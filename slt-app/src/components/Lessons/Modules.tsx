import React, { useEffect, useState, useContext } from 'react';
import { getModules } from 'src/utils/lessons';

import { Col, Button } from 'reactstrap';
import GridLessons from '../Grid/Grid';
import { makeStyles, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { UserContext, logout } from 'src/utils/auth';

const useStyles = makeStyles(theme => ({
  paper: {
    // height: 100,
    // width: 100,
    padding: theme.spacing(2),
    textAlign: 'center'
  }
}));

interface ModuleProps {
  name: string;
}

const Module: React.FC<ModuleProps> = props => {
  const classes = useStyles();
  return (
    <Link to={`modules/${props.name}`}>
      <Paper elevation={5} className={classes.paper}>
        {props.name}
      </Paper>
    </Link>
  );
};

const Modules = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { checkAuth } = useContext(UserContext);

  const allModules = async () => {
    const modules = await getModules();
    if (modules) {
      if (!modules.msg) {
        setModules(modules);
        setLoading(false);
      } else {
        // remove cookies
        document.cookie.split(';').forEach(c => {
          document.cookie = c
            .replace(/^ +/, '')
            .replace(
              /=.*/,
              '=;expires=' + new Date().toUTCString() + ';path=/'
            );
        });

        // make app redirect to login
        await logout();
        checkAuth();
      }
    } else {
      console.log('Error occured');
    }

    // worst-case safety check
    if (!Array.isArray(modules)) setModules([]);
  };

  useEffect(() => {
    allModules();
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      {loading ? (
        <CircularProgress style={{ marginTop: 20 }} size={90} />
      ) : (
        <GridLessons
          rowSize={3}
          items={modules.map((m, index) => (
            <Module name={m} key={index} />
          ))}
        />
      )}
    </div>
  );
};

export default Modules;
