import { useQueryAlbums } from 'src/api/albums';
import { Alert } from 'src/components/Alert';
import { Header } from 'src/components/Header';
import { Loader } from 'src/components/Loader';

export const AlbumsPage = (): JSX.Element => {
  const { data: albums, isError, isFetching } = useQueryAlbums();

  return (
    <>
      <div className='page'>
        <Header />
        {isFetching ? (
          <Loader />
        ) : (
          <div className='list'>
            {albums?.map((el, index) => {
              return (
                <div className='list-el' key={`album-${el.title}-${index}`}>
                  <h3>{el.title}</h3>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isError && <Alert />}
    </>
  );
};
