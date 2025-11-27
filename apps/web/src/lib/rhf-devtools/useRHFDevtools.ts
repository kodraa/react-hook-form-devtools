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
    // Register form - stores formMethods and emits registration event
    DevtoolsEventClient.registerForm(formId, form);

    return () => {
      // Unregister form when component unmounts
      DevtoolsEventClient.unregisterForm(formId);
    };
  }, [form, formId]);
}
