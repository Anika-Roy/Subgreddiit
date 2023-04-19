const router = require('express').Router();
let Subgreddiit = require('../models/subgreddiit');
let Report = require('../models/report');
let User = require('../models/user');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware.js');
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
let Post = require('../models/post');

//viewing all subgreddiits
router.route('/all').get(verifyToken, (req, res) => {
    Subgreddiit.find()
        .then(subgreddiits => res.json(subgreddiits))
        .catch(err => res.status(400).json('Error: ' + err));
});

//viewing my subgreddiits
router.route('/my').get(verifyToken, (req, res) => {
    console.log("req.id", req.id)
    Subgreddiit.find({ moderators: { $in: [req.id] } })
        .then(subgreddiits => res.json(subgreddiits))
        .catch(err => res.status(400).json('Error: ' + err));
});

//adding new sub grediit
router.route('/add').post(verifyToken, (req, res) => {
    // name, descrip, bannedKey, tags
    const name = req.body.name;
    const descrip = req.body.descrip;
    const bannedKey = req.body.bannedKey;
    const tags = req.body.tags;
    const userId = req.body.userId;
    // console.log("reached add backend")
    // console.log(userId)
    // console.log(typeof ObjectId(userId))
    const newSubGreddiit = new Subgreddiit({
        "name": name,
        "description": descrip,
        "bannedKeywords": bannedKey,
        "tags": tags,
        "moderators": [mongoose.Types.ObjectId(userId)],
        "notBannedMembers": [mongoose.Types.ObjectId(userId)],
    });

    newSubGreddiit.save()
        .then((subgreddiit) => res.json({ subgreddiitID: subgreddiit._id }))
        .catch(err => res.status(400).json('Error: ' + err));
});

//deleting SubGreddiit by id
router.route('/:id').delete(verifyToken, (req, res) => {
    Subgreddiit.findByIdAndDelete(req.params.id)
        .then(() => res.json('Subgreddiit deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});


//viewing SubGreddiit by id
router.route('/:id').get(verifyToken, (req, res) => {
    Subgreddiit.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

//appending requested user
router.route('/add_requested_user/:SubgreddiitId').post(verifyToken, (req, res) => {
    // console.log(req.body.userId)
    //check if user is banned

    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            // console.log(subgreddiit)
            if ((subgreddiit.bannedMembers).includes(req.body.userId)) {
                res.json("You are banned")
            }
            else {
                subgreddiit.requestedUsers.push(mongoose.Types.ObjectId(req.body.userId));
                // console.log(subgreddiit)
                subgreddiit.save()
                    .then(() => res.json('User added!'))
                    .catch(err => console.log("this didnt work", err));
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));

});

//appending post
router.route('/add_post/:SubgreddiitId').post(verifyToken, (req, res) => {
    // console.log(req.body.postId)
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            subgreddiit.posts.push(mongoose.Types.ObjectId(req.body.postId));
            subgreddiit.save()
                .then(() => res.json('User added!'))
                .catch(err => console.log("this didnt work", err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//viewing all posts in a subgreddiit
router.route('/get_all_posts/:SubGredId').get(verifyToken, (req, res) => {
    //get all posts in that subgreddit whose Ids are in the subgreddiit.posts array

    // console.log(req.params.SubGredId)

    Subgreddiit.findById(req.params.SubGredId)
        .then(subgreddiit => {
            // console.log(subgreddiit.posts)
            Post.find({ _id: { $in: subgreddiit.posts } })
                .then(posts => {
                    res.json(posts)
                    console.log(posts)
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));

});

//getting users of a subgreddiit
router.route('/get_users/:SubgreddiitId').get(verifyToken, (req, res) => {
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            // console.log(subgreddiit.notBannedMembers)
            User.find({ _id: { $in: subgreddiit.notBannedMembers } })
                .select('username')
                .then(users => {
                    res.json(users)
                    // console.log(users)
                })
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//getting requested users of a subgreddiit
router.route('/get_req_users/:SubgreddiitId').get(verifyToken, (req, res) => {
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            // console.log(subgreddiit.requestedUsers)
            User.find({ _id: { $in: subgreddiit.requestedUsers } })
                .then(users => {
                    res.json(users)
                    // console.log("users", users)
                })
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
//getting not banned users of a subgreddiit
router.route('/get_not_banned_users/:SubgreddiitId').get(verifyToken, (req, res) => {
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            // console.log(subgreddiit.notBannedMembers)
            User.find({ _id: { $in: subgreddiit.notBannedMembers } })
                .then(users => {
                    res.json(users)
                    // console.log("users", users)
                })
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
//getting blocked users of a subgreddiit
router.route('/get_blocked_users/:SubgreddiitId').get(verifyToken, (req, res) => {

    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            // console.log(subgreddiit.blockedUsers)
            //check if user is a moderator
            if (subgreddiit.moderators.includes(req.id)) {
                User.find({ _id: { $in: subgreddiit.blockedmembers } })
                    .then(users => {
                        res.json(users)
                        // console.log("users", users)
                    })
            }
            else {
                res.json("you are not a moderator")
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


//adding a report
router.route('/add_report/:SubgreddiitId').post(verifyToken, (req, res) => {
    // console.log(req.body.reportId)
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            subgreddiit.reports.push(mongoose.Types.ObjectId(req.body.reportId));
            subgreddiit.save()
                .then(() => res.json('User added!'))
                .catch(err => console.log("this didnt work", err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//rejecting a user
router.route('/reject_user/:SubgreddiitId/:userId').delete(verifyToken, (req, res) => {
    // console.log(req.body.userId)
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            // console.log(subgreddiit)
            subgreddiit.requestedUsers.pull(mongoose.Types.ObjectId(req.params.userId));
            // console.log(subgreddiit)
            subgreddiit.save()
                .then(() => res.json('User added!'))
                .catch(err => console.log("this didnt work", err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//accepting a user
router.route('/accept_user/:SubgreddiitId/:userId').post(verifyToken, (req, res) => {
    // console.log(req.body.userId)
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            // console.log(subgreddiit)
            subgreddiit.requestedUsers.pull(mongoose.Types.ObjectId(req.params.userId));
            subgreddiit.notBannedMembers.push(mongoose.Types.ObjectId(req.params.userId));
            // console.log(subgreddiit)
            subgreddiit.save()
                .then(() => res.json('User added!'))
                .catch(err => console.log("this didnt work", err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//getting reports of a subgreddiit
router.route('/get_reports/:SubgreddiitId').get(verifyToken, (req, res) => {
    console.log(req.id)
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            // console.log(subgreddiit.reports)
            if (subgreddiit.moderators.includes(req.id)) {
                Report.find({ _id: { $in: subgreddiit.reports } })
                    .then(reports => {
                        // Filter out reports older than 10 days
                        const filteredReports = reports.filter(report => {
                            const ageInMs = Date.now() - report.createdAt.getTime();
                            const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
                            return ageInDays <= 10;
                        });

                        // Delete reports older than 10 days
                        const oldReports = reports.filter(report => {
                            const ageInMs = Date.now() - report.createdAt.getTime();
                            const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
                            return ageInDays > 10;
                        });

                        oldReports.forEach(report => {
                            Report.findByIdAndDelete(report._id)
                                .then(() => console.log(`Deleted report ${report._id}`))
                                .catch(err => console.log(err));
                        });

                        res.json(filteredReports);
                        // console.log("reports", filteredReports);
                    })
            }
            else {
                res.json("you are not a moderator")
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//deleting post from subgreddiit
router.route('/delete_post/:SubgreddiitId/:postId').delete(verifyToken, (req, res) => {
    // console.log(req.body.postId)
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            // console.log(subgreddiit)
            subgreddiit.posts.pull(mongoose.Types.ObjectId(req.params.postId));
            // console.log(subgreddiit)
            subgreddiit.save()
                .then(() => res.json('User added!'))
                .catch(err => console.log("this didnt work", err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//deleting report from Subgreddiit
router.route('/delete_report/:SubgreddiitId/:reportId').delete(verifyToken, (req, res) => {
    // console.log(req.body.postId)
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            // console.log(subgreddiit)
            subgreddiit.reports.pull(mongoose.Types.ObjectId(req.params.reportId));
            // console.log(subgreddiit)
            subgreddiit.save()
                .then(() => res.json('User added!'))
                .catch(err => console.log("this didnt work", err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//remove user from notbanned members to blocked and banned members
router.route('/block_user/:SubgreddiitId/:userId').post(verifyToken, (req, res) => {
    // console.log(req.body.userId)
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            // console.log(subgreddiit)
            subgreddiit.notBannedMembers.pull(mongoose.Types.ObjectId(req.params.userId));
            subgreddiit.bannedMembers.push(mongoose.Types.ObjectId(req.params.userId));
            subgreddiit.blockedmembers.push(mongoose.Types.ObjectId(req.params.userId))
            // console.log(subgreddiit)
            subgreddiit.save()
                .then(() => res.json('User added!'))
                .catch(err => console.log("this didnt work", err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
    //remove joined Subgreddiit from user
    User.findById(req.params.userId)
        .then(user => {
            user.joinedSubGreddiits.pull(mongoose.Types.ObjectId(req.params.SubgreddiitId));
            user.save()
                .then(() => res.json('User added!'))
                .catch(err => console.log("this didnt work", err));
        })
});

//get banned keywords
router.route('/get_banned_keywords/:SubgreddiitId').get(verifyToken, (req, res) => {
    Subgreddiit.findById(req.params.SubgreddiitId)
        .then(subgreddiit => {
            res.json(subgreddiit.bannedKeywords)
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//leaving subgreddiit
router.route('/leave_subgreddiit/:userId/:subgreddiitId').delete(verifyToken, (req, res) => {
    console.log("reached leave subgreddiit")
    Subgreddiit.findById(req.params.subgreddiitId)
        .then(subgreddiit => {
            subgreddiit.notBannedMembers.pull(mongoose.Types.ObjectId(req.params.userId));
            subgreddiit.bannedMembers.push(mongoose.Types.ObjectId(req.params.userId));
            subgreddiit.save()
                .then(() => res.json('Subgreddiit left!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});







module.exports = router;




