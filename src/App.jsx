// src/App.js

import TextEditor from "./TextEditor";

function App() {
  return (
    <div className="App">
      <header
        style={{ backgroundColor: "#4a90e2", color: "white", padding: "20px" }}
      >
        <h1 style={{ margin: 0 }}>Text Editor</h1>
      </header>
      <main style={{ padding: "20px" }}>
        <TextEditor />
      </main>
    </div>
  );
}

export default App;
