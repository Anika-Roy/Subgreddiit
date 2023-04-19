import React, { useState } from "react"
import axios from 'axios';
import { useEffect } from "react";
import { useParams } from "react-router-dom";


// import { FormInput} from "../common/FormInput"

// let User = require('../../../server/models/user');

export const MySubGredUsers = ({ user }) => {

    const { subgredId } = useParams();
    const [users, setUsers] = useState([]);
    const [blocked, setBlocked] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/subgreddiits/get_not_banned_users/'+ subgredId, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("res.data: ", res.data)
                setUsers(res.data);
                // setLoading(false)
            })
            .catch(err => {
                console.log("Problem getting users")
                console.error(err);
            });
        //get blocked users
        axios.get('http://localhost:5000/subgreddiits/get_blocked_users/'+ subgredId, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("blocked user: ", res.data)
                setBlocked(res.data);
                setLoading(false)
            })
            .catch(err => {
                console.log("Problem getting users")
                console.error(err);
            })
    }, []);
   
    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <h1>Users</h1>
            
            <ul>
                {users.map(joinedUser => (
                    <p key={joinedUser._id}>{joinedUser.userName}</p>
                ))}
                {blocked.map(block => (
                    <p key={block._id}><b>{block.userName}</b></p>
                ))}

            </ul>

        </div>
    )
}


