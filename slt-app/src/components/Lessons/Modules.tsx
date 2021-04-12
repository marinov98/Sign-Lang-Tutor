import React, { useEffect, useState } from 'react';
import { getModules } from '../../utils/lessons';

import { Col, Button } from 'reactstrap';
import GridLessons from '../Grid/Grid';
import { makeStyles, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';

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
      <Paper className={classes.paper}>{props.name}</Paper>
    </Link>
  );
};

const Modules = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const allModules = async () => {
    const modules = await getModules();
    if (modules) {
      setModules(modules);
      setLoading(false);
    } else {
      console.log('Error occured');
    }

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
          items={modules.map(m => (
            <Module name={m} key={Math.random().toString(36).substr(2, 9)} />
          ))}
        />
      )}
    </div>
  );
};

export default Modules;
