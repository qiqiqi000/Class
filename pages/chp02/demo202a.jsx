import React from 'react';
import { Routes, Route } from 'react-router-dom';

function Demo202() {
  return (
    <div>
      <h1>Home</h1>
      <Routes>
        <Route path="/about" element={React.createElement(require("../chp07/demo701").default)} />
      </Routes>
    </div>
  );
}

function Demo701() {
  return <h1>Demo701</h1>;
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<Demo202 />} />
      <Route key="route_701" path="Page701/*" element={React.createElement(require("../chp07/demo701").default)} />
    </Routes>
  );
}

export default App;