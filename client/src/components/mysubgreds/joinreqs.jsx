import React, { useState } from "react"
import axios from 'axios';
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { JoinReqsCard } from "./joinReqsCard"



// import { FormInput} from "../common/FormInput"

// let User = require('../../../server/models/user');

export const MySubGredReqUsers = ({ }) => {

    const { subgredId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/subgreddiits/get_req_users/'+ subgredId, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("res.data: ", res.data)
                setUsers(res.data);
                setLoading(false)
            })
            .catch(err => {
                console.log("Problem getting users")
                console.error(err);
            });
    }, []);
   
    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <h1>Joining Reqs:)</h1>
            
            <ul>
                {users.map(reqUser => (
                    <JoinReqsCard key={reqUser._id} reqUser={reqUser} />
                ))}
            </ul>

        </div>
    )
}


