import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Post } from 'src/types/types';
import { isPostArr } from 'src/utils/guards';

export const getPosts = async (): Promise<Post[] | undefined> => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);

    const responseData: unknown = await response.json();

    if (isPostArr(responseData)) return responseData;
    else throw new Error('Something went wrong with API request (posts)');
  } catch {
    throw new Error('Unexpected result (posts)');
  }
};

export const useQueryPosts = (): UseQueryResult<Post[]> => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      return await getPosts();
    },
  });
};
