import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button } from "../common/Button"
import { Link } from "react-router-dom";
import { ModalReport } from "./modalReport/modalReport";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ModalComment } from "./modalReport/modalComment";
// import jwt_decode from "jwt-decode";

// let User = require('../../../server/models/user');

export const PostCard = ({ post, user, mode }) => {

    const [subgreddiitName, setSubgreddiitName] = useState("");
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [loading3, setLoading3] = useState(true);
    const [upvote, setUpvote] = useState(post.upvotes.length);
    const [downvote, setDownvote] = useState(post.downvotes.length);
    // const [upvoteDisable, setUpvoteDisable] = useState(false);
    // const [downvoteDisable, setDownvoteDisable] = useState(false);

    // console.log("mode: ", mode)

    //get subgreddiit name
    useEffect(() => {
        console.log("reached useEffect")
        axios.get('http://localhost:5000/subgreddiits/' + post.postedIn, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                // console.log("res.data: ", res.data)
                setSubgreddiitName(res.data.name);
                setLoading1(false)
            })
            .catch(err => {
                console.log("Problem getting subgreddiit")
                console.error(err);
            });
        //get if user has upvoted/downvoted
        // axios.get('http://localhost:5000/posts/check_upvote/' + post._id + '/' + user._id, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'Authorization': 'Bearer ' + localStorage.getItem('token')
        //     }
        // })
        //     .then(res => {
        //         console.log("res.data: ", res.data)
        //         if (res.data) {
        //             setUpvoteDisable(true)
        //             setLoading2(false)
        //         }
        //     })
        //     .catch(err => {
        //         console.log("Problem finding upvote disable status")
        //         console.error(err);
        //     });
        // axios.get('http://localhost:5000/posts/check_downvote/' + post._id + '/' + user._id, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'Authorization': 'Bearer ' + localStorage.getItem('token')
        //     }
        // })
        //     .then(res => {
        //         console.log("res.data: ", res.data)
        //         if (res.data) {
        //             setDownvoteDisable(true)
        //             setLoading3(false)
        //         }
        //     })
        //     .catch(err => {
        //         console.log("Problem finding downvote disable status")
        //         console.error(err);
        //     });

    }, [])

    // if (loading1 || loading2 || loading3) {
    //     return <div>Loading...</div>
    // }
    if(loading1){
        return <div>Loading...</div>
    }
    // console.log(post)
    const handleUpvote = () => {
        console.log("reached upvote")
        axios.post(`http://localhost:5000/posts/upvote/${post._id}/${user._id}`,JSON.stringify({}),{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                alert(res.data)
                if(res.data==='Post upvoted.'){
                    setUpvote(upvote + 1)
                }
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
            });

        // setUpvote(upvote + 1)

        

    }
    const handleDownvote = () => {
        console.log("reached downvote")
        axios.post(`http://localhost:5000/posts/downvote/${post._id}/${user._id}`,JSON.stringify({}), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                alert(res.data)
                if(res.data==='Post downvoted.'){
                    setDownvote(downvote + 1)
                }
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }
    const data1 = { followerId: user._id }
    const data2 = { creatorId: post.creatorId }


    const handleFollow = () => {
        console.log("reached follow")
        //add user to creator's followers
        axios.post('http://localhost:5000/users/add_follower/' + post.creatorId, JSON.stringify(data1), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("follower added")
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
            });

        //adding creator Id to user's following
        axios.post('http://localhost:5000/users/add_following/' + user._id, JSON.stringify(data2), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("following added")
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
            });



    }
    const handleSave = () => {
        console.log("reached save")
        //add post to user's saved posts
        const data3 = { postId: post._id }
        axios.post('http://localhost:5000/users/add_saved_post/' + user._id, JSON.stringify(data3), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                alert("post saved")
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }
    const handleRemove = () => {
        console.log("reached remove")
        //remove post from user's saved posts
        const data3 = { postId: post._id }
        axios.delete(`http://localhost:5000/users/remove_saved_post/${user._id}/${post._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                alert("post removed")
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
            });

    }

    return (
        <div>

            <h2>Title: {post.title}</h2>
            <h2>Created By: {post.postedBy}</h2>
            <ul>
                <li>content --  {post.content}</li>
                {
                    mode === "Remove" ? <li>subgreddiitName: {subgreddiitName}</li> : null
                }
                <li>upvotes -- {upvote}</li>
                <li>downvotes -- {downvote}</li>
                <li>comments -- <ol>{
                        //show comments as a list
                        post.comments.map((comment, index) => {
                            return <li key={index}>{comment}</li>
                        })}
                </ol>
                </li>
            </ul>
            <Button onClick={handleUpvote} text="Upvote" />

            <Button onClick={handleDownvote} text="Downvote" />
            <Button onClick={handleFollow} text="Follow" />
            {
                mode === "Save" ? <Button onClick={handleSave} text="Save" /> : <Button onClick={handleRemove} text="Remove" />
            }
            <ModalReport user={user} post={post} />
            <ModalComment user={user} post={post} />

            {/* <Button onClick={()=> navigate(`/${subgreddiit.name}`)} text="View" /> */}
        </div>


    )
}
