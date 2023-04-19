import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { FormInput } from "../common/FormInput"
import { Button } from "../common/Button"
// import jwt_decode from "jwt-decode";

// let User = require('../../../server/models/user');

export const NotJoinedSubgreddiitCard = ({ subgreddiit, userId }) => {

    const navigate = useNavigate();
    // const userId = userId;
    const SubgreddiitId = subgreddiit._id;

    // const data1 = {SubgreddiitId};
    const data2 = { userId };


    const handleJoin = () => {


        // axios.post('http://localhost:5000/users/add_sub/'+ userId, JSON.stringify(data1), {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'Authorization': 'Bearer ' + localStorage.getItem('token')
        //     }
        // })
        //     // .then(res => {
        //     //     console.log(res.data);
        //     // })
        //     .then(res => {
        //         console.log(res)
        //         console.log("added subgreddiit")
        //     })
        //     .catch(err => {

        //         console.error(err);
        //     });

        console.log("data2: " + JSON.stringify(data2))

        axios.post('http://localhost:5000/subgreddiits/add_requested_user/' + SubgreddiitId, JSON.stringify(data2), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            // .then(res => {
            //     console.log(res.data);
            // })
            .then(res => {
                if (res.data === "You are banned") {
                    alert("You are banned from this subgreddiit")
                }
                else {
                    console.log(res)
                    console.log("added user")
                    alert("Request sent")
                }

            })
            .catch(err => {
                console.log("error")
                console.error(err);
            });
    }


    return (
        <div>

            <h2>{subgreddiit.name}</h2>
            <ul>
                <li>#people --  {subgreddiit.notBannedMembers.length + subgreddiit.bannedMembers.length}</li>
                <li>#posts -- {subgreddiit.posts.length}</li>
                <li>description -- {subgreddiit.description}</li>
                <li>banned keywords -- {
                    //display the array subgreddiit.bannedKeywords in a comma separated form
                    subgreddiit.bannedKeywords.map((keyword, index) => {
                        return <span key={index}>{index ? "," : ""}{keyword} </span>
                    })}</li>
                <li>Tags -- {
                    //display the array subgreddiit.bannedKeywords in a comma separated form
                    subgreddiit.tags.map((tag, index) => {
                        return <span key={index}>{index ? "," : ""}{tag} </span>
                    })}</li>
            </ul>
            <Button onClick={handleJoin} text="Join" />
            {/* <Button onClick={()=> navigate(`/${subgreddiit.name}`)} text="View" /> */}
        </div>


    )
}
