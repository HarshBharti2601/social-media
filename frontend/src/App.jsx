import React from 'react'
import './App.css'
import { Button, Container, Text } from '@chakra-ui/react'
import { Routes, Route, Navigate } from 'react-router-dom'

//pages
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import { useRecoilValue } from 'recoil'
import userAtom from './atoms/userAtom'
import Logout from './components/Logout'
import UpdateProfilePage from './pages/UpdateProfilePage'
import CreatePost from './components/CreatePost'

const App = () => {
  const user = useRecoilValue(userAtom);
  // console.log(user)
  return (
    <Container maxWidth='620px'>
      <Header/>
      <Routes>
        <Route path='/' element={user ? <HomePage/> : <Navigate to='/auth'/>}/>
        <Route path='/auth' element={!user ? <AuthPage/> : <Navigate to='/'/>}/>
        <Route path='/update' element={user ? <UpdateProfilePage/> : <Navigate to='/auth'/>}/>

        <Route path='/:username' element={<UserPage/>}/>
        <Route path='/:username/post/:pid' element={<PostPage/>}/>
      </Routes>

      {user && <Logout/>}
      {user && <CreatePost/>}
      {user && (
        <Text position={'fixed'} bottom={'33px'} left={6}>
          {user.name}
        </Text>
      )}
     </Container>
  )
}

export default App
