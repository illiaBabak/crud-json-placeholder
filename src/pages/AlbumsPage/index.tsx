import { useState } from 'react';
import { useAddAlbum, useDeleteAlbum, useQueryAlbums } from 'src/api/albums';
import { Page } from 'src/components/Page';
import { Album } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';

export const AlbumsPage = (): JSX.Element => {
  const { data: albums, isError, isLoading } = useQueryAlbums();
  const [albumValues, setAlbumValues] = useState<Album>({
    title: '',
    userId: 1,
    id: 0,
  });

  const { mutateAsync: addAlbum } = useAddAlbum();

  const { mutateAsync: deleteAlbum } = useDeleteAlbum();

  const handleMutate = () => addAlbum({ ...albumValues, id: albums?.length ?? 0 });

  const albumElements =
    albums?.map((album, index) => (
      <div className='list-el' key={`album-${album.title}-${index}`}>
        <h3>{album.title}</h3>
        <div className='delete-el-btn' onClick={() => deleteAlbum(album.id)}>
          Delete
        </div>
      </div>
    )) ?? [];

  const albumInputs = (
    <>
      <div className='create-window-row'>
        <h4>Title</h4>
        <input
          type='text'
          className='create-window-input'
          value={albumValues.title}
          onChange={(e) => {
            const val = e.currentTarget.value;
            setAlbumValues((prev) => ({
              ...prev,
              title: val,
            }));
          }}
        />
      </div>
    </>
  );

  return (
    <Page
      title='albums'
      isError={isError}
      isLoading={isLoading}
      listElements={albumElements}
      changeData={handleMutate}
      inputs={albumInputs}
      isDisabledBtn={hasEmptyField(albumValues)}
    />
  );
};
