import {
  Grid,
  makeStyles,
  Container,
  Divider,
  GridSize
} from '@material-ui/core';
import { addListener } from 'node:process';

interface GridProps {
  rowSize: number;
  items: any[];
}

const useStyles = makeStyles(theme => ({
  grid: {
    marginTop: 10
  }
}));

const GridLessons: React.FunctionComponent<GridProps> = props => {
  const numRows = Math.ceil(props.items.length / props.rowSize);
  const classes = useStyles();
  return (
    // <Container className={classes.grid}>
    //   {Array.from(Array(numRows)).map((
    //     // generates array [0..numRows-1]
    //     _,
    //     index
    //   ) => (
    //     <Grid container spacing={2}>
    //       {props.items
    //         .slice(index * props.rowSize, (index + 1) * props.rowSize)
    //         .map((
    //           // generates items on i-th row
    //           x
    //         ) => (
    //           <Grid item key={x.props._id} xs={12} sm={6} md={4} lg={2}>
    //             {x}
    //           </Grid>
    //         ))}
    //     </Grid>
    //   ))}
    // </Container>
    <Container
      maxWidth="xl"
      className={classes.grid}
      key={Math.random().toString(36).substr(2, 9)}
    >
      <Grid container justify="flex-start" spacing={2}>
        {props.items.map((x, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            {x}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GridLessons;
