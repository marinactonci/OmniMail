import { EmailMessage } from "./email-message";

export type SyncUpdatedResponse = {
  nextPageToken?: string;
  nextDeltaToken: string;
  records: EmailMessage[];
}
