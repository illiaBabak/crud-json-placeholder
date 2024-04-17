import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Alert } from 'src/components/Alert';
import { AlbumsPage } from 'src/pages/AlbumsPage';
import { PostsPage } from 'src/pages/PostsPage';
import { UsersPage } from 'src/pages/UsersPage';
import { AlertProps } from 'src/types/types';

type GlobalContextType = {
  shouldShowCreateWindow: boolean;
  setShouldShowCreateWindow: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertProps: React.Dispatch<React.SetStateAction<AlertProps | null>>;
};

export const GlobalContext = createContext<GlobalContextType>({
  shouldShowCreateWindow: false,
  setShouldShowCreateWindow: () => {},
  setAlertProps: () => {},
});

export const App = (): JSX.Element => {
  const [alertProps, setAlertProps] = useState<AlertProps | null>(null);
  const [shouldShowCreateWindow, setShouldShowCreateWindow] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAlertProps(null);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [alertProps]);

  return (
    <div className='container'>
      <GlobalContext.Provider value={{ shouldShowCreateWindow, setShouldShowCreateWindow, setAlertProps }}>
        <BrowserRouter>
          <Routes>
            <Route path='/*' element={<Navigate to='/posts' />} />
            <Route path='/posts' element={<PostsPage />} />
            <Route path='/albums' element={<AlbumsPage />} />
            <Route path='/users' element={<UsersPage />} />
            <Route path='/posts/:id' element={<PostsPage />} />
            <Route path='/albums/:id' element={<AlbumsPage />} />
            <Route path='/users/:id' element={<UsersPage />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>

      {alertProps && (
        <Alert
          text={alertProps.text}
          type={alertProps.type}
          onClose={() => setAlertProps(null)}
          position={alertProps.position}
        />
      )}
    </div>
  );
};
