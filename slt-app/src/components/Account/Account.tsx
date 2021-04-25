import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, CircularProgress } from '@material-ui/core';
import { IUser } from 'src/interfaces/user';
import { getUserInfo } from 'src/utils/user';
import { removeUser } from 'src/utils/user';
import { resetProgress } from 'src/utils/lessons';
import { UserContext, logout } from 'src/utils/auth';

const styles_parent = {
  borderStyle: 'outset',
  padding: '10px',
  marginLeft: '100px',
  marginRight: '100px',
  verticalAlign: 'middle'
};

const styles_inner = {
  borderStyle: 'dotted',
  marginTop: '5px'
};

const button_styles = {
  margin: '10px'
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
  const history = useHistory();

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

  const handleDelete = async () => {
    const msg =
      'Would you like to delete your lessons? (Lessons are used to get feedback on well people using the application are doing.';
    const msg2 = 'Are you sure? Final warning before all data is deleted.';
    let removeLessons = false;

    if (window.confirm(msg)) {
      removeLessons = true;
    }

    if (window.confirm(msg2)) {
      await removeUser(removeLessons);
      await logout();
      checkAuth();
    }
  };

  const handleReset = async () => {
    const msg = 'Are you sure? All accomplishments will be removed...';
    if (window.confirm(msg)) {
      await resetProgress();
      history.push('/');
    }
  };

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <div className="text-center" style={{ border: '3px' }}>
      {loading ? (
        <CircularProgress size={70} style={{ marginTop: 10 }} />
      ) : (
        <div style={styles_parent}>
          <div style={styles_inner}>
            <div>
              <h3 style={{ borderStyle: 'inset', margin: '20px' }}>
                {firstName} {lastName}
              </h3>
            </div>
            <br />
            <div>
              <div
                style={{ borderStyle: 'outset', margin: '10px 50px 10px 50px' }}
              >
                <h4 style={{ textAlign: 'left', textIndent: '20px' }}>
                  Accomplishments
                </h4>
                <div>Lessons Completed: {lessonsCompleted}</div>
                <div>Stars: {stars}</div>
              </div>
              <div
                style={{ borderStyle: 'outset', margin: '10px 50px 10px 50px' }}
              >
                <h4 style={{ textAlign: 'left', textIndent: '20px' }}>
                  Experience
                </h4>
                <div>Progress: {progress}</div>
                <div>Date Joined: {dateJoined}</div>
              </div>
            </div>
            <Button
              variant="contained"
              style={button_styles}
              color="primary"
              onClick={handleReset}
            >
              Reset Progress
            </Button>
            <Button
              variant="contained"
              style={button_styles}
              color="secondary"
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
