import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { Album } from 'src/types/types';
import { isAlbumArr } from 'src/utils/guards';
import { ALBUMS_QUERY, ALBUM_ADD, ALBUM_DELETE, ALBUM_EDIT, ALBUM_MUTATION, BASE_URL } from './constants';

const addAlbum = async (album: Album): Promise<void> => {
  const response = await fetch(`${BASE_URL}/albums`, {
    method: 'POST',
    body: JSON.stringify(album),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with adding a new album');
};

const deleteAlbum = async (albumId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/albums/${albumId}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Something went wrong with deleting a post');
};

const editAlbum = async (album: Album): Promise<void> => {
  const response = await fetch(`${BASE_URL}/albums/${album.id}`, {
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
    const response = await fetch(`${BASE_URL}/albums`);

    const responseData: unknown = await response.json();

    if (isAlbumArr(responseData)) return responseData;
    else throw new Error('Something went wrong with API request (albums)');
  } catch {
    throw new Error('Unexpected result (albums)');
  }
};

export const useQueryAlbums = (): UseQueryResult<Album[]> =>
  useQuery({
    queryKey: [ALBUMS_QUERY],
    queryFn: getAlbums,
  });

export const useAddAlbum = (): UseMutationResult<
  void,
  Error,
  Album,
  {
    prevVal: Album[] | undefined;
  }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [ALBUM_MUTATION, ALBUM_ADD],
    mutationFn: addAlbum,
    onMutate: async (album: Album) => {
      await queryClient.cancelQueries({ queryKey: [ALBUMS_QUERY] });

      const prevVal = queryClient.getQueryData<Album[] | undefined>([ALBUMS_QUERY]);

      queryClient.setQueryData([ALBUMS_QUERY], (prev: Album[]) => [album, ...prev]);

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData([ALBUMS_QUERY], context?.prevVal);
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
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [ALBUM_MUTATION, ALBUM_DELETE],
    mutationFn: deleteAlbum,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: [ALBUMS_QUERY] });

      const prevVal = queryClient.getQueryData<Album[] | undefined>([ALBUMS_QUERY]);

      queryClient.setQueryData([ALBUMS_QUERY], (prev: Album[]) => prev.filter((album) => album.id !== id));

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData([ALBUMS_QUERY], context?.prevVal);
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
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [ALBUM_MUTATION, ALBUM_EDIT],
    mutationFn: editAlbum,
    onMutate: async (editedAlbum: Album) => {
      await queryClient.cancelQueries({ queryKey: [ALBUMS_QUERY] });

      const prevVal = queryClient.getQueryData<Album[] | undefined>([ALBUMS_QUERY]);

      queryClient.setQueryData<Album[] | undefined>([ALBUMS_QUERY], (prev) =>
        prev?.map((album) => (album.id === editedAlbum.id ? { ...album, ...editedAlbum } : album))
      );

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData([ALBUMS_QUERY], context?.prevVal);
    },
  });
};
