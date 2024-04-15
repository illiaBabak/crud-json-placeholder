import { useState } from 'react';
import { useAddPost, useDeletePost, useQueryPosts } from 'src/api/posts';
import { Page } from 'src/components/Page';
import { Post } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';

export const PostsPage = (): JSX.Element => {
  const { data: posts, isError, isLoading } = useQueryPosts();
  const [postValues, setPostValues] = useState<Post>({
    title: '',
    body: '',
    id: 0,
    userId: 1,
  });

  const { mutateAsync: createPost } = useAddPost();

  const { mutateAsync: deletePost } = useDeletePost();

  const handleMutate = () => createPost({ ...postValues, id: posts?.length ?? 0 });

  const postElements =
    posts?.map((el, index) => {
      return (
        <div className='list-el' key={`post-${el.title}-${index}`}>
          <h3>{el.title}</h3>
          <p>{el.body}</p>
          <div className='delete-el-btn' onClick={() => deletePost(el.id)}>
            Delete
          </div>
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

      <div className='create-window-row'>
        <h4>User ID</h4>
        <input
          type='number'
          className='create-window-input'
          value={postValues.userId}
          onChange={(e) => {
            const val = Number(e.currentTarget.value);
            setPostValues((prev) => ({
              ...prev,
              userId: val,
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
        isLoading={isLoading}
        listElements={postElements}
        changeData={handleMutate}
        inputs={postInputs}
        isDisabledBtn={hasEmptyField(postValues)}
      />
    </>
  );
};
