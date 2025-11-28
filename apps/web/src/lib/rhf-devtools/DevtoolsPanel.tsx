import { useEffect, useState } from "react";
import { DevtoolsEventClient } from "./eventClient";

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

          {formState && (
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
                  <h4 style={{ margin: "0", fontSize: "13px" }}>Form State</h4>
                  {formMethods && (
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
                  )}
                </div>
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
              </div>

              <div style={{ marginBottom: "12px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
                  Values
                </h4>
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
                  {JSON.stringify(formState.values, null, 2)}
                </pre>
              </div>

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
            </div>
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

const WatchedFields = ({ formMethods }: { formMethods: FormMethods }) => {
  const [fieldNames, setFieldNames] = useState<Array<string>>([]);

  return (
    <div>
      <h4 style={{ margin: "0 0 8px 0", fontSize: "13px" }}>Watched Fields</h4>
    </div>
  );
};
