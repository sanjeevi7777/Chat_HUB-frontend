  
  import React, { useState } from "react";
  import io from "socket.io-client";
  import Chat from "./chat";
  // import { Link } from 'react-router-dom';
  import Logo from "../chatlogo.png"
  const socket = io.connect("https://chat-hub-server-a9x4.onrender.com");
  // const socket = io.connect("http://localhost:3001/");

  function App() {
    const [showChat, setShowChat] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState("");

    const username = localStorage.getItem('name');
    const photo = localStorage.getItem('photo');
    const generateRoomCode = () => {
      // if (isChecked) {
        const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
        }
        setGeneratedCode(code);
        socket.emit("create_room", code); // Emit event to create a new room
      // } else {
      //   alert('Please agree to the terms and conditions.');
      // }
    };
  
    const joinRoom = () => {
      const messageData = {
        room: generatedCode,
        username: username
      };
  
      if (username !== "" && generatedCode !== "") {
        setIsLoading(true);
        socket.emit("join_room", generatedCode, (response) => {
          if (response === "RoomExists") {
            socket.emit("user_joined_send", messageData);
            setTimeout(() => {
              setShowChat(true);
              setIsLoading(false);
            }, 3000);
          } else if (response === "RoomNotFound") {
            setIsLoading(false);
            alert("The room does not exist or is empty.");
          }
        });
      }
    };

    return (
      <div className="App">
        {!showChat ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="flex items-center justify-center">
            <img className="fixed top-2 left-100 h-18 w-20" src={Logo} alt="Logo" />
              <div className="ml-10 mr-10 bg-gray-700 rounded shadow p-8">
                <h3 className="text-xl mb-6 text-teal-500 k font-semibold">Join A Chat..!</h3>

                <div className="App">
                  <button
                    onClick={generateRoomCode}
                    className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:bg-gray-400 relative mb-8"
                  >
                    Generate New Code
                  </button>
                  {/* <p className="text-white">or</p> */}
                  <hr></hr>
                  <br>
                  </br>
                  <b className="text-white">Existing Code..</b>
                  <input
                    type="text"
                    placeholder="Enter Room ID..."
                    value={generatedCode}
                    className="block w-full border rounded py-2 px-4 mt-2 mb-4 text-black focus:outline-none focus:border-teal-500"
                    onChange={(event) => {
                      setGeneratedCode(event.target.value);
                    }}
                  />
                </div>
                {/* <p className="text-left text-xs sm:text-sm md:text-base lg:text-sm text-gray-400 mb-4 sm:mb-4 mt-10">
                  By joining, you agree to our <Link to="/terms" className="underline">Terms and Conditions</Link>.
                </p> */}

                
                <button
                  onClick={joinRoom}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:bg-teal-600 relative"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div style={{ display: 'flex' }}>
                      <svg aria-hidden="true" role="status" class="mt-1 inline w-4 h-4 me-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                      </svg>
                      Joining...
                    </div>
                  ) : (
                    'Join A Room'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Chat socket={socket} username={username} room={generatedCode} photo={photo} />
        )}
      </div>
    );
  }

  export default App;
