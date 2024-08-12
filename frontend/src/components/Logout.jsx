import { Button } from '@chakra-ui/react';
import React from 'react'
import { BiLogOut } from "react-icons/bi";
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';

const Logout = () => {
    const setUser = useSetRecoilState(userAtom)

    const showToast = useShowToast();

    const handleLogout = async () => {


        try {
            const res = await fetch('/api/users/logout', {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();
            if (data.error) {
                showToast('Error', data.error, 'error')
                return
            }
            else {
                showToast('Success', 'Logout Successfully', 'success')
            }

            localStorage.removeItem('user-threads');
            setUser(null)
        }
        catch (error) {
            showToast('Error', error, 'error')
        }
    }

    return (
        <>
            <Button position={'fixed'} bottom={'60px'} left={'30px'} size={'sm'} onClick={handleLogout}>
                <BiLogOut size={25}/>
            </Button >
        </>
    )

}

export default Logout
