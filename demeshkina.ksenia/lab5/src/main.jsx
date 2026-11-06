import React, {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const books = [
  {
    id: 1,
    title: 'Сияние',
    text: 'Хит продаж этого месяца',
    color: '#8b2e2e',
    rating: 4.8,
    description:
      'Роман Стивена Кинга о писателе Джеке Торрансе и последствиях его безумия под влиянием зловещего отеля "Оверлук".',
    price: 650,
  },
  {
    id: 2,
    title: 'Братья Карамазовы',
    text: 'Классика, которую стоит перечитать',
    color: '#2e4a8b',
    rating: 4.9,
    description:
      'Роман Фёдора Достоевского о трех братьях и трагических последствиях философии Ивана.',
    price: 520,
  },
  {
    id: 3,
    title: 'Граф Монте-Кристо',
    text: 'Новинка в нашей подборке',
    color: '#2a852aff',
    rating: 4.7,
    description:
      'Роман о мести и справедливости, в котором несправедливо осужденный моряк совершает дерзкий побег из тюрьмы.',
    price: 480,
  },
];

function Slider() {
  const [current, setCurrent] = useState(0);

  const book = books[current];

  function nextSlide() {
    if (current === books.length - 1) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  }

  function prevSlide() {
    if (current === 0) {
      setCurrent(books.length - 1);
    } else {
      setCurrent(current - 1);
    }
  }

  return (
    <div className="slider">
      <div className="card" data-testid="book-slide">
        <div className="card-cover" style={{background: book.color}}>
          {book.title}
        </div>
        <div className="card-info">
          <h2>{book.title}</h2>
          <p>Рейтинг: {book.rating}</p>
          <p>{book.description}</p>
          <p className="card-price">{book.price} ₽</p>
        </div>
      </div>

      <p className="slide-text" data-testid="slide-caption">
        {book.text}
      </p>

      <div className="controls">
        <button onClick={prevSlide} data-testid="slide-previous">
          Назад
        </button>
        <span data-testid="slide-indicator">
          {current + 1}/{books.length}
        </span>
        <button onClick={nextSlide} data-testid="slide-next">
          Далее
        </button>
      </div>

      <div className="pagination">
        {books.map((item, index) => (
          <button
            key={item.id}
            className={index === current ? 'dot active' : 'dot'}
            onClick={() => setCurrent(index)}
            data-testid="slide-page"
          ></button>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="page">
      <h1>Книжный магазин</h1>
      <Slider />
    </div>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
