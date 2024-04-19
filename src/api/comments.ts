import { UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';
import { isCommentArr } from 'src/utils/guards';
import { Comment } from 'src/types/types';

type CommentResponse = {
  comments: Comment[];
  postId: number;
};

const getComments = async (postId: number): Promise<CommentResponse | undefined> => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);

    const responseData: unknown = await response.json();

    if (isCommentArr(responseData)) return { comments: responseData, postId };
    else throw new Error('Something went wrong with API (comments)');
  } catch {
    throw new Error('Unexpected result (comments)');
  }
};

export const useCommentsQuery = (): UseInfiniteQueryResult<{ pages: CommentResponse[] } | undefined, Error> => {
  return useInfiniteQuery({
    queryKey: ['comments'],
    queryFn: async ({ pageParam }) => {
      return await getComments(pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (currentPage) => {
      const { postId = 1 } = currentPage ?? {};
      return postId + 1;
    },
  });
};
