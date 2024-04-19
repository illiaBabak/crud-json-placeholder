import { useCallback, useEffect, useState } from 'react';
import { useCommentsQuery } from 'src/api/comments';
import { useQueryPost } from 'src/api/posts';
import { Header } from 'src/components/Header';
import { Loader } from 'src/components/Loader';
import { Comment } from 'src/types/types';

const MAX_POSTS = 100;

export const CommentsPage = (): JSX.Element => {
  const [page, setPage] = useState(0);
  const [comments, setComments] = useState<Comment[] | undefined>([]);
  const [isRefetching, setIsRefetching] = useState(false);
  const { data: commentsData, isLoading: isLoadingComments, fetchNextPage, fetchPreviousPage } = useCommentsQuery();
  const { data: currentPost, isLoading: isLoadingPost, refetch } = useQueryPost(page + 1);

  useEffect(() => {
    if (commentsData && commentsData.pages[page]) setComments(commentsData.pages[page].comments);
  }, [commentsData, page]);

  const handleRefetch = useCallback(async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  }, [refetch]);

  const commentElements =
    comments?.map((comment) => {
      return (
        <div className='comment' key={`comment-${comment.id}-${comment.email}`}>
          <h4>{comment.name}</h4>
          <p className='comment-content'>{comment.body}</p>
          <p className='comment-content'>Author: {comment.email}</p>
        </div>
      );
    }) ?? [];

  return (
    <div className='comments-page'>
      <Header title='Comments' />

      {isLoadingComments || isLoadingPost || isRefetching ? (
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
              <div
                className={`comment-btn ${page === 0 ? 'disabled-btn' : ''}`}
                onClick={
                  page !== 0
                    ? async () => {
                        setPage((prev) => prev - 1);
                        await fetchPreviousPage();
                        handleRefetch();
                      }
                    : () => {}
                }
              >
                Prev
              </div>
              <div
                className={`comment-btn ${page === MAX_POSTS ? 'disabled-btn' : ''}`}
                onClick={
                  page !== MAX_POSTS
                    ? async () => {
                        setPage((prev) => prev + 1);
                        await fetchNextPage();
                        handleRefetch();
                      }
                    : () => {}
                }
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
