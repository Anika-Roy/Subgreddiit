import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button } from "../../common/Button"
import { Link } from "react-router-dom";
// import jwt_decode from "jwt-decode";

// let User = require('../../../server/models/user');

export const FollowerCard = ({ user , follower}) => {

    const handleRemove = () => {
        console.log("reached remove")
        //remove follower from user's followers
        axios.delete(`http://localhost:5000/users/remove_follower/${user._id}/${follower._id}`,{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("follower removed")
            }
            )
            .catch(err => {
                console.log("Problem removing follower")
                console.error(err);
            }
            );
        //remove user from follower's following
        axios.delete(`http://localhost:5000/users/remove_following/${follower._id}/${user._id}`,{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("following removed")
            }
            )
            .catch(err => {
                console.log("Problem removing following")
                console.error(err);
            }
            );
    }

    return (
        <div>
        <h2>{follower.userName}</h2> <Button onClick={handleRemove} text="Remove" />
       
        {/* <Button onClick={()=> navigate(`/${subgreddiit.name}`)} text="View" /> */}
        </div>


    )
    }
