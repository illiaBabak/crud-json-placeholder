import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Post } from 'src/types/types';
import { isPost, isPostArr } from 'src/utils/guards';

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

export const addPost = async (post: Post): Promise<Post | undefined> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: post.title,
      body: post.body,
      id: post.id,
      userId: 1,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with adding a new post');

  const newPost: unknown = await response.json();

  return isPost(newPost) ? newPost : undefined;
};

export const deletePost = async (post: Post): Promise<undefined> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/{${post.id}}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Something went wrong with deleting a post');
};
