import { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAddPost, useDeletePost, useEditPost, useQueryPosts } from 'src/api/posts';
import { Page } from 'src/components/Page';
import { GlobalContext } from 'src/root';
import { Post } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';
import { searchPredicate } from 'src/utils/searchPredicate';

const DEFAULT_VALUES = {
  title: '',
  body: '',
  id: 0,
  userId: 1,
};

export const PostsPage = (): JSX.Element => {
  const [editedPost, setEditedPost] = useState<Post>(DEFAULT_VALUES);
  const { setShouldShowCreateWindow, setAlertProps } = useContext(GlobalContext);

  const { data: posts, isLoading } = useQueryPosts();

  const { mutateAsync: createPost } = useAddPost();
  const { mutateAsync: deletePost } = useDeletePost();
  const { mutateAsync: editPost } = useEditPost();

  const navigate = useNavigate();
  const [seachParams, setSearchParams] = useSearchParams();

  const searchText = seachParams.get('query');
  const filteredPosts = posts?.filter((post) => searchPredicate([post.title, post.body], searchText ?? ''));

  const handleMutate = () => createPost({ ...editedPost, id: posts?.length ?? 0 });

  const handleEdit = () => editPost(editedPost ?? DEFAULT_VALUES);

  const searchPostInput = (
    <input
      type='text'
      className='search-input'
      onBlur={(e) => {
        setAlertProps({ text: 'Success', position: 'top', type: 'success' });

        if (!e.currentTarget.value) {
          setSearchParams((prev) => {
            prev.delete('query');
            return prev;
          });

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
        onClick={() => navigate(`/posts/comments/${index + 1}`)}
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

  const handleInputChange = ({ currentTarget: { value, name } }: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPost((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const postInputs = (
    <>
      <div className='create-window-row'>
        <h4>Title</h4>
        <input
          type='text'
          name='title'
          className='create-window-input'
          value={editedPost.title}
          onChange={handleInputChange}
        />
      </div>

      <div className='create-window-row'>
        <h4>Body</h4>
        <input
          type='text'
          name='body'
          value={editedPost.body}
          className='create-window-input'
          onChange={handleInputChange}
        />
      </div>

      <div className='create-window-row'>
        <h4>User ID</h4>
        <input
          type='number'
          name='userId'
          className='create-window-input'
          value={editedPost.userId}
          onChange={handleInputChange}
        />
      </div>
    </>
  );

  return (
    <Page
      title='posts'
      isLoading={isLoading}
      listElements={postElements}
      changeData={editedPost.id ? handleEdit : handleMutate}
      inputs={postInputs}
      isDisabledBtn={hasEmptyField(editedPost)}
      isEdit={!!editedPost.id}
      onResetState={() => setEditedPost(DEFAULT_VALUES)}
      searchInput={searchPostInput}
    />
  );
};
