import { useState, useEffect } from 'react';
import axios from 'axios';

export const BlockButton = ({report, disabled, handleIgnore}) => {
    const [buttonState, setButtonState] = useState('block'); // 'block' or 'cancel'
    const [countdown, setCountdown] = useState(3);

    const blockUser = () => {
        //remove user from notbanned members to blocked and banned members
        axios.post(`http://localhost:5000/subgreddiits/block_user/${report.reportedIn}/${report.reportedUser}`,JSON.stringify({}), {
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
    var buttonText = buttonState === 'block' ? 'Block' : `Cancel in ${countdown} secs`;
    useEffect(() => {
        if (countdown === 0 && buttonState === 'cancel') {
            blockUser()
            buttonText="Blocked"
        }

        else if (buttonState === 'cancel' && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [buttonState, countdown]);

    const handleButtonClick = () => {
        if (buttonState === 'block') {
            setButtonState('cancel');
        } else {
            setButtonState('block');
            setCountdown(3);
        }
    };

    return <button disabled={disabled} onClick={handleButtonClick}>{buttonText}</button>;
}