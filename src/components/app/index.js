import React, { Component } from 'react';
import './App.css';
import Chart from '../chart';
import FieldPicker from '../field-picker';
import Stepper from '../stepper';
import About from '../about';

class App extends Component {
  constructor() {
    super();
    this.state = {
      NUM_SEASONS: 10,
      FIELD: 'WAR',
      IS_HITTERS: false
    };
  }

  changeParam = (field, value) => {
    this.setState({ [field]: value });
  }

  changeState = (configuration) => {
    this.setState(configuration);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Who&#39;s The Best Baseball Player?</h1>
          <h3>An exploration of the best player performances since 1968</h3>
        </header>
        <div className="container">
          <About />
          <Stepper changeState={ this.changeState } />
          <FieldPicker { ...this.state }  changeParam={ this.changeParam } disabled={ this.state.disabled } />
          <Chart { ...this.state } />
        </div>
      </div>
    );
  }
}

export default App;
