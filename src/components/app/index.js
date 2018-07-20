import React, { Component } from 'react';
import './App.css';
import Chart from '../chart';
import FieldPicker from '../field-picker';

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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Joel&#39;s Baseball Data Visualization</h1>
        </header>
        <div className="container" style={ { padding: '20px 0'} }>
          <FieldPicker { ...this.state }  changeParam={ this.changeParam } />
          <Chart { ...this.state } />
        </div>
      </div>
    );
  }
}

export default App;
