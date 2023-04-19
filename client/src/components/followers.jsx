import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FollowerCard } from './followCards/followerCard';

export const Followers = ({ user }) => {

  // const [userIds, setUserIds]= useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  //getting followers from backend
  useEffect(() => {
    axios.get('http://localhost:5000/users/get_followers/' + user._id, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        console.log(res.data);
        setFollowers(res.data);
        setLoading(false);

      })
      .catch(err => {
        console.log("Problem getting followers")
        console.error(err);
      });
  }, []);




  return (
    <div>
      <h1>Followers</h1>
      <ul>
        {followers.map(follower => (
          <FollowerCard key={follower._id} follower={follower} user={user} />
        ))}
      </ul>
    </div>
  );
};
