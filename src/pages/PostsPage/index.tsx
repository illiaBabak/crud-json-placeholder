import { useQueryPosts } from 'src/api/posts';
import { Alert } from 'src/components/Alert';
import { Header } from 'src/components/Header';
import { Loader } from 'src/components/Loader';

export const PostsPage = (): JSX.Element => {
  const { data: posts, isError, isFetching } = useQueryPosts();

  return (
    <>
      <div className='page'>
        <Header />
        {isFetching ? (
          <Loader />
        ) : (
          <div className='list'>
            {posts?.map((el, index) => {
              return (
                <div className='list-el' key={`post-${el.title}-${index}`}>
                  <h3>{el.title}</h3>
                  <p>{el.body}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isError && <Alert />}
    </>
  );
};
