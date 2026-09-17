import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  const now = new Date();
  return {
    user: { id: 7, openId: "social-test", name: "Social Test", email: "social@test.local", loginMethod: "test", role: "user", createdAt: now, updatedAt: now, lastSignedIn: now },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("social input validation", () => {
  it("rejects empty comments before reaching the database", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.social.comment({ postId: 1, body: "   " })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects non-media upload payloads", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.social.uploadMedia({ dataUrl: "not-a-data-url", fileName: "x.txt", mimeType: "text/plain" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects invalid account setting enums before persistence", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.social.updateSettings({ allowTags: "invalid" as never })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("accepts boolean account setting input at the router boundary", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.social.updateSettings({ privateAccount: true })).resolves.toBeDefined();
  });
});
