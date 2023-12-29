import './App.css';
import Connection from './components/connection';
import GoogleLoginButton from './components/google_auth';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import {gapi} from 'gapi-script'
import { useEffect } from 'react';
function App() {
  useEffect(()=>{
    function start(){
      gapi.client.init({
        clientID:"798504094336-id3r3n1ldom2rjmsa6tdp6db0oii5nct.apps.googleusercontent.com",
        scope:""
      })
    };
    gapi.load('client:auth2',start);
  })
  return (
    <BrowserRouter>
   
     <Routes>
                {/* <Route path='/signUp' element={<SignUp/>}></Route>
                <Route path='/' element={<SignIn/>}></Route> */}
                <Route path='/connection' element={<Connection/>}></Route>
                <Route path='/' element={<GoogleLoginButton/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
