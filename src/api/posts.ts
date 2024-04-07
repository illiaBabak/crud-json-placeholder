import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { PostResponse } from 'src/types/posts';
import { isPostResponse } from 'src/utils/guards';

export const getPosts = async (): Promise<PostResponse | undefined> => {
  try {
    const response: AxiosResponse<PostResponse> = await axios.get(`https://jsonplaceholder.typicode.com/posts`);

    if (isPostResponse(response)) return response;
    else throw new Error('Something went wrong with API request (posts)');
  } catch {
    throw new Error('Unexpected result (posts)');
  }
};

export const useQueryPosts = (): UseQueryResult<PostResponse> => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      return await getPosts();
    },
  });
};
