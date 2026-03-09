import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { fetchCart, clearCart } from '../reducers/basketSlice';

export function CartLoader() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      dispatch(clearCart());
    }
  }, [dispatch, isAuthenticated]);

  return null;
}
