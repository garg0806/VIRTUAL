// import axios from "axios";

// const geminiRespone = async (command , assistantName, userName) => {
//   try {
// const apiUrl = `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`;
    
//     const prompt=`You are a virtual assistant named ${assistantName} created by $ (userName).

// You are not Google. You will now behave like a voice-enabled assistant.

// Your task is to understand the user's natural language input and respond with a JSON object like this:

// {

// "type": "general" | "google_search" | "youtube_search" | "youtube_play" |

// "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" |

// "instagram_open" | "facebook_open" | "weather-show",

// "userinput": "<original user input>" {only remove your name from userinput if exists) and agar kisi ne google ya youtube pe kuch search karne ko bola hai t

// userInput me only bo search baala text jaye,

// "response": "<a short spoken response to read out loud to the user>"}
// Instructions:

// "type": determine the intent of the user.

// "userinput": original sentence the user spoke.

// "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's

// what I found", "Today is Tuesday", etc.

// Type meanings:

// -"general": if it's a factual or informational question.

// "google_search": if user wants to search something on Google.

// "youtube search": if user wants to search something on YouTube.

// "youtube_play": if user wants to directly play a video or song.

// "calculator_open" if user wants to open a calculator

// "instagram_open" if user wants to open instagram

// "facebook_open": if user wants to open facebook.

// "weather-show" if user wants to know weather
// "get_time": if user asks for the current time.
// "get_date": if user asks for the current date.  
// "get_day": if user asks for the current day.
// "get_month": if user asks for the current month.  

// Important:
// use "{author name}" agar koi puche tune kisne bmaaya
// only respond in JSON format, do not include any other text or explanation.

// now your userInput-${command}`
    
//     if (!apiUrl) {
//       throw new Error("GEMINI_API_URL is not defined in .env");
//     }

//     const result = await axios.post(
//       apiUrl,
//       {
//         contents: [{
//             parts: [{ text: prompt }],
//           },
//         ],
//       },
      
        
      
//     );

//     return result.data.candidates[0].content.parts[0].text;
//   } catch (error) {
//     console.error("Gemini Error:", error.response?.data || error.message);
//     throw error;
//   }
// };

// export default geminiRespone;






// import axios from "axios";

// const geminiRespone = async (command, assistantName, userName) => {
//   try {
//     const apiUrl = `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`;

//     const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}. Respond in JSON format like:
// \`\`\`json
// {
//   "type": "get-date",
//   "userinput": "${command}",
//   "response": "Today is July 26, 2025"
// }
// \`\`\`

// Now respond to: "${command}"`;

//     const response = await axios.post(apiUrl, {
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }]
//         }
//       ]
//     });

//     const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!raw) {
//       console.error("❌ Gemini response missing content:", response.data);
//       return null;
//     }

//     // 🟢 Extract JSON from markdown
//     const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
//     if (!match || !match[1]) {
//       console.error("❌ JSON block not found in Gemini response:", raw);
//       return null;
//     }

//     return match[1]; // the pure JSON string

//   } catch (err) {
//     console.error("❌ Gemini Error:", err.response?.data || err.message || err);
//     return null;
//   }
// };

// export default geminiRespone;





// const geminiRespone = async (command, assistantName, userName) => {
//   try {
//     const apiUrl = `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`;

//     // Strong prompt — no markdown, strict JSON response
//     const prompt = `You are a virtual assistant named ${assistantName}, created by ${userName}.

// Respond ONLY in this exact JSON format — no backticks, no code blocks, no extra text:

// {
//   "type": "<type>",
//   "userinput": "${command}",
//   "response": "<short assistant-style reply>"
// }

// Valid types: get-date, get-time, get-day, get-month, youtube-play, google-search, calculator-open, etc.

// User command: "${command}"
// Respond now.`;

//     // Make Gemini API request
//     const response = await axios.post(apiUrl, {
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }]
//         }
//       ]
//     });

//     // Get raw text response
//     const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!raw) {
//       console.error("❌ Gemini response missing content:", response.data);
//       return null;
//     }

//     return raw.trim(); // Return raw JSON string

//   } catch (err) {
//     console.error("❌ Gemini Error:", err.response?.data || err.message || err);
//     return null;
//   }
// };

// export default geminiRespone;





import axios from "axios";

const geminiRespone = async (command, assistantName, userName) => {
  try {
    const apiUrl = `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`;

    if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_API_URL) {
      throw new Error("GEMINI_API_URL or GEMINI_API_KEY is missing from .env");
    }

    const prompt = `You are a virtual assistant named ${assistantName}, created by ${userName}.
You are not Google. You are a smart voice-enabled assistant.
Your task is to understand the user's natural language input and respond with a **JSON object only**, using this format:

{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" |
           "get-time" | "get-date" | "get-day" | "get-month" |
           "calculator-open" | "instagram-open" | "facebook-open" | "weather-show",

  "userinput": "<original user input without assistant name or extra words. If it’s a Google or YouTube search, only include the query>",

  "response": "<a short voice-style response like 'Sure, opening it now', 'Today is Tuesday', etc.>"
}

### type meanings:
- "general": factual/info questions. aur agar koi aisa question puchta hai jiska answer tume pata hai usko bhi general type me rakhna
- "google-search": search query on Google
- "youtube-search": search query on YouTube
- "youtube-play": user wants to play a specific video
- "calculator-open": user wants to open calculator
- "instagram-open": user wants to open Instagram
- "facebook-open": user wants to open Facebook
- "weather-show": user wants weather info
- "get-time": current time
- "get-date": current date
- "get-day": current day
- "get-month": current month

🟢 Important Rules:
- Do not include your name in "userinput"
- If the user asks "who created you", return: "I was created by ${userName}"
- Respond ONLY in pure JSON (no markdown, no backticks, no extra text)

Now respond to this command:
"${command}"
`;

    const result = await axios.post(apiUrl, {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const rawText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error("❌ Gemini response missing content:", result.data);
      return null;
    }

    return rawText.trim(); // Should be a JSON string

  } catch (error) {
    console.error("❌ Gemini Error:", error.response?.data || error.message);
    return null;
  }
};

export default geminiRespone;
