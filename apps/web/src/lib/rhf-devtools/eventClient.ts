import { EventClient } from "@tanstack/devtools-event-client";
import type { UseFormReturn } from "react-hook-form";

export type FormState = {
  formId: string;
  values: Record<string, any>;
  errors: Record<string, any>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  touchedFields: Record<string, boolean>;
  dirtyFields: Record<string, boolean>;
};

type EventMap = {
  // The key of the event map is a combination of {pluginId}:{eventSuffix}
  // The value is the expected type of the event payload
  "rhf-devtools:form-state": FormState;
  "rhf-devtools:forms-list": { forms: FormState[] };
};

class RHFDevtoolsEventClient extends EventClient<EventMap> {
  // Store for formMethods that can't be serialized through events
  private formMethodsStore: Map<string, UseFormReturn> = new Map();

  constructor() {
    super({
      // The pluginId must match that of the event map key
      pluginId: "rhf-devtools",
      debug: false,
    });
  }

  /**
   * Register form methods for a given formId
   * This bypasses the event system to avoid serialization issues
   */
  registerFormMethods(formId: string, formMethods: UseFormReturn) {
    this.formMethodsStore.set(formId, formMethods);
  }

  /**
   * Retrieve form methods for a given formId
   */
  getFormMethods(formId: string): UseFormReturn | undefined {
    return this.formMethodsStore.get(formId);
  }

  /**
   * Unregister form methods when a form is unmounted
   */
  unregisterFormMethods(formId: string) {
    this.formMethodsStore.delete(formId);
  }

  /**
   * Get all registered form IDs
   */
  getRegisteredFormIds(): string[] {
    return Array.from(this.formMethodsStore.keys());
  }

  /**
   * Check if a form is registered
   */
  hasFormMethods(formId: string): boolean {
    return this.formMethodsStore.has(formId);
  }
}

// This is where the magic happens, it'll be used throughout your application.
export const DevtoolsEventClient = new RHFDevtoolsEventClient();
