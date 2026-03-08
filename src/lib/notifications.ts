import { NotificationType, type Prisma } from "@prisma/client";

export async function createNotificationsForUsers(
  tx: Prisma.TransactionClient,
  userIds: string[],
  input: {
    type?: NotificationType;
    title: string;
    body: string;
  },
) {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean))];

  if (!uniqueUserIds.length) {
    return;
  }

  await tx.notification.createMany({
    data: uniqueUserIds.map((userId) => ({
      userId,
      type: input.type ?? NotificationType.GENERIC,
      title: input.title,
      body: input.body,
    })),
  });
}
