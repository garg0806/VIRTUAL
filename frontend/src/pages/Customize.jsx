import React, { useState, useRef, useContext } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoChevronBackSharp } from "react-icons/io5";

function Customize() {

  const { serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(userDataContext)
  const navigate = useNavigate()
  const inputImage = useRef()
  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))

  }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#0303b6e6] flex justify-center items-center flex-col  '>
      <IoChevronBackSharp className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer'onClick={()=>navigate("/")} />
      <h1 className='text-white text-[30px] text-center fle justify-center'>Select Your <span>Assistant Image</span></h1>
      <div className='w-[100%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px] mx-auto p-2 '>

        <Card image={image1} />
        <Card image={image2} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        <div className={`w-[150px] h-[250px] bg-[#08085b]
          border-2 border-[blue] rounded-2xl overflow-hidden mt-[20px] hover:shadow-2xl hover-white cursor-pointer hiver:border-4 hover:border-white items-center justify-center flex ${selectedImage == "input" ? "border-4 border-white shadow-2xl" : null}`} onClick={() => {
            inputImage.current.click()
            setSelectedImage("input")



          }}>
          {!frontendImage && <MdOutlineDriveFolderUpload className='text-white w-[25px] h-[25px]' />}

          {frontendImage && <img src={frontendImage} className='h-full object-cover ' />}



        </div>
        <input type="file" accept='image/*' ref={inputImage} hidden
          onChange={handleImage} />




      </div>


            <div className='left-0 right-0 flex justify-center mt-6'>
      {selectedImage && <button className="  min-w-[150px] h-[60px] text-[19px] font-semibold bg-white text-black rounded-full cursore-pointer" onClick={() => navigate("/customize2")}>
        NEXT
      </button>}

            </div>


    </div>

  )
}

export default Customize