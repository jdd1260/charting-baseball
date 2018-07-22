import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    width: 1000,
    margin: 'auto'
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  buttons: {
    margin: 'auto'
  }
});

const steps = [
  {
    label: 'Hittters 5 years',
    configuration: {
      IS_HITTERS: true,
      NUM_SEASONS: 5,
      FIELD: 'WAR',
      disabled: true
    }
  },
  {
    label: 'Hittters 15 years',
    configuration: {
      IS_HITTERS: true,
      NUM_SEASONS: 15,
      FIELD: 'WAR',
      disabled: true
    }
  },
  {
    label: 'Pitchers 5 years',
    configuration: {
      IS_HITTERS: false,
      NUM_SEASONS: 5,
      FIELD: 'WAR',
      disabled: true
    }
  },
  {
    label: 'Pitchers 5 years',
    configuration: {
      IS_HITTERS: false,
      NUM_SEASONS: 15,
      FIELD: 'WAR',
      disabled: true
    }
  },
  {
    label: 'Explore',
    configuration: {
      IS_HITTERS: true,
      NUM_SEASONS: 10,
      FIELD: 'HR',
      disabled: false
    }
  },
];

class PhaseStepper extends React.Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0,
    };
  }

  componentDidMount() {
    this.props.changeState(steps[0].configuration);
  }

  totalSteps = () => {
    return steps.length;
  };

  handleNext = () => {
    if (!this.isLastStep()) {
      this.handleStep(this.state.activeStep + 1)();
    }
  };

  handleBack = () => {
    if (this.state.activeStep !== 0) {
      this.handleStep(this.state.activeStep - 1)();
    }
  };

  handleStep = step => () => {
    this.setState({
      activeStep: step,
    });
    this.props.changeState(steps[step].configuration);
  };

  isLastStep() {
    return this.state.activeStep === this.totalSteps() - 1;
  }

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={ 9 }>
              <Stepper nonLinear activeStep={activeStep}>
                { steps.map(({ label }, index) => {
                  return (
                    <Step key={label}>
                      <StepButton
                        onClick={ this.handleStep(index) }
                      >
                        { label }
                      </StepButton>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>
            <Grid item xs={ 3 } className={ classes.buttons }>
              <Button
                disabled={ activeStep === 0 }
                onClick={ this.handleBack }
                className={ classes.button }
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={ this.handleNext }
                className={ classes.button }
                disabled={ this.isLastStep() }
              >
                Next
              </Button>
            </Grid>
        </Grid>
      </div>
    );
  }
}

PhaseStepper.propTypes = {
  classes: PropTypes.object,
  changeState: PropTypes.func.isRequired
};

export default withStyles(styles)(PhaseStepper);
