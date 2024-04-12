import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addAlbum, deleteAlbum, useQueryAlbums } from 'src/api/albums';
import { Page } from 'src/components/Page';
import { Album } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';

export const AlbumsPage = (): JSX.Element => {
  const { data: albums, isError, isFetching } = useQueryAlbums();
  const [albumValues, setAlbumValues] = useState<Album>({
    title: '',
    userId: 1,
    id: albums?.length ?? 1,
  });
  const queryClient = useQueryClient();

  const albumsMutation = useMutation({
    mutationFn: (album: Album) => addAlbum(album),
    onMutate: async (album: Album) => {
      await queryClient.cancelQueries({ queryKey: ['albums'] });

      const prevVal: Album[] | undefined = queryClient.getQueryData(['albums']);

      queryClient.setQueryData(['albums'], (prev: Album[]) => [album, ...prev]);

      return { prevVal };
    },

    onError: (_err, _newAlbum, context) => {
      queryClient.setQueryData(['albums'], context?.prevVal);
    },
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: (album: Album) => deleteAlbum(album),
    onMutate: async (deletedAlbum: Album) => {
      await queryClient.cancelQueries({ queryKey: ['albums'] });

      const prevVal: Album[] | undefined = queryClient.getQueryData(['albums']);

      queryClient.setQueryData(['albums'], (prev: Album[]) => prev.filter((album) => album.id !== deletedAlbum.id));

      return { prevVal };
    },

    onError: (_err, _album, context) => {
      queryClient.setQueryData(['albums'], context?.prevVal);
    },
  });

  const handleMutate = () => albumsMutation.mutate(albumValues);

  const albumElements =
    albums?.map((album, index) => (
      <div className='list-el' key={`album-${album.title}-${index}`}>
        <h3>{album.title}</h3>
        <div className='delete-el-btn' onClick={() => deleteAlbumMutation.mutate(album)}>
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
      isFetching={isFetching}
      listElements={albumElements}
      changeData={handleMutate}
      inputs={albumInputs}
      isDisabledBtn={hasEmptyField(albumValues)}
    />
  );
};
