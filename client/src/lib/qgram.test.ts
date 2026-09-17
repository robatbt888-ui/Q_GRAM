import { describe, expect, it } from "vitest";
import { filterQgramPosts, getQgramLikeCount } from "./qgram";

const samplePosts = [
  { id: 1, name: "رها احمدی", username: "raha.ahmadi", location: "تهران", caption: "قهوه و شروع تازه", likes: 10 },
  { id: 2, name: "سینا نادری", username: "sina.n", location: "چالوس", caption: "مسیرهای تازه", likes: 20 },
];

describe("qgram feed helpers", () => {
  it("filters by Persian text across caption and location", () => {
    expect(filterQgramPosts(samplePosts, "چالوس", [], false).map((post) => post.id)).toEqual([2]);
    expect(filterQgramPosts(samplePosts, "  قهوه ", [], false).map((post) => post.id)).toEqual([1]);
  });

  it("shows only saved posts when saved mode is enabled", () => {
    expect(filterQgramPosts(samplePosts, "", [2], true).map((post) => post.id)).toEqual([2]);
    expect(filterQgramPosts(samplePosts, "", [], true)).toEqual([]);
  });

  it("increments the like count only for a newly liked post", () => {
    expect(getQgramLikeCount(10, false)).toBe(10);
    expect(getQgramLikeCount(10, true)).toBe(11);
  });
});
