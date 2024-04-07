import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { Album, AlbumResponse } from 'src/types/albums';
import { isAlbumResponse } from 'src/utils/guards';

const getAlbums = async (): Promise<Album[] | undefined> => {
  try {
    const response: AxiosResponse<AlbumResponse> = await axios.get('https://jsonplaceholder.typicode.com/albums');

    if (isAlbumResponse(response)) return response.data;
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
