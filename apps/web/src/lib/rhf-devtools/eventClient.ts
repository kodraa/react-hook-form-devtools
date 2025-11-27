import { EventClient } from "@tanstack/devtools-event-client";

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
  constructor() {
    super({
      // The pluginId must match that of the event map key
      pluginId: "rhf-devtools",
      debug: false,
    });
  }
}

// This is where the magic happens, it'll be used throughout your application.
export const DevtoolsEventClient = new RHFDevtoolsEventClient();