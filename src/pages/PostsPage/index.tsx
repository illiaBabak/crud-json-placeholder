import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addPost, useQueryPosts } from 'src/api/posts';
import { Page } from 'src/components/Page';
import { Post } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';

export const PostsPage = (): JSX.Element => {
  const { data: posts, isError, isFetching } = useQueryPosts();
  const [postValues, setPostValues] = useState<Post>({
    title: '',
    body: '',
  });
  const queryClient = useQueryClient();

  const postsMutation = useMutation({
    mutationFn: (post: Post) => addPost(post),
    onMutate: async (post: Post) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const prevVal: Post[] | undefined = queryClient.getQueryData(['posts']);

      queryClient.setQueryData(['posts'], (prev: Post[]) => [post, ...prev]);

      return { prevVal };
    },

    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(['posts'], context?.prevVal);
    },
  });

  const handleMutate = () => postsMutation.mutate(postValues);

  const postElements =
    posts?.map((el, index) => {
      return (
        <div className='list-el' key={`post-${el.title}-${index}`}>
          <h3>{el.title}</h3>
          <p>{el.body}</p>
        </div>
      );
    }) ?? [];

  const postInputs = (
    <>
      <div className='create-window-row'>
        <h4>Title</h4>
        <input
          type='text'
          className='create-window-input'
          value={postValues.title}
          onChange={(e) => {
            const val = e.currentTarget.value;
            setPostValues((prev) => ({
              ...prev,
              title: val,
            }));
          }}
        />
      </div>

      <div className='create-window-row'>
        <h4>Body</h4>
        <input
          type='text'
          value={postValues.body}
          className='create-window-input'
          onChange={(e) => {
            const val = e.currentTarget.value;
            setPostValues((prev) => ({
              ...prev,
              body: val,
            }));
          }}
        />
      </div>
    </>
  );

  return (
    <>
      <Page
        title='posts'
        isError={isError}
        isFetching={isFetching}
        listElements={postElements}
        changeData={handleMutate}
        inputs={postInputs}
        isDisabledBtn={hasEmptyField(postValues)}
      />
    </>
  );
};