import Post from './post';
import PostList from './postList';
import PostDeleteModal from './postDeleteModal';
import React, { useEffect, useState } from 'react';
import { getPostsAction } from '@/actions/post';
import CustomLoading from '@/app/components/customLoading';
import ChatList from '../chatList';

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


  return (
    <>
      <div className='w-full flex flex-row'>
        <div className='max-w-4xl flex flex-col w-2/3'>
          <Post onPostsChange={onPostsChange} profile={profile} />
          <PostList posts={posts} profile={profile} onOpen={handleOpen} setPosts={setPosts} />
          <PostDeleteModal isOpen={isOpen} onOpenChange={handleClose} postId={selectedPostId} removePost={removePost}/>
        </div>
        <div className='w-1/3 flex justify-center lg:sticky top-4 lg:h-screen'>
          <ChatList />
        </div>
      </div>
       </>
  )  
}

export default PostConatiner