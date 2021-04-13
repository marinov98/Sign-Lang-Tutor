import React, { useEffect, useState } from 'react';
import { IUser } from '../../interfaces/user';
import { getUserInfo } from '../../utils/user';
import { CircularProgress } from '@material-ui/core';

const Account = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [progress, setProgress] = useState<string>('');
  const [lessonsCompleted, setlessonsCompleted] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [dateJoined, setDateJoined] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true)

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

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <div className="text-center">
      {loading ? <CircularProgress size={70} style={{"marginTop": 10}}/> :
      <div style={{"marginTop": 5}}>
        <div>
          <h3>
            {firstName} {lastName}
          </h3>
        </div>
        <br />
        <div>
          <div>Progress: {progress}</div>
          <div>Lessons Completed: {lessonsCompleted}</div>
          <div>Stars: {stars}</div>
          <div>Date Joined: {dateJoined}</div>
        </div>
      </div>
      }
    </div>
  );
};

export default Account;
