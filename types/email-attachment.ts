export interface EmailAttachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  inline: boolean;
  contentId?: string;
  content?: string;
  contentLocation?: string;
}
