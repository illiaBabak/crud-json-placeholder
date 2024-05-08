import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { isCommentArr } from 'src/utils/guards';
import { Comment } from 'src/types/types';
import { BASE_URL, COMMENTS_QUERY } from './constants';

type CommentResponse = {
  comments: Comment[];
  postId: number;
};

const getComments = async (postId: number): Promise<CommentResponse | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);

    const responseData: unknown = await response.json();

    if (isCommentArr(responseData)) return { comments: responseData, postId };
    else throw new Error('Something went wrong with API (comments)');
  } catch {
    throw new Error('Unexpected result (comments)');
  }
};

export const useCommentQuery = (id: number): UseQueryResult<CommentResponse | undefined, Error> => {
  return useQuery({
    queryKey: [COMMENTS_QUERY, id],
    queryFn: async () => {
      return await getComments(id);
    },
  });
};
