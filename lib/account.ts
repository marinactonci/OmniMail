import { EmailAddress } from "@/types/email-address";
import { EmailMessage } from "@/types/email-message";
import { SyncResponse } from "@/types/sync-response";
import { SyncUpdatedResponse } from "@/types/sync-updated-response";
import axios from "axios";
import prisma from "./prisma";
import { syncEmailsToDatabase } from "./sync-to-db";

export class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async startSync(retryCount = 3) {
    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const response = await axios.post<SyncResponse>(
          "https://api.aurinko.io/v1/email/sync",
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            params: {
              daysWithin: 30,
              bodyType: "html",
            },
            // Add timeout configuration
            timeout: 10000, // 10 seconds
          }
        );
        return response.data;
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") &&
          attempt < retryCount - 1
        ) {
          // Wait before retry (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
          continue;
        }
        throw error;
      }
    }
    throw new Error("Max retry attempts reached");
  }

  async getUpdatedEmails({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }) {
    const params: Record<string, string> = {};
    if (deltaToken) {
      params.deltaToken = deltaToken;
    }
    if (pageToken) {
      params.pageToken = pageToken;
    }

    const response = await axios.get<SyncUpdatedResponse>(
      "https://api.aurinko.io/v1/email/sync/updated",
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params,
      }
    );

    return response.data;
  }

  async performInitialSync() {
    try {
      let syncResponse = await this.startSync();

      // Add timeout to prevent infinite polling
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (!syncResponse.ready) {
        if (attempts >= maxAttempts) {
          throw new Error("Initial sync timeout after 30 seconds");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        syncResponse = await this.startSync();
        attempts++;
      }

      if (!syncResponse.syncUpdatedToken) {
        throw new Error("No sync token received from initial sync");
      }

      let storedDeltaToken: string = syncResponse.syncUpdatedToken;

      let updatedResponse = await this.getUpdatedEmails({
        deltaToken: storedDeltaToken,
      });

      let allEmails: EmailMessage[] = updatedResponse.records;

      // Move the page fetching loop outside
      while (updatedResponse.nextPageToken) {
        console.log("fetching next page");
        updatedResponse = await this.getUpdatedEmails({
          pageToken: updatedResponse.nextPageToken,
        });
        allEmails = [...allEmails, ...updatedResponse.records];
        if (updatedResponse.nextDeltaToken) {
          storedDeltaToken = updatedResponse.nextDeltaToken;
        }
      }

      console.log(
        "initial sync completed, we have synced",
        allEmails.length,
        "emails"
      );

      return {
        emails: allEmails,
        deltaToken: storedDeltaToken,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error performing initial sync:",
          JSON.stringify(error.response?.data, null, 2)
        );
        throw error; // Re-throw the error to handle it in the calling code
      } else {
        console.error("Error performing initial sync:", error);
        throw error;
      }
    }
  }

  async syncEmails() {
    const account = await prisma.emailAccount.findUnique({
      where: {
        accessToken: this.token,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    if (!account.nextDeltaToken) {
      throw new Error("No delta token found for account");
    }

    let response = await this.getUpdatedEmails({
      deltaToken: account.nextDeltaToken,
    });

    let storedDeltaToken = account.nextDeltaToken;
    let allEmails: EmailMessage[] = response.records;

    if (response.nextDeltaToken) {
      storedDeltaToken = response.nextDeltaToken;
    }

    while (response.nextPageToken) {
      response = await this.getUpdatedEmails({
        pageToken: response.nextPageToken,
      });
      allEmails = allEmails.concat(response.records);
      if (response.nextDeltaToken) {
        storedDeltaToken = response.nextDeltaToken;
      }
    }

    try {
      syncEmailsToDatabase(allEmails, account.id);
    } catch (error) {
      console.error("Error syncing emails to database:", error);
    }

    await prisma.emailAccount.update({
      where: { id: account.id },
      data: {
        nextDeltaToken: storedDeltaToken,
      },
    });

    return {
      emails: allEmails,
      deltaToken: storedDeltaToken,
    };
  }

  async sendEmail({
    from,
    subject,
    body,
    inReplyTo,
    threadId,
    references,
    to,
    cc,
    bcc,
    replyTo, // replyTo is EmailAddress | undefined
  }: {
    from: EmailAddress;
    subject: string;
    body: string;
    inReplyTo?: string;
    threadId?: string;
    references?: string[];
    to: EmailAddress[];
    cc?: EmailAddress[];
    bcc?: EmailAddress[];
    replyTo?: EmailAddress;
  }) {
    try {
      const aurinkoPayload: {
        from: EmailAddress;
        subject: string;
        body: string;
        inReplyTo?: string;
        threadId?: string;
        references?: string[];
        to: EmailAddress[];
        cc?: EmailAddress[];
        bcc?: EmailAddress[];
        replyTo?: EmailAddress[]; // replyTo is an array of EmailAddress or undefined
      } = {
        from,
        subject,
        body,
        inReplyTo,
        threadId,
        references,
        to,
        cc,
        bcc,
      };

      if (replyTo) {
        aurinkoPayload.replyTo = [replyTo]; // If replyTo is defined, set it as an array
      }
      // If replyTo was undefined, aurinkoPayload.replyTo remains undefined,
      // and axios will omit it from the JSON sent to Aurinko.

      console.log("Sending email to Aurinko with payload:", aurinkoPayload);

      const response = await axios.post(
        "https://api.aurinko.io/v1/email/messages",
        aurinkoPayload, // Send the modified payload
        {
          params: {
            returnIds: true,
          },
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      console.log("Email sent successfully:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error sending email:",
          JSON.stringify(error.response?.data, null, 2)
        );
        throw error;
      } else {
        console.error("Error sending email:", error);
        throw error;
      }
    }
  }
}
