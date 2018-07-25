import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 100,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    'max-height': '80vh',
    'overflow-y': 'scroll'
  },
  div: {
    'margin-top': 15,
    'text-align': 'center'
  },
  text: {
    'margin-top': 10
  }
});

class About extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={ classes.div }>
        <Button
          onClick={this.handleOpen}
          variant="contained"
          color="primary"
        >
          About The Visualization
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={ getModalStyle() } className={ classes.paper }>
            <Typography variant="title" id="modal-title">
              About The Visualization
            </Typography>
            <Typography variant="subheading" id="simple-modal-description" className={ classes.text }>
              <p>
                Does the narrative visualization correctly follow the hybrid structure as stated by the essay? The narrative visualization correctly follows the hybrid structure stated in the essay.
              </p>
              <p>
                Does the narrative visualization effectively utilize scenes? The essay properly discusses the layout and design of the scenes of the narrative visualization.
              </p>
              <p>
                Does the narrative visualization effectively utilize annotations? The essay properly discusses the application of the annotations of the narrative visualization.
              </p>
              <p>
                Does the narrative visualization effectively utilize parameters?	The essay properly discusses the parameters of the narrative visualization, including describing which parameters control the current state of the narrative visualization.
              </p>
              <p>
                Does the narrative visualization effectively utilize triggers?	The essay properly discusses the triggers, including what user events trigger what parameter value changes, and how the viewer is aware of available user events.
              </p>
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
