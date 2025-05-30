import { EmailMessage } from "@/types/email-message";
import { EmailAddress } from "@/types/email-address";
import prisma from "./prisma";
import { EmailAttachment } from "@/types/email-attachment";

export async function syncEmailsToDatabase(
  emails: EmailMessage[],
  accountId: string
) {
  console.log("attempting to sync emails to database", emails.length);

  try {
    // Promise.all(
    //   emails.map((email, index) => upsertEmail(email, accountId, index))
    // );
    for (let index = 0; index < emails.length; index++) {
      await upsertEmail(emails[index], accountId, index);
    }
  } catch (e) {
    console.log("error syncing emails to database", e);
  }
}

async function upsertEmail(
  email: EmailMessage,
  accountId: string,
  index: number
) {
  console.log("upserting email", index);
  try {
    let emailLabelType: "inbox" | "sent" | "draft" = "inbox";
    if (
      email.sysLabels.includes("inbox") ||
      email.sysLabels.includes("important")
    ) {
      emailLabelType = "inbox";
    } else if (email.sysLabels.includes("sent")) {
      emailLabelType = "sent";
    } else if (email.sysLabels.includes("draft")) {
      emailLabelType = "draft";
    }

    const addressesToUpsert = new Map();
    for (const address of [
      email.from,
      ...email.to,
      ...email.cc,
      ...email.bcc,
      ...email.replyTo,
    ]) {
      addressesToUpsert.set(address.address, address);
    }

    const upsertedAddresses: Awaited<ReturnType<typeof upsertEmailAddress>>[] =
      [];

    for (const address of addressesToUpsert.values()) {
      const upsertedAddress = await upsertEmailAddress(address, accountId);
      upsertedAddresses.push(upsertedAddress);
    }

    const addressMap = new Map(
      upsertedAddresses
        .filter(Boolean)
        .map((address) => [address!.address, address])
    );

    const fromAddress = addressMap.get(email.from.address);
    if (!fromAddress) {
      console.log(
        `Failed to upsert from address for email ${email.bodySnippet}`
      );
      return;
    }

    const toAddresses = email.to
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);
    const ccAddresses = email.cc
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);
    const bccAddresses = email.bcc
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);
    const replyToAddresses = email.replyTo
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);

    const thread = await prisma.thread.upsert({
      where: { id: email.threadId },
      update: {
        subject: email.subject,
        accountId,
        lastMessageDate: new Date(email.sentAt),
        done: false,
        participantIds: [
          ...new Set([
            fromAddress.id,
            ...toAddresses.map((addr) => addr!.id),
            ...ccAddresses.map((addr) => addr!.id),
            ...bccAddresses.map((addr) => addr!.id),
          ]),
        ],
      },
      create: {
        id: email.threadId,
        accountId,
        subject: email.subject,
        done: false,
        draftStatus: emailLabelType === "draft",
        inboxStatus: emailLabelType === "inbox",
        sentStatus: emailLabelType === "sent",
        lastMessageDate: new Date(email.sentAt),
        participantIds: [
          ...new Set([
            fromAddress.id,
            ...toAddresses.map((addr) => addr!.id),
            ...ccAddresses.map((addr) => addr!.id),
            ...bccAddresses.map((addr) => addr!.id),
          ]),
        ],
      },
    });

    await prisma.email.upsert({
      where: { id: email.id },
      update: {
        threadId: thread.id,
        createdTime: new Date(email.createdTime),
        lastModifiedTime: new Date(),
        sentAt: new Date(email.sentAt),
        receivedAt: new Date(email.receivedAt),
        internetMessageId: email.internetMessageId,
        subject: email.subject,
        sysLabels: email.sysLabels,
        keywords: email.keywords,
        sysClassifications: email.sysClassifications,
        sensitivity: email.sensitivity,
        meetingMessageMethod: email.meetingMessageMethod,
        fromId: fromAddress.id,
        to: { set: toAddresses.map((addr) => ({ id: addr!.id })) },
        cc: { set: ccAddresses.map((addr) => ({ id: addr!.id })) },
        bcc: { set: bccAddresses.map((addr) => ({ id: addr!.id })) },
        replyTo: { set: replyToAddresses.map((addr) => ({ id: addr!.id })) },
        hasAttachments: email.hasAttachments,
        internetHeaders: email.internetHeaders,
        body: email.body,
        bodySnippet: email.bodySnippet,
        inReplyTo: email.inReplyTo,
        references: email.references,
        threadIndex: email.threadIndex,
        nativeProperties: email.nativeProperties,
        folderId: email.folderId,
        omitted: email.omitted,
        emailLabel: emailLabelType,
      },
      create: {
        id: email.id,
        emailLabel: emailLabelType,
        threadId: thread.id,
        createdTime: new Date(email.createdTime),
        lastModifiedTime: new Date(),
        sentAt: new Date(email.sentAt),
        receivedAt: new Date(email.receivedAt),
        internetMessageId: email.internetMessageId,
        subject: email.subject,
        sysLabels: email.sysLabels,
        internetHeaders: email.internetHeaders,
        keywords: email.keywords,
        sysClassifications: email.sysClassifications,
        sensitivity: email.sensitivity,
        meetingMessageMethod: email.meetingMessageMethod,
        fromId: fromAddress.id,
        to: { connect: toAddresses.map((addr) => ({ id: addr!.id })) },
        cc: { connect: ccAddresses.map((addr) => ({ id: addr!.id })) },
        bcc: { connect: bccAddresses.map((addr) => ({ id: addr!.id })) },
        replyTo: {
          connect: replyToAddresses.map((addr) => ({ id: addr!.id })),
        },
        hasAttachments: email.hasAttachments,
        body: email.body,
        bodySnippet: email.bodySnippet,
        inReplyTo: email.inReplyTo,
        references: email.references,
        threadIndex: email.threadIndex,
        nativeProperties: email.nativeProperties,
        folderId: email.folderId,
        omitted: email.omitted,
      },
    });

    const threadEmails = await prisma.email.findMany({
      where: { threadId: thread.id },
      orderBy: { threadIndex: "asc" },
    });

    let threadFolderType = "sent";
    for (const threadEmail of threadEmails) {
      if (threadEmail.emailLabel === "inbox") {
        threadFolderType = "inbox";
        break;
      } else if (threadEmail.emailLabel === "draft") {
        threadFolderType = "draft";
      }
    }
    await prisma.thread.update({
      where: { id: thread.id },
      data: {
        draftStatus: threadFolderType === "draft",
        inboxStatus: threadFolderType === "inbox",
        sentStatus: threadFolderType === "sent",
      },
    });

    for (const attachment of email.attachments) {
      await upsertAttachment(email.id, attachment);
    }
  } catch (e) {
    console.log("error upserting email", e, email.id, email.subject);
  }
}

async function upsertEmailAddress(address: EmailAddress, accountId: string) {
  try {
    // First try to find the existing address
    const existingAddress = await prisma.emailAddress.findUnique({
      where: {
        accountId_address: {
          accountId: accountId,
          address: address.address ?? "",
        },
      },
    });

    if (existingAddress) {
      // If it exists, update it
      return await prisma.emailAddress.update({
        where: { id: existingAddress.id },
        data: {
          name: address.name,
          raw: address.raw,
        },
      });
    } else {
      // If it doesn't exist, create it
      return await prisma.emailAddress.create({
        data: {
          address: address.address ?? "",
          name: address.name,
          raw: address.raw,
          accountId,
        },
      });
    }
  } catch (error) {
    // Log the full error for debugging
    console.error("Failed to upsert email address:", {
      error,
      address,
      accountId,
    });
    return null;
  }
}

async function upsertAttachment(emailId: string, attachment: EmailAttachment) {
  try {
    await prisma.emailAttachment.upsert({
      where: { id: attachment.id ?? "" },
      update: {
        name: attachment.name,
        mimeType: attachment.mimeType,
        size: attachment.size,
        inline: attachment.inline,
        contentId: attachment.contentId,
        content: attachment.content,
        contentLocation: attachment.contentLocation,
      },
      create: {
        id: attachment.id,
        emailId,
        name: attachment.name,
        mimeType: attachment.mimeType,
        size: attachment.size,
        inline: attachment.inline,
        contentId: attachment.contentId,
        content: attachment.content,
        contentLocation: attachment.contentLocation,
      },
    });
  } catch (error) {
    console.log(`Failed to upsert attachment for email ${emailId}: ${error}`);
  }
}
