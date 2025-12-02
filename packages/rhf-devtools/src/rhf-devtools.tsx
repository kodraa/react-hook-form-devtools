import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { DevtoolsEventClient } from "./event-client";

/**
 * Hook to register a React Hook Form instance with the devtools
 * @param form - The form instance from useForm()
 * @param formId - A unique identifier for the form
 */
export function RHFDevtools({ formId }: { formId: string }) {
  const formMethods = useFormContext();

  useEffect(() => {
    // Register form - stores formMethods and emits registration event
    DevtoolsEventClient.registerForm(formId, formMethods);

    return () => {
      // Unregister form when component unmounts
      DevtoolsEventClient.unregisterForm(formId);
    };
  }, [formMethods, formId]);

  return null;
}
