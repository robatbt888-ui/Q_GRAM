import { and, desc, eq, like, asc, sql } from "drizzle-orm";
import { comments, conversationParticipants, conversations, follows, messages, notifications, postLikes, postSaves, posts, users } from "../drizzle/schema";
import { getDb } from "./db";

const feedSelection = (viewerId: number) => ({
  post: posts,
  author: users,
  likes: sql<number>`count(distinct ${postLikes.userId})`,
  comments: sql<number>`count(distinct ${comments.id})`,
  isLiked: sql<number>`max(case when ${postLikes.userId} = ${viewerId} then 1 else 0 end)`,
  isSaved: sql<number>`max(case when ${postSaves.userId} = ${viewerId} then 1 else 0 end)`,
});

export async function listFeed(viewerId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select(feedSelection(viewerId)).from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .leftJoin(postLikes, eq(posts.id, postLikes.postId))
    .leftJoin(postSaves, eq(posts.id, postSaves.postId))
    .leftJoin(comments, eq(posts.id, comments.postId))
    .groupBy(posts.id, users.id).orderBy(desc(posts.createdAt)).limit(limit).offset(offset);
}

export async function listSavedFeed(viewerId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select(feedSelection(viewerId)).from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .innerJoin(postSaves, eq(posts.id, postSaves.postId))
    .leftJoin(postLikes, eq(posts.id, postLikes.postId))
    .leftJoin(comments, eq(posts.id, comments.postId))
    .where(eq(postSaves.userId, viewerId))
    .groupBy(posts.id, users.id).orderBy(desc(posts.createdAt)).limit(limit);
}

export async function searchUsers(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  const term = `%${query.trim()}%`;
  return db.select({ id: users.id, name: users.name, username: users.username, bio: users.bio, avatarUrl: users.avatarUrl }).from(users).where(like(users.username, term)).limit(limit);
}

export async function updateProfile(userId: number, input: { username?: string; bio?: string; avatarUrl?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(users).set(input).where(eq(users.id, userId));
  return db.select().from(users).where(eq(users.id, userId)).limit(1);
}

export async function createPost(input: { authorId: number; caption?: string; mediaUrl: string; mediaType?: "image" | "video"; location?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(posts).values(input);
  return result[0].insertId;
}

export async function togglePostLike(postId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId))).limit(1);
  if (existing.length) { await db.delete(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId))); return false; }
  await db.insert(postLikes).values({ postId, userId }); return true;
}

export async function togglePostSave(postId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(postSaves).where(and(eq(postSaves.postId, postId), eq(postSaves.userId, userId))).limit(1);
  if (existing.length) { await db.delete(postSaves).where(and(eq(postSaves.postId, postId), eq(postSaves.userId, userId))); return false; }
  await db.insert(postSaves).values({ postId, userId }); return true;
}

export async function addComment(postId: number, authorId: number, body: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(comments).values({ postId, authorId, body });
  return result[0].insertId;
}

export async function toggleFollow(followerId: number, followingId: number) {
  if (followerId === followingId) throw new Error("Cannot follow yourself");
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))).limit(1);
  if (existing.length) { await db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))); return false; }
  await db.insert(follows).values({ followerId, followingId }); return true;
}

export async function listNotifications(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ notification: notifications, actor: users }).from(notifications).leftJoin(users, eq(notifications.actorId, users.id)).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
}

export async function createConversation(userId: number, otherUserId: number) {
  if (userId === otherUserId) throw new Error("Cannot message yourself");
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const conversation = await db.insert(conversations).values({});
  const conversationId = Number(conversation[0].insertId);
  await db.insert(conversationParticipants).values([{ conversationId, userId }, { conversationId, userId: otherUserId }]);
  return conversationId;
}

export async function listConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(conversationParticipants).where(eq(conversationParticipants.userId, userId)).limit(50);
}

export async function listMessages(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  const member = await db.select().from(conversationParticipants).where(and(eq(conversationParticipants.conversationId, conversationId), eq(conversationParticipants.userId, userId))).limit(1);
  if (!member.length) throw new Error("Conversation access denied");
  return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(asc(messages.createdAt));
}

export async function sendMessage(conversationId: number, senderId: number, body: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const member = await db.select().from(conversationParticipants).where(and(eq(conversationParticipants.conversationId, conversationId), eq(conversationParticipants.userId, senderId))).limit(1);
  if (!member.length) throw new Error("Conversation access denied");
  const result = await db.insert(messages).values({ conversationId, senderId, body });
  return result[0].insertId;
}
