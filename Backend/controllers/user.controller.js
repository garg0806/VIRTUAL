
import uploadOnCloudinary from "../config/cloudinary.js"
import geminiRespone from "../gemini.js"
import User from "../models/user.model.js"

import moment from "moment";
export const  getCurrentUser=async(req,res)=>{
    try {
        const userId=req.userId
        const user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }

        return res.status(200).json(user)

    } catch (error) {
        return res.status(400).json({message :" get current user error"})
        
    }

 }


 export const updateAssistant=async(req,res)=>{
    try {
        const{assistantName,imageUrl}=req.body
        let assistantImage;

        if(req.file){
            assistantImage=await uploadOnCloudinary(req.file.path)
        }
        else{
            assistantImage=imageUrl
        }


        const user =await User.findByIdAndUpdate(req.userId,{assistantName,assistantImage},{new:true}).select("-password")
        return res.status(200).json(user)
        
    } catch (error) {
         return res.status(400).json({message :" updateAssistant  error"})
        
    }
 }

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    // ✅ Add validation for command
    if (!command || typeof command !== 'string' || command.trim() === '') {
      return res.status(400).json({ response: "Invalid command" });
    }

    const user = await User.findById(req.userId);
    
    // ✅ Add null check for user
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    user.history.push(command)
    user.save()

    const userName = user.name || "User";
    const assistantName = user.assistantName || "Assistant";

    const result = await geminiRespone(command, assistantName, userName);

    // ✅ Check for missing or non-string response
    if (!result || typeof result !== "string") {
      console.error("❌ Gemini returned invalid or empty result:", result);
      return res.status(400).json({ response: "sorry I cannot understand" });
    }

    let cleanedResult = result.trim();

    // ✅ Clean up code block if present
    if (cleanedResult.startsWith("```")) {
      cleanedResult = cleanedResult.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1");
    }

    let gemResult;
    try {
      gemResult = JSON.parse(cleanedResult);
    } catch (e) {
      console.error("❌ Failed to parse cleaned Gemini response:", cleanedResult);
      return res.status(400).json({ response: "sorry I cannot understand" });
    }

    const type = gemResult.type;

    switch (type) {
      case "get-date":
        return res.json({ type, userInput: gemResult.userinput, response: `current date is ${moment().format("YYYY-MM-DD")}` });

      case "get-time":
        return res.json({ type, userInput: gemResult.userinput, response: `current time is ${moment().format("HH:mm:ss")}` });

      case "get-day":
        return res.json({ type, userInput: gemResult.userinput, response: `today is ${moment().format("dddd")}` });

      case "get-month":
        return res.json({ type, userInput: gemResult.userinput, response: `current month is ${moment().format("MMMM")}` });

      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({ type, userInput: gemResult.userinput, response: gemResult.response });

      default:
        return res.status(400).json({ response: `sorry I cannot understand` });
    }

  } catch (error) {
    console.error("❌ askToAssistant error:", error.message);
    return res.status(500).json({ response: "ask to assistant error" });
  }
};






