"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }

  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorised");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("user not found");
    }

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAccount = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        isDefault: shouldBeDefault,
        userId: user.id,
      },
    });

    const serializedAccount = serializeTransaction(newAccount);
    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getUserAccounts(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorised");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("user not found");
    }

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    const serializedAccount = accounts.map(serializeTransaction);

    return serializedAccount;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}
