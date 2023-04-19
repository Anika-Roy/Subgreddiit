import React, { useState } from "react"
import {useEffect} from "react";
import axios from 'axios';

import { FormInput } from "../common/FormInput"
import { Button } from "../common/Button"
import { Link } from "react-router-dom";
// import jwt_decode from "jwt-decode";

// let User = require('../../../server/models/user');

export const JoinedSubgreddiitCard = ({ subgreddiit, userId }) => {

    const [moderator, setModerator] = useState(false);

    useEffect(() => {
        //check if moderator
        console.log("reached use effect")
        if (subgreddiit.moderators.includes(userId)) {
            setModerator(true);
        }
    }, [])
        

    console.log(userId)
    const handleLeave = () => {
        console.log("reached delete")
        //remove subgrediit from user's joined subgreddiits
        //remove user from subgreddiit's notBanned members to Banned members
        axios.delete(`http://localhost:5000/users/leave_subgreddiit/${userId}/${subgreddiit._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log(res.data);
                axios.delete(`http://localhost:5000/subgreddiits/leave_subgreddiit/${userId}/${subgreddiit._id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                    .then(res => {
                        console.log(res.data);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            })
            .catch(err => {
                console.error(err);
            });


    }

    return (
        <div>

            <h2><Link to={{
                pathname: `/allsubgreddiits/${subgreddiit._id}`
            }}>{subgreddiit.name}</Link></h2>
            <ul>
                <li>#people --  {subgreddiit.notBannedMembers.length + subgreddiit.blockedmembers.length}</li>
                <li>#posts -- {subgreddiit.posts.length}</li>
                <li>description -- {subgreddiit.description}</li>
                <li>banned keywords -- {subgreddiit.bannedKeywords.map((keyword, index) => {
                    return <span key={index}>{index ? "," : ""}{keyword} </span>
                })}</li>
                <li>Tags -- {
                    //display the array subgreddiit.bannedKeywords in a comma separated form
                    subgreddiit.tags.map((tag, index) => {
                        return <span key={index}>{index ? "," : ""}{tag} </span>
                    })}</li>
            </ul>
            <Button onClick={handleLeave} disabled={moderator} text="Leave" />
            {/* <Button onClick={()=> navigate(`/${subgreddiit.name}`)} text="View" /> */}
        </div>


    )
}
