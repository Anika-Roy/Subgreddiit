import logo from './logo.svg';
import './App.css';
import React, { useState } from "react"
import { Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import {Login} from "./auth/Login"
// import { Register } from './auth/Register';
import { Auth } from './auth/Auth';
// import FormInput from './common/FormInput';
import { About } from "./components/About"
import { Dashboard } from "./components/dashboard"
import Protected from './auth/Protected';
import ResponsiveAppBar from './common/Navbar';
import { Followers } from './components/followers';
import { Following } from './components/following';
import { useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { MySubGreddiits } from './components/mySubGreddiits';
import { SubGredPageMod } from './components/subGredPageMod';
import { AllSubGreddiits } from './components/allSubGreddiits';
import { SubGredPageView } from './components/subGredPageView';
import { MySubGredUsers } from './components/mysubgreds/subUsers';
import {MySubGredReqUsers} from './components/mysubgreds/joinreqs';
import {Reported} from './components/mysubgreds/reported';
import {SavedPostsPage} from './components/savedPostsPage';

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user_token = localStorage.getItem('token');
    // const user_token = JSON.parse(localStorage.getItem('token'));

    // console.log(user_token);
    if (user_token) {

      const temp = (jwt_decode(user_token))._doc;
      console.log("temp",temp);
      setUser(temp);
      
      // setIsSignedIn(true);
      // console.log(user);

      // navigate('/about');
    }
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   console.log(user);
  //   // navigate('/about');
  // }, [user]);
  if(loading)
  {
    return <h1>Loading...</h1>
  }

  

  return (
    <div>

      {user && <ResponsiveAppBar user={user} setUser={setUser} />}
      {/* <MySubGreddiits/> */}
      <Routes>
        <Route path="/" element={
        user ? <Dashboard user={user} /> : <Auth user={user} setUser={setUser} />} />
        <Route path="/about"
          element={
            <Protected user={user}>
              {<About user={user} setUser={setUser} />}
            </Protected>
          }
        />
        <Route path="/dashboard"
          element={
            <Protected user={user}>
              {<Dashboard user={user} />}
            </Protected>
          }
        />
        <Route path="/savedposts"
          element={
            <Protected user={user}>
              {<SavedPostsPage user={user} />}
            </Protected>
          }
        />
        <Route path="/mysubgreddiits"
          element={
            <Protected user={user}>
              {< MySubGreddiits user={user} setUser={setUser} />}
            </Protected>
          }
        />
        <Route path="/allsubgreddiits"
          element={
            <Protected user={user}>
              {< AllSubGreddiits user={user} setUser={setUser} />}
            </Protected>
          }
        />
        <Route path="/mysubgreddiits/:subgredId"
          element={
            <Protected user={user}>
              {< SubGredPageMod user={user}/>}
            </Protected>
          }
        />
        <Route path="/mysubgreddiits/:subgredId/users"
          element={
            <Protected user={user}>
              {<MySubGredUsers/>}
            </Protected>
          }
        />
        <Route path="/mysubgreddiits/:subgredId/joiningrequestspage"
          element={
            <Protected user={user}>
              {<MySubGredReqUsers/>}
            </Protected>
          }
        />
        <Route path="/mysubgreddiits/:subgredId/stats"
          element={
            <Protected user={user}>
              {< SubGredPageMod user={user}/>}
            </Protected>
          }
        />
        <Route path="/mysubgreddiits/:subgredId/reported"
          element={
            <Protected user={user}>
              {<Reported user={user}/>}
            </Protected>
          }
        />
        <Route path="/allsubgreddiits/:subgredId"
          element={
            <Protected user={user}>
              {< SubGredPageView user={user} />}
            </Protected>
          }
        />
        <Route path="/about/followers"
          element={
            <Protected user={user}>
              {<Followers user={user}/>}
            </Protected>
          }
        />
        <Route path="/about/following"
          element={
            <Protected user={user}>
              {<Following user={user}/>}
            </Protected>
          }
        />
      </Routes> 
    </div>
  )
}


export default App;

