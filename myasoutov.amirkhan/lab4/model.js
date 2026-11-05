export class BlogPost {
  constructor({id, title, tags = [], comments = []}) {
    this.id = id;
    this.title = title;
    this.tags = [...tags];
    this.comments = comments.map((c) => ({...c}));
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

export function groupPostsByTags(posts) {
  const map = new Map();
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!map.has(tag)) {
        map.set(tag, []);
      }
      map.get(tag).push(post);
    }
  }
  return map;
}

export function getUniqueTags(posts) {
  const set = new Set();
  for (const post of posts) {
    for (const tag of post.tags) {
      set.add(tag);
    }
  }
  return set;
}

export function groupPostsByCommentCount(posts) {
  const map = new Map();
  for (const post of posts) {
    const count = post.comments.length;
    if (!map.has(count)) {
      map.set(count, []);
    }
    map.get(count).push(post);
  }
  return map;
}

export function getPostsByTag(posts, tag) {
  return posts.filter((post) => post.tags.includes(tag));
}

export function getAllCommentAuthors(posts) {
  const authors = [];
  for (const post of posts) {
    for (const comment of post.comments) {
      authors.push(comment.author);
    }
  }
  return authors;
}
