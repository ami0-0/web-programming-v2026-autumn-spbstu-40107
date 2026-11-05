export class BlogPost {
  constructor({id, title, tags = [], comments = []}) {
    this.id = id;
    this.title = title;
    this.tags = Array.isArray(tags) ? [...tags] : [];
    this.comments = Array.isArray(comments)
      ? comments.map((c) => ({...c}))
      : [];
  }

  addTag(tag) {
    const hasTag = this.tags.some((t) =>
      typeof t === 'object' && t !== null && 'name' in t
        ? t.name === (typeof tag === 'object' && tag !== null ? tag.name : tag)
        : t === tag,
    );
    if (!hasTag) {
      this.tags.push(tag);
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter((t) => {
      const tagName =
        typeof t === 'object' && t !== null && 'name' in t ? t.name : t;
      const targetName =
        typeof tag === 'object' && tag !== null && 'name' in tag
          ? tag.name
          : tag;
      return tagName !== targetName;
    });
  }

  addComment(comment) {
    this.comments.push(comment);
  }

  get commentCount() {
    return this.comments.length;
  }
}

function extractTagName(tag) {
  if (typeof tag === 'object' && tag !== null && 'name' in tag) {
    return tag.name;
  }
  return String(tag);
}

export function groupPostsByTag(posts) {
  const map = new Map();
  for (const post of posts) {
    const tags = Array.isArray(post.tags) ? post.tags : [];
    for (const tag of tags) {
      const key = extractTagName(tag);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(post);
    }
  }
  return map;
}

export const groupPostsByTags = groupPostsByTag;

export function getUniqueTags(posts) {
  const set = new Set();
  for (const post of posts) {
    const tags = Array.isArray(post.tags) ? post.tags : [];
    for (const tag of tags) {
      set.add(extractTagName(tag));
    }
  }
  return set;
}

export function groupPostsByCommentCount(posts) {
  const map = new Map();
  for (const post of posts) {
    const count = post.comments ? post.comments.length : 0;
    if (!map.has(count)) {
      map.set(count, []);
    }
    map.get(count).push(post);
  }
  return map;
}

export function findPostsByTag(posts, tag) {
  const targetTag = extractTagName(tag);
  return posts.filter((post) => {
    const tags = Array.isArray(post.tags) ? post.tags : [];
    return tags.some((t) => extractTagName(t) === targetTag);
  });
}

export const getPostsByTag = findPostsByTag;

export function getAllCommentAuthors(posts) {
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
