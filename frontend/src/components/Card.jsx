import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

function Card  ({image})  {
  const{serverUrl,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  return (
    <div className={`w-[80px] h-[160px] w-[150px]  h-[250px] bg-[#08085b]
    border-2 border-[blue] rounded-2xl overflow-hidden mt-[20px] hover:shadow-2xl hover-white cursor-pointer hiver:border-4 hover:border-white ${selectedImage==image?"border-4 border-white shadow-2xl":null}`} onClick={()=>{setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
    }}>
        <img src={image} className='h-full object-cover' alt="" />
        

    </div>
  )
}

export default Card