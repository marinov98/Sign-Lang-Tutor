import { Grid, makeStyles, Container } from '@material-ui/core';
import { useStyles } from 'src/styles/modulesStyles';

interface GridProps {
  rowSize: number;
  items: any[];
}

const GridLessons: React.FunctionComponent<GridProps> = props => {
  const numRows = Math.ceil(props.items.length / props.rowSize);
  const classes = useStyles();
  return (
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
