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

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const setauthScreen = useSetRecoilState(authScreenAtom)

    const [inputs, setInputs] = useState({
        username: '',
        password: '',
    });

    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();
    const [loading, setloading] = useState(false);

    const handlelogin = async (e) => {
        e.preventDefault();
        setloading(true)
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(inputs)
            })

            const data = await res.json();

            if (data.error) {
                showToast('Error', data.error, 'error')
                return
            }
            else {
                showToast('Success', 'Login Successfully', 'success')
            }

            localStorage.setItem('user-threads', JSON.stringify(data));
            setUser(data);

            setInputs({
                username: '',
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
                        Login
                    </Heading>
                </Stack>
                <Box
                    w={{
                        base: 'full',
                        sm: '400px'
                    }}
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <form onSubmit={handlelogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <FormControl isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input type="text" value={inputs.username} onChange={(e) => setInputs({...inputs, username: e.target.value})}/>
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
                            <Stack spacing={10} pt={2}>
                                <Button
                                    type='submit'
                                    loadingText="logging in"
                                    size="lg"
                                    bg={useColorModeValue('gray.600', 'gray.700')}
                                    color={'white'}
                                    _hover={{
                                        bg: useColorModeValue('gray.700', 'gray.800'),
                                    }}
                                    isLoading={loading}>
                                    login
                                </Button>
                            </Stack>
                        </form>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Doesn't have an account !
                                <Link color={'blue.400'} mx={2}
                                    onClick={() => setauthScreen('signup')}
                                >
                                    SignUp
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}