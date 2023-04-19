import { useState } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import axios from 'axios';

export const ModalReport = ({ user, post }) => {
  const [open, setOpen] = useState(false);
  const [concern, setConcern] = useState('');
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
  const SubgredId= post.postedIn;
  const handleSubmit = () => {
    // Submit the post to the backend
    const data = { concern, reportedUser :post.creatorId , reportedIn: post.postedIn, reportedBy: user._id, reportedPost: post._id };

    console.log(JSON.stringify(data))
    //add report to db
    axios.post('http://localhost:5000/reports/add/', JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        console.log("res.data: ", res)
        //append report id to subgreddiit
        const data2 = { reportId: res.data.reportID };
        console.log(res.data.reportID)
        axios.post('http://localhost:5000/subgreddiits/add_report/' + SubgredId , JSON.stringify(data2), {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
          .then(res => {
            console.log("added report to subgreddiit")
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.error(err);
      });

    // Close the modal
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}>Add Report</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" component="h2">
            Report Post
          </Typography>
          <TextField
            label="Concern"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            sx={{ width: '100%', marginTop: 1 }}
          />
          <Button onClick={handleSubmit} sx={{ marginTop: 2 }}>Submit</Button>
        </Box>
      </Modal>
    </div>
  );
};