import { useEffect, useState } from "react";
import { DevtoolsEventClient } from "./event-client";
import { useFormContext, useWatch, FormProvider } from "react-hook-form";

const ChevronDown = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronRight = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const Plus = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const X = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Separator = () => (
  <div
    style={{
      height: "1px",
      background:
        "linear-gradient(to right, transparent, #374151, transparent)",
      margin: "16px 0",
    }}
  />
);

export default function RHFDevtoolsPanel() {
  const [formIds, setFormIds] = useState<Array<string>>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  useEffect(() => {
    setFormIds(DevtoolsEventClient.getRegisteredFormIds());

    const cleanupRegister = DevtoolsEventClient.on("register-form", (e) => {
      setFormIds((prev) => {
        if (!prev.includes(e.payload.formId)) {
          return [...prev, e.payload.formId];
        }
        return prev;
      });
    });

    const cleanupUnregister = DevtoolsEventClient.on("unregister-form", (e) => {
      setFormIds((prev) => prev.filter((id) => id !== e.payload.formId));
    });

    return () => {
      cleanupRegister();
      cleanupUnregister();
    };
  }, []);

  const formMethods = selectedFormId
    ? DevtoolsEventClient.getFormMethods(selectedFormId)
    : undefined;

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

  useEffect(() => {
    if (!formMethods) return;

    const subscription = formMethods.watch(() => {
      // force re-render when form state changes
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
            <FormProvider {...formMethods}>
              <div>
                <FormStateSection />
                <Separator />
                <ValuesSection />
                <Separator />
                <TouchedFieldsSection />
                <DirtyFieldsSection />
                <Separator />
                {/* <GetValuesOnDemand /> */}
                <Separator />
                <WatchedFieldsSection />
              </div>
            </FormProvider>
          )}
        </>
      )}
    </div>
  );
}

const FormStateSection = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const formMethods = useFormContext();
  const formState = {
    isDirty: formMethods.formState.isDirty,
    isValid: formMethods.formState.isValid,
    isSubmitting: formMethods.formState.isSubmitting,
  };

  return (
    <div style={{ marginBottom: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
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
          <span>Form State</span>
        </button>
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
      {isExpanded && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
      )}
    </div>
  );
};

const TouchedFieldsSection = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { formState } = useFormContext();
  const fieldKeys = Object.keys(formState.touchedFields);

  if (fieldKeys.length === 0) return null;

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
        <span>Touched Fields</span>
      </button>
      {isExpanded && (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {fieldKeys.map((field) => (
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
      )}
    </div>
  );
};

const DirtyFieldsSection = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { formState } = useFormContext();
  const fieldKeys = Object.keys(formState.dirtyFields);

  if (fieldKeys.length === 0) return null;

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
        <span>Dirty Fields</span>
      </button>
      {isExpanded && (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {fieldKeys.map((field) => (
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
      )}
    </div>
  );
};

const WatchedFieldsSection = () => {
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
        <span>Watched Fields</span>
      </button>
      {isExpanded && <WatchedFields />}
    </div>
  );
};

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
    if (formIds.length === 1 && formIds[0]) {
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

const ValuesSection = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { getValues } = useFormContext();
  const values = getValues();

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

      <button
        onClick={addField}
        style={{
          marginTop: "8px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          padding: "6px 12px",
          fontSize: "11px",
          borderRadius: "4px",
          border: "1px solid #4b5563",
          background: "transparent",
          color: "#fff",
          cursor: "pointer",
          transition: "background 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          target.style.background = "#1a1a1a";
          target.style.borderColor = "#6b7280";
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.background = "transparent";
          target.style.borderColor = "#4b5563";
        }}
      >
        <Plus size={14} />
        <span>Add Field</span>
      </button>
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
  const value = useWatch({
    control,
    // @ts-expect-error - fieldName can be undefined
    name: fieldName === "--" ? undefined : fieldName,
  });

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
          placeholder="Enter CASE SENSITIVE field name (e.g. username) or Enter -- to watch all values"
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

// @ts-expect-error - commented for now
const GetValuesOnDemand = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { getValues, getFieldState } = useFormContext();
  const [fields, setFields] = useState<Array<{ id: string; name: string }>>([
    { id: crypto.randomUUID(), name: "" },
  ]);
  const [results, setResults] = useState<
    Record<
      string,
      {
        value: unknown;
        fieldState: ReturnType<typeof getFieldState> | null;
      }
    >
  >({});

  const addField = () => {
    setFields((prev) => [...prev, { id: crypto.randomUUID(), name: "" }]);
  };

  const removeField = (id: string) => {
    setFields((prev) => {
      if (prev.length === 1) {
        return [{ id: crypto.randomUUID(), name: "" }];
      }
      return prev.filter((field) => field.id !== id);
    });
  };

  const updateFieldName = (id: string, name: string) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, name } : field))
    );
  };

  const handleGetValues = (fieldId: string, fieldName: string) => {
    const value = fieldName ? getValues(fieldName) : getValues();
    setResults((prev) => ({
      ...prev,
      [fieldId]: {
        value,
        fieldState: prev[fieldId]?.fieldState || null,
      },
    }));
  };

  const handleGetFieldState = (fieldId: string, fieldName: string) => {
    const fieldState = fieldName ? getFieldState(fieldName) : null;
    setResults((prev) => ({
      ...prev,
      [fieldId]: {
        value: prev[fieldId]?.value || null,
        fieldState,
      },
    }));
  };

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
        <span>Get Values On Demand</span>
      </button>
      {isExpanded && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {fields.map((field) => (
              <GetValuesFieldRow
                key={field.id}
                field={field}
                result={results[field.id]}
                onRemove={() => removeField(field.id)}
                onNameChange={(name) => updateFieldName(field.id, name)}
                onGetValues={() => handleGetValues(field.id, field.name)}
                onGetFieldState={() =>
                  handleGetFieldState(field.id, field.name)
                }
              />
            ))}
          </div>

          <button
            onClick={addField}
            style={{
              marginTop: "8px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: "6px 12px",
              fontSize: "11px",
              borderRadius: "4px",
              border: "1px solid #4b5563",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.background = "#1a1a1a";
              target.style.borderColor = "#6b7280";
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.background = "transparent";
              target.style.borderColor = "#4b5563";
            }}
          >
            <Plus size={14} />
            <span>Add Field</span>
          </button>
        </>
      )}
    </div>
  );
};

const GetValuesFieldRow = ({
  field,
  result,
  onRemove,
  onNameChange,
  onGetValues,
  onGetFieldState,
}: {
  field: { id: string; name: string };
  result?: {
    value: unknown;
    fieldState: ReturnType<
      ReturnType<typeof useFormContext>["getFieldState"]
    > | null;
  };
  onRemove: () => void;
  onNameChange: (name: string) => void;
  onGetValues: () => void;
  onGetFieldState: () => void;
}) => {
  const fieldStateWithSerializableError = result?.fieldState
    ? {
        ...result.fieldState,
        error: result.fieldState.error
          ? {
              message: result.fieldState.error.message,
              type: result.fieldState.error.type,
            }
          : null,
      }
    : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "12px",
        background: "#1a1a1a",
        borderRadius: "6px",
        border: "1px solid #374151",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="text"
          value={field.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Field name (leave empty for all values)"
          style={{
            flex: 1,
            border: "1px solid #4b5563",
            borderRadius: "4px",
            padding: "6px 10px",
            background: "#0a0a0a",
            color: "#fff",
            fontSize: "11px",
            outline: "none",
          }}
        />
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ display: "flex", gap: "6px" }}>
        <button
          onClick={onGetValues}
          style={{
            flex: 1,
            padding: "6px 12px",
            fontSize: "11px",
            borderRadius: "4px",
            border: "1px solid #3b82f6",
            background: "#1e40af",
            color: "#fff",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1e40af")}
        >
          Get Value
        </button>
        <button
          onClick={onGetFieldState}
          style={{
            flex: 1,
            padding: "6px 12px",
            fontSize: "11px",
            borderRadius: "4px",
            border: "1px solid #8b5cf6",
            background: "#6d28d9",
            color: "#fff",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#7c3aed")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#6d28d9")}
        >
          Get Field State
        </button>
      </div>

      {result?.value !== undefined && result?.value !== null && (
        <div style={{ marginTop: "4px" }}>
          <div
            style={{
              fontSize: "10px",
              color: "#9ca3af",
              marginBottom: "4px",
              fontWeight: "600",
            }}
          >
            VALUE:
          </div>
          <pre
            style={{
              margin: 0,
              padding: "8px",
              background: "#0a0a0a",
              borderRadius: "4px",
              overflow: "auto",
              maxHeight: "150px",
              fontSize: "11px",
              border: "1px solid #374151",
              color: "#10b981",
            }}
          >
            {JSON.stringify(result.value, null, 2)}
          </pre>
        </div>
      )}

      {fieldStateWithSerializableError && (
        <div style={{ marginTop: "4px" }}>
          <div
            style={{
              fontSize: "10px",
              color: "#9ca3af",
              marginBottom: "4px",
              fontWeight: "600",
            }}
          >
            FIELD STATE:
          </div>
          <pre
            style={{
              margin: 0,
              padding: "8px",
              background: "#0a0a0a",
              borderRadius: "4px",
              overflow: "auto",
              maxHeight: "150px",
              fontSize: "11px",
              border: "1px solid #374151",
              color: "#a78bfa",
            }}
          >
            {JSON.stringify(fieldStateWithSerializableError, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
