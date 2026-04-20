import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

function CreatePage() {
  const [message, setMessage] = useState('');
  const [instagram, setInstagram] = useState('');
  const [code, setCode] = useState('');

  const [isMatch, setIsMatch] = useState(false);
  const [matchData, setMatchData] = useState(null);

  const [chat, setChat] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  // 🔥 CREATE CODE
  const createCode = async () => {
    const res = await axios.post('https://silent-connect-4b6e.onrender.com/api/create', {
      message,
      instagram
    });
    setCode(res.data.code);
  };

  // 💖 CREATOR INTEREST
  const sendCreatorInterest = async () => {
    try {
      await axios.post('https://silent-connect-4b6e.onrender.com/api/creator-interest', {
        code
      });
      alert("💖 You liked back!");
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 CHECK MATCH
  const checkMatch = async () => {
    try {
      const res = await axios.get(`https://silent-connect-4b6e.onrender.com/api/match/${code}`);

      if (res.data.match) {
        setIsMatch(true);
        setMatchData(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 🔄 POLLING MATCH
  useEffect(() => {
    if (!code || isMatch) return;

    const interval = setInterval(() => {
      checkMatch();
    }, 2000);

    return () => clearInterval(interval);
  }, [code, isMatch]);

  // 🔥 FETCH CHAT
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`https://silent-connect-4b6e.onrender.com/api/messages/${code}`);
      setChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔄 POLLING CHAT
  useEffect(() => {
    if (!isMatch) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [isMatch]);

  // 💬 SEND MESSAGE
  const sendMessage = async () => {
    try {
      if (!newMsg.trim()) return;

      await axios.post('https://silent-connect-4b6e.onrender.com/api/send-message', {
        code,
        sender: "creator",
        message: newMsg
      });

      setNewMsg('');
      fetchMessages();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">
      
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-[350px] text-center">

        <h1 className="text-3xl font-bold text-pink-600 mb-2">
          💖 Silent Connect
        </h1>

        <p className="text-gray-600 mb-6 text-sm">
          Connect without talking! ✨
        </p>

        <input
          className="w-full p-3 mb-3 rounded-xl border"
          placeholder="Say something sweet 😊"
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded-xl border"
          placeholder="Your Instagram @"
          onChange={(e) => setInstagram(e.target.value)}
        />

        <button
          onClick={createCode}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-xl font-semibold"
        >
          ✨ Create Connection
        </button>

        {/* 🔥 AFTER CODE */}
        {code && (
          <div className="mt-6">

            <p className="text-sm text-gray-500">Your Code</p>
            <h2 className="text-2xl font-bold text-purple-600">{code}</h2>

            <div className="mt-4 flex justify-center">
              {/* <QRCodeCanvas value={`http://localhost:5173/view/${code}`} /> */}
              <QRCodeCanvas value={`${window.location.origin}/view/${code}`} />
            </div>

            <button
              onClick={sendCreatorInterest}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              💖 I'm Interested Too
            </button>

            {/* 💖 MATCH */}
            {isMatch && matchData && (
              <div className="mt-4 p-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-2xl">

                <h1 className="text-xl font-bold mb-2">
                  💖 It's a Match!
                </h1>

                <p>👩 Them: @{matchData.responder_instagram}</p>

                <div className="bg-white text-gray-800 p-2 rounded-lg mt-2">
                  <p className="text-sm">💌 Message:</p>
                  <p className="italic">"{matchData.responder_message}"</p>
                </div>

              </div>
            )}

            {/* 💬 CHAT */}
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

          </div>
        )}

      </div>
    </div>
  );
}

export default CreatePage;