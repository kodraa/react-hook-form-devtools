import { useEffect, useState } from "react";
import { DevtoolsEventClient } from "./eventClient";
import { useFormContext, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";

export default function RHFDevtoolsPanel() {
  const [formIds, setFormIds] = useState<Array<string>>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with already registered forms
    setFormIds(DevtoolsEventClient.getRegisteredFormIds());

    // Subscribe to form registration events
    const cleanupRegister = DevtoolsEventClient.on("register-form", (e) => {
      setFormIds((prev) => {
        if (!prev.includes(e.payload.formId)) {
          return [...prev, e.payload.formId];
        }
        return prev;
      });
    });

    // Subscribe to form unregistration events
    const cleanupUnregister = DevtoolsEventClient.on("unregister-form", (e) => {
      setFormIds((prev) => prev.filter((id) => id !== e.payload.formId));
    });

    return () => {
      cleanupRegister();
      cleanupUnregister();
    };
  }, []);

  // Get form methods from the store
  const formMethods = selectedFormId
    ? DevtoolsEventClient.getFormMethods(selectedFormId)
    : undefined;

  // Get form state directly from form methods
  const formState = formMethods
    ? {
        values: formMethods.getValues(),
        errors: formMethods.formState.errors,
        isDirty: formMethods.formState.isDirty,
        isValid: formMethods.formState.isValid,
        isSubmitting: formMethods.formState.isSubmitting,
        touchedFields: formMethods.formState.touchedFields,
        dirtyFields: formMethods.formState.dirtyFields,
      }
    : null;

  // Subscribe to form state changes for re-rendering
  useEffect(() => {
    if (!formMethods) return;

    const subscription = formMethods.watch(() => {
      // Force re-render when form state changes
      setFormIds((prev) => [...prev]);
    });

    return () => subscription.unsubscribe();
  }, [formMethods]);

  return (
    <div style={{ padding: "16px", fontFamily: "monospace", fontSize: "12px" }}>
      <h3
        style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "bold" }}
      >
        React Hook Form DevTools
      </h3>

      {formIds.length === 0 ? (
        <div style={{ color: "#888" }}>No forms registered yet...</div>
      ) : (
        <>
          <SelectForm
            formIds={formIds}
            selectedFormId={selectedFormId}
            setSelectedFormId={setSelectedFormId}
          />

          {formState && formMethods && (
            <Form {...formMethods}>
              <div>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <h4 style={{ margin: "0", fontSize: "13px" }}>
                      Form State
                    </h4>
                    <button
                      onClick={() =>
                        formMethods.reset({
                          options: {
                            keepDefaultValues: true,
                          },
                        })
                      }
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        borderRadius: "4px",
                        border: "1px solid #3b82f6",
                        background: "#1e40af",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Reset Form
                    </button>
                  </div>
                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: formState.isDirty ? "#f59e0b" : "#374151",
                      }}
                    >
                      {formState.isDirty ? "Dirty" : "Pristine"}
                    </span>
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: formState.isValid ? "#10b981" : "#ef4444",
                      }}
                    >
                      {formState.isValid ? "Valid" : "Invalid"}
                    </span>
                    {formState.isSubmitting && (
                      <span
                        style={{
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: "#3b82f6",
                        }}
                      >
                        Submitting
                      </span>
                    )}
                  </div>
                </div>

                <ValuesSection values={formState.values} />

                {Object.keys(formState.touchedFields).length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
                      Touched Fields
                    </h4>
                    <div
                      style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
                    >
                      {Object.keys(formState.touchedFields).map((field) => (
                        <span
                          key={field}
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: "#374151",
                          }}
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(formState.dirtyFields).length > 0 && (
                  <div>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
                      Dirty Fields
                    </h4>
                    <div
                      style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
                    >
                      {Object.keys(formState.dirtyFields).map((field) => (
                        <span
                          key={field}
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: "#374151",
                          }}
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <GetValuesOnDemand />

                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
                    Watched Fields
                  </h4>
                  <WatchedFields />
                </div>
              </div>
            </Form>
          )}
        </>
      )}
    </div>
  );
}

const SelectForm = ({
  formIds,
  selectedFormId,
  setSelectedFormId,
}: {
  formIds: Array<string>;
  selectedFormId: string | null;
  setSelectedFormId: (formId: string) => void;
}) => {
  useEffect(() => {
    if (formIds.length === 1) {
      setSelectedFormId(formIds[0]);
    }
  }, [formIds, setSelectedFormId]);

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", marginBottom: "4px" }}>
        Select Form:
      </label>
      <select
        value={selectedFormId || ""}
        onChange={(e) => setSelectedFormId(e.target.value)}
        style={{
          width: "100%",
          padding: "4px 8px",
          borderRadius: "4px",
          border: "1px solid #333",
          background: "#1a1a1a",
          color: "#fff",
        }}
      >
        <option value="">Select a form...</option>
        {formIds.map((formId) => (
          <option key={formId} value={formId}>
            {formId}
          </option>
        ))}
      </select>
    </div>
  );
};

const ValuesSection = ({ values }: { values: unknown }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div style={{ marginBottom: "12px" }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          margin: "0 0 8px 0",
          fontSize: "13px",
          fontWeight: "600",
          background: "none",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          padding: "0",
        }}
      >
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span>Values</span>
      </button>
      {isExpanded && (
        <pre
          style={{
            margin: 0,
            padding: "8px",
            background: "#1a1a1a",
            borderRadius: "4px",
            overflow: "auto",
            maxHeight: "200px",
          }}
        >
          {JSON.stringify(values, null, 2)}
        </pre>
      )}
    </div>
  );
};

const WatchedFields = () => {
  const [watchedFields, setWatchedFields] = useState<
    Array<{ id: string; name: string }>
  >([{ id: crypto.randomUUID(), name: "" }]);

  const addField = () => {
    setWatchedFields((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "" },
    ]);
  };

  const removeField = (id: string) => {
    setWatchedFields((prev) => {
      if (prev.length === 1) {
        return [{ id: crypto.randomUUID(), name: "" }];
      }
      return prev.filter((field) => field.id !== id);
    });
  };

  const updateFieldName = (id: string, name: string) => {
    setWatchedFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, name } : field))
    );
  };

  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {watchedFields.map((field) => (
          <WatchedFieldRow
            key={field.id}
            fieldName={field.name}
            onRemove={() => removeField(field.id)}
            onNameChange={(name) => updateFieldName(field.id, name)}
          />
        ))}
      </div>

      <Button
        onClick={addField}
        size="sm"
        variant="outline"
        style={{
          marginTop: "8px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        <Plus size={14} />
        <span>Add Field</span>
      </Button>
    </div>
  );
};

const WatchedFieldRow = ({
  fieldName,
  onRemove,
  onNameChange,
}: {
  fieldName: string;
  onRemove: () => void;
  onNameChange: (name: string) => void;
}) => {
  const { control } = useFormContext();
  const value = useWatch({ control, name: fieldName });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
        padding: "8px 12px",
        background: "#1a1a1a",
        borderRadius: "6px",
        border: "1px solid #374151",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <input
          type="text"
          value={fieldName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter CASE SENSITIVE field name (e.g. username)"
          style={{
            width: "100%",
            border: "1px solid #4b5563",
            borderRadius: "4px",
            padding: "4px 8px",
            background: "#0a0a0a",
            color: "#fff",
            fontSize: "11px",
            outline: "none",
            marginBottom: "6px",
          }}
        />
        {fieldName && (
          <div
            style={{
              fontSize: "12px",
              color: "#fff",
              wordBreak: "break-all",
            }}
          >
            {typeof value === "object" ? (
              <pre
                style={{
                  margin: 0,
                  fontFamily: "monospace",
                  fontSize: "11px",
                  color: "#10b981",
                }}
              >
                {JSON.stringify(value, null, 2)}
              </pre>
            ) : (
              <span style={{ color: "#10b981" }}>
                {value === undefined
                  ? "undefined"
                  : value === null
                  ? "null"
                  : String(value)}
              </span>
            )}
          </div>
        )}
      </div>
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          color: "#6b7280",
          cursor: "pointer",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
      >
        <X size={14} />
      </button>
    </div>
  );
};

const GetValuesOnDemand = () => {
  const { getValues, getFieldState } = useFormContext();
  const [inputValue, setInputValue] = useState<string>("");
  const [gottenValue, setGottenValue] = useState<unknown>(null);
  const [fieldState, setFieldState] = useState<ReturnType<
    typeof getFieldState
  > | null>(null);

  const handleGetValues = (field?: string) => {
    setGottenValue(field ? getValues(field) : getValues());
  };

  const handleGetFieldState = (field?: string) => {
    setFieldState(field ? getFieldState(field) : null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGottenValue(null);
    setFieldState(null);
    return setInputValue(e.target.value);
  };

  const fieldStateWithSerializableError = fieldState
    ? {
        ...fieldState,
        error: fieldState.error
          ? {
              message: fieldState.error.message,
              type: fieldState.error.type,
            }
          : null,
      }
    : null;

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={() => handleGetValues(inputValue)}>Get Values</button>
      <button onClick={() => handleGetFieldState(inputValue)}>
        Get Field State
      </button>
      {Boolean(gottenValue) && (
        <div>
          <pre>{JSON.stringify(gottenValue, null, 2)}</pre>
        </div>
      )}
      {Boolean(fieldState) && (
        <div>
          <pre>{JSON.stringify(fieldStateWithSerializableError, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
