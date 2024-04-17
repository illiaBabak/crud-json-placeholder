import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const findAlbum = (albums: Album[] | undefined, searchVal: string) => {
  const targetAlbum = albums?.filter((album) => album.title.toLowerCase().includes(searchVal.toLowerCase()))[0];

  return targetAlbum;
};

export const AlbumsPage = (): JSX.Element => {
  const { data: albums, isLoading } = useQueryAlbums();
  const { setShouldShowCreateWindow, setAlertProps } = useContext(GlobalContext);
  const [editedAlbum, setEditedAlbum] = useState<Album | null>(null);
  const [albumValues, setAlbumValues] = useState<Album>(DEFAULT_VALUES);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const { mutateAsync: addAlbum } = useAddAlbum();

  const { mutateAsync: deleteAlbum } = useDeleteAlbum();

  const { mutateAsync: editAlbum } = useEditAlbum();

  const handleMutate = () => addAlbum({ ...albumValues, id: albums?.length ?? 0 });

  const handleEdit = () => editAlbum(editedAlbum ?? DEFAULT_VALUES);

  const removeEdit = () => setEditedAlbum(null);

  const searchAlbum = () => {
    if (!searchVal) {
      navigate('/posts');
      return;
    }

    const searched = findAlbum(albums, searchVal);

    if (searched) navigate(`/albums/:${searched?.id}`);
    else {
      setAlertProps({ text: 'Not found', type: 'warning', position: 'top' });
      navigate('/albums');
    }
  };

  const searchAlbumInput = (
    <input
      type='text'
      className='search-input'
      value={searchVal}
      onChange={(e) => setSearchVal(e.currentTarget.value)}
      onBlur={() => searchAlbum()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
    />
  );

  const albumElements =
    (id ? albums?.filter((album) => album.id === Number(id.slice(1))) : albums)?.map((album, index) => {
      if (id && index > 0) return <></>;

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
      removeEdit={removeEdit}
      searchInput={searchAlbumInput}
    />
  );
};
