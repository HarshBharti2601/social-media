import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actiions from '../components/Actiions'
import Comment from '../components/Comment'
import useGetUserProfile from '../hooks/useGetUserProfile'
import useShowToast from '../hooks/useShowToast'
import { useNavigate, useParams } from 'react-router-dom'
import { DeleteIcon } from '@chakra-ui/icons'
import { formatDistanceToNow } from 'date-fns'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'

const PostPage = () => {

  const { user, loading } = useGetUserProfile()
  const [post, setPost] = useState([]);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          showToast('Error', data.error, 'error')
          return;
        }
        // console.log(data)
        setPost(data);
      }
      catch (error) {
        showToast('Error', error.message, 'error');
      }
    }

    getPost();
  }, [showToast, pid])

  const handleDeletePost = async () => {
    try {
      if (!window.confirm('Are you sure want to delete this post?')) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.error) {
        showToast('Error', data.error, 'error')
        return;
      }
      showToast('Success', 'Post Delete Successfully', 'success');
      navigate(`/${user.username}`)
    }
    catch (error) {
      showToast('Error', error.message, 'error');
    }
  }

  if (!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    )
  }

  if (!post) {
    return null;
  }

  const createdAtDate = post?.createdAt ? new Date(post.createdAt) : null;

  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} justifyContent={'space-between'} gap={3}>
          <Flex alignItems={'center'} gap={3}>
            <Avatar src={user.profilePic} size={'md'} name='Mark Zuckerberg' />
            <Flex>
              <Text fontSize={'sm'} fontWeight={'bold'}>
                {user.username}
              </Text>
              <Image src='/verified.png' w={4} h={4} ml={4} />
            </Flex>
          </Flex>
          <Flex gap={4} alignItems={'center'}>
            <Text fontSize={'xs'} width={28} textAlign={'right'} color={'gray.300'}>
              {createdAtDate && formatDistanceToNow(new Date(post?.createdAt))} ago
            </Text>

            {currentUser?._id === user._id && <DeleteIcon size={20} cursor={'pointer'} onClick={handleDeletePost} />}
          </Flex>
        </Flex>
      </Flex>

      <Text my={3}>{post?.text}</Text>
      <Box
        borderRadius={6}
        overflow={'hidden'}
        border={'1px solid gray.light'}
      >
        <Image src={post?.img} w={'full'} />
      </Box>
      <Flex gap={3} my={3} cursor={'pointer'}>
        <Actiions post={post} />
      </Flex>

      {/* <Flex gap={2} alignItems={'center'}>
        <Text color={'gray.light'} fontSize={'sm'}>238 replies</Text>
        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
        <Text color={'gray.light'} fontSize={'sm'}>
          {200} likes
        </Text>
      </Flex> */}

      <Divider my={4} />

      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>👋</Text>
          <Text color={'gray.light'}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />
      {post?.replies?.map((reply) => (
        <Comment
          key={reply._id}
          comment={reply.text}
          createdAt='2d'
          likes={100}
          username={reply.username}
          useAvatar={reply.userProfilePic}
          lastReply = {reply._id === post?.replies[post?.replies?.length - 1]._id}
        />
      ))}

    </>
  )
}

export default PostPage
