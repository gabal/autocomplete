import React from 'react';
import Autocomplete from './components/Autocomplete';
import fruits from './data/fruits.js';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Autocomplete data={Array.from(new Set(fruits))} placeholder="Enter a fruit" />
    </div>
  );
}

export default App;
