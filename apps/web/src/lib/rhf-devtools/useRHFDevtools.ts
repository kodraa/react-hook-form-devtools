import { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import { DevtoolsEventClient } from "./eventClient";

/**
 * Hook to register a React Hook Form instance with the devtools
 * @param form - The form instance from useForm()
 * @param formId - A unique identifier for the form
 */
export function useRHFDevtools(form: UseFormReturn<any>, formId: string) {
  useEffect(() => {
    // Subscribe to form state changes
    const subscription = form.subscribe({
      formState: {
        errors: true,
        isDirty: true,
        isValid: true,
        touchedFields: true,
        dirtyFields: true,
        values: true,
      },
      callback: () => {
        const {
          formState: {
            errors,
            isDirty,
            isValid,
            isSubmitting,
            touchedFields,
            dirtyFields,
          },
        } = form;

        // Emit the current form state to the devtools
        DevtoolsEventClient.emit("form-state", {
          formId,
          // formMethods: form,
          values: form.getValues(),
          errors,
          isDirty,
          isValid,
          isSubmitting,
          touchedFields,
          dirtyFields,
        });
      },
    });

    return () => {
      subscription();
    };
  }, [form, formId]);
}
