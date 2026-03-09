import './cards.scss';
import { useEffect, useState } from 'react';
import Item from '../card-item';
import { api, type Product } from '../../services/api';
import { useFavorites } from '../../contexts/FavoritesContext';

function Cards() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="Cards Cards-loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="Cards Cards-error">{error}</div>;
  }

  return (
    <div className="Cards">
      {products.map((item) => (
        <Item
          key={item.id}
          id={item.id}
          url={item.url}
          title={item.title}
          description={item.description}
          price={item.price}
          weight={item.weight}
          isFavorite={isFavorite(item.id)}
          onToggleFavorite={() => toggleFavorite(item.id)}
        />
      ))}
    </div>
  );
}

export default Cards;
