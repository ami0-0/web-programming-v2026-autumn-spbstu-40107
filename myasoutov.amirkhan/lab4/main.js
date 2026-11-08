import {BlogPost} from './model.js';

const listElement = document.querySelector('[data-testid="entity-list"]');
const formElement = document.querySelector('[data-testid="entity-form"]');

let posts = [];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadData() {
  const data = JSON.parse(localStorage.getItem('blogPosts') || '[]');
  posts = data.map((p) => new BlogPost(p));
  render();
}

async function saveData() {
  localStorage.setItem('blogPosts', JSON.stringify(posts));
}

async function addPost(id, title) {
  await delay(100);
  const post = new BlogPost({id: Number(id), title});
  posts.push(post);
  await saveData();
  render();
}

async function deletePost(id) {
  await delay(100);
  posts = posts.filter((p) => p.id !== id);
  await saveData();
  render();
}

async function addTagToPost(id, tag) {
  await delay(100);
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.addTag(tag);
  }
  await saveData();
  render();
}

async function removeTagFromPost(id, tag) {
  await delay(100);
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.removeTag(tag);
  }
  await saveData();
  render();
}

async function addCommentToPost(id, author, text) {
  await delay(100);
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.addComment({author, text});
  }
  await saveData();
  render();
}

formElement.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(formElement);
  const id = formData.get('id');
  const title = formData.get('title');
  if (title && id) {
    formElement.reset();
    await addPost(id, title);
  }
});

function render() {
  listElement.innerHTML = '';

  posts.forEach((post) => {
    const card = document.createElement('div');
    card.dataset.testid = 'entity-card';
    card.className = 'entity-card';

    const header = document.createElement('h3');
    header.textContent = `${post.title} (ID: ${post.id})`;

    const tagsHeader = document.createElement('h4');
    tagsHeader.textContent = 'Теги:';

    const tagsList = document.createElement('ul');
    tagsList.className = 'tags-list';
    post.tags.forEach((tag) => {
      const tagLi = document.createElement('li');
      tagLi.textContent = `${tag} `;

      const removeTagBtn = document.createElement('button');
      removeTagBtn.type = 'button';
      removeTagBtn.textContent = 'Удалить тэг';
      removeTagBtn.className = 'small-btn';
      removeTagBtn.onclick = () => removeTagFromPost(post.id, tag);

      tagLi.appendChild(removeTagBtn);
      tagsList.appendChild(tagLi);
    });

    const addTagForm = document.createElement('form');
    addTagForm.className = 'mini-form';
    const tagInput = document.createElement('input');
    tagInput.name = 'tag';
    tagInput.placeholder = 'Новый тег';
    tagInput.required = true;
    const addTagBtn = document.createElement('button');
    addTagBtn.type = 'submit';
    addTagBtn.textContent = 'Добавить тэг';

    addTagForm.append(tagInput, addTagBtn);
    addTagForm.onsubmit = (e) => {
      e.preventDefault();
      addTagToPost(post.id, tagInput.value);
    };

    const commentsHeader = document.createElement('h4');
    commentsHeader.textContent = `Комментарии (${post.commentCount}):`;

    const commentsList = document.createElement('ul');
    post.comments.forEach((c) => {
      const cLi = document.createElement('li');
      cLi.textContent = `${c.author}: ${c.text}`;
      commentsList.appendChild(cLi);
    });

    const addCommentForm = document.createElement('form');
    addCommentForm.className = 'mini-form';
    const authorInput = document.createElement('input');
    authorInput.name = 'author';
    authorInput.placeholder = 'Автор';
    authorInput.required = true;
    const textInput = document.createElement('input');
    textInput.name = 'text';
    textInput.placeholder = 'Текст';
    textInput.required = true;
    const addCommentBtn = document.createElement('button');
    addCommentBtn.type = 'submit';
    addCommentBtn.textContent = 'Добавить комментарий';

    addCommentForm.append(authorInput, textInput, addCommentBtn);
    addCommentForm.onsubmit = (e) => {
      e.preventDefault();
      addCommentToPost(post.id, authorInput.value, textInput.value);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.dataset.testid = 'delete-entity';
    deleteBtn.textContent = 'Удалить пост';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => deletePost(post.id);

    card.append(
      header,
      tagsHeader,
      tagsList,
      addTagForm,
      commentsHeader,
      commentsList,
      addCommentForm,
      deleteBtn,
    );
    listElement.appendChild(card);
  });
}

loadData();
