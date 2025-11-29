import { EventClient } from "@tanstack/devtools-event-client";
import type { UseFormReturn } from "react-hook-form";

export type FormState = {
  formId: string;
  formMethods: UseFormReturn;
};

type EventMap = {
  "rhf-devtools:register-form": { formId: string };
  "rhf-devtools:unregister-form": { formId: string };
};

class RHFDevtoolsEventClient extends EventClient<EventMap> {
  private formsStore: Map<string, UseFormReturn> = new Map();

  constructor() {
    super({
      pluginId: "rhf-devtools",
      debug: false,
    });
  }

  registerForm(formId: string, formMethods: UseFormReturn) {
    this.formsStore.set(formId, formMethods);
    this.emit("register-form", { formId });
  }

  unregisterForm(formId: string) {
    this.formsStore.delete(formId);
    this.emit("unregister-form", { formId });
  }

  getFormMethods(formId: string): UseFormReturn | undefined {
    return this.formsStore.get(formId);
  }

  getAllForms(): Array<FormState> {
    return Array.from(this.formsStore.entries()).map(
      ([formId, formMethods]) => ({
        formId,
        formMethods,
      })
    );
  }

  getRegisteredFormIds(): string[] {
    return Array.from(this.formsStore.keys());
  }
}

export const DevtoolsEventClient = new RHFDevtoolsEventClient();
