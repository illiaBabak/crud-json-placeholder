import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Album } from 'src/types/types';
import { isAlbumArr } from 'src/utils/guards';

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
