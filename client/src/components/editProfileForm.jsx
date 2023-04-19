import React, { useState } from "react"
import axios from 'axios';

import { useNavigate } from "react-router-dom";

import { FormInput } from "../common/FormInput"
import { Button } from "../common/Button"
import jwt_decode from "jwt-decode";

export const EditProfileForm = ({ user, setUser }) => {

    const navigate = useNavigate();


    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [age, setAge] = useState( user.age);
    const [contactNo, setContactNo] = useState(user.contactNo);

    //defining variable to control button
    let isDisabled = firstName.length == 0 || lastName.length == 0 || age < 18 || contactNo.toString().length !== 10;

    //first name
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    }
    //last name
    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    }
    //age change
    const handleAgeChange = (event) => {
        setAge(event.target.value);
    }
    //contact number
    const handleContactNoChange = (event) => {
        setContactNo(event.target.value);
    }

    const handleSubmit = event => {
        event.preventDefault();

        const data = { firstName, lastName, age: Number(age), contactNo: Number(contactNo)};

        console.log(JSON.stringify(data))
        axios.put('http://localhost:5000/users/update/'+user._id, JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log(res.data);
                console.log("user updated");
                
            })
            
            .catch(err => {
                console.log("user not updated")
                console.error(err);
            });
    }


    return (
        <form onSubmit={handleSubmit}>
            <FormInput value={firstName} label="firstName" id="firstName" placeholder="First Name" type="text" name="firstName" onChange={handleFirstNameChange} />
            <FormInput value={lastName} label="lastName" id="lastName" placeholder="Last Name" type="text" name="lastName" onChange={handleLastNameChange} />
            <FormInput value={age} label="age" id="age" placeholder="Your Age" type="number" name="age" onChange={handleAgeChange} />
            <FormInput value={contactNo} label="contactNo" id="contactNo" placeholder="Contact Number" type="tel" name="contactNo" onChange={handleContactNoChange} />

            <Button type="submit" disabled={isDisabled} text="Save changes" />
        </form>
    )

}