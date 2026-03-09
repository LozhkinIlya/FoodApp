import './header.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Out from '../out-button';
import { selectCountProducts, selectPriceBasket } from '../../store/selectors';

function getProductCountLabel(count: number): string {
  if (count === 1) return 'товар';
  if (count > 1 && count < 5) return 'товара';
  if (count % 10 === 1 && count !== 11) return 'товар';
  if (count % 10 > 1 && count % 10 < 5) return 'товара';
  return 'товаров';
}

interface HeaderProps {
  leftContent?: React.ReactNode;
  title?: string;
}

function Header({ leftContent, title = 'НАША ПРОДУКЦИЯ' }: HeaderProps) {
  const amount = useSelector(selectPriceBasket);
  const count = useSelector(selectCountProducts);

  return (
    <div className="Header">
      {leftContent}
      <h1 className="Header-title">{title}</h1>
      <div className="Header-cart">
        <div className="Header-cart__count">
          <p>{count}</p>
          <p>{getProductCountLabel(count)}</p>
        </div>
        <div className="Header-cart__content">
          <p>на сумму:</p>
          <p>{amount}</p>
          <p>₽</p>
        </div>
      </div>
      <Link to="/profile" className="Header-profile-link">
        <span className="Header-profile-text">Профиль</span>
      </Link>
      <Link to="/basket">
        <button className="Header-cart__button">
          <img src="/img/cart.svg" className="Cart-icon" alt="icon" />
        </button>
      </Link>
      <Out />
    </div>
  );
}

export default Header;
