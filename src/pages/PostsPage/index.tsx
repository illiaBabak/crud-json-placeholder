import { useQueryPosts } from 'src/api/posts';
import { Page } from 'src/components/Page';

export const PostsPage = (): JSX.Element => {
  const { data: posts, isError, isFetching } = useQueryPosts();

  const postElements =
    posts?.map((el, index) => {
      return (
        <div className='list-el' key={`post-${el.title}-${index}`}>
          <h3>{el.title}</h3>
          <p>{el.body}</p>
        </div>
      );
    }) ?? [];

  return <Page title='posts' isError={isError} isFetching={isFetching} listElements={postElements} />;
};
