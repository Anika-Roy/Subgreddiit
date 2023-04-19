import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button } from "../../common/Button"
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { BlockButton } from "./blockButton"
// import jwt_decode from "jwt-decode";

// let User = require('../../../server/models/user');

export const ReportedCard = ({report}) => {

    const [reportedBy, setReportedBy] = useState('');
    const [reportedUser, setReportedUser] = useState('');
    const [postText, setPostText] = useState('');
    const [loading, setLoading] = useState(true);
    const [ignore, setIgnore] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/reports/get_info/'+ report._id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(report => {
            console.log("reports fetched")
            //getting the reports from the IDs
            console.log(report.data)
            setReportedBy((report.data.reportedBy).userName);
            setReportedUser((report.data.reportedUser).userName);
            setPostText((report.data.reportedPost).content);
            // setLoading(false)
        })
        .catch(err => {
            console.log("error")
            console.error(err);
        });
        //get if the report is ignored
        axios.get('http://localhost:5000/reports/'+ report._id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(report => {
            // console.log("reports fetched")
            //getting the reports from the IDs
            console.log(report.data.ignored)
            setIgnore(report.data.ignored);
            setLoading(false)
        })
        .catch(err => {
            console.log("error")
            console.error(err);
        });
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    }
    
    
    const handleBlock = () => {
        //remove user from notbanned members to blocked and banned members
        axios.post(`http://localhost:5000/subgreddiits/block_user/${report.reportedIn}/${report.reportedUser}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => {
            console.log("user blocked from subgreddiit") 
        })
        .catch(err => {
            console.log("error")
            console.error(err);
        });
        //change name in all posts to "blocked user"
        axios.put(`http://localhost:5000/posts/change_name/${report.reportedUser}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => {
            console.log("user name changed in posts")
        })
        .catch(err => {
            console.log("error")
            console.error(err);
        });
        handleIgnore();
        // //remove user from subgreddiit
        // axios.put(`http://localhost:5000/subgreddiits/remove_user/${report.reportedIn}/${report.reportedUser}`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'Authorization': 'Bearer ' + localStorage.getItem('token')
        //     }
        // })
        // .then(res => {
        //     console.log("user removed from subgreddiit")
        // })
        // .catch(err => {
        //     console.log("error")
        //     console.error(err);
        // });
    }

    const handleDeletePost = () => {
        // delete post from the subgreddiit
        axios.delete(`http://localhost:5000/subgreddiits/delete_post/${report.reportedIn}/${report.reportedPost}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => {
            console.log("post deleted from subgreddiit")
        })
        .catch(err => {     
            console.log("error")
            console.error(err);
        });

        // //delete post from the user
        // axios.delete(`http://localhost:5000/users/delete_post/${report.reportedPost}/${report.creatorId}`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'Authorization': 'Bearer ' + localStorage.getItem('token')
        //     }
        // })
        // .then(res => {
        //     console.log("post deleted from user")
        // })
        // .catch(err => {
        //     console.log("error")
        //     console.error(err);
        // });

        //delete post from the database
        // axios.delete(`http://localhost:5000/posts/${report.reportedPost}`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'Authorization': 'Bearer ' + localStorage.getItem('token')
        //     }
        // })
        // .then(res => {
        //     console.log("post deleted from database")
        // })
        // .catch(err => {
        //     console.log("error")
        //     console.error(err);
        // });

        // delete report from the database
        
        axios.delete(`http://localhost:5000/reports/${report._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => {
            console.log("report deleted from database")
        })
        .catch(err => {
            console.log("error")
            console.error(err);
        });

        // delete report from the subgreddiit
        axios.delete(`http://localhost:5000/subgreddiits/delete_report/${report.reportedIn}/${report._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }})
        .then(res => {
            console.log("report deleted from subgreddiit")
        })
        .catch(err => {
            console.log("error")
            console.error(err);
        });
     }  

    const handleIgnore = () => {
        // set the report to ignore
        axios.post(`http://localhost:5000/reports/ignore/${report._id}`, JSON.stringify({}),{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => {
            console.log("report ignored")
            setIgnore(res.data)
        })
        .catch(err => {
            console.log("error")
            console.error(err);
        });
    }
   

    return (
        <div>

        <h2>Report</h2>
        <ul>
            <li>reported By --  {reportedBy}</li>
            <li>Reported User -- {reportedUser}</li>
            <li>concern -- {report.concern}</li>
            <li>Posted Text -- {postText}</li>
        </ul>
        {/* <Button onClick={handleBlock} disabled={ignore} text="Block" /> */}
        {console.log("report: ",report)}
        <BlockButton report={report} disabled={ignore} handleIgnore={handleIgnore}/>
        <Button onClick={handleDeletePost} disabled={ignore} text="Delete Post" />
        <Button onClick={handleIgnore} disabled={ignore} text="Ignore" />
        </div>


    )
    }
