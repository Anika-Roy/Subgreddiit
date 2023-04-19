import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { useNavigate } from 'react-router-dom';
import { SingleLineInputUnstyledProps } from '@mui/base';
import SignInSide from "./mui_templates/SignInSide";
import RegisterSide from './mui_templates/RegisterSide';

export const Auth = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('login');

  const navigate = useNavigate();

  return (
    <div>
      <div className="tabs">
        <button className={activeTab === 'login' ? 'active' : ''} onClick={() => setActiveTab('login')}>
          Login
        </button>
        <button className={activeTab === 'register' ? 'active' : ''} onClick={() => setActiveTab('register')}>
          Register
        </button>
      </div>
      {activeTab === 'login' ? <Login user={user} setUser={setUser}/> : <Register user={user} setUser={setUser}/>}
    </div>
  );
};
