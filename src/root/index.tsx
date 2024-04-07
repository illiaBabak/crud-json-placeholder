import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AlbumsPage } from 'src/pages/AlbumsPage';
import { PostsPage } from 'src/pages/PostsPage';
import { UsersPage } from 'src/pages/UsersPage';

export const App = (): JSX.Element => {
  return (
    <div className='container'>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<Navigate to='/posts' />} />
          <Route path='/posts' element={<PostsPage />} />
          <Route path='/albums' element={<AlbumsPage />} />
          <Route path='/users' element={<UsersPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
