import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ViewPage() {
  const { code } = useParams();

  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userInsta, setUserInsta] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [isMatch, setIsMatch] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [chat,setChat] = useState([]);
  const [newMsg,setNewMsg] = useState('');
  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://silent-connect-4b6e.onrender.com/api/code/${code}`);
        setData(res.data);
      } catch (err) {
        if (err.response?.status === 410) {
          setData({ error: "⏳ Code expired" });
        } else if (err.response?.status === 404) {
          setData({ error: "❌ Code not found" });
        } else {
          setData({ error: "⚠️ Something went wrong" });
        }
      }
    };

    fetchData();
  }, [code]);

  const fetchMessages = async () => {
  const res = await axios.get(`https://silent-connect-4b6e.onrender.com/api/messages/${code}`);
  setChat(res.data);
};

  // 🔥 CHECK MATCH FUNCTION
  const checkMatch = async () => {
    try {
      const res = await axios.get(`https://silent-connect-4b6e.onrender.com/api/match/${code}`);
      console.log("Match API:", res.data); // debug

      if (res.data.match) {
        setIsMatch(true);
        setMatchData(res.data); //this stores full data
      }
    } catch (err) {
      console.log("Match error:", err);
    }
  };
  useEffect(() => {
  if (!isMatch) return;

  const interval = setInterval(() => {
    fetchMessages();
  }, 2000);

  return () => clearInterval(interval);
}, [isMatch]);

  // 🔥 AUTO CHECK MATCH EVERY 2 SEC
  useEffect(() => {
    const interval = setInterval(() => {
      checkMatch();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 SEND RESPONSE
  const sendResponse = async () => {
    try {
      await axios.post('https://silent-connect-4b6e.onrender.com/api/respond', {
        code,
        instagram: userInsta,
        message: userMsg
      });

      alert("💖 Response sent!");

      // check immediately also
      checkMatch();

    } catch (err) {
      console.log("Response error:", err);
    }
  };
  const sendMessage = async () => {
  try {
    console.log("Sending:", newMsg);

    const res = await axios.post('https://silent-connect-4b6e.onrender.com/api/send-message', {
      code,
      sender: "👩",
      message: newMsg
    });

    console.log("Response:", res.data);

    setNewMsg('');
    fetchMessages();

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
  }
};

  // ⏳ STATES
  if (!data) return <h2>Loading...</h2>;
  if (data.error) return <h2>{data.error}</h2>;

  // ✅ UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-red-200">

      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-[350px] text-center">

        {/* 💖 MATCH UI */}
        {isMatch && (
  <div className="mt-4">

    <h2 className="text-lg font-bold mb-2">💬 Chat</h2>

    <div className="h-40 overflow-y-auto bg-white p-2 rounded border">
      {chat.map((msg, index) => (
        <p key={index} className="text-sm">
          <b>{msg.sender}:</b> {msg.message}
        </p>
      ))}
    </div>

    <div className="flex mt-2">
      <input
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        className="flex-1 p-2 border rounded"
        placeholder="Type message..."
      />
      <button
        onClick={sendMessage}
        className="ml-2 bg-pink-500 text-white px-3 rounded"
      >
        Send
      </button>
    </div>

  </div>
)}
        {isMatch && matchData && (
         <div className="mb-4 p-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-2xl shadow-lg animate-pulse">

         <h1 className="text-xl font-bold mb-2">
          💖 It's a Match!
          </h1>

        <div className="text-sm mb-2">
         <p>👨 You: @{matchData.creator_instagram}</p>
         <p>👩 Them: @{matchData.responder_instagram}</p>
         </div>

       <div className="bg-white text-gray-800 p-2 rounded-lg mt-2">
        <p className="text-sm">💌 Message from them:</p>
         <p className="italic">"{matchData.responder_message}"</p>
         </div>

        </div>
        )}

        <h1 className="text-2xl font-bold mb-3 text-purple-700">
          💌 A message for you
        </h1>

        <p className="text-gray-700 mb-4 italic text-lg">
          "{data.message}"
        </p>

        <div className="bg-pink-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Connect on Instagram</p>
          <p className="font-semibold text-purple-600 text-lg">
            @{data.instagram}
          </p>
        </div>

        {/* BUTTONS */}
        <div className='mt-4'>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            👍 Interested
          </button>

          <button className="bg-gray-400 text-white px-4 py-2 rounded-lg">
            👎 Not Interested
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="mt-4">
            <input
              placeholder="Your Instagram"
              className="w-full p-2 mb-2 border rounded"
              onChange={(e) => setUserInsta(e.target.value)}
            />

            <input
              placeholder="Say something 😊"
              className="w-full p-2 mb-2 border rounded"
              onChange={(e) => setUserMsg(e.target.value)}
            />

            <button
              onClick={sendResponse}
              className="bg-pink-500 text-white px-4 py-2 rounded"
            >
              Send 💌
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ViewPage;