import { Container, Row, Col } from 'reactstrap';

interface GridProps {
  rowSize: number;
  items: any[];
}

const Grid: React.FunctionComponent<GridProps> = props => {
  const numRows = Math.ceil(props.items.length / props.rowSize);

  return (
    <Container>
      {Array.from(Array(numRows).keys()).map((
        // generates array [0..numRows-1]
        i
      ) => (
        <Row>
          {props.items.slice(i * props.rowSize, (i + 1) * props.rowSize).map((
            // generates items on i-th row
            x
          ) => (
            <Col> {x} </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};

export default Grid;
