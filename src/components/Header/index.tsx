import { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GlobalContext } from 'src/root';
import { capitalize } from 'src/utils/capitalize';

type Props = {
  title: string;
};

export const Header = ({ title }: Props): JSX.Element => {
  const [, setSearchParams] = useSearchParams();
  const { setAlertProps } = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <div className='header'>
      <h1 className='title'>{capitalize(title)}</h1>
      <div className='btn-container'>
        <input
          type='text'
          className='search-input'
          onBlur={(e) => {
            const trimmedVal = e.currentTarget.value.trim();

            setAlertProps({ text: 'Success', position: 'top', type: 'success' });

            if (!trimmedVal) {
              setSearchParams((prev) => {
                prev.delete('query');
                return prev;
              });

              return;
            }

            setSearchParams({ query: trimmedVal });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
        />

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
