export class BlogPost {
  constructor(idOrObj, title, tags = [], comments = []) {
    if (typeof idOrObj === 'object' && idOrObj !== null) {
      this.id = Number(idOrObj.id);
      this.title = String(idOrObj.title ?? '');
      this.tags = Array.isArray(idOrObj.tags) ? [...idOrObj.tags] : [];
      this.comments = Array.isArray(idOrObj.comments)
        ? idOrObj.comments.map((c) => ({...c}))
        : [];
    } else {
      this.id = Number(idOrObj);
      this.title = String(title ?? '');
      this.tags = Array.isArray(tags) ? [...tags] : [];
      this.comments = Array.isArray(comments)
        ? comments.map((c) => ({...c}))
        : [];
    }
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  addComment(comment) {
    this.comments.push(comment);
  }

  get commentCount() {
    return this.comments.length;
  }
}

export function groupPostsByTag(posts) {
  const result = new Map();
  for (const post of posts) {
    const tags = Array.isArray(post.tags) ? post.tags : [];
    for (const tag of tags) {
      if (!result.has(tag)) {
        result.set(tag, []);
      }
      result.get(tag).push(post);
    }
  }
  return result;
}

export const groupPostsByTags = groupPostsByTag;

export function getUniqueTags(posts) {
  const set = new Set();
  for (const post of posts) {
    const tags = Array.isArray(post.tags) ? post.tags : [];
    for (const tag of tags) {
      set.add(tag);
    }
  }
  return Array.from(set);
}

export function groupPostsByCommentCount(posts) {
  const result = new Map();
  for (const post of posts) {
    const count = Number(post.commentCount ?? post.comments?.length ?? 0);
    if (!result.has(count)) {
      result.set(count, []);
    }
    result.get(count).push(post);
  }
  return result;
}

export function findPostsByTag(posts, tag) {
  return posts.filter((post) => {
    const tags = Array.isArray(post.tags) ? post.tags : [];
    return tags.includes(tag);
  });
}

export const getPostsByTag = findPostsByTag;

export function getCommentAuthors(posts) {
  const authors = [];
  for (const post of posts) {
    const comments = Array.isArray(post.comments) ? post.comments : [];
    for (const comment of comments) {
      if (
        typeof comment === 'object' &&
        comment !== null &&
        'author' in comment
      ) {
        authors.push(comment.author);
      } else {
        authors.push(comment);
      }
    }
  }
  return authors;
}

export const getAllCommentAuthors = getCommentAuthors;
