const router = require('express').Router();
let Post = require('../models/post');
let User = require('../models/user');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware.js');
const ObjectId = require('mongodb').ObjectId;
const mongoose=require('mongoose');
let Subgreddiit=require('../models/subgreddiit')


//appending post 
router.route('/add/').post((req, res) => {
    console.log("userId", req.body.creatorId)
    console.log("subgreddiitId", req.body.postedIn)
    //replace banned keywords in title and content with asterisks

    // const title = req.body.title;
    // const content = req.body.content;
    const title = req.body.title.replace(new RegExp(req.body.bannedKeywords.join('|'), 'gi'), '*');
    const content = req.body.content.replace(new RegExp(req.body.bannedKeywords.join('|'), 'gi'), '*');

    
    const creatorId = req.body.creatorId;
    const postedBy = req.body.postedBy;
    const postedIn = req.body.postedIn;

    const newPost = new Post({
        title,
        content,
        creatorId,
        postedBy,
        postedIn,
    });

    newPost.save()
        .then(() =>
            res.json(newPost))
        .catch(err => res.status(400).json('Error: ' + err));
  });


//deleting post by id
router.route('/:id').delete((req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(() => res.json('Post deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

//change name in all posts to "blocked user"
router.route('/change_name/:userId').put((req, res) => {
    Post.updateMany({creatorId: req.params.userId}, {postedBy: "Blocked User"})
        .then(() => res.json('Post name changed.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

//get saved posts of a user
router.route('/saved/:userId').get((req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            console.log(user.savedPosts)
            Post.find({_id: {$in: user.savedPosts}})
                // .populate('postedIn', 'name')
                .then(posts => {
                    res.json(posts)
                    console.log(posts)
                })
                .catch(err => res.status(400).json('Error: ' + err));
            
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//upvote post
router.route('/upvote/:postId/:userId').post((req, res) => {
    Post.findById(req.params.postId)
        .then(post => {
            if (post.upvotes.includes(req.params.userId)) {
                post.upvotes = post.upvotes.filter(id => id != req.params.userId)
                post.save()
                    .then(() => res.json('Un-upvoted!'))
                    .catch(err => res.status(400).json('Error: ' + err));
            } else {
                post.upvotes.push(req.params.userId)
                post.save()
                    .then(() => res.json('Post upvoted.'))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//downvote post
router.route('/downvote/:postId/:userId').post((req, res) => {
    Post.findById(req.params.postId)
        .then(post => {
            if (post.downvotes.includes(req.params.userId)) {
                post.downvotes = post.downvotes.filter(id => id != req.params.userId)
                post.save()
                    .then(() => res.json('Un-downvoted!'))
                    .catch(err => res.status(400).json('Error: ' + err));
            } else {
                post.downvotes.push(req.params.userId)
                post.save()
                    .then(() => res.json('Post downvoted.'))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//check if user has upvoted post
// router.route('/check_upvote/:postId/:userId').get((req, res) => {
//     Post.findById(req.params.postId)
//         .then(post => {
//             if (post.upvotes.includes(req.params.userId)) {
//                 res.json(true)
//             } else {
//                 res.json(false)
//             }
//         })
//         .catch(err => res.status(400).json('Error: ' + err));
// });

//check downvote
// router.route('/check_downvote/:postId/:userId').get((req, res) => {
//     Post.findById(req.params.postId)
//         .then(post => {
//             if (post.downvotes.includes(req.params.userId)) {
//                 res.json(true)
//             } else {
//                 res.json(false)
//             }
//         })
//         .catch(err => res.status(400).json('Error: ' + err));
// });

//append added comment
router.route('/add_comment/:postId').post((req, res) => {
    // console.log("comment", req.body)
    Post.findById(req.params.postId)
        .then(post => {
            post.comments.push(req.body.comment)
            post.save()
                .then(() => res.json('Comment added.'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});




module.exports = router;




