import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect } from "react";
import { FormInput } from "../common/FormInput"
import { Button } from "../common/Button"
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import { MySubgreddiitCard } from "./mySubGreddiitCard";
// import { FormInput} from "../common/FormInput"

// let User = require('../../../server/models/user');

export const MySubGreddiits = ({ user, setUser }) => {

    const [showForm, setShowForm] = useState(false); // useState hook with initial value false
    const [subgreddiits, setSubgreddiits] = useState([]);
    const [loading, setLoading] = useState(true);

    //creating the field variables
    const [name, setName] = useState('');
    const [descrip, setDescrip] = useState('');
    const [bannedKey, setBannedKey] = useState('');
    const [tags, setTags] = useState('');
    //error variables
    const [nameError, setNameError] = useState('');

    //defining variable to control button
    let isDisabled = name.length == 0;

    const userId = user._id;

    //defining functions to handle changes
    const handleNameChange = (event) => {
        //updating Name
        setName(event.target.value);
        setNameError("");
    }

    const handleDescripChange = event => {
        //updating Description
        setDescrip(event.target.value);
    }

    const handleBannedKeyChange = event => {
        //updating Banned Keywords
        setBannedKey(event.target.value.split(",").map(key => key.trim()));
    }

    const handleTagsChange = event => {
        //updating Tags
        //        setTags(event.target.value);
        setTags(event.target.value.split(",").map(tag => tag.trim()));
    }

   

    useEffect(() => {

        axios.get('http://localhost:5000/subgreddiits/my', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("successful api call")
                setSubgreddiits(res.data);
                setLoading(false)
            })
            .catch(err => {
                console.log("Problem getting subgreddiit")
                console.error(err);
            });
        // console.log("inside useeffect")
        // console.log("first useeffect:", subgreddiits)
    }, []);

    if (loading) {
        return <h1>Loading</h1>
    }
    // console.log("after loading:", subgreddiits)
    
    const handleClick = () => { // Function to handle button click
        setShowForm(true); // When button is clicked, change showForm value to true
    }
    //handling submit
    const handleSubmit = event => {
        event.preventDefault();
        // const tag_string= (JSON.stringify(tags)).split(",")
        // console.log(string)
        // console.log("user id",user._id)
        const data = { name, descrip, bannedKey, tags, userId };
        console.log(data)
        console.log(JSON.stringify(data))
        // console.log(localStorage.getItem('token'))
        // console.log(typeof localStorage.getItem('token'))
        axios.post('http://localhost:5000/subgreddiits/add', JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            // .then(res => {
            //     console.log(res.data);
            // })
            // .then(response => res.json())
            // .then(newSubgreddiit => {
            //     setSubgreddiits([...subgreddiits, newSubgreddiit]);})   
            .then(res => {
                console.log("subgreddiit added")
                const data = { newSubgreddiit: res.data.subgreddiitID};
                //add subgreddiit to created subgreddiits too
                axios.post('http://localhost:5000/users/add_created_sub/'+userId, JSON.stringify(data), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                    .then(res => {
                        console.log("subgreddiit added to created subgreddiits")
                    })
                    .catch(err => {
                        console.log("Problem adding subgreddiit to created subgreddiits")
                        console.error(err);
                    }); 
            })
            .catch(err => {
                console.log("Problem adding subgreddiit")
                console.error(err);
            });
    }

    return (
        <div>
            {/* <ul>
                {subgreddiits.map(subgreddiit => (
                    <li key={subgreddiit._id}>{subgreddiit.name}</li>
                ))}
            </ul> */}
            <ul>
                {subgreddiits.map(subgreddiit => (
                    <MySubgreddiitCard key={subgreddiit._id} subgreddiit={subgreddiit} />
                ))}
            </ul>
            {/* <h3>
                {
                    subgreddiits.map(item => item.id)
                }
            </h3> */}

            <button onClick={handleClick}>Add New SubGreddiit</button>
            {showForm &&
                <form onSubmit={handleSubmit}>
                    <FormInput value={name} label="Name" id="name" placeholder="Subgreddiit Name" name="name" type="text" onChange={handleNameChange} />
                    <FormInput value={descrip} label="Description" id="description" placeholder="Subgreddiit Description" name="descrip" type="text" onChange={handleDescripChange} />
                    <FormInput value={tags} label="Tags" id="tags" placeholder="Subgreddiit Tags" type="text" name="tags" onChange={handleTagsChange} />
                    <FormInput value={bannedKey} label="Banned Keywords" id="banned keywords" placeholder="Banned keywords" name="bannedKey" type="text" onChange={handleBannedKeyChange} />
                    <Button type="submit" disabled={isDisabled} text="Submit" />
                </form>

            }
            {/* <a href="/mysubgreddiits/subgredpagemod">Go to sample Subgreddiit in mod view</a> */}
            {/* <Link to="/mysubgreddiits/subgredpagemod"> Go to sample Subgreddiit in mod view </Link> */}
        </div>
    )
}


