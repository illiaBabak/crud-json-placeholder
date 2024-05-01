import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCommentQuery } from 'src/api/comments';
import { useQueryPost } from 'src/api/posts';
import { Header } from 'src/components/Header';
import { Loader } from 'src/components/Loader';
import { Comment } from 'src/types/types';

const MAX_POSTS = 100;

export const CommentsPage = (): JSX.Element => {
  const { id } = useParams();
  const parsedId = useRef<number>(Number(id?.slice(1)));
  const [comments, setComments] = useState<Comment[] | undefined>([]);
  const { data: commentsData, isLoading: isLoadingComments } = useCommentQuery(parsedId.current);
  const { data: currentPost, isLoading: isLoadingPost } = useQueryPost(parsedId.current);
  const navigate = useNavigate();

  useEffect(() => {
    if (commentsData) setComments(commentsData.comments);
  }, [commentsData]);

  const handlePrevClick = () => {
    if (parsedId.current === 1) return;

    navigate(`/posts/comments/:${parsedId.current - 1}`);
    window.location.reload();
  };

  const handleNextClick = () => {
    if (parsedId.current === MAX_POSTS) return;

    navigate(`/posts/comments/:${parsedId.current + 1}`);
    window.location.reload();
  };

  const commentElements =
    comments?.map((comment) => (
      <div className='comment' key={`comment-${comment.id}-${comment.email}`}>
        <h4>{comment.name}</h4>
        <p className='comment-content'>{comment.body}</p>
        <p className='comment-content'>Author: {comment.email}</p>
      </div>
    )) ?? [];

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
              <div className={`comment-btn ${parsedId.current === 1 ? 'disabled-btn' : ''}`} onClick={handlePrevClick}>
                Prev
              </div>
              <div
                className={`comment-btn ${parsedId.current === MAX_POSTS ? 'disabled-btn' : ''}`}
                onClick={handleNextClick}
              >
                Next
              </div>
            </div>
          </div>

          <div className='list-wrapper'>
            <div className='list'>{commentElements}</div>
          </div>
        </div>
      )}
    </div>
  );
};
