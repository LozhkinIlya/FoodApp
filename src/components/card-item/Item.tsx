import './item.scss';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../reducers/basketSlice';
import { Link } from 'react-router-dom';

interface ItemProps {
  id: number;
  url: string;
  title: string;
  description: string;
  price: number;
  weight: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function Item({ id, url, title, description, price, weight, isFavorite, onToggleFavorite }: ItemProps) {
  const dispatch = useDispatch();

  const handlePlus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(id));
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.();
  };

  return (
    <div className="Item">
      {onToggleFavorite && (
        <button
          type="button"
          className={`Item-favorite ${isFavorite ? 'Item-favorite--active' : ''}`}
          onClick={handleFavorite}
          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 16.5L8.55 15.18C4.4 11.58 2 9.28 2 6.5C2 4.5 3.5 3 5.5 3C6.74 3 7.93 3.6 8.75 4.5L10 5.75L11.25 4.5C12.07 3.6 13.26 3 14.5 3C16.5 3 18 4.5 18 6.5C18 9.28 15.6 11.58 11.45 15.19L10 16.5Z"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <Link to={`/product/${id}`}>
        <img src={url.startsWith('/') ? url : `/${url}`} className="Item-img" alt="food" />
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
