import React, {useState, useEffect, useMemo} from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const STORAGE_KEY = 'lab5_finance_data';
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#FF19A3',
];

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch {
        console.error('Failed to parse transactions');
      }
    }
  }, []);

  // Сохранение данных при каждом изменении массива транзакций
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!amount || !category) {
      return;
    }

    const newTransaction = {
      id: crypto.randomUUID(),
      type,
      amount: parseFloat(amount),
      category: category.trim(),
      description: description.trim(),
      date: new Date().toISOString(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setAmount('');
    setCategory('');
    setDescription('');
  };

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Подготовка данных для круговой диаграммы (только расходы)
  const chartData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({name, value}));
  }, [transactions]);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <main data-testid="app" className="app-container">
      <h1>Учет личных финансов</h1>

      <div className="balance-board">
        <div className="balance-item income">
          <h3>Доходы</h3>
          <p>{totalIncome} ₽</p>
        </div>
        <div className="balance-item expense">
          <h3>Расходы</h3>
          <p>{totalExpense} ₽</p>
        </div>
        <div className="balance-item total">
          <h3>Баланс</h3>
          <p>{totalIncome - totalExpense} ₽</p>
        </div>
      </div>

      <div className="content-grid">
        <section className="form-section">
          <h2>Добавить операцию</h2>
          <form onSubmit={handleAddTransaction} className="transaction-form">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Расход</option>
              <option value="income">Доход</option>
            </select>
            <input
              type="number"
              placeholder="Сумма"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
            <input
              type="text"
              placeholder="Категория (например, Еда, Зарплата)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Описание (необязательно)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Добавить</button>
          </form>
        </section>

        <section className="chart-section">
          <h2>Структура расходов</h2>
          {chartData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} ₽`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="empty-msg">Нет данных о расходах для диаграммы</p>
          )}
        </section>
      </div>

      <section className="history-section">
        <h2>История транзакций</h2>
        {transactions.length === 0 ? (
          <p className="empty-msg">Транзакций пока нет</p>
        ) : (
          <ul className="transaction-list">
            {transactions.map((t) => (
              <li key={t.id} className={`transaction-item ${t.type}`}>
                <div className="transaction-info">
                  <strong>{t.category}</strong>
                  <span className="transaction-desc">{t.description}</span>
                  <span className="transaction-date">
                    {new Date(t.date).toLocaleDateString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="transaction-actions">
                  <span className="transaction-amount">
                    {t.type === 'income' ? '+' : '-'}
                    {t.amount} ₽
                  </span>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="delete-btn"
                  >
                    &times;
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
