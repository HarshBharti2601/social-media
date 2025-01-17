import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';

const UserPage = () => {
  
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchPosting] = useState(true)
  const {user,loading} = useGetUserProfile()

  useEffect(() => {
    const getPosts = async () => {
      setFetchPosting(true)
      try {
        const res = await fetch(`/api/posts/user/${username}`);

        const data = await res.json();
        if (data.error) {
          return showToast('Error', data.error, 'error');
        }
        // console.log(data)
        setPosts(data)
      }
      catch (error) {
        showToast('Error', error.message, 'error');
        setPosts([])
      }
      finally{
        setFetchPosting(false)
      }
    }
    
    getPosts();

  }, [username, showToast])

  if (!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    )
  }

  if (!user && !loading) {
    return <h1>User not found</h1>;
  }

  return (
    <>
      <UserHeader user={user} />
      
      {!fetchingPosts && posts.length === 0 && <h1>User has not Posts</h1>}
      {fetchingPosts && (
        <Flex justifyContent={'center'} my={12}>
          <Spinner size={'xl'}/>
        </Flex>
      )}

      {
       posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
       ))
      }
    </>
  )
}

export default UserPage
