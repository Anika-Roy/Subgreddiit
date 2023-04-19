import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect } from "react";
import { FormInput } from "../common/FormInput"
import { Button } from "../common/Button"
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ModalPost } from "./modalPost";
import { PostCard } from "./postCard";
import img from "../random_img.jpg";

// import { FormInput} from "../common/FormInput"

// let User = require('../../../server/models/user');

export const SubGredPageView = ({ user }) => {

    const { subgredId } = useParams();
    const [subgreddiit, setSubgreddiit] = useState({});
    const [posts, setPosts] = useState([]);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/subgreddiits/'+ subgredId, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("subgreddiit: ", res.data)
                setSubgreddiit(res.data);
                setLoading1(false)
            })
            .catch(err => {
                console.log("Problem getting subgreddiit")
                console.error(err);
            });
        //get created posts in this subgreddiit
        axios.get('http://localhost:5000/subgreddiits/get_all_posts/'+ subgredId, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("res.data: ", res.data)
                setPosts(res.data);
                setLoading2(false)
            })
            .catch(err => {
                console.log("Problem getting subgreddiit")
                console.error(err);
            });




        // console.log("inside useeffect")
        // console.log("first useeffect:", subgreddiits)
    }, []);
    // do something with the id
    // console.log(subgredId);
    if (loading1 || loading2) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <h1>Name: {subgreddiit.name}</h1>
            <img src={img} alt="random image"  width="200" height="200"/>
            <h2>Description: {subgreddiit.description}</h2>

            <h3>Posts:</h3>
            
            <ModalPost user={user} subgreddiit={subgreddiit} />
            <ul>
                {posts.map(post => (
                    <PostCard key={post._id} post={post} user={user} mode={"Save"}/>
                ))}
            </ul>

        </div>
    )
}


