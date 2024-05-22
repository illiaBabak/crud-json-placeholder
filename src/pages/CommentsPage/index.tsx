import { useNavigate, useParams } from 'react-router-dom';
import { useCommentQuery } from 'src/api/comments';
import { useQueryPost } from 'src/api/posts';
import { Header } from 'src/components/Header';
import { Loader } from 'src/components/Loader';

const MAX_POSTS = 100;

export const CommentsPage = (): JSX.Element => {
  const { id } = useParams();
  const parsedId = Number(id);
  const { data: commentsData, isLoading: isLoadingComments } = useCommentQuery(parsedId);
  const { data: currentPost, isLoading: isLoadingPost } = useQueryPost(parsedId);
  const navigate = useNavigate();

  const handlePrevClick = () => {
    if (parsedId === 1) return;

    navigate(`../comments/${parsedId - 1}`);
  };

  const handleNextClick = () => {
    if (parsedId === MAX_POSTS) return;

    navigate(`../comments/${parsedId + 1}`);
  };

  return (
    <div className='comments-page'>
      <Header title='Comments' />

      {isLoadingComments || isLoadingPost ? (
        <Loader />
      ) : (
        <div className='comments-main'>
          <div className='current-post-wrapper'>
            <h2 className='current-post-text'>Post:</h2>
            <div className='current-post'>
              <h3>{currentPost?.title}</h3>
              <p>{currentPost?.body}</p>
            </div>

            <div className='comments-container-btn'>
              <div className={`comment-btn ${parsedId === 1 ? 'disabled-btn' : ''}`} onClick={handlePrevClick}>
                Prev
              </div>
              <div className={`comment-btn ${parsedId === MAX_POSTS ? 'disabled-btn' : ''}`} onClick={handleNextClick}>
                Next
              </div>
            </div>
          </div>

          <div className='list-wrapper'>
            <div className='list'>
              {commentsData?.map((comment) => (
                <div className='comment' key={`comment-${comment.id}-${comment.email}`}>
                  <h4>{comment.name}</h4>
                  <p className='comment-content'>{comment.body}</p>
                  <p className='comment-content'>Author: {comment.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
