import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const findPosts = (posts: Post[] | undefined, searchVal: string) => {
  const targetPosts = posts?.filter(
    (post) =>
      post.body.toLowerCase().includes(searchVal.toLowerCase()) ||
      post.title.toLowerCase().includes(searchVal.toLowerCase())
  );

  return targetPosts;
};

export const PostsPage = (): JSX.Element => {
  const { setShouldShowCreateWindow, setAlertProps } = useContext(GlobalContext);
  const { data: posts, isLoading } = useQueryPosts();
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [postValues, setPostValues] = useState<Post>(DEFAULT_VALUES);
  const [seachParams, setSearchParams] = useSearchParams();
  const searchText = seachParams.get('query');
  const [filteredPosts, setFilteredPosts] = useState<Post[] | undefined>(posts);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = searchText ? findPosts(posts, searchText) : posts;

    setFilteredPosts(filtered);

    if (!posts) return;

    if (!filtered?.length) setAlertProps({ text: 'Not found', position: 'top', type: 'warning' });
  }, [posts, searchText, setAlertProps]);

  const { mutateAsync: createPost } = useAddPost();

  const { mutateAsync: deletePost } = useDeletePost();

  const { mutateAsync: editPost } = useEditPost();

  const handleMutate = () => createPost({ ...postValues, id: posts?.length ?? 0 });

  const handleEdit = () => editPost(editedPost ?? DEFAULT_VALUES);

  const removeEdit = () => setEditedPost(null);

  const searchPostInput = (
    <input
      type='text'
      className='search-input'
      onBlur={(e) => {
        setAlertProps({ text: 'Success', position: 'top', type: 'success' });

        if (!e.currentTarget.value) {
          const params = new URLSearchParams(seachParams);
          params.delete('query');
          setSearchParams(params);
          return;
        }

        setSearchParams({ query: e.currentTarget.value });
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
    />
  );

  const postElements =
    filteredPosts?.map((el, index) => (
      <div
        className='list-el'
        key={`post-${el.title}-${index}`}
        onClick={() => navigate(`/posts/comments/:${index + 1}`)}
      >
        <h3>{el.title}</h3>
        <p>{el.body}</p>
        <div
          className='container-el-btn'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
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
    )) ?? [];

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
        isLoading={isLoading}
        listElements={postElements}
        changeData={editedPost ? handleEdit : handleMutate}
        inputs={postInputs}
        isDisabledBtn={editedPost ? hasEmptyField(editedPost) : hasEmptyField(postValues)}
        isEdit={!!editedPost}
        removeEdit={removeEdit}
        searchInput={searchPostInput}
      />
    </>
  );
};
