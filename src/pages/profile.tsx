import './profile.scss';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/app-header';
import Item from '../components/card-item';
import { api, type OrderResponse, type UserResponse } from '../services/api';
import { useFavorites } from '../contexts/FavoritesContext';

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    pending: 'В обработке',
    cancelled: 'Отменён',
    completed: 'Выполнен',
  };
  return map[status] ?? status;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function Profile() {
  const { favorites, removeFavorite } = useFavorites();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([api.fetchUser(), api.fetchOrders()])
      .then(([userData, ordersData]) => {
        setUser(userData);
        setOrders(ordersData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancelOrder = async (orderId: number) => {
    setCancellingId(orderId);
    try {
      await api.cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
      );
    } catch {
      // ignore error
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="Profile">
      <Header
        title="ЛИЧНЫЙ КАБИНЕТ"
        leftContent={
          <Link to="/">
            <button className="Profile-back-btn" aria-label="Назад">
              <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.65166 1.04683C3.787 0.911493 4.00007 0.911493 4.13541 1.04683C4.26618 1.1776 4.26618 1.39524 4.13541 1.5257L1.68253 3.97859H9.77672C9.9654 3.97859 10.1202 4.12856 10.1202 4.31725C10.1202 4.50593 9.9654 4.66078 9.77672 4.66078H1.68253L4.13541 7.10909C4.26618 7.24443 4.26618 7.46238 4.13541 7.59284C4.00007 7.72818 3.787 7.72818 3.65166 7.59284L0.618095 4.55927C0.487328 4.42851 0.487328 4.21086 0.618095 4.0804L3.65166 1.04683Z" fill="#D58C51" />
              </svg>
            </button>
          </Link>
        }
      />

      <div className="Profile-content">
        {loading ? (
          <p className="Profile-loading">Загрузка...</p>
        ) : (
          <>
            <section className="Profile-greeting">
              {user && <p className="Profile-login">Привет, {user.login}!</p>}
            </section>

            <section className="Profile-orders">
              <h3 className="Profile-section-title">Мои заказы</h3>
              {orders.length === 0 ? (
                <p className="Profile-empty">Заказов пока нет</p>
              ) : (
                <ul className="Profile-orders-list">
                  {orders.map((order) => (
                    <li key={order.id} className="Profile-order-item">
                      <div className="Profile-order-header">
                        <span className="Profile-order-date">{formatDate(order.created_at)}</span>
                        <span className="Profile-order-price">{order.total_price} ₽</span>
                        <span className="Profile-order-status">{formatStatus(order.status)}</span>
                        {order.status === 'pending' && (
                          <button
                            type="button"
                            className="Profile-order-cancel"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingId === order.id}
                          >
                            {cancellingId === order.id ? 'Отмена...' : 'Отменить заказ'}
                          </button>
                        )}
                      </div>
                      <ul className="Profile-order-items">
                        {order.items.map((oi) => (
                          <li key={`${order.id}-${oi.product_id}`} className="Profile-order-product">
                            {oi.product.title} — {oi.price} ₽ × {oi.quantity}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="Profile-favorites">
              <h3 className="Profile-section-title">Избранное</h3>
              {favorites.length === 0 ? (
                <p className="Profile-empty">В избранном пока ничего нет</p>
              ) : (
                <div className="Profile-favorites-grid">
                  {favorites.map((product) => (
                    <div key={product.id} className="Profile-favorite-card">
                      <Item
                        id={product.id}
                        url={product.url}
                        title={product.title}
                        description={product.description}
                        price={product.price}
                        weight={product.weight}
                        isFavorite={true}
                        onToggleFavorite={() => removeFavorite(product.id)}
                      />
                      <button
                        className="Profile-remove-fav"
                        onClick={() => removeFavorite(product.id)}
                        type="button"
                      >
                        Удалить из избранного
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
