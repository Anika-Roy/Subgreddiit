import { useState } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';

export const ModalPost = ({ user, subgreddiit }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [bannedKeywords, setBannedKeywords] = useState([]);
  const [loading_keywords, setLoadingKeywords] = useState(true);

  useEffect(() => {
    //get banned keywords
    axios.get(`http://localhost:5000/subgreddiits/get_banned_keywords/${subgreddiit._id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        console.log("res.data: ", res.data)
        setBannedKeywords(res.data);
        setLoadingKeywords(false);
      })
      .catch(err => {
        console.error(err);
      });
  }, [])

  if (loading_keywords) {
    <p>Loading...</p>
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const addPostToBackend = (data) => {
    //add post to db
    axios.post('http://localhost:5000/posts/add/', JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        console.log("res.data: ", res.data)
        //append post id to subgreddiit
        const data2 = { postId: res.data._id };
        axios.post('http://localhost:5000/subgreddiits/add_post/' + subgreddiit._id, JSON.stringify(data2), {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
          .then(res => {
            console.log("added post to subgreddiit")
          })
          .catch(err => {
            console.error(err);
          });
        handleClose();
      });
  }

  const handleSubmit = () => {

      console.log(title, content);
      const data = { title, content, postedBy: user.userName, postedIn: subgreddiit._id, creatorId: user._id, creatorName: user.userName, bannedKeywords: bannedKeywords };

      //check if post contains banned keywords
      if (bannedKeywords.some(keyword => title.includes(keyword) || content.includes(keyword))) {
        alert("Your post contains a banned keyword")
      }
      console.log(JSON.stringify(data))
      addPostToBackend(data)
      //append post id to user
      //   const data3 = { postId: res.data._id };
      //   axios.post('http://localhost:5000/users/add_post/' + user._id, JSON.stringify(data3), {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Accept': 'application/json',
      //       'Authorization': 'Bearer ' + localStorage.getItem('token')
      //     }
      //   })
      //     .then(res => {
      //       console.log("added post to user")
      //     })
      //     .catch(err => {
      //       console.error(err);
      //     });
      // })
      // .catch(err => {
      //   console.error(err);
      // });

      // Close the modal

    };
  

  return (
    <div>
      <Button onClick={handleOpen}>Add post</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" component="h2">
            Add a new post to {subgreddiit.name}
          </Typography>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ width: '100%', marginTop: 1 }}
          />
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={4}
            sx={{ width: '100%', marginTop: 1 }}
          />
          <Button onClick={handleSubmit} sx={{ marginTop: 2 }}>Submit</Button>
        </Box>
      </Modal>
    </div>
  );
}