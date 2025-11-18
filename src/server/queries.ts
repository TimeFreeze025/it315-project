"use server";

import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { images } from "./db/schema";
import { and, desc, eq, or } from "drizzle-orm";
import { utapi } from "./uploadthing";

export async function getMyImages() {
  const user = await auth();

  if (!user?.userId) throw new Error("Invalid userId");

  // const images = await db.query.images.findMany({
  //   where: (model, { eq }) => eq(model.userId, user.userId),
  //   orderBy: (model, { desc }) => desc(model.id),
  // });

  const result = await db
    .select()
    .from(images)
    .where(eq(images.userId, user.userId))
    .orderBy(desc(images.id));

  // return images;
  return result;
}

export async function getImage(id: number) {
  const user = await auth();

  if (!user?.userId) throw new Error("Invalid userId");

  // const images = await db.query.images.findMany({
  //   where: (model, { eq }) => eq(model.userId, user.userId),
  //   orderBy: (model, { desc }) => desc(model.id),
  // });

  const result = await db
    .select()
    .from(images)
    .where(and(eq(images.userId, user.userId), eq(images.id, id)));

  // return images;
  return result;
}

export async function deleteImage(id: number) {
  const user = await auth();

  if (!user?.userId) throw new Error("Unauthorized");

  // const image = await db.query.images.findFirst({
  //   where: (model, { eq }) => eq(model.id, id),
  // });

  const [image] = await db.select().from(images).where(eq(images.id, id));

  if (!image) throw new Error("Image not found");

  if (image.userId !== user.userId) {
    throw new Error("You do not have permission to delete this image");
  }

  const fileKey = image.imageUrl?.split("/").pop();
  if (!fileKey) throw new Error("Invalid file key");

  await utapi.deleteFiles(fileKey);

  await db
    .delete(images)
    .where(and(eq(images.id, id), eq(images.userId, user.userId)));
}
