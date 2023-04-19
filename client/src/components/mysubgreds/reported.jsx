import React, { useState } from "react"
import axios from 'axios';
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { JoinReqsCard } from "./joinReqsCard"
import { ReportedCard } from "./reportedCard"



// import { FormInput} from "../common/FormInput"

// let User = require('../../../server/models/user');

export const Reported = ({ user }) => {

    const { subgredId } = useParams();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/subgreddiits/get_reports/'+ subgredId, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log("res.data: ", res.data)
                setReports(res.data);
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
            <h1>Reports:(</h1>
            
            <ul>
                {reports.map(report => (
                    <ReportedCard key={report._id} report={report}/>
                ))}
            </ul>

        </div>
    )
}


