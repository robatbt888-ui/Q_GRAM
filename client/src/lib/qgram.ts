export type QgramFeedPost = {
  id: number;
  name: string;
  username: string;
  location: string;
  caption: string;
  likes: number;
};

export function filterQgramPosts<T extends QgramFeedPost>(
  posts: T[],
  query: string,
  savedIds: number[],
  savedOnly: boolean,
): T[] {
  const normalizedQuery = query.trim().toLowerCase();
  const source = savedOnly ? posts.filter((post) => savedIds.includes(post.id)) : posts;
  if (!normalizedQuery) return source;

  return source.filter((post) =>
    `${post.name} ${post.username} ${post.caption} ${post.location}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function getQgramLikeCount(likes: number, liked: boolean) {
  return likes + (liked ? 1 : 0);
}
