import React, { Component } from 'react';
import './App.css';
import Chart from '../chart';
import FieldPicker from '../field-picker';
import Stepper, { steps } from '../stepper';
import About from '../about';

class App extends Component {
  constructor() {
    super();
    this.state = {
      ...steps[0].configuration
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
          <h1 className="App-title">Who is The Best Baseball Player?</h1>
          <h3>An exploration of the best player performances since 1968</h3>
        </header>
        <div className="container">
          <About />
          <Stepper changeState={ this.changeState } />
          <FieldPicker { ...this.state }  changeParam={ this.changeParam } disabled={ this.state.disabled }  />
          <Chart { ...this.state } />
        </div>
      </div>
    );
  }
}

export default App;
