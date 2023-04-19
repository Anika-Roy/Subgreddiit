import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FollowingCard } from './followCards/followingCard';

export const Following = ({user}) => {

  // const [userIds, setUserIds]= useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  //getting followers from backend
  useEffect(() => {
    axios.get('http://localhost:5000/users/get_following/'+user._id, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
        .then(res => {
          console.log(res.data);
          setFollowing(res.data);
          setLoading(false);
          
        })
        .catch(err => {
          console.log("Problem getting following")
          console.error(err);
        });
  }, []);




  return (
    <div>
      <h1>Following</h1>
      <ul>
      {following.map(followee => (
          <FollowingCard key={followee._id} followee={followee} user={user} />
        ))}
      </ul>
    </div>
  );
};
