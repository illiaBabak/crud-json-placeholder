import { useContext, useState } from 'react';
import { useAddPost, useDeletePost, useEditPost, useQueryPosts } from 'src/api/posts';
import { Page } from 'src/components/Page';
import { GlobalContext } from 'src/root';
import { Post } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';

const DEFAULT_VALUES = {
  title: '',
  body: '',
  id: 0,
  userId: 1,
};

export const PostsPage = (): JSX.Element => {
  const { data: posts, isError, isLoading } = useQueryPosts();
  const { setShouldShowCreateWindow } = useContext(GlobalContext);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [postValues, setPostValues] = useState<Post>(DEFAULT_VALUES);

  const { mutateAsync: createPost } = useAddPost();

  const { mutateAsync: deletePost } = useDeletePost();

  const { mutateAsync: editPost } = useEditPost();

  const handleMutate = () => createPost({ ...postValues, id: posts?.length ?? 0 });

  const handleEdit = () => editPost(editedPost ?? DEFAULT_VALUES);

  const removeEdit = () => setEditedPost(null);

  const postElements =
    posts?.map((el, index) => {
      return (
        <div className='list-el' key={`post-${el.title}-${index}`}>
          <h3>{el.title}</h3>
          <p>{el.body}</p>
          <div className='container-el-btn'>
            <div className='delete-el-btn' onClick={() => deletePost(el.id)}>
              Delete
            </div>
            <div
              className='edit-el-btn'
              onClick={() => {
                setShouldShowCreateWindow(true);
                setEditedPost(el);
              }}
            >
              Edit
            </div>
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
          value={editedPost ? editedPost.title : postValues.title}
          onChange={(e) => {
            const val = e.currentTarget.value;

            {
              editedPost
                ? setEditedPost((prev) => {
                    if (!prev) return prev;

                    return {
                      ...prev,
                      title: val,
                    };
                  })
                : setPostValues((prev) => ({
                    ...prev,
                    title: val,
                  }));
            }
          }}
        />
      </div>

      <div className='create-window-row'>
        <h4>Body</h4>
        <input
          type='text'
          value={editedPost ? editedPost.body : postValues.body}
          className='create-window-input'
          onChange={(e) => {
            const val = e.currentTarget.value;

            {
              editedPost
                ? setEditedPost((prev) => {
                    if (!prev) return prev;

                    return {
                      ...prev,
                      body: val,
                    };
                  })
                : setPostValues((prev) => ({
                    ...prev,
                    body: val,
                  }));
            }
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

            {
              editedPost
                ? setEditedPost((prev) => {
                    if (!prev) return prev;

                    return {
                      ...prev,
                      userId: val,
                    };
                  })
                : setPostValues((prev) => ({
                    ...prev,
                    userId: val,
                  }));
            }
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
        changeData={editedPost ? handleEdit : handleMutate}
        inputs={postInputs}
        isDisabledBtn={editedPost ? hasEmptyField(editedPost) : hasEmptyField(postValues)}
        isEdit={!!editedPost}
        removeEdit={removeEdit}
      />
    </>
  );
};
