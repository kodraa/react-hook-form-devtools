import { useEffect, useId } from "react";
import { type FieldValues, type UseFormReturn, useForm } from "react-hook-form";
import { registerForm } from "./react-hook-form-plugin";

/**
 * Enhanced useForm hook that automatically registers with devtools
 * Use this instead of the regular useForm to get automatic devtools integration
 */
export function useFormWithDevtools<
  TFieldValues extends FieldValues = FieldValues
>(
  ...args: Parameters<typeof useForm<TFieldValues>>
): UseFormReturn<TFieldValues> {
  const form = useForm<TFieldValues>(...args);
  const formId = useId();

  useEffect(() => {
    const cleanup = registerForm(formId, form);
    return cleanup;
  }, [formId, form]);

  return form;
}
