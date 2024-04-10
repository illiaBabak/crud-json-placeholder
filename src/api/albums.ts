import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Album } from 'src/types/types';
import { isAlbum, isAlbumArr } from 'src/utils/guards';

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

export const addAlbum = async (album: Album): Promise<Album | undefined> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
    method: 'POST',
    body: JSON.stringify({
      title: album.title,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with adding a new album');

  const newAlbum: unknown = await response.json();

  return isAlbum(newAlbum) ? newAlbum : undefined;
};
