import { EmailMessage } from "@/types/email-message";
import { SyncResponse } from "@/types/sync-response";
import { SyncUpdatedResponse } from "@/types/sync-updated-response";
import axios from "axios";

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
          (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') &&
          attempt < retryCount - 1
        ) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        throw error;
      }
    }
    throw new Error('Max retry attempts reached');
  }

  async getUpdatedEmails({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }) {
    let params: Record<string, string> = {};
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
        console.error("Error performing initial sync:", JSON.stringify(error.response?.data, null, 2));
        throw error; // Re-throw the error to handle it in the calling code
      } else {
        console.error("Error performing initial sync:", error);
        throw error;
      }
    }
  }
}
