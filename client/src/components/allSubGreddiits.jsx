import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect } from "react";
import { FormInput } from "../common/FormInput"
import { Button } from "../common/Button"
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import { JoinedSubgreddiitCard } from "./joinedGredCard";
import { NotJoinedSubgreddiitCard } from "./notJoinedGredCard";
import { SearchBar } from "./searchnFilter/searchBar";
import { Tags } from "./searchnFilter/tags";
import { Filter } from "./searchnFilter/filter";
// import { FormInput} from "../common/FormInput"

// let User = require('../../../server/models/user');

export const AllSubGreddiits = ({ user, setUser }) => {

  const [query, setQuery] = useState("");
  const [tags, setTags] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("none");

  const [joinedSubgreddiits, setJoinedSubgreddiits] = useState([]);
  const [allSubgreddiits, setAllSubgreddiits] = useState([]);
  const [notJoinedSubgreddiits, setNotJoinedSubgreddiits] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user._id;

  useEffect(() => {
    // const userId = "your_user_id_here";

    // Get subgreddiits joined by user
    axios
      .get(`http://localhost:5000/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then((res) => {
        const user = res.data;
        const joinedSubgreddiitIds = user.joinedSubGreddiits;

        axios
          .get(`http://localhost:5000/subgreddiits/all`, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          })
          .then((res) => {
            const subgreddiits = res.data;

            // Get subgreddiits joined by user
            const userSubgreddiits = subgreddiits.filter((subgreddiit) =>
              joinedSubgreddiitIds.includes(subgreddiit._id)
            );

            // Get all subgreddiits except those joined by user
            const notJoinedSubgreddiits = subgreddiits.filter(
              (subgreddiit) => !joinedSubgreddiitIds.includes(subgreddiit._id)
            );

            setJoinedSubgreddiits(userSubgreddiits);
            setAllSubgreddiits([...userSubgreddiits, ...notJoinedSubgreddiits]);
            setNotJoinedSubgreddiits(notJoinedSubgreddiits);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });



  }, []);

  if (loading) {
    return <h1>Loading</h1>
  }

  const filterByQuery = (subgreddiits) => {
    return subgreddiits.filter((subgreddiit) => {
      if (subgreddiit === '') {
        return subgreddiit;
      } else if (subgreddiit.name.toLowerCase().includes(query.toLowerCase())) {
        return subgreddiit;
      }
    })
  }

  const filterByTags = (subgreddiits) => {
    return subgreddiits.filter((subgreddiit) => {
      if (tags.length === 0) {
        return subgreddiit;
      } else if (subgreddiit.tags.some(tag => tags.includes(tag))) {
        return subgreddiit;
      }
    })
  }

  const sortSubgreddiits = (subgreddiits, sortCriteria) => {
    switch (sortCriteria) {
      case "name":
        return [...subgreddiits].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      case "#members":
        return [...subgreddiits].sort((a, b) => (b.notBannedMembers.length + b.bannedMembers.length) - (a.notBannedMembers.length + a.bannedMembers.length));
      case "creationDate":
        return [...subgreddiits].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return subgreddiits;
    }
  };
  //handling submit
  // const handleSubmit = event => {
  //     event.preventDefault();

  // }
  // console.log("joined subgreddiits: " + joinedSubgreddiits)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div><SearchBar query={query} setQuery={setQuery} /></div>
      <div><Tags tags={tags} setTags={setTags}/></div>
      <div><Filter sortCriteria={sortCriteria} setSortCriteria={setSortCriteria}/></div>
      <ul>
        {
          sortSubgreddiits(filterByTags(filterByQuery(joinedSubgreddiits)), sortCriteria)
          // filterByTags(filterByQuery(joinedSubgreddiits))
          .map(subgreddiit => (
            <JoinedSubgreddiitCard key={subgreddiit._id} subgreddiit={subgreddiit} userId={userId} />
          ))}
      </ul>

      <ul>
        {
          sortSubgreddiits(filterByTags(filterByQuery(notJoinedSubgreddiits)), sortCriteria)
          // filterByTags(filterByQuery(notJoinedSubgreddiits))
          .map(subgreddiit => (
            <NotJoinedSubgreddiitCard key={subgreddiit._id} subgreddiit={subgreddiit} userId={userId} />
          ))}
      </ul>

      {/* <Link to="/mysubgreddiits/subgredpageview"> Go to sample Subgreddiit in view </Link> */}
    </div>
  )
}


