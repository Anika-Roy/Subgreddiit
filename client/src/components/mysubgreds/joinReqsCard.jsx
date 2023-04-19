import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button } from "../../common/Button"
import { useParams } from "react-router-dom";
// import jwt_decode from "jwt-decode";

// let User = require('../../../server/models/user');

export const JoinReqsCard = ({reqUser}) => {

    const { subgredId } = useParams();
    
    const handleReject = () => {
        console.log("reached handleReject")
        axios.delete(`http://localhost:5000/subgreddiits/reject_user/${subgredId}/${reqUser._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
    })
        .then(res => {
            console.log("user rejected")
        })
        .catch(err => {
            console.log("error")
            console.error(err);
        });
    }

    const handleAccept = () => {
        console.log("reached handleAccept")
        //add user to joined users in subgreddiit
        axios.post(`http://localhost:5000/subgreddiits/accept_user/${subgredId}/${reqUser._id}`,JSON.stringify({}),{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => {
            console.log("user accepted")
        })
        .catch(err => {
            console.log("error")
            console.error(err);
        });
        //add subgreddiit to joined subgreddiits in user
        axios.post(`http://localhost:5000/users/add_joined_sub/${reqUser._id}/${subgredId}`,JSON.stringify({}), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => {
            console.log("subgreddiit added to user")
        })
        .catch(err => {
            console.log("error")
            console.error(err);
        });




    }

   

    return (
        <div>

        <h2>{reqUser.userName}</h2>
        <ul>
            <li>age --  {reqUser.age}</li>
            <li>firstName -- {reqUser.firstName}</li>
            <li>lastName -- {reqUser.lastName}</li>
            <li>email -- {reqUser.email}</li>
        </ul>
        <Button onClick={handleReject} text="Reject" />
        <Button onClick={handleAccept} text="Accept" />
        </div>


    )
    }
