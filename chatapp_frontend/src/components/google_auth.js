import React from 'react';
import { GoogleLogin } from '@leecheuk/react-google-login';
import { useNavigate } from 'react-router-dom';
import Logo from '../chatlogo.png';
import axios from 'axios'; // Import Axios for making HTTP requests

const GetStarted = () => {
  const navigate = useNavigate();

  const responseGoogleSuccess = async (response) => {
    if (response.profileObj) {
      const { imageUrl, name, email } = response.profileObj;

      // Store data in localStorage (optional)
      localStorage.setItem('photo', imageUrl || '');
      localStorage.setItem('name', name || '');
      localStorage.setItem('email', email || '');

      try {
        // Send user data to backend server
        await axios.post('https://chat-hub-server-a9x4.onrender.com/storeUserData', {
          email:email,
          username: name,
        });
         
        // Navigate to '/connection' after successful login and data storage
        navigate('/connection');
      } catch (error) {
        console.error('Error sending user data to the server:', error);
        alert('Failed to login. Please try again.');
      }
    } else {
      navigate('/');
    }
  };

  const responseGoogleFailure = (error) => {
    console.error('Google Login Failed:', error);
    alert('Google login failed. Please try again.');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <img className="fixed top-14 left-100 h-18 w-20" src={Logo} alt="Logo" />

      <div className="text-center">
        {/* <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Welcome to <span style={{ color: 'teal' }}>Chat HUB !</span>
        </h1>
        <p className="text-lg mb-8">
          Indulge in intriguing conversations and meet peculiar individuals exclusively through online chats.
        </p> */}
        <GoogleLogin
          clientId="798504094336-id3r3n1ldom2rjmsa6tdp6db0oii5nct.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={responseGoogleSuccess}
          onFailure={responseGoogleFailure}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    </div>
  );
};

export default GetStarted;

