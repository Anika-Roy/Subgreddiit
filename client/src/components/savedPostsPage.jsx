import React, { useState } from "react"
import axios from 'axios';
import { useEffect } from "react";
import { Button } from "../common/Button"
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { PostCard } from "./postCard";

// import { FormInput} from "../common/FormInput"

// let User = require('../../../server/models/user');

export const SavedPostsPage = ({ user }) => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [loading2, setLoading2] = useState(true);
    // const [subgreddiitName, setSubgreddiitName] = useState('');


    useEffect(() => {
        //get user's saved posts
        axios.get('http://localhost:5000/posts/saved/'+ user._id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("res.data: ", res.data)
                setPosts(res.data);
                setLoading(false)
            })
            .catch(err => {
                console.log("Problem getting saved posts")
                console.error(err);
            });
    }, []);
    // do something with the id
    // console.log(subgredId);
    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <h1>Saved Posts</h1>
            <ul>
                {posts.map(post => (
                    <PostCard key={post._id} post={post} user={user} mode={"Remove"}/>
                ))}
            </ul>

        </div>
    )
}


