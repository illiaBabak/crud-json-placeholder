import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAddAlbum, useDeleteAlbum, useEditAlbum, useQueryAlbums } from 'src/api/albums';
import { Page } from 'src/components/Page';
import { GlobalContext } from 'src/root';
import { Album } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';

const DEFAULT_VALUES = {
  title: '',
  userId: 1,
  id: 0,
};

const findAlbums = (albums: Album[] | undefined, searchVal: string) => {
  const targetAlbums = albums?.filter((album) => album.title.toLowerCase().includes(searchVal.toLowerCase()));

  return targetAlbums;
};

export const AlbumsPage = (): JSX.Element => {
  const { data: albums, isLoading } = useQueryAlbums();
  const { setShouldShowCreateWindow, setAlertProps } = useContext(GlobalContext);
  const [editedAlbum, setEditedAlbum] = useState<Album | null>(null);
  const [albumValues, setAlbumValues] = useState<Album>(DEFAULT_VALUES);
  const [searchVal, setSearchVal] = useState('');
  const [seachParams, setSearchParams] = useSearchParams();
  const searchText = seachParams.get('query');
  const [filteredAlbums, setFilteredAlbums] = useState<Album[] | undefined>(albums);

  useEffect(() => {
    const filtered = searchText ? findAlbums(albums, searchText) : albums;

    setFilteredAlbums(filtered);

    if (!albums) return;

    if (!filtered?.length) setAlertProps({ text: 'Not found', position: 'top', type: 'warning' });
  }, [albums, searchText, setAlertProps]);

  const { mutateAsync: addAlbum } = useAddAlbum();

  const { mutateAsync: deleteAlbum } = useDeleteAlbum();

  const { mutateAsync: editAlbum } = useEditAlbum();

  const handleMutate = () => addAlbum({ ...albumValues, id: albums?.length ?? 0 });

  const handleEdit = () => editAlbum(editedAlbum ?? DEFAULT_VALUES);

  const removeEdit = () => setEditedAlbum(null);

  const searchAlbumInput = (
    <input
      type='text'
      className='search-input'
      value={searchVal}
      onChange={(e) => setSearchVal(e.currentTarget.value)}
      onBlur={(e) => {
        setAlertProps({ text: 'Success', position: 'top', type: 'success' });

        if (!e.currentTarget.value) {
          const params = new URLSearchParams(seachParams);
          params.delete('query');
          setSearchParams(params);
          return;
        }

        setSearchParams({ query: e.currentTarget.value });
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
    />
  );

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
          value={editedAlbum ? editedAlbum.title : albumValues.title}
          onChange={(e) => {
            const val = e.currentTarget.value;

            {
              editedAlbum
                ? setEditedAlbum((prev) => {
                    if (!prev) return prev;

                    return {
                      ...prev,
                      title: val,
                    };
                  })
                : setAlbumValues((prev) => ({
                    ...prev,
                    title: val,
                  }));
            }
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
      changeData={editedAlbum ? handleEdit : handleMutate}
      inputs={albumInputs}
      isDisabledBtn={editedAlbum ? hasEmptyField(editedAlbum) : hasEmptyField(albumValues)}
      isEdit={!!editedAlbum}
      onResetState={removeEdit}
      searchInput={searchAlbumInput}
    />
  );
};
