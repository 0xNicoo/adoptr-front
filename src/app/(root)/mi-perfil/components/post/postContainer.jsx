import Post from './post';
import PostList from './postList';
import PostDeleteModal from './postDeleteModal';
import React, { useEffect, useState } from 'react';
import { deletePostAction, getPostsAction } from '@/actions/post';
import CustomLoading from '@/app/components/customLoading';
import ChatList from '../chatList';
import { errorToast, successToast } from '@/util/toast';

const PostConatiner = ({profile}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
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

  const handleOpen = (post) => {
    setSelectedPost(post);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async () => {
    console.log(selectedPost.user.id)
    if(selectedPost.user.id != profile.user.id){
      errorToast("Usted no es dueño de este post")
      setIsOpen(false)
      return
    }

    try {
      await deletePostAction(selectedPost.id)
      successToast("El post se elimino correctamente!")
      setIsOpen(false)
      removePost(selectedPost.id)
    } catch (error) {
        console.error('Failed to delete post', error);
    }
  }

  if (loading) return <CustomLoading />
  if (error) return <p>{error}</p>;


  return (
    <>
      <div className="flex w-full max-w-4xl">
        <div className="flex flex-col w-full max-w-4xl">
          <div className="w-full">
            <Post onPostsChange={onPostsChange} profile={profile} />
          </div>
          <div className="w-full">
            <PostList posts={posts} profile={profile} onOpen={handleOpen} setPosts={setPosts} />
          </div>
          <PostDeleteModal isOpen={isOpen} onOpenChange={handleClose} handleDeletePost={handleDeletePost} />
        </div>
        <div className="hidden lg:block lg:w-1/4 lg:sticky top-4 lg:h-screen ml-8">
          <ChatList />
        </div>
      </div>
    </>
  )  
}

export default PostConatiner