import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { Post } from 'src/types/types';
import { isPost, isPostArr } from 'src/utils/guards';
import { BASE_URL, POSTS_QUERY, POST_ADD, POST_DELETE, POST_EDIT, POST_MUTATION, POST_QUERY } from './constants';

const addPost = async (post: Post): Promise<void> => {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    body: JSON.stringify(post),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with adding a new post');
};

const deletePost = async (postId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Something went wrong with deleting a post');
};

const editPost = async (post: Post): Promise<void> => {
  const response = await fetch(`${BASE_URL}/posts/${post.id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with editing a post');
};

const getPost = async (id: number): Promise<Post | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`);

    const responseData: unknown = await response.json();

    if (isPost(responseData)) return responseData;
    else throw new Error('Something went wrong with API request (post)');
  } catch {
    throw new Error('Unexpected result (post)');
  }
};

const getPosts = async (): Promise<Post[] | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);

    const responseData: unknown = await response.json();

    if (isPostArr(responseData)) return responseData;
    else throw new Error('Something went wrong with API request (posts)');
  } catch {
    throw new Error('Unexpected result (posts)');
  }
};

export const useQueryPosts = (): UseQueryResult<Post[]> =>
  useQuery({
    queryKey: [POSTS_QUERY],
    queryFn: getPosts,
  });

export const useQueryPost = (id: number): UseQueryResult<Post> =>
  useQuery({
    queryKey: [POST_QUERY, id],
    queryFn: async () => {
      return await getPost(id);
    },
  });

export const useAddPost = (): UseMutationResult<
  void,
  Error,
  Post,
  {
    prevVal: Post[] | undefined;
  }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [POST_MUTATION, POST_ADD],
    mutationFn: addPost,
    onMutate: async (post: Post) => {
      await queryClient.cancelQueries({ queryKey: [POSTS_QUERY] });

      const prevVal = queryClient.getQueryData<Post[] | undefined>([POSTS_QUERY]);

      queryClient.setQueryData([POSTS_QUERY], (prev: Post[]) => [post, ...prev]);

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData([POSTS_QUERY], context?.prevVal);
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
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [POST_MUTATION, POST_DELETE],
    mutationFn: deletePost,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: [POSTS_QUERY] });

      const prevVal = queryClient.getQueryData<Post[] | undefined>([POSTS_QUERY]);

      queryClient.setQueryData([POSTS_QUERY], (prev: Post[]) => prev.filter((post) => post.id !== id));

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData([POSTS_QUERY], context?.prevVal);
    },
  });
};

export const useEditPost = (): UseMutationResult<
  void,
  Error,
  Post,
  {
    prevVal: Post[] | undefined;
  }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [POST_MUTATION, POST_EDIT],
    mutationFn: editPost,
    onMutate: async (editedPost: Post) => {
      await queryClient.cancelQueries({ queryKey: [POSTS_QUERY] });

      const prevVal = queryClient.getQueryData<Post[] | undefined>([POSTS_QUERY]);

      queryClient.setQueryData<Post[] | undefined>([POSTS_QUERY], (prev) =>
        prev?.map((post) => (post.id === editedPost.id ? { ...post, ...editedPost } : post))
      );

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData([POSTS_QUERY], context?.prevVal);
    },
  });
};
