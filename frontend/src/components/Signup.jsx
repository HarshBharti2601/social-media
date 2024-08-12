import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false)
    const setauthScreen = useSetRecoilState(authScreenAtom)

    const [inputs,setInputs] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });

    const setUser = useSetRecoilState(userAtom)
    const showToast = useShowToast();
    const [loading, setloading] = useState(false)

    const handleSignup = async (e) => {
        e.preventDefault();
        setloading(true)
        try {
            const res = await fetch('/api/users/signup',{
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(inputs)
            })

            const data = await res.json();

            if(data.error){
                showToast('Error', data.error, 'error')
                return
            }
            else{
                showToast('Success', 'Account Created Successfully', 'success')
            }

            localStorage.setItem('user-threads', JSON.stringify(data));
            setUser(data)

            setInputs({
                name: '',
                username: '',
                email: '',
                password: '',
            })
            // console.log(data)
        } 
        catch (error) {
            showToast('Error', error, 'error')
        }
        finally{
            setloading(false)
        }
    }

    return (
        <Flex align={'center'} justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <form onSubmit={handleSignup} style={{display:'flex', flexDirection: 'column', gap:'15px'}}>
                            <HStack>
                                <Box>
                                    <FormControl isRequired>
                                        <FormLabel>Full Name</FormLabel>
                                        <Input type="text" value={inputs.name} onChange={(e) => setInputs({...inputs, name: e.target.value})}/>
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl isRequired >
                                        <FormLabel>Username</FormLabel>
                                        <Input type="text" value={inputs.username} onChange={(e) => setInputs({...inputs, username: e.target.value})}/>
                                    </FormControl>
                                </Box>
                            </HStack>
                            <FormControl isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" value={inputs.email} onChange={(e) => setInputs({...inputs, email: e.target.value})}/>
                            </FormControl>
                            <FormControl isRequired >
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input type={showPassword ? 'text' : 'password'} minLength={5} value={inputs.password} onChange={(e) => setInputs({...inputs, password: e.target.value})}/>
                                    <InputRightElement h={'full'}>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Stack spacing={10} pt={2} onSubmit={handleSignup}>
                                <Button
                                    type='submit'
                                    loadingText="Submitting"
                                    size="lg"
                                    bg={useColorModeValue('gray.600', 'gray.700')}
                                    color={'white'}
                                    _hover={{
                                        bg: useColorModeValue('gray.700', 'gray.800'),
                                    }}
                                    isLoading={loading}>
                                    Sign up
                                </Button>
                            </Stack>
                        </form>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Already a user?
                                <Link color={'blue.400'} mx={2}
                                    onClick={() => setauthScreen('login')}
                                >
                                    Login
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}