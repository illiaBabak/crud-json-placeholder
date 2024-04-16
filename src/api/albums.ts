import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Album } from 'src/types/types';
import { isAlbum, isAlbumArr } from 'src/utils/guards';

const addAlbum = async (album: Album): Promise<Album | undefined> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
    method: 'POST',
    body: JSON.stringify(album),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with adding a new album');

  const newAlbum: unknown = await response.json();

  return isAlbum(newAlbum) ? newAlbum : undefined;
};

const deleteAlbum = async (albumId: number): Promise<void> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Something went wrong with deleting a post');
};

const editAlbum = async (album: Album): Promise<void> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${album.id}`, {
    method: 'PUT',
    body: JSON.stringify(album),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with editing a post');
};

const getAlbums = async (): Promise<Album[] | undefined> => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/albums');

    const responseData: unknown = await response.json();

    if (isAlbumArr(responseData)) return responseData;
    else throw new Error('Something went wrong with API request (albums)');
  } catch {
    throw new Error('Unexpected result (albums)');
  }
};

export const useQueryAlbums = (): UseQueryResult<Album[]> =>
  useQuery({
    queryKey: ['albums'],
    queryFn: getAlbums,
  });

export const useAddAlbum = (): UseMutationResult<
  Album | undefined,
  Error,
  Album,
  {
    prevVal: Album[] | undefined;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['add_album'],
    mutationFn: (album: Album) => addAlbum(album),
    onMutate: async (album: Album) => {
      await queryClient.cancelQueries({ queryKey: ['albums'] });

      const prevVal = queryClient.getQueryData<Album[] | undefined>(['albums']);

      queryClient.setQueryData(['albums'], (prev: Album[]) => [album, ...prev]);

      return { prevVal };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(['albums'], context?.prevVal);
    },
  });
};

export const useDeleteAlbum = (): UseMutationResult<
  void,
  Error,
  number,
  {
    prevVal: Album[] | undefined;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete_album'],
    mutationFn: deleteAlbum,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['albums'] });

      const prevVal = queryClient.getQueryData<Album[] | undefined>(['albums']);

      queryClient.setQueryData(['albums'], (prev: Album[]) => prev.filter((album) => album.id !== id));

      return { prevVal };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(['albums'], context?.prevVal);
    },
  });
};

export const useEditAlbum = (): UseMutationResult<
  void,
  Error,
  Album,
  {
    prevVal: Album[] | undefined;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['edit_album'],
    mutationFn: editAlbum,
    onMutate: async (editedAlbum: Album) => {
      await queryClient.cancelQueries({ queryKey: ['albums'] });

      const prevVal = queryClient.getQueryData<Album[] | undefined>(['albums']);

      const editedAlbumIndex = prevVal?.findIndex((album) => album.id === editedAlbum.id);

      if (!editedAlbumIndex && editedAlbumIndex !== 0) return;

      const updatedAlbums = [
        ...(prevVal ?? []).slice(0, editedAlbumIndex),
        editedAlbum,
        ...(prevVal ?? []).slice(editedAlbumIndex + 1),
      ];

      queryClient.setQueryData(['albums'], updatedAlbums);

      return { prevVal };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(['albums'], context?.prevVal);
    },
  });
};
