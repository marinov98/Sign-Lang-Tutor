import React, { useContext, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';

interface GridProps {
  rowSize: number;
  items: any[];
};

const Grid: React.FunctionComponent<GridProps> = (props) => {
  const numRows = Math.ceil(props.items.length / props.rowSize);

  return (
    <Container>
      {
        Array.from(Array(numRows).keys()).map(i => // generates array [0..numRows-1]
          <Row>
            {
              props.items.slice(i * props.rowSize, (i+1) * props.rowSize).map(x => // generates items on i-th row
                <Col> {x} </Col>)
            } 
          </Row>
        )
      }
    </Container>
  );
};

export default Grid;
