import Post from './post';
import PostList from './postList';
import PostDeleteModal from './postDeleteModal';
import React, { useEffect, useState } from 'react';
import { getPostsAction } from '@/actions/post';
import CustomLoading from '@/app/components/customLoading';

const PostConatiner = ({profile}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPostsAction(); 
        setPosts(postsData); 
      } catch (err) {
        setError('Error al obtener los posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const onPostsChange = (post) => {
    setPosts([post, ...posts]);
  }

  const removePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleOpen = (postId) => {
    setSelectedPostId(postId);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPostId(null);
  };

  if (loading) return <CustomLoading />
  if (error) return <p>{error}</p>;


  return(
      <>
      <div className='flex flex-col w-full'>
      <div className='max-w-4xl w-full flex flex-col'>
        <div className='w-2/3'>
          <Post onPostsChange={onPostsChange} profile={profile} />
        </div>
        <div className='w-2/3'>
        <PostList posts={posts} profile={profile} onOpen={handleOpen} setPosts={setPosts} />
        </div>  
        <PostDeleteModal isOpen={isOpen} onOpenChange={handleClose} postId={selectedPostId} removePost={removePost}/>
      </div>
    </div>
      </>
  )
}

export default PostConatiner