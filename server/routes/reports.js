const router = require('express').Router();
let Report = require('../models/report');
let Subgreddiit=require('../models/subgreddiit');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware.js');
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');

// saving report
router.route('/add').post(verifyToken, (req, res) => {
    // name, descrip, bannedKey, tags
    const concern = req.body.concern;
    const reportedBy = req.body.reportedBy;
    const reportedUser = req.body.reportedUser;
    const reportedPost = req.body.reportedPost;
    const reportedIn = req.body.reportedIn;
    console.log("reached add backend")
    // console.log(userId)
    // console.log(typeof ObjectId(userId))
    const newReport = new Report({
        "concern": concern,
        "reportedBy": reportedBy,
        "reportedUser": reportedUser,
        "reportedPost": reportedPost,
        "reportedIn": reportedIn,
    });
    newReport.save()
        .then((report) => {
            res.json({ reportID: report._id })
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//getting information in a report
router.route('/get_info/:reportId/').get(verifyToken, (req, res) => {
    console.log("reached get post info")
    Report.findById(req.params.reportId)
        .populate('reportedBy', 'userName')
        .populate('reportedUser', 'userName')
        .populate('reportedPost', 'content')
        .exec(function (err, report) {
            if (err) return handleError(err);
            //check if moderator
            Subgreddiit.findById(report.reportedIn)
                .then(subgreddiit => {
                    if (subgreddiit.moderators.includes(req.id)) {
                        res.json(report);
                    } else {
                        res.json("Not a moderator");
                    }
                })  
        });
});

//deleting report by id
router.route('/:id').delete(verifyToken, (req, res) => {
    Report.findByIdAndDelete(req.params.id)
        .then(() => res.json('Report deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

//ignoring a report
router.route('/ignore/:id').post(verifyToken,(req, res) => {
    Report.findById(req.params.id)
        .then(report => {
            report.ignored = true;
            report.save()
                .then((rep) => res.json(rep.ignored))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//viewing by id
router.route('/:id').get(verifyToken,(req, res) => {
    Report.findById(req.params.id)
        .then(report => {
            //check if moderator
            Subgreddiit.findById(report.reportedIn)
                .then(subgreddiit => {
                    if (subgreddiit.moderators.includes(req.id)) {
                        res.json(report);
                    } else {
                        res.json("Not a moderator");
                    }
                })
            // res.json(report);
        })
        .catch(err => res.status(400).json('Error: ' + err));
})




module.exports = router;




