import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addAlbum, useQueryAlbums } from 'src/api/albums';
import { Page } from 'src/components/Page';
import { Album } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';

export const AlbumsPage = (): JSX.Element => {
  const { data: albums, isError, isFetching } = useQueryAlbums();
  const [albumValues, setAlbumValues] = useState<Album>({
    title: '',
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

  const handleMutate = () => albumsMutation.mutate(albumValues);

  const albumElements =
    albums?.map((album, index) => (
      <div className='list-el' key={`album-${album.title}-${index}`}>
        <h3>{album.title}</h3>
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
          onChange={(e) => setAlbumValues({ title: e.currentTarget.value })}
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
