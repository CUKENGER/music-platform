import { Prisma } from "@prisma/client";

export type CommentWithLikes = Prisma.CommentGetPayload<{
  include: { likedByUsers: true };
}>;
