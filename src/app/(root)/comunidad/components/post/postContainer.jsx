import Post from './post';
import PostList from './postList';
import React, { useEffect, useState } from 'react';
import { getAllPostsAction } from '@/actions/post';

const PostContainer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

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
    fetchPosts();
  }, []);

  const onPostsChange = (post) => {
    setPosts([post, ...posts]);
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
          <PostList posts={posts} setPosts={setPosts} />
        </div>  
      </div>
    </div>
  )
}

export default PostContainer