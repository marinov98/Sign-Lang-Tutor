import React, { useEffect, useState } from 'react';
import { getModules } from '../../utils/lessons';
import Grid from '../Grid/Grid';
import { Col, Button } from 'reactstrap';

interface ModuleProps {
  name: string;
};

const Module: React.FC<ModuleProps> = props => {
  return (
    <Col>
      {props.name}
    </Col>
  )
};

const Modules = () => {
  const [modules, setModules] = useState<any[]>([]);

  const allModules = async () => {
    const modules = await getModules();
    if (modules) {
      setModules(modules);
    }
    console.log('Error occured');
  };

  useEffect(() => {
    allModules();
  }, []);

  return <Grid rowSize={3} items={modules.map(m => <Module name={m} />)} />;
};

export default Modules;
