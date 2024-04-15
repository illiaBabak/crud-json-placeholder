import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Post } from 'src/types/types';
import { isPost, isPostArr } from 'src/utils/guards';

const addPost = async (post: Post): Promise<Post | undefined> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(post),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with adding a new post');

  const newPost: unknown = await response.json();

  return isPost(newPost) ? newPost : undefined;
};

const deletePost = async (postId: number): Promise<void> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/{${postId}}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Something went wrong with deleting a post');
};

const getPosts = async (): Promise<Post[] | undefined> => {
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

export const useAddPost = (): UseMutationResult<
  Post | undefined,
  Error,
  Post,
  {
    prevVal: Post[] | undefined;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['add_post'],
    mutationFn: addPost,
    onMutate: async (post: Post) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const prevVal = queryClient.getQueryData<Post[] | undefined>(['posts']);

      queryClient.setQueryData(['posts'], (prev: Post[]) => [post, ...prev]);

      return { prevVal };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(['posts'], context?.prevVal);
    },
  });
};

export const useDeletePost = (): UseMutationResult<
  void,
  Error,
  number,
  {
    prevVal: Post[] | undefined;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete_post'],
    mutationFn: deletePost,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const prevVal = queryClient.getQueryData<Post[] | undefined>(['posts']);

      queryClient.setQueryData(['posts'], (prev: Post[]) => prev.filter((post) => post.id !== id));

      return { prevVal };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(['posts'], context?.prevVal);
    },
  });
};
