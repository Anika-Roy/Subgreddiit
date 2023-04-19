import React from 'react';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { EditProfileForm } from './editProfileForm';


export const About = ({ user, setUser }) => {

    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false); // useState hook with initial value false


    const handleClick = () => { // Function to handle button click
        setShowForm(true); // When button is clicked, change showForm value to true
    }

    useEffect(() => {
        axios.get('http://localhost:5000/users/' + user._id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log(res.data);
                setUser(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
        <div>
            <h1>About</h1>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>

                    <tr>
                        <td>First Name:</td>
                        <td>{user.firstName}</td>
                    </tr>
                    <tr>
                        <td>Last Name:</td>
                        <td>{user.lastName}</td>
                    </tr>
                    <tr>
                        <td>User Name:</td>
                        <td>{user.userName}</td>
                    </tr>
                    <tr>
                        <td>Contact:</td>
                        <td>{user.contactNo}</td>
                    </tr>
                    <tr>
                        <td>Mail:</td>
                        <td>{user.email}</td>
                    </tr>
                    <tr>
                        <td>Age:</td>
                        <td>{user.age}</td>
                    </tr>
                    <tr>
                        <td>Followers:</td>
                        <td><Link to="/about/followers" relative="about">
                            {user.followers.length}
                        </Link></td>
                    </tr>
                    <tr>
                        <td>Following:</td>
                        <td><Link to="/about/following" relative="about">
                            {user.following.length}
                        </Link></td>
                    </tr>
                </tbody>
            </table>
            <button onClick={handleClick}>Edit Profile</button>
            {showForm && <EditProfileForm user={user} setUser={setUser} />}
        </div>
    );
}

export default About;