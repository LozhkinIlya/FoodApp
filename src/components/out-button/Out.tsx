import './out.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Out() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleClick = () => {
    logout();
    navigate('/autorization');
  };

  return (
    <button type="button" className="Out-btn" onClick={handleClick}>
      Выйти
    </button>
  );
}

export default Out;
