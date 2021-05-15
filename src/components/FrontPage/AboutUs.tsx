import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from 'src/utils/auth';
import { Button } from '@material-ui/core';
import sign_lang from './../../images/sign-lang.jpg';

const photoStyle = {
  marginTop: '10px',
  height: '250px',
  width: '250px',
  border: '2px solid',
  borderRadius: '20px'
};

const AboutUs = () => {
  const { authenticated } = useContext(UserContext);
  const history = useHistory();

  return (
    <div className="text-center">
      <img style={photoStyle} src={sign_lang} alt="sign lang img" />
      <br />
      <br />
      <div style={{ margin: '20px', fontWeight: 'bold' }}>
        <p>
          Have you ever wanted to learn Sign Language and don’t know how?
          <br />
          <br />
          Maybe you tried some other method and it didn’t work out. Maybe you
          went to classes but they were too expensive or inflexible.
          <br />
          <br />
          Or maybe you tried YouTube but you didn’t know if you were doing
          anything right.
          <br />
          <br />
          If this sounds like you, then Sign Language Tutor is the answer! Sign
          Language Tutor uses advanced Machine Learning techniques to teach you
          American Sign Language for free! You only need an internet connection
          and a webcam! You get the flexibility of YouTube lessons with feedback
          of in-person classes, all in the same place! So sign up now if you
          already haven't and start your Sign Language journey today!
        </p>
      </div>
      {authenticated ? (
        ''
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push('/register')}
        >
          Make an account
        </Button>
      )}
    </div>
  );
};

export default AboutUs;
