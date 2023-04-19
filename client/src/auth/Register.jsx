import React, { useState } from "react"
import axios from 'axios';

import { useNavigate } from "react-router-dom";

import { FormInput } from "../common/FormInput"
import { Button } from "../common/Button"
import jwt_decode from "jwt-decode";
// import * as jwt_decode from 'jwt-decode';

export const Register = ({ user, setUser }) => {

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [age, setAge] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');

    //defining variable to control button
    let isDisabled = password.length == 0 || userName.length == 0 || firstName.length == 0 || lastName.length == 0 || age < 18 || contactNo.toString().length !== 10;

    //errors
    const [usernameError, setUserNameError] = useState('');
    const [passError, setPassError] = useState('');

    //first name
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    }
    //last name
    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    }
    //user name
    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    }
    //age change
    const handleAgeChange = (event) => {
        setAge(event.target.value);
    }
    //contact number
    const handleContactNoChange = (event) => {
        setContactNo(event.target.value);
    }
    //email
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    //password
    const handlePassChange = (event) => {
        setPass(event.target.value);
    }

    const handleSubmit = event => {
        event.preventDefault();

        //error handling
        // if (UserName === "admin" && pass === "admin") {
        //     console.log("Login Success");
        //     localStorage.setItem('UserName', JSON.stringify(UserName));
        //     setIsSignedIn(true);
        //     navigate("/about");
        // }
        // else if (UserName === "admin" && pass !== "admin") {
        //     setPassError("Invalid password");
        //     console.log("Invalid Password");
        // }
        // else if (UserName !== "admin" && pass === "admin") {
        //     setUserNameError("Invalid User Name");
        //     console.log("Invalid UserName");
        // }
        // else {
        //     setUserNameError("Invalid User Name");
        //     setPassError("Invalid password");
        //     console.log("Invalid UserName and Password");
        // }
        const data = { firstName, lastName, userName, age: Number(age), contactNo: Number(contactNo), email, password };

        console.log(JSON.stringify(data))
        axios.post('http://localhost:5000/users/add', JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log(res.data);
                console.log("user set");
                console.log(res.data.token);
                localStorage.setItem('token', res.data.token);
                const temp=jwt_decode(res.data.token)._doc;
                //setting user pass undefined:)
                temp.password=undefined;
                // console.log(temp)
                setUser(temp);
                console.log("user", user);
                
                // navigate("/dashboard");
            })
            // .then(res => {
            //     console.log(res.data);
            //     localStorage.setItem('token', res.data.token);
            //     console.log('Token saved to local storage');
            // })
            // .then(() => {
            //     const temp = localStorage.getItem('token')._doc;
            //     console.log(temp);
            //     setUser(temp);
            // })
            // .then(() => {
            //     console.log("user variable set")
            //     console.log(user)
            //     // setIsSignedIn(true);
            //     // console.log(isSignedIn)
            //     navigate("/about");
            // })
            .catch(err => {
                console.error(err);
            });
            
        // if (user) {
        //     setIsSignedIn(true);
        //     navigate("/about");
        // } 
        // setIsSignedIn(true);
        // navigate("/about");

        // console.log("Email: ", email);
        // console.log("Password: ", pass);
        // Perform some action, such as sending data to the server
        // or updating the component's state
    }

    // if(isSignedIn){
    //     navigate("/about");
    // }


    return (
        <form onSubmit={handleSubmit}>
            <FormInput value={firstName} label="firstName" id="firstName" placeholder="First Name" type="text" name="firstName" onChange={handleFirstNameChange} />

            <FormInput value={lastName} label="lastName" id="lastName" placeholder="Last Name" type="text" name="lastName" onChange={handleLastNameChange} />

            <FormInput value={userName} label="userName" id="userName" placeholder="User Name" type="text" name="userName" onChange={handleUserNameChange} error={usernameError} />

            <FormInput value={age} label="age" id="age" placeholder="Your Age" type="number" name="age" onChange={handleAgeChange} />

            <FormInput value={contactNo} label="contactNo" id="contactNo" placeholder="Contact Number" type="tel" name="contactNo" onChange={handleContactNoChange} />

            <FormInput value={email} label="email" id="email" placeholder="youremail@gmail.com" type="email" name="email" onChange={handleEmailChange} />

            <FormInput value={password} label="password" id="password" placeholder="*******" type="password" name="password" onChange={handlePassChange} error={passError} />

            <Button type="submit" disabled={isDisabled} text="Register" />

        </form>

    )

}