import type { DevtoolsPlugin } from "@tanstack/react-devtools";
import { useEffect, useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

/**
 * Global registry to store all React Hook Form instances
 */
const formRegistry = new Map<string, UseFormReturn<any>>();

/**
 * Subscribe to a form instance
 * This function should be called from your form components
 */
export function registerForm<T extends FieldValues>(
  formId: string,
  form: UseFormReturn<T>
) {
  formRegistry.set(formId, form);

  // Return cleanup function
  return () => {
    formRegistry.delete(formId);
  };
}

/**
 * Get all registered forms
 */
export function getRegisteredForms() {
  return Array.from(formRegistry.entries());
}

/**
 * React Hook Form Devtools Plugin
 * This plugin integrates with TanStack Devtools to provide inspection capabilities
 */
export function ReactHookFormDevtoolsPlugin(): DevtoolsPlugin {
  return {
    id: "react-hook-form",
    name: "React Hook Form",
    devtools: {
      getInstanceKey: (instance: UseFormReturn<any>) => {
        // Generate a unique key for each form instance
        return `form-${Math.random().toString(36).substring(2, 9)}`;
      },
      getInstanceLabel: (instance: UseFormReturn<any>) => {
        // Label for the form in the devtools
        return "Form";
      },
      getInstanceData: (instance: UseFormReturn<any>) => {
        // Extract the form state data
        const formState = instance.formState;
        const values = instance.getValues();

        return {
          values,
          errors: formState.errors,
          isDirty: formState.isDirty,
          isValid: formState.isValid,
          isSubmitting: formState.isSubmitting,
          isSubmitted: formState.isSubmitted,
          isSubmitSuccessful: formState.isSubmitSuccessful,
          submitCount: formState.submitCount,
          touchedFields: formState.touchedFields,
          dirtyFields: formState.dirtyFields,
          defaultValues: formState.defaultValues,
        };
      },
    },
    panelComponent: FormDevtoolsPanel,
  };
}

/**
 * Custom panel component for the devtools
 */
function FormDevtoolsPanel() {
  const [forms, setForms] = useState<Array<[string, UseFormReturn<any>]>>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Poll for form updates (in production, you'd want a more efficient subscription mechanism)
    const interval = setInterval(() => {
      const currentForms = getRegisteredForms();
      setForms(currentForms);

      // Force re-render to show updated form state
      forceUpdate({});
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const selectedForm = forms.find(([id]) => id === selectedFormId)?.[1];

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">React Hook Form Inspector</h2>
        <span className="text-sm text-muted-foreground">
          {forms.length} form{forms.length !== 1 ? "s" : ""} registered
        </span>
      </div>

      {forms.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
          <div className="text-center">
            <p className="mb-2 text-sm font-medium">No forms registered</p>
            <p className="text-xs text-muted-foreground">
              Use <code className="rounded bg-muted px-1">registerForm()</code>{" "}
              in your components
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Forms List */}
          <div className="flex w-48 flex-col gap-2 overflow-y-auto">
            <h3 className="text-sm font-medium">Forms</h3>
            {forms.map(([id, form]) => (
              <button
                key={id}
                onClick={() => setSelectedFormId(id)}
                type="button"
                className={`rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                  selectedFormId === id
                    ? "border-primary bg-accent"
                    : "border-border"
                }`}
              >
                <div className="font-medium">{id}</div>
                <div className="text-xs text-muted-foreground">
                  {form.formState.isDirty ? "Modified" : "Clean"}
                </div>
              </button>
            ))}
          </div>

          {/* Form Details */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
            {selectedForm ? (
              <>
                <FormStateSection form={selectedForm} />
                <FormValuesSection form={selectedForm} />
                <FormErrorsSection form={selectedForm} />
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">
                  Select a form to inspect
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FormStateSection({ form }: { form: UseFormReturn<any> }) {
  const { formState } = form;

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-3 font-medium">Form State</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <StateItem label="Is Dirty" value={formState.isDirty} />
        <StateItem label="Is Valid" value={formState.isValid} />
        <StateItem label="Is Submitting" value={formState.isSubmitting} />
        <StateItem label="Is Submitted" value={formState.isSubmitted} />
        <StateItem
          label="Submit Successful"
          value={formState.isSubmitSuccessful}
        />
        <StateItem label="Submit Count" value={formState.submitCount} />
      </div>
    </div>
  );
}

function FormValuesSection({ form }: { form: UseFormReturn<any> }) {
  const values = form.getValues();

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-3 font-medium">Values</h3>
      <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  );
}

function FormErrorsSection({ form }: { form: UseFormReturn<any> }) {
  const { errors } = form.formState;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-3 font-medium">Errors</h3>
      {hasErrors ? (
        <pre className="overflow-x-auto rounded bg-destructive/10 p-3 text-xs">
          {JSON.stringify(errors, null, 2)}
        </pre>
      ) : (
        <p className="text-sm text-muted-foreground">No validation errors</p>
      )}
    </div>
  );
}

function StateItem({
  label,
  value,
}: {
  label: string;
  value: boolean | number;
}) {
  return (
    <div className="flex items-center justify-between rounded bg-muted px-2 py-1">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-mono font-medium">
        {typeof value === "boolean" ? (
          <span className={value ? "text-green-500" : "text-gray-500"}>
            {value ? "✓" : "✗"}
          </span>
        ) : (
          value
        )}
      </span>
    </div>
  );
}
