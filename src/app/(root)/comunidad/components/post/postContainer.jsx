import Post from './post';
import PostList from './postList';
import React, { useEffect, useState } from 'react';
import { deletePostAction, getAllPostsAction } from '@/actions/post';
import PostDeleteModal from '@/app/(root)/mi-perfil/components/post/postDeleteModal';
import { getProfileAction } from '@/actions/profile';
import { errorToast, successToast } from '@/util/toast';

const PostContainer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [profile, setProfile] = useState(null); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getAllPostsAction(); 
        setPosts(postsData); 
      } catch (err) {
        setError('Error al obtener los posts');
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const profileLogged = await getProfileAction();
        setProfile(profileLogged.user.id);
      } catch (err) {
        setError('Error al obtener el perfil');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
    fetchPosts();
  }, []);

  const onPostsChange = (post) => {
    setPosts([post, ...posts]);
  }

  const handleOpen = (post) => {
    setSelectedPost(post);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPost(null);
  };

  const removePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleDeletePost = async () => {
    if(selectedPost.user.id != profile){
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

  if (loading) return <p className="text-center">Cargando posts...</p>;
  if (error) return <p className="text-center">{error}</p>;

  return(
    <div className='flex flex-col w-full items-center justify-center'>
      <div className='max-w-4xl w-full px-4 flex flex-col items-center'>
        <div className='w-2/3 mt-4'>
          <Post onPostsChange={onPostsChange} />
        </div>
        <div className='w-2/3 mt-4'>
          <PostList posts={posts} setPosts={setPosts} onOpen={handleOpen} profile={profile}/>
        </div>  
        <PostDeleteModal isOpen={isOpen} onOpenChange={handleClose} handleDeletePost={handleDeletePost} />
      </div>
    </div>
  )
}

export default PostContainer