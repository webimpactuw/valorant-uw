import React from "react";
import Widget from "./widget";
import './App.css';

function App() {
  const todos = ["Clean bathroom", "Finish CSE HW", "Cook a meal for roommate", "Walk the dog"];

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <ol>
      {todos.map(todo => <todo text={todo} />)}
      </ol>
    </div>
  );
}

export default App;
