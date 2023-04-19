import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { FormInput } from "../common/FormInput"
import { Button } from "../common/Button"
import jwt_decode from "jwt-decode";

// let User = require('../../../server/models/user');

export const Login = ({ user, setUser }) => {

    //variable navigate
    const navigate = useNavigate();

    // const [loading,setLoading]=useState(true);

    //creating the field variables
    const [userName, setUserName] = useState('');
    const [password, setPass] = useState('');
    const [usernameError, setUserNameError] = useState('');
    const [passError, setPassError] = useState('');

    //defining variable to control button
    let isDisabled = password.length == 0 || userName.length == 0;

    //defining functions to handle changes
    const handleUserNameChange = (event) => {
        //updating UserName
        setUserName(event.target.value);
        setUserNameError("");
    }

    const handlePassChange = event => {
        //updating UserName
        setPass(event.target.value);
        setPassError("");
    }

    //handling submit
    const handleSubmit = event => {
        event.preventDefault();

        const data = { userName, password };

        console.log(JSON.stringify(data))
        axios.post('http://localhost:5000/users/login', JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            // .then(res => {
            //     console.log(res.data);
            // })
            .then(res => {
                localStorage.setItem('token', res.data.token);
                console.log('Token saved to local storage');
                const temp = (jwt_decode(res.data.token))._doc;
                console.log(temp);
                setUser(temp);
                // setLoading(false);
                // console.log("user variable set")
                // console.log(user)
                // setIsSignedIn(true);
                // console.log("user",user._id)
                // navigate("/dashboard");
            })
            .catch(err => {
                console.error(err);
            });

    }
        
    

    return (
        <form onSubmit={handleSubmit}>

            <FormInput value={userName} label="userName" id="userName" placeholder="User Name" type="text" name="userName" onChange={handleUserNameChange} error={usernameError} />
            <FormInput value={password} label="password" id="password" placeholder="*******" type="password" name="password" onChange={handlePassChange} error={passError} />

            <Button type="submit" disabled={isDisabled} text="Log In" />

        </form>

    )
}