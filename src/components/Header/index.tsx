import { useNavigate } from 'react-router-dom';
import { capitalize } from 'src/utils/capitalize';

export const Header = ({ title }: { title: string }): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className='header'>
      <h1 className='title'>{capitalize(title)}</h1>
      <div className='btn-container'>
        <div className='btn' onClick={() => navigate('/posts')}>
          Posts
        </div>
        <div className='btn' onClick={() => navigate('/albums')}>
          Albums
        </div>
        <div className='btn' onClick={() => navigate('/users')}>
          Users
        </div>
      </div>
    </div>
  );
};
