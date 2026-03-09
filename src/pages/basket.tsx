import '../components/cart/cart.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BasketItem from '../components/cart/cart-item';
import Out from '../components/out-button';
import { selectBasket, selectPriceBasket } from '../store/selectors';
import { api } from '../services/api';
import { clearCart } from '../reducers/basketSlice';

function Basket() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const basket = useSelector(selectBasket);
  const prices = useSelector(selectPriceBasket);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLink = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handlePlaceOrder = async () => {
    if (basket.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      await api.createOrder();
      dispatch(clearCart());
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка оформления заказа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Cart">
      <header className="Cart-header">
        <Link to="/">
          <button className="Cart-back-btn">
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.65166 1.04683C3.787 0.911493 4.00007 0.911493 4.13541 1.04683C4.26618 1.1776 4.26618 1.39524 4.13541 1.5257L1.68253 3.97859H9.77672C9.9654 3.97859 10.1202 4.12856 10.1202 4.31725C10.1202 4.50593 9.9654 4.66078 9.77672 4.66078H1.68253L4.13541 7.10909C4.26618 7.24443 4.26618 7.46238 4.13541 7.59284C4.00007 7.72818 3.787 7.72818 3.65166 7.59284L0.618095 4.55927C0.487328 4.42851 0.487328 4.21086 0.618095 4.0804L3.65166 1.04683Z" fill="#D58C51" />
            </svg>
          </button>
        </Link>
        <h1 className="Cart-title">КОРЗИНА С ВЫБРАННЫМИ ТОВАРАМИ</h1>
        <div className="Out-cart-btn">
          <Out />
        </div>
      </header>

      <div className="Cart-items">
        {basket.map((item) => (
          <BasketItem
            key={item.idx}
            id={item.id}
            idx={item.idx}
            img={item.url}
            title={item.title}
            price={item.price}
            handleLink={() => handleLink(item.id)}
          />
        ))}
      </div>

      <footer className="Cart-footer">
        <span className="Order">ЗАКАЗ НА СУММУ:</span>
        <span className="Order-count">{prices}</span>
        <span className="Order-p">₽</span>
        {error && <span className="Cart-error">{error}</span>}
        <button
          className="Order-btn"
          onClick={handlePlaceOrder}
          disabled={basket.length === 0 || loading}
        >
          {loading ? 'Оформление...' : 'Оформить заказ'}
        </button>
      </footer>
    </div>
  );
}

export default Basket;
