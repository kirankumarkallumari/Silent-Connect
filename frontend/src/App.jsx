// import { useState } from 'react';
// import axios from 'axios';
// import { QRCodeCanvas } from 'qrcode.react';

// function App() {
//   const [message, setMessage] = useState('');
//   const [instagram, setInstagram] = useState('');
//   const [code, setCode] = useState('');

//   const createCode = async () => {
//     try {
//       const res = await axios.post('http://localhost:5000/api/create', {
//         message,
//         instagram
//       });

//       setCode(res.data.code);
//     } catch (err) {
//       console.log(err);
//       alert("Error creating code");
//     }
//   };

//   return (
//     <div style={{ padding: "40px", fontFamily: "Arial" }}>
//       <h1>Silent Connect 🔥</h1>

//       <input
//         placeholder="Enter message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       /><br /><br />

//       <input
//         placeholder="Instagram ID"
//         value={instagram}
//         onChange={(e) => setInstagram(e.target.value)}
//       /><br /><br />

//       <button onClick={createCode}>Generate Code</button>

//       {code && (
//         <div style={{ marginTop: "20px" }}>
//           <h2>Your Code: {code}</h2>

//           <QRCodeCanvas
//             value={`http://localhost:5173/view/${code}`}
//             size={200}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

import { Routes, Route } from 'react-router-dom';
import CreatePage from './CreatePage';
import ViewPage from './ViewPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePage />} />
      <Route path="/view/:code" element={<ViewPage />} />
    </Routes>
  );
}

export default App;