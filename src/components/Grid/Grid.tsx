import { Grid, makeStyles, Container, GridSize } from '@material-ui/core';
import { useStyles } from 'src/styles/modulesStyles';

interface GridProps {
  rowSize: {
    xs: GridSize;
    sm: GridSize;
    md: GridSize;
    lg: GridSize;
  };
  items: any[];
}

const RenderGrid: React.FunctionComponent<GridProps> = props => {
  const classes = useStyles();

  return (
    <Container
      className={classes.grid}
      key={Math.random().toString(36).substr(2, 9)}
    >
      <Grid container justify="flex-start" spacing={2}>
        {props.items.map((x, index) => (
          <Grid
            item
            xs={props.rowSize.xs}
            sm={props.rowSize.sm}
            md={props.rowSize.md}
            lg={props.rowSize.lg}
            key={index}
          >
            {x}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RenderGrid;
