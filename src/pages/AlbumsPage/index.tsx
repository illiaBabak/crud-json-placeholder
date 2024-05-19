import { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAddAlbum, useDeleteAlbum, useEditAlbum, useQueryAlbums } from 'src/api/albums';
import { Page } from 'src/components/Page';
import { GlobalContext } from 'src/root';
import { Album } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';
import { searchPredicate } from 'src/utils/searchPredicate';

const DEFAULT_VALUES = {
  title: '',
  userId: 1,
  id: 0,
};

export const AlbumsPage = (): JSX.Element => {
  const [editedAlbum, setEditedAlbum] = useState<Album>(DEFAULT_VALUES);
  const { setShouldShowCreateWindow } = useContext(GlobalContext);

  const { data: albums, isLoading } = useQueryAlbums();

  const { mutateAsync: addAlbum } = useAddAlbum();
  const { mutateAsync: deleteAlbum } = useDeleteAlbum();
  const { mutateAsync: editAlbum } = useEditAlbum();

  const [seachParams] = useSearchParams();

  const searchText = seachParams.get('query');
  const filteredAlbums = albums?.filter((album) => searchPredicate([album.title], searchText ?? ''));

  const handleMutate = () => addAlbum({ ...editedAlbum, id: albums?.length ?? 0 });

  const handleEdit = () => editAlbum(editedAlbum ?? DEFAULT_VALUES);

  const albumElements =
    filteredAlbums?.map((album, index) => {
      return (
        <div className='list-el' key={`album-${album.title}-${index}`}>
          <h3>{album.title}</h3>
          <div className='container-el-btn'>
            <div className='delete-el-btn' onClick={() => deleteAlbum(album.id)}>
              Delete
            </div>
            <div
              className='edit-el-btn'
              onClick={() => {
                setShouldShowCreateWindow(true);
                setEditedAlbum(album);
              }}
            >
              Edit
            </div>
          </div>

          <div></div>
        </div>
      );
    }) ?? [];

  const albumInputs = (
    <>
      <div className='create-window-row'>
        <h4>Title</h4>
        <input
          type='text'
          className='create-window-input'
          value={editedAlbum.title}
          onChange={(e) => {
            const val = e.currentTarget.value;

            setEditedAlbum((prev) => {
              if (!prev) return prev;

              return {
                ...prev,
                title: val,
              };
            });
          }}
        />
      </div>
    </>
  );

  return (
    <Page
      title='albums'
      isLoading={isLoading}
      listElements={albumElements}
      changeData={editedAlbum.id ? handleEdit : handleMutate}
      inputs={albumInputs}
      isDisabledBtn={hasEmptyField(editedAlbum)}
      isEdit={!!editedAlbum.id}
      onResetState={() => setEditedAlbum(DEFAULT_VALUES)}
    />
  );
};
