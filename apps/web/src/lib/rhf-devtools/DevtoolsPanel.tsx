import { useEffect, useState } from "react";
import { DevtoolsEventClient, type FormState } from "./eventClient";

export default function RHFDevtoolsPanel() {
  const [forms, setForms] = useState<FormState[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  console.log("forms", forms);
  useEffect(() => {
    // Subscribe to individual form state updates
    const cleanupFormState = DevtoolsEventClient.on("form-state", (e) => {
      console.log("on form state", e);
      setForms((prev) => {
        console.log("setting forms");
        const existing = prev.find((f) => f.formId === e.payload.formId);
        console.log({
          existing,
          payload: e.payload,
        });
        if (existing) {
          return prev.map((f) =>
            f.formId === e.payload.formId ? e.payload : f
          );
        }
        console.log({
          prev,
          e,
          payload: e.payload,
        });
        return [...prev, e.payload];
      });
    });

    // Subscribe to forms list updates
    const cleanupFormsList = DevtoolsEventClient.on("forms-list", (e) => {
      setForms(e.payload.forms);
    });

    return () => {
      cleanupFormState();
      cleanupFormsList();
    };
  }, []);

  const selectedForm = forms.find((f) => f.formId === selectedFormId);

  return (
    <div style={{ padding: "16px", fontFamily: "monospace", fontSize: "12px" }}>
      <h3
        style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "bold" }}
      >
        React Hook Form DevTools
      </h3>

      {forms.length === 0 ? (
        <div style={{ color: "#888" }}>No forms registered yet...</div>
      ) : (
        <>
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
              {forms.map((form) => (
                <option key={form.formId} value={form.formId}>
                  {form.formId}
                </option>
              ))}
            </select>
          </div>

          {selectedForm && (
            <div>
              <div style={{ marginBottom: "12px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
                  Form State
                </h4>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: selectedForm.isDirty ? "#f59e0b" : "#374151",
                    }}
                  >
                    {selectedForm.isDirty ? "Dirty" : "Pristine"}
                  </span>
                  <span
                    style={{
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: selectedForm.isValid ? "#10b981" : "#ef4444",
                    }}
                  >
                    {selectedForm.isValid ? "Valid" : "Invalid"}
                  </span>
                  <span
                    style={{
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: selectedForm.isSubmitting
                        ? "#3b82f6"
                        : "#374151",
                    }}
                  >
                    {selectedForm.isSubmitting ? "Submitting" : "Ready"}
                  </span>
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
                  {JSON.stringify(selectedForm.values, null, 2)}
                </pre>
              </div>

              {Object.keys(selectedForm.errors).length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "13px",
                      color: "#ef4444",
                    }}
                  >
                    Errors
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
                    {JSON.stringify(selectedForm.errors, null, 2)}
                  </pre>
                </div>
              )}

              {Object.keys(selectedForm.touchedFields).length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
                    Touched Fields
                  </h4>
                  <div
                    style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
                  >
                    {Object.keys(selectedForm.touchedFields).map((field) => (
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

              {Object.keys(selectedForm.dirtyFields).length > 0 && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
                    Dirty Fields
                  </h4>
                  <div
                    style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
                  >
                    {Object.keys(selectedForm.dirtyFields).map((field) => (
                      <span
                        key={field}
                        style={{
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: "#f59e0b",
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
