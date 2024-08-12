import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
} from '@chakra-ui/react'

import useShowToast from '../hooks/useShowToast';
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePrivewImage from '../hooks/usePrivewImage';

export default function UpdateProfilePage() {
    const [user, setUser] = useRecoilState(userAtom);
    const [updating,setUpdating] = useState(false)
    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        bio: user.bio,
        email: user.email,
        password: '',
    });
    // console.log(user, 'user is here');

    const fileRef = useRef(null);

    const { handleImageChange, imgUrl } = usePrivewImage();

    const showToast = useShowToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true)
        try {
            const res = await fetch(`/api/users/update/${user._id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ ...inputs, profilePic: imgUrl })
            })

            const data = await res.json();
            // console.log(data)

            if (data.error) {
                showToast('Error', data.error, 'error')
                return;
            }
            else {
                showToast('Success', 'Account Updated Successfully', 'success')
             }

            setUser(data)
            localStorage.setItem('user-threads', JSON.stringify(data));

            // setInputs({
            //     name: '',
            //     username: '',
            //     email: '',
            //     password: '',
            // }) 
            // console.log(data)
        }
        catch (error) {
            showToast('Error', error.message, 'error')
        }
        finally{
            setUpdating(false)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <Flex
                align={'center'}
                justify={'center'}
                my={4}>
                <Stack
                    spacing={2}
                    w={'full'}
                    maxW={'md'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        User Profile Edit
                    </Heading>

                    <FormControl>
                        <FormLabel>User Icon</FormLabel>
                        <Stack direction={['column', 'row']} spacing={6}>
                            <Center>
                                <Avatar size="xl" boxShadow={'md'} src={imgUrl || user.profilePic} />
                            </Center>
                            <Center w="full">
                                <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
                                <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Full name</FormLabel>
                        <Input
                            placeholder="name"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            value={inputs.name} onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>User name</FormLabel>
                        <Input
                            placeholder="UserName"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            value={inputs.username} onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <Input
                            placeholder="Your bio..."
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            value={inputs.bio} onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder="your-email@example.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                            value={inputs.email} onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="password"
                            _placeholder={{ color: 'gray.500' }}
                            type="password"
                            value={inputs.password} onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        />
                    </FormControl>
                    <Stack spacing={6} direction={['column', 'row']}>
                        <Button
                            bg={'red.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'red.500',
                            }}>
                            Cancel
                        </Button>
                        <Button
                            isLoading={updating}
                            type='submit'
                            bg={'green.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'green.500',
                            }}>
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form >
    )
}