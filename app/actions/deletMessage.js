"use server";

import connectDB from "@/config/database";
import Message from "@/models/message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function deleteMessage(messageId) {
  await connectDB();
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;

  const message = await Message.findById(messageId);

  if (message.recipient.toString() !== userId) {
    throw new Error("unauthorized");
  }

  await message.deleteOne();

  revalidatePath("/message", "page");
}

export default deleteMessage;
