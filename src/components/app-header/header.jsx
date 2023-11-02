import './header.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Out from '../out-button';

function Header() {
  const amount = useSelector(state => state.basket.priceBasket)
  const count = useSelector(state => state.basket.countProducts)
  
  function nameText (count) {
    if (count === 1) {
      return 'товар'
    } else if (count > 1 && count < 5) {
      return 'товара'
    }  else if (count % 10 === 1 && count !== 11) {
      return 'товар'
    } else if (count % 10 > 1 && count % 10 < 5) {
      return 'товара'
    } else {
      return 'товаров'
    }
  }

  return (
    <div className="Header">
      <h1 className="Header-title">НАША ПРОДУКЦИЯ</h1>
      <div className="Header-cart">
        <div className="Header-cart__count">
          <p>{count}</p>
          <p>{nameText(count)}</p>
        </div>
        
        <div className="Header-cart__content">
          <p className="">на сумму:</p>
          <p className="">{amount}</p>
          <p className="">₽</p>
        </div>
      </div>
      <Link to='/basket'><button className="Header-cart__button">
      <img src='/img/cart.svg' className="Cart-icon" alt="icon"/>
      </button>
      </Link>
      <Link to='/registration'><Out /></Link>
    </div>
  );
}
  
export default Header;