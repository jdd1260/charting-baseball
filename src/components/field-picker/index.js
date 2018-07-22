import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/lab/Slider';

import { fieldAndSortingOptions } from '../../utils/fields';

import './index.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 75
  },
  select: {
    display: 'block',
    'width': '80%',
    margin: 'auto',
    'text-align': 'left',
    'margin-top': 20
  },
  slider: {
    width: '80%',
    margin: 'auto'
  }
});

class FieldPicker extends Component {
  static propTypes = {
    NUM_SEASONS: PropTypes.number.isRequired,
    FIELD: PropTypes.string.isRequired,
    IS_HITTERS: PropTypes.bool.isRequired,
    changeParam: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    disabled: PropTypes.bool
  };

  changeNumSeasons = (event, value) => {
    this.props.changeParam('NUM_SEASONS', value);
  }

  changeIsHitters = (event) => {
    this.props.changeParam('IS_HITTERS', Boolean(event.target.value));
    this.props.changeParam('FIELD', 'WAR');
  }

  changeField = (event) => {
    this.props.changeParam('FIELD', event.target.value);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={ "field-picker row text-center" + classes.root }>
        <Grid container spacing={24}>
          <Grid item xs>
            <Paper className={classes.paper}>
              Season Span
              <Slider
                className={classes.slider}
                value={ this.props.NUM_SEASONS }
                min={ 1 }
                max={ 22 }
                step={1}
                disabled={ this.props.disabled }
                onChange={ this.changeNumSeasons } />
                { this.props.NUM_SEASONS }
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper}>
              Statistic
              <div>
                <Select
                  value={ this.props.FIELD }
                  onChange={ this.changeField }
                  className={ classes.select }
                  disabled={ this.props.disabled }
                >
                  { Object.keys(fieldAndSortingOptions[this.props.IS_HITTERS ? 'hitters' : 'pitchers']).map(field => (
                    <MenuItem key={ field } value={ field }>{ field }</MenuItem>
                  ))}
                </Select>
              </div>
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper}>
              Player Type
              <div>
                <Select
                  value={ this.props.IS_HITTERS ? 1 : 0 }
                  onChange={ this.changeIsHitters }
                  className={ classes.select }
                  disabled={ this.props.disabled }
                >
                  <MenuItem value={ 1 }>Hitters</MenuItem>
                  <MenuItem value={ 0 }>Pitchers</MenuItem>
                </Select>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(FieldPicker);
