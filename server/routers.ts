import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { addComment, createConversation, createPost, getAccountSettings, listConversations, listFeed, listMessages, listNotifications, listSavedFeed, markNotificationsRead, searchUsers, sendMessage, toggleFollow, togglePostLike, togglePostSave, updateAccountSettings, updateProfile } from "./socialDb";

const dataUrlSchema = z.string().regex(/^data:(image|video)\/[a-zA-Z0-9.+-]+;base64,/, "Invalid media data").max(15_000_000);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  social: router({
    feed: protectedProcedure.input(z.object({ limit: z.number().int().min(1).max(50).default(20), offset: z.number().int().min(0).default(0) })).query(({ ctx, input }) => listFeed(ctx.user.id, input.limit, input.offset)),
    saved: protectedProcedure.query(({ ctx }) => listSavedFeed(ctx.user.id)),
    searchUsers: publicProcedure.input(z.object({ query: z.string().trim().min(1).max(64) })).query(({ input }) => searchUsers(input.query)),
    updateProfile: protectedProcedure.input(z.object({ username: z.string().trim().min(2).max(64).optional(), bio: z.string().max(500).optional(), avatarUrl: z.string().url().optional() })).mutation(({ ctx, input }) => updateProfile(ctx.user.id, input)),
    createPost: protectedProcedure.input(z.object({ caption: z.string().max(2200).optional(), mediaUrl: z.string().url().or(z.string().startsWith("/manus-storage/")), mediaType: z.enum(["image", "video"]).default("image"), location: z.string().max(255).optional() })).mutation(({ ctx, input }) => createPost({ ...input, authorId: ctx.user.id })),
    uploadMedia: protectedProcedure.input(z.object({ dataUrl: dataUrlSchema, fileName: z.string().max(100).default("upload"), mimeType: z.string().regex(/^(image|video)\//) })).mutation(async ({ ctx, input }) => {
      const [, encoded] = input.dataUrl.split(",");
      const buffer = Buffer.from(encoded, "base64");
      const key = `${ctx.user.id}/posts/${Date.now()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const saved = await storagePut(key, buffer, input.mimeType);
      return { ...saved, mediaType: input.mimeType.startsWith("video/") ? "video" as const : "image" as const };
    }),
    toggleLike: protectedProcedure.input(z.object({ postId: z.number().int().positive() })).mutation(({ ctx, input }) => togglePostLike(input.postId, ctx.user.id)),
    toggleSave: protectedProcedure.input(z.object({ postId: z.number().int().positive() })).mutation(({ ctx, input }) => togglePostSave(input.postId, ctx.user.id)),
    comment: protectedProcedure.input(z.object({ postId: z.number().int().positive(), body: z.string().trim().min(1).max(1000) })).mutation(({ ctx, input }) => addComment(input.postId, ctx.user.id, input.body)),
    follow: protectedProcedure.input(z.object({ userId: z.number().int().positive() })).mutation(({ ctx, input }) => toggleFollow(ctx.user.id, input.userId)),
    notifications: protectedProcedure.query(({ ctx }) => listNotifications(ctx.user.id)),
    markNotificationsRead: protectedProcedure.mutation(({ ctx }) => markNotificationsRead(ctx.user.id)),
    settings: protectedProcedure.query(({ ctx }) => getAccountSettings(ctx.user.id)),
    updateSettings: protectedProcedure.input(z.object({
      privateAccount: z.boolean().optional(),
      allowComments: z.boolean().optional(),
      allowTags: z.enum(["everyone", "following", "nobody"]).optional(),
      allowMentions: z.enum(["everyone", "following", "nobody"]).optional(),
      pushNotifications: z.boolean().optional(),
      emailNotifications: z.boolean().optional(),
      archiveStories: z.boolean().optional(),
      activityStatus: z.boolean().optional(),
      language: z.string().min(2).max(16).optional(),
    })).mutation(({ ctx, input }) => updateAccountSettings(ctx.user.id, input)),
    conversations: protectedProcedure.query(({ ctx }) => listConversations(ctx.user.id)),
    createConversation: protectedProcedure.input(z.object({ otherUserId: z.number().int().positive() })).mutation(({ ctx, input }) => createConversation(ctx.user.id, input.otherUserId)),
    messages: protectedProcedure.input(z.object({ conversationId: z.number().int().positive() })).query(({ ctx, input }) => listMessages(input.conversationId, ctx.user.id)),
    sendMessage: protectedProcedure.input(z.object({ conversationId: z.number().int().positive(), body: z.string().trim().min(1).max(4000) })).mutation(({ ctx, input }) => sendMessage(input.conversationId, ctx.user.id, input.body)),
  }),
});

export type AppRouter = typeof appRouter;
