import { EmailMessage } from "./email-message";

export interface SyncUpdatedResponse {
  nextPageToken?: string;
  nextDeltaToken: string;
  records: EmailMessage[];
}
