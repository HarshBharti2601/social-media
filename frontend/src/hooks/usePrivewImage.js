import React, { useState } from 'react'
import useShowToast from './useShowToast';

const usePrivewImage = () => {
    const [imgUrl, setImageUrl] = useState(null);
    const showToast = useShowToast();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();

            reader.onloadend = () => {
                setImageUrl(reader.result);
            }

            reader.readAsDataURL(file)
        }
        else{
            showToast('Inavlid file Type','Please select an image file', 'error')
            setImageUrl(null)
        }
    }
    // console.log(imgUrl);
    return {handleImageChange, imgUrl, setImageUrl}
}

export default usePrivewImage
