const router = require('express').Router();
let User = require('../models/user');
let Subgreddiit=require('../models/subgreddiit');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware.js');
const mongoose = require('mongoose');

//viewing all users
router.route('/').get(verifyToken, (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

//adding new user
router.route('/add').post((req, res) => {
    const userName = req.body.userName;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const email = req.body.email;
    const contactNo = Number(req.body.contactNo);
    const age = Number(req.body.age);

    const newUser = new User({
        userName,
        firstName,
        lastName,
        password,
        email,
        contactNo,
        age,
    });

    newUser.save()
        .then(() => {
            // res.json('User added!')
            const user = { ...newUser._doc };
            console.log({ user })
            const token = jwt.sign({ id:newUser._id,_doc: user }, 'secret_key_lmao_will_make_it_longer', { expiresIn: '1h' });
            res.json({
                message: 'Signup successful!',
                token: token
            });
        })
        .catch (err => res.status(400).json('Error: ' + err));
    // Generate a JWT
    // const token = jwt.sign({ userName }, 'secret_key_lmao_will_make_it_longer', { expiresIn: '1h' });

    // // Send the JWT to the client
    // res.json({
    //     message: 'Signup successful!',
    //     token: token
    // });
    
});

//logging in user
// router.route('/login').post(async (req, res) => {
router.post('/login', async (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;

    // console.log("reached login backend")
    // console.log(typeof ({ userName }))
    // console.log(typeof ({ password }))
    //checking password

    // const user=
    User.findOne({ userName: userName }, function (err, user) {
        if (err) throw err;
        // console.log("reached inside findOne")
        // test a matching password
        user.comparePassword(password, function (err, isMatch) {
            if (err) throw err;
            console.log({ password }, isMatch); // -> Password123: true
            if (isMatch) {
                //creating token
                user.password = undefined;
                const payload = { id: user._id, ...user }
                const token = jwt.sign(payload, 'secret_key_lmao_will_make_it_longer', { expiresIn: '12h' });

                // Send the JWT to the client
                res.json({
                    message: 'login successful!',
                    token: token
                });
            }
        });
    });
});


//viewing user by id
router.route('/:id').get(verifyToken, (req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

//deleting user by id
router.route('/:id').delete(verifyToken, (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// //appending created subgreddiit
// router.route('/add_sub/:userId').post(verifyToken, (req, res) => {
//     User.findById(req.params.userId)
//         .then(user => {
//             user.joinedSubGreddiits.push(mongoose.Types.ObjectId(req.body.SubgreddiitId));
//             user.save()
//                 .then(() => res.json('Subgreddiit added!'))
//                 .catch(err => res.status(400).json('Error: ' + err));
//         })
//         .catch(err => res.status(400).json('Error: ' + err));
// });

//appending created subgreddiit
router.route('/add_created_sub/:userId').post(verifyToken, (req, res) => {
    // console.log("subgreddiitId: " , req.body.newSubgreddiit)
    User.findById(req.params.userId)
        .then(user => {
            //add subgreddiit to joined subgreddiits
            user.joinedSubGreddiits.push(mongoose.Types.ObjectId(req.body.newSubgreddiit));
            console.log("joinedsubgreddiit", user.joinedSubGreddiits)
            //add subgreddiit to created subgreddiits
            user.createdSubGreddiits.push(mongoose.Types.ObjectId(req.body.newSubgreddiit));
            user.save()
                .then(() => res.json('Subgreddiit added!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
//appending created post
router.route('/add_post/:userId').post(verifyToken, (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            user.createdPosts.push(mongoose.Types.ObjectId(req.body.PostId));
            user.save()
                .then(() => res.json('Post added!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
//delete created post
router.route('/delete_post/:postId/:userId').delete(verifyToken, (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            user.createdPosts.pull(mongoose.Types.ObjectId(req.params.postId));
            user.save()
                .then(() => res.json('Post deleted!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//appending joined subgreddiit
router.route('/add_joined_sub/:reqUserId/:subgredId').post(verifyToken,(req, res) => {
    User.findById(req.params.reqUserId)
        .then(user => {
            user.joinedSubGreddiits.push(mongoose.Types.ObjectId(req.params.subgredId));
            user.save()
                .then(() => res.json('Subgreddiit added!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
});
//get usernames of followers
router.route('/get_followers/:userId').get(verifyToken, (req, res) => {
    console.log("reached get followers")
    User.findById(req.params.userId)
        .then(user => {
            console.log(user.followers)
            User.find({ _id: { $in: user.followers } })
                .then(users => {
                    res.json(users)
                    console.log(users)
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
});

//get usernames of following
router.route('/get_following/:userId').get(verifyToken, (req, res) => {
    console.log("reached get following")
    User.findById(req.params.userId)
        .then(user => {
            console.log("user.following", user.following)
            User.find({ _id: { $in: user.following } })
                .then(users => {
                    res.json(users)
                    console.log(users)
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
});

//updating user by id
router.route('/update/:id').put(verifyToken, (req, res) => {

    const filter = { _id: req.params.id };
    const update = {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            contactNo: req.body.contactNo,
        }
    };

    User.updateOne(filter, update)
        .then(result => {
            console.log(`Modified  document!`);
            console.log(result)
        })
        .catch(error => {
            console.log(error);
        });



    // User.findById(req.params.id)
    //     .then(user => {
    //         user.userName = req.body.userName;
    //         user.password = req.body.password;
    //         user.email = req.body.email;
    //         user.save()
    //             .then(() => res.json('User updated!'))
    //             .catch(err => res.status(400).json('Error: ' + err));
    //     })
    //     .catch(err => res.status(400).json('Error: ' + err));


});

//add follower
router.route('/add_follower/:creatorId').post(verifyToken, (req, res) => {
    // console.log(req.body)
    User.findById(req.params.creatorId)
        .then(user => {
            user.followers.push(mongoose.Types.ObjectId(req.body.followerId));
            user.save()
                .then(() => res.json('Follower added!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//add following
router.route('/add_following/:userId').post(verifyToken, (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            user.following.push(mongoose.Types.ObjectId(req.body.creatorId));
            user.save()
                .then(() => res.json('Following added!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//remove follower
router.route('/remove_follower/:userId/:followerId').delete(verifyToken, (req, res) => {
    console.log("reached remove follower")
    User.findById(req.params.userId)
        .then(user => {
            user.followers.pull(mongoose.Types.ObjectId(req.params.followerId));
            user.save()
                .then(() => res.json('Follower removed!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//remove following:)
router.route('/remove_following/:followerId/:userId').delete(verifyToken, (req, res) => {
    User.findById(req.params.followerId)
        .then(user => {
            user.following.pull(mongoose.Types.ObjectId(req.params.userId));
            user.save()
                .then(() => res.json('Following removed!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//appending saved post
router.route('/add_saved_post/:userId').post(verifyToken, (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            user.savedPosts.push(mongoose.Types.ObjectId(req.body.postId));
            user.save()
                .then(() => res.json('Post saved!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//removing saved post
router.route('/remove_saved_post/:userId/:postId').delete(verifyToken, (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            user.savedPosts.pull(mongoose.Types.ObjectId(req.params.postId));
            user.save()
                .then(() => res.json('Post unsaved!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//leave subgreddiit
router.route('/leave_subgreddiit/:userId/:subgreddiitId').delete(verifyToken,(req, res) => {
    console.log("reached leave subgreddiit")
    User.findById(req.params.userId)
        .then(user => {
            user.joinedSubGreddiits.pull(mongoose.Types.ObjectId(req.params.subgreddiitId));
            user.save()
                .then(() => res.json('removed from user joined subgreds!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

// router.route('/:id').get((req, res) => {
//     Exercise.findById(req.params.id)
//         .then(exercise => res.json(exercise))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// router.route('/:id').delete((req, res) => {
//     Exercise.findByIdAndDelete(req.params.id)
//         .then(() => res.json('Exercise deleted.'))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// router.route('/update/:id').post((req, res) => {
//     Exercise.findById(req.params.id)
//         .then(exercise => {
//             exercise.username = req.body.username;
//             exercise.description = req.body.description;
//             exercise.duration = Number(req.body.duration);
//             exercise.date = Date.parse(req.body.date);

//             exercise.save()
//                 .then(() => res.json('Exercise updated!'))
//                 .catch(err => res.status(400).json('Error: ' + err));
//         })
//         .catch(err => res.status(400).json('Error: ' + err));
// });

