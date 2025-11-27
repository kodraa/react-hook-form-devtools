import { EventClient } from "@tanstack/devtools-event-client";
import type { UseFormReturn } from "react-hook-form";

export type FormState = {
  formId: string;
  formMethods: UseFormReturn;
};

type EventMap = {
  // The key of the event map is a combination of {pluginId}:{eventSuffix}
  // The value is the expected type of the event payload
  "rhf-devtools:register-form": { formId: string };
  "rhf-devtools:unregister-form": { formId: string };
};

class RHFDevtoolsEventClient extends EventClient<EventMap> {
  // Store for formMethods - mapping formId to form methods
  private formsStore: Map<string, UseFormReturn> = new Map();

  constructor() {
    super({
      // The pluginId must match that of the event map key
      pluginId: "rhf-devtools",
      debug: false,
    });
  }

  /**
   * Register a form and emit registration event
   */
  registerForm(formId: string, formMethods: UseFormReturn) {
    this.formsStore.set(formId, formMethods);
    this.emit("register-form", { formId });
  }

  /**
   * Unregister a form and emit unregistration event
   */
  unregisterForm(formId: string) {
    this.formsStore.delete(formId);
    this.emit("unregister-form", { formId });
  }

  /**
   * Get form methods for a specific form
   */
  getFormMethods(formId: string): UseFormReturn | undefined {
    return this.formsStore.get(formId);
  }

  /**
   * Get all registered forms (formId + formMethods)
   */
  getAllForms(): Array<FormState> {
    return Array.from(this.formsStore.entries()).map(
      ([formId, formMethods]) => ({
        formId,
        formMethods,
      })
    );
  }

  /**
   * Get all registered form IDs
   */
  getRegisteredFormIds(): string[] {
    return Array.from(this.formsStore.keys());
  }
}

// This is where the magic happens, it'll be used throughout your application.
export const DevtoolsEventClient = new RHFDevtoolsEventClient();
