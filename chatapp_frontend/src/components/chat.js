import React, { useEffect, useState, useRef } from "react";
import { LogoutIcon } from "@heroicons/react/outline";
import { MoonIcon, SunIcon, XIcon } from "@heroicons/react/solid";
import Picker from 'emoji-picker-react';
import { GoogleLogout } from '@leecheuk/react-google-login';
import { useNavigate } from "react-router-dom";
// import Logo from "../chatlogo.png"
const Chat = ({ socket, username, room, photo }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [istDateTime, setIstDateTime] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const userPhoto = localStorage.getItem('photo');
  const email = localStorage.getItem('email');
  const [showModal, setShowModal] = useState(false);
  const Navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); 
  const [userList, setUserList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCross, setIsCross] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false); // State variable to force update
  useEffect(() => {
    setForceUpdate(prev => !prev);
  }, [darkMode]);
  const handleButtonClick = () => {
    // setShowPicker(!showPicker);
    setTimeout(() => {
      setShowPicker(!showPicker);
    }, 10);
  };
  const onEmojiClick = (event) => {
    const emoji = event.emoji;
    setCurrentMessage((prevMessage) => prevMessage + emoji);
    inputRef.current.focus();
  };
  const copyToClipboard = () => {
    const textField = document.createElement('textarea');
    textField.innerText = room;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    console.log('Text copied to clipboard:', room);
  }
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const leave = () => {
    window.location.reload();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsCross(!isCross);

  }
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const modalRef = useRef();

  const handleClickOutsideModal = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      handleClickOutsideModal(event);
    };

    if (showModal) {
      window.addEventListener('click', handleWindowClick);
    }

    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [showModal]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchIST();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchIST = () => {
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
    };

    const formattedTime = now.toLocaleString('en-IN', options);
    const is12HourFormat = formattedTime.includes('AM') || formattedTime.includes('PM');

    setIstDateTime(is12HourFormat ? formattedTime : formattedTime.replace(':', '.'));
  };

  const sendMessage = async () => {
    const trimmedMessage = currentMessage.trim();
    if (trimmedMessage !== "") {
      const messageData = {
        room: room,
        photo: photo,
        author: username,
        message: trimmedMessage,
        time: istDateTime,
      };

      await socket.emit("send_message", messageData);

      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("user", (message) => {
      console.log('Received message:', message.username);
      setUserList((list1) => [...list1, message]);
    });
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const buttonStyle = {
    backgroundColor: darkMode ? 'teal' : 'teal',
    color: darkMode ? '#fff' : '#fff',
    display: 'flex',
    padding: '5px',
    paddingLeft: '10px',
    paddingRight: '10px',
    borderRadius: 5
  };
  return (
    <div className={`min-h-screen flex flex-col relative ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}>
      <div className={`fixed top-0 left-0 right-0 p-4 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} z-10`}>
        {/* Dark mode toggle button */}


        {/* User modal */}
        <div className="relative" ref={modalRef}>
          <img
            src={userPhoto}
            alt="User Profile"
            className="fixed top-4 right-4 h-8 w-8 rounded-full cursor-pointer"
            onClick={toggleModal}
          />
          {showModal && (
            <div className={`fixed top-14 right-4 transform transition-all duration-300 ${showModal ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className={`h-55 p-5 rounded shadow-md flex flex-col items-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
                <img
                  src={userPhoto}
                  alt="User Profile"
                  className="h-12 w-12 rounded-full mb-2"
                />
                <p className={`text-lg mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>{username}</p>
                <p className={`text-xs mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{email}</p>
                <button
                  onClick={toggleModal}
                  className="absolute top-2 right-1 px-3 py-1 rounded-md focus:outline-none flex items-center justify-center"
                  style={{ color: darkMode ? '#FFFFFF' : '#000000' }}
                >
                  <XIcon className="h-5 w-5" />
                </button>
                <button style={{ marginBottom: 15 }} onClick={toggleDarkMode}>
                  <div style={{ display: 'flex' }}>
                    <button onClick={toggleDarkMode} className={`p-2 rounded-full border ${darkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-400 bg-gray-400'}`}>
                      {darkMode ? (
                        <SunIcon className="h-2 w-2 text-yellow-400" />
                      ) : (
                        <MoonIcon className="h-2 w-2 text-gray-500" />
                      )}
                    </button>&nbsp;&nbsp;<p className={`text-sm`} style={{ marginTop: '5px' }}> {!darkMode ? 'Dark Mode' : 'Light Mode'} </p>
                  </div>
                </button>

                <GoogleLogout
                  clientId="798504094336-id3r3n1ldom2rjmsa6tdp6db0oii5nct.apps.googleusercontent.com"
                  buttonText="SignOut"
                  onLogoutSuccess={() => Navigate('/')}
                  cookiePolicy={'single_host_origin'}
                  render={renderProps => (
                    <button onClick={renderProps.onClick} style={buttonStyle}>  <LogoutIcon className="h-5 w-5" />&nbsp;<p className={`text-sm mt-0.5`}>Sign Out</p></button>
                  )}
                />
              </div>
            </div>
          )}
        </div>
        {/* Chat header */}
        <div>
          {/* Mobile view */}
          <div className="sm:hidden fixed top-2 left-4">
            <button
              className="fixed top-5 left-3"
              onClick={toggleDropdown}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isCross ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill={darkMode ? 'white' : 'black'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill={darkMode ? 'white' : 'black'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                >
                  <rect x="4" y="5" width="20" height="1" rx="1" ry="1" />
                  <rect x="4" y="11" width="20" height="1" rx="1" ry="1" />
                  <rect x="4" y="17" width="20" height="1" rx="1" ry="1" />
                </svg>
              )}
            </button>
            {/* Dropdown content for mobile */}
            {isDropdownOpen && (
              <div className={`p-5 mt-10 rounded shadow-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
                <p className="text-xs mb-2">CODE: <span style={{ textDecoration: 'underline', color: 'teal' }} onClick={copyToClipboard}>{room}</span></p>
                <button
                  onClick={() => { leave() }}
                  className="bg-red-600 hover:bg-red-400 text-white text-xs px-3 py-2 mt-2 rounded focus:outline-none focus:bg-red-600"
                >
                  Leave
                </button>
              </div>
            )}
          </div>
          {/* Desktop view */}
          <div className="hidden sm:flex fixed top-2 left-3">
            <p className="text-white-500 sm:text-xl text-xs mt-4 mr-3">CODE: <span style={{ textDecoration: 'underline', color: 'teal', cursor: 'pointer' }} onClick={copyToClipboard}>{room}</span></p>
            <button
              onClick={() => { leave() }}
              className="bg-red-600 hover:bg-red-400 text-white text-xs px-4 py-1 ml-5 mt-3 rounded focus:outline-none focus:bg-red-600"
            >
              Leave
            </button>
          </div>
        </div>

        <h1 className={`text-xl sm:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Chat <span style={{ color: 'teal' }}> HUB</span></h1>

      </div>


      {/* Message container */}
      <div className={`mt-16 flex-1 p-4 pb-20 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        {/* <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center"> */}
        <div className="flex flex-col justify-center">
          {userList.map((messageContent, index) => (
            <div
              className={`relative mb-2 inline-flex ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
              key={index}
              style={{ alignSelf: 'center', paddingLeft: '12px', paddingRight: '12px', padding: '4px', borderRadius: '8px', marginRight: '6px', maxWidth: 'fit-content' }}
            >
              <p style={{ fontSize: 12, color: !darkMode ? 'darkgray' : 'gray', }}>
                {messageContent.username} joined!
              </p>
            </div>
          ))}
        </div>


        {/* </div> */}
        {messageList.map((messageContent, index) => {
          const isMe = messageContent.author === username;

          return (
            <div
              key={index}
              className={`relative mb-2 ${isMe ? 'flex justify-end' : 'flex justify-start'}`}
              id={isMe ? "you" : "other"}
            >
              {!isMe && (
                <div style={{ display: 'flex' }}>
                  <img
                    src={messageContent.photo}
                    alt="User Profile"
                    className="h-6 w-6 rounded-full"
                  />
                </div>
              )}
              <div style={{ marginBottom: 10, marginLeft: 10 }}>
                <div className={`${isMe && darkMode ? 'bg-teal-700' : isMe && !darkMode ? 'bg-teal-300' : !isMe && !darkMode ? 'bg-gray-100' : 'bg-gray-800'} ${darkMode ? 'text-white' : 'text-black'} py-1 px-2 rounded-lg inline-block max-w-md break-words relative`}>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {!isMe && (
                      <p style={{ fontSize: 'calc(0.4em + 0.5vw)', textAlign: 'left', color: darkMode ? 'lightgreen' : 'green', marginBottom: '5px' }}>
                        {messageContent.author}
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{ fontSize: 'calc(0.6em + 0.5vw)', color: `${darkMode ? 'white' : 'black'}`, minWidth: '3vw', wordWrap: 'break-word', textAlign: 'left', marginBottom: '0px', maxWidth: '60vw' }}>
                        {messageContent.message}
                      </p>
                      <p style={{ fontSize: 'calc(0.4em + 0.4vw)', color: `${darkMode ? 'white' : 'black'}`, marginLeft: '10px', textAlign: 'right', marginTop: 'auto', flexShrink: 0 }}>
                        {messageContent.time}
                      </p>
                    </div>
                  </div>

                  <div className={`absolute ${isMe ? 'right-0' : 'left-0'} -top-1`}>
                    <div className={`w-2 h-4 ${isMe && darkMode ? 'bg-teal-700' : isMe && !darkMode ? 'bg-teal-300' : !isMe && !darkMode ? 'bg-gray-100' : 'bg-gray-800'} transform rotate-180 rounded`}></div>
                  </div>

                </div>
              </div>

            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>


      <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'border-gray-900 sm:bg-gray-800 bg-gray-900 text-white' : 'border-gray-300 sm:bg-gray-200 bg-white text-black'} p-2 sm:p-2 rounded-half`}>
        <div className="flex flex-row">
        <button
        className="rounded-full fixed bottom-5 left-5"
        style={{height:'fit-content'}}
        onClick={handleButtonClick}
      >
        {/* Emoji symbol */}
        {!showPicker ? (
        <span>
        <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="ekdr8vow dhq51u3o" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24"><title>smiley</title><path fill="currentColor" d="M9.153,11.603c0.795,0,1.439-0.879,1.439-1.962S9.948,7.679,9.153,7.679 S7.714,8.558,7.714,9.641S8.358,11.603,9.153,11.603z M5.949,12.965c-0.026-0.307-0.131,5.218,6.063,5.551 c6.066-0.25,6.066-5.551,6.066-5.551C12,14.381,5.949,12.965,5.949,12.965z M17.312,14.073c0,0-0.669,1.959-5.051,1.959 c-3.505,0-5.388-1.164-5.607-1.959C6.654,14.073,12.566,15.128,17.312,14.073z M11.804,1.011c-6.195,0-10.826,5.022-10.826,11.217 s4.826,10.761,11.021,10.761S23.02,18.423,23.02,12.228C23.021,6.033,17.999,1.011,11.804,1.011z M12,21.354 c-5.273,0-9.381-3.886-9.381-9.159s3.942-9.548,9.215-9.548s9.548,4.275,9.548,9.548C21.381,17.467,17.273,21.354,12,21.354z  M15.108,11.603c0.795,0,1.439-0.879,1.439-1.962s-0.644-1.962-1.439-1.962s-1.439,0.879-1.439,1.962S14.313,11.603,15.108,11.603z"></path></svg>
        </span>):(
       <svg
       xmlns="http://www.w3.org/2000/svg"
       className="h-6 w-6"
       fill={darkMode ? 'white' : 'black'}
       viewBox="0 0 24 24"
       stroke="currentColor"
       style={{
         width: '24px',
         height: '24px',
       }}
     >
       <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth={2}
         d="M6 18L18 6M6 6l12 12"
       />
     </svg>
    )
}
      </button>
          <div className={`fixed bottom-12 right-50 ${showModal ? 'translate-x-0' : '-translate-y-5'}`}>
            {showPicker &&   <Picker key={forceUpdate} onEmojiClick={onEmojiClick} theme={darkMode ? 'dark' : 'light'} />}
          </div>
          <input
            type="text"
            value={ currentMessage}
            ref={inputRef} 
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
            placeholder="Type a message..."
            style={{
              paddingLeft: '3rem', // Remove left padding
            }}
            className={`flex-1 p-2 rounded-full border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-gray-100 text-black'} focus:outline-none focus:ring focus:border-blue-500 mb-0 sm:mb-0 sm:mr-2`}
          />

          <button
            onClick={sendMessage}
            className="ml-2 w-auto sm:px-0 py-0 sm:rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="48"
              height="48"
              // stroke="teal-300"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="lightgray"
              className="feather feather-arrow-right-circle"
            >
              <circle cx="12" cy="12" r="10" fill="teal" />
              <path d="M12 16l4-4-4-4M8 12h8" stroke="lightgray" />
            </svg>

          </button>

        </div>
      </div>
    </div>
  );
}

export default Chat;
