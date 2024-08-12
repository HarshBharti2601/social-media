import { AddIcon } from '@chakra-ui/icons'
import {
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useColorModeValue,
    useDisclosure,
}
    from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import usePrivewImage from '../hooks/usePrivewImage'
import { BsFillImageFill } from 'react-icons/bs'
import useShowToast from '../hooks/useShowToast'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'

const Max_Char = 500;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState();
    const [updating,setUpdating] = useState(false);
    const [remainingChar, setRemainingChar] = useState(500);

    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const fileRef = useRef(null);

    const { handleImageChange, imgUrl, setImageUrl } = usePrivewImage();

    const handleTextChange = (e) => {
        const inputText = e.target.value;
        if(inputText.length > Max_Char){
            const truncatedText = inputText.slice(0, Max_Char);
            setPostText(truncatedText);
            setRemainingChar(0);
        }
        else{
            setPostText(inputText);
            setRemainingChar(Max_Char - inputText.length)
        }
    }
    const handleCreatePost = async () => {
        setUpdating(true)
        try {
            const res = await fetch(`/api/posts/create`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({postedBy: user._id, text: postText, img: imgUrl})
            });

            const data = await res.json();

            if(data.error){
                showToast('Error', data.error, 'error');
                return;
            }
            showToast('Success', 'Post created Successfully', 'success')
            onClose();
            setPostText('')
            setImageUrl('')
            // console.log(data);
        } 
        catch (error) {
            showToast('Error', error.message, 'error')
        }
        finally{
            setUpdating(false)
        }
    }
    return (
        <>
            <Button
                position={'fixed'}
                bottom={10}
                right={10}
                leftIcon={<AddIcon />}
                bg={useColorModeValue('gray.300', 'gray.dark')}
                onClick={onOpen}
            >
                Post
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder='Post content goes here...'
                                value={postText}
                                onChange={handleTextChange}
                            />
                            <Text fontSize={'xs'} fontWeight={'bold'} textAlign={'right'} m={'1'} color={'gray.300'}>
                                {remainingChar}/{Max_Char}
                            </Text>

                            <Input type='file' hidden ref={fileRef} onChange={handleImageChange}/>

                            <BsFillImageFill
                                style={{marginLeft: '5px', cursor: 'pointer'}}
                                size={16}
                                onClick={() => fileRef.current.click()}
                            />

                            {
                                imgUrl && (
                                    <Flex mt={5} w={'full'} position={'relative'}>
                                        <Image src={imgUrl} alt='Selected img'/>
                                        <CloseButton onClick={() => setImageUrl("")} bg={'gray.600'} position={'absolute'} top={2} right={2}/>
                                    </Flex>
                                )
                            }
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={updating}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default CreatePost
