import { createContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AlbumsPage } from 'src/pages/AlbumsPage';
import { PostsPage } from 'src/pages/PostsPage';
import { UsersPage } from 'src/pages/UsersPage';

// TODO  type AlertProps = {
//   text: string;
//   type: 'success' | 'error' | 'warning';
//   onClose: () => void;
//   position: 'top' | 'bottom';
// };

type GlobalContextType = {
  shouldShowCreateWindow: boolean;
  setShouldShowCreateWindow: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GlobalContext = createContext<GlobalContextType>({
  shouldShowCreateWindow: false,
  setShouldShowCreateWindow: () => {},
});

export const App = (): JSX.Element => {
  const [shouldShowCreateWindow, setShouldShowCreateWindow] = useState(false);

  return (
    <div className='container'>
      <GlobalContext.Provider value={{ shouldShowCreateWindow, setShouldShowCreateWindow }}>
        <BrowserRouter>
          <Routes>
            <Route path='/*' element={<Navigate to='/posts' />} />
            <Route path='/posts' element={<PostsPage />} />
            <Route path='/albums' element={<AlbumsPage />} />
            <Route path='/users' element={<UsersPage />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
    </div>
  );
};
