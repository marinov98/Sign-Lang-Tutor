import React, { useEffect, useState, useContext } from 'react';
import { IUser } from '../../interfaces/user';
import { getUserInfo } from '../../utils/user';
import { CircularProgress } from '@material-ui/core';
import {
Button
} from '@material-ui/core';
import { removeUser } from "../../utils/user"
import { UserContext, logout } from "../../utils/auth"

const styles_parent = {
  "borderStyle": "outset",
  "padding": "10px",
  "marginLeft": "100px",
  "marginRight": "100px",
  "verticalAlign": "middle"
};

const styles_inner = {
  "borderStyle": "dotted",
  "marginTop": "5px"
};

const button_styles = {
  "margin": "10px",
};

const Account = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [progress, setProgress] = useState<string>('');
  const [lessonsCompleted, setlessonsCompleted] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [dateJoined, setDateJoined] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { checkAuth } = useContext(UserContext);

  const userInfo = async () => {
    const user: IUser = await getUserInfo();

    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setProgress(user.progress);
      setlessonsCompleted(user.lessonsCompleted);
      setStars(user.stars);

      let date = new Date(user.dateJoined).toLocaleDateString();
      setDateJoined(date);
      setLoading(false);
      return;
    }

    console.log('Error occured');
  };

  const handleClick = async () => {
    const msg = 'Are you sure? all progress will be lost...'
    if (window.confirm(msg)) {
      await removeUser()
      await logout()
      checkAuth()
    }
  };

  useEffect(() => {
    userInfo();
  }, []);

  return (
      <div className="text-center" style={{"border": "3px"}}>
        {loading ? (
          <CircularProgress size={70} style={{ marginTop: 10 }} />
        ) : (
          <div style={styles_parent}>
            <div style={styles_inner}>
              <div>
                <h3 style={{"borderStyle": "inset", "margin": "20px"}}>
                  {firstName} {lastName}
                </h3>
              </div>
              <br />
              <div>
                <div style={{"borderStyle": "outset", "margin": "10px 50px 10px 50px"}}>
                  <h4 style={{"textAlign": "left", "textIndent": "20px"}}>Accomplishments</h4>
                  <div>Lessons Completed: {lessonsCompleted}</div>
                  <div>Stars: {stars}</div>
                </div>
                <div style={{"borderStyle": "outset", "margin": "10px 50px 10px 50px"}}>
                  <h4 style={{"textAlign": "left", "textIndent": "20px"}}>Experience</h4>
                <div>Progress: {progress}</div>
                <div>Date Joined: {dateJoined}</div>
                </div>
              </div>
              <Button variant="contained" style={button_styles} color="secondary" onClick={handleClick}>Delete Account</Button>
            </div>
          </div>
        )}
      </div>
  );
};

export default Account;
