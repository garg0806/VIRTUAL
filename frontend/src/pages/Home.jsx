import React, { use, useContext, useEffect } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useRef } from 'react';
import aiImg from '../assets/ai.gif';
import userImg from '../assets/user.gif';

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();
  const[listening, setListening] = useState(false); 
  const[userText, setUserText] = useState('');
  const [aiText, setAiText] = useState('');
  const isSpeakingRef=useRef(false);
  const recognitionRef=useRef(null);
  const synth=window.speechSynthesis;
  const isRecognizingRef = useRef(false);

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logOut`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.error("Logout failed:", error);
    }
  };
  const startRecognition = () => {
    try{
      recognitionRef.current?.start();
      setListening(true);
    }catch(error){
      if(!error.message.includes("start")){
      console.error("Error starting speech recognition:", error);
    }}
  }

  const speak=(text)=>{
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const hindiVoice = synth.getVoices().find(voice => voice.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      startRecognition();
    };
    synth.speak(utterance);

  }
  const handleCommand=(data)=>{
    // const{type,userInput,response}=data
      if (!data) {
    console.error("❌ No data provided to handleCommand.");
    return;
  }

  const { type, userInput, response } = data;

  // Optionally validate fields
  if (!response) {
    console.error("❌ Missing response in data:", data);
    return;
  }
    speak(response);
    if(type==='google-search'){
      const query=encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if(type==='calculator-open'){
      window.open('https://www.calculator.com', '_blank');
    }

    if(type==='youtube-search'){  
      const query=encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    } 
    if(type==='youtube-play'){
      const query=encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

    if(type==='instagram-open'){
      window.open('https://www.instagram.com', '_blank');
    }   
    if(type==='facebook-open'){
      window.open('https://www.facebook.com', '_blank');
    }
    if(type==='weather-show'){
      window.open('https://www.weather.com', '_blank');
    }

  }

 

  useEffect(() => {
    

       if (!userData?.assistantName) {
    console.warn("Assistant name not available yet, skipping speech setup.");
    return;
  
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    // console.log("userData:", userData);
    // console.log("Assistant Name:", userData.assistantName.toLowerCase());

    recognitionRef.current = recognition;
    //  const isRecognizingRef = { current: false }
    

    const safeRecognition=()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
      try {
        recognition.start();
        console.log("Speech recognition started");
        
      } catch (error) {
        if(error.name !== 'NotAllowedError') {
          console.error("Speech recognition not allowed:", error);
        }
        
      }
      
        
       
      }
    }

    recognition.onstart = () => {
      console.log("Speech recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");  
      isRecognizingRef.current = false;
      setListening(false);  

      if(!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition()},1000);
        }
      }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if(event.error !== "aborted"&& !isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 10000);
      }

    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Transcript:", transcript);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        try {
          const data = await getGeminiResponse(transcript);
          console.log("Gemini Response:", data);
          // speak(data.response)
          handleCommand(data);
          setAiText(data.response);
          setUserText(" ")
        } catch (error) {
          console.error("Error in Gemini Response:", error);
        }
      }
    };

    const fallback=setInterval(()=>{
      if(!isRecognizingRef.current && !isSpeakingRef.current){
        safeRecognition();
      }
    },10000)


    // recognition.start();
    console.log("Speech recognition started");

    return () => {
      recognition.stop();
      console.log("Speech recognition stopped");
    };
  }, [userData?.assistantName]);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#0303b6e6] flex justify-center items-center flex-col'>
      <button
        type="submit"
        className='min-w-[150px] h-[60px] bg-white rounded-full absolute top-[20px] right-[20px] text-black text-[19px]'
        onClick={handleLogOut}
      >
        LogOut
      </button>

      <button
        type="submit"
        className='min-w-[290px] h-[60px] bg-white rounded-full absolute top-[120px] right-[20px] text-black text-[19px]'
        onClick={() => navigate('/customize')}
      >
        Customize your assistant
      </button>

      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden'>
        <img src={userData?.assistantImage} alt="Assistant" className='h-full object-cover rounded-2xl shadow-lg' />
      </div>

      {userData?.assistantName ? (
        <h1 className='text-white text-[18px] font-bold'>
          I'm {userData.assistantName}
        </h1>
      ) : (
        <h1 className='text-red-400 text-[14px]'>Assistant name not loaded</h1>

      )}
      {!aiText && <img src={userImg} alt=""className='w-[200px]' />}
      {aiText && <img src={aiImg} alt=""className='w-[200px]' />}

      {/* <h1 className='text-white'>{userText?userText:aiText?aiText:null}</h1> */}

      <h1 className='text-white'>{userText || aiText || null}</h1>


      
    </div>
  );
}

export default Home;


 