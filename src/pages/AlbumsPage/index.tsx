import { useQueryAlbums } from 'src/api/albums';
import { Page } from 'src/components/Page';

export const AlbumsPage = (): JSX.Element => {
  const { data: albums, isError, isFetching } = useQueryAlbums();

  const albumElements =
    albums?.map((album, index) => (
      <div className='list-el' key={`album-${album.title}-${index}`}>
        <h3>{album.title}</h3>
      </div>
    )) ?? [];

  return <Page title='albums' isError={isError} isFetching={isFetching} listElements={albumElements} />;
};
