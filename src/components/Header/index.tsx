import { useNavigate } from 'react-router-dom';
import { capitalize } from 'src/utils/capitalize';

type Props = {
  title: string;
  searchInput: JSX.Element;
};

export const Header = ({ title, searchInput }: Props): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className='header'>
      <h1 className='title'>{capitalize(title)}</h1>
      <div className='btn-container'>
        {searchInput}
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
