import prisma from "./prisma";

export const authorizeAccountAccess = async (
  accountId: string,
  userId: string
) => {
  const account = await prisma.emailAccount.findFirst({
    where: {
      id: accountId,
      userId,
    },
    select: {
      id: true,
      emailAddress: true,
      name: true,
      accessToken: true,
    },
  });

  if (!account) {
    throw new Error("Account not found or unauthorized");
  }

  return account;
};
