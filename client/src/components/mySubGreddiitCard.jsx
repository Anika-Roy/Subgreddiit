import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { FormInput } from "../common/FormInput"
import { Button } from "../common/Button"
// import jwt_decode from "jwt-decode";

// let User = require('../../../server/models/user');

export const MySubgreddiitCard = ({ subgreddiit}) => {

    const navigate = useNavigate();
    
    const handleDelete = () => {
        console.log("reached delete")
        alert("functionality not added yet")
        // axios.delete(`http://localhost:5000/subgreddiits/${subgreddiit._id}`,{
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'Authorization': 'Bearer ' + localStorage.getItem('token')
        //     }
        // })
        //     .then(res => {
        //         console.log("deleted")
        //     })
        //     .catch(err => {
        //         console.log("Problem deleting subgreddiit")
        //         console.error(err);
        //     });
    }
   

    return (
        <div>

        <h2>{subgreddiit.name}</h2>
        <ul>
            <li>#people --  {subgreddiit.notBannedMembers.length+subgreddiit.blockedmembers.length}</li>
            <li>#posts -- {subgreddiit.posts.length}</li>
            <li>description -- {subgreddiit.description}</li>
            <li>banned keywords -- {
            subgreddiit.bannedKeywords.map((keyword, index) => {
                return <span key={index}>{index ? ",": ""}{keyword} </span>
            })}</li>
        </ul>
        <Button onClick={handleDelete} text="Delete" />
        <Button onClick={()=> navigate(`/mysubgreddiits/${subgreddiit._id}`)} text="View" />
        </div>


    )
    }
