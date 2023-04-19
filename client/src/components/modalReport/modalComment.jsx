import { useState } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import axios from 'axios';

export const ModalComment = ({ user, post }) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
//   const [content, setContent] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
  const handleSubmit = () => {
    // Submit the comment to the backend
    const data={comment: comment}
    axios.post('http://localhost:5000/posts/add_comment/'+post._id, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        alert(res.data)
      })
      .catch(err => {
        console.error(err);
      });

    // Close the modal
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}>Add Comment</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" component="h2">
            Add Comment
          </Typography>
          <TextField
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ width: '100%', marginTop: 1 }}
          />
          <Button onClick={handleSubmit} sx={{ marginTop: 2 }}>Submit</Button>
        </Box>
      </Modal>
    </div>
  );
};