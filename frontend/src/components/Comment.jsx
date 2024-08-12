import { Avatar, Divider, Flex, Text } from '@chakra-ui/react'
import React from 'react'


const Comment = ({comment,username,useAvatar,lastReply}) => {
    return (
        <>
            <Flex gap={4} py={2} my={2} w={'full'}>
                <Avatar src={useAvatar} size={'sm'}/>
                <Flex gap={1} w={'full'} flexDirection={'column'}>
                    <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>{username}</Text>
                    </Flex>
                    <Text>{comment}</Text>
                </Flex>
            </Flex>
            {!lastReply ? <Divider/> : null}
        </>
    )
}

export default Comment
