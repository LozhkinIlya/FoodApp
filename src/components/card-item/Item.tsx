import './item.scss';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../reducers/basketSlice';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import type { BasketItem } from '../../types';

interface ItemProps {
  id: number;
  url: string;
  title: string;
  description: string;
  price: number;
  weight: string;
}

function Item({ id, url, title, description, price, weight }: ItemProps) {
  const dispatch = useDispatch();

  const handlePlus = () => {
    const item: BasketItem = {
      id,
      idx: uuidv4(),
      title,
      url,
      price,
      description,
      weight,
    };
    dispatch(addToCart(item));
  };

  return (
    <div className="Item">
      <Link to={`/product/${id}`}>
        <img src={url} className="Item-img" alt="food" />
        <div className="Item-top">
          <h2 className="Item-title">{title}</h2>
          <p className="Item-description">{description}</p>
          <div className="Item-bottom">
            <span className="Item-price">{price} ₽</span>
            <span className="Slash">/</span>
            <span className="Item-weight">{weight}</span>
          </div>
        </div>
      </Link>

      <button onClick={handlePlus} className="Item-btn">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="Hide">
          <path d="M7 1.28564V12.3571" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M12.3569 6.82135L1.28551 6.82135" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="Hide-cart-text">В корзину</p>
      </button>
    </div>
  );
}

export default Item;
