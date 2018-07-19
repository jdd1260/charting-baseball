import React, { Component } from 'react';
import './App.css';
import Chart from '../chart';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Joel's Baseball Data Visualization</h1>
        </header>
        <Chart NUM_SEASONS={ 10 } FIELD="ERA" IS_HITTERS={ false }/>
      </div>
    );
  }
}

export default App;
