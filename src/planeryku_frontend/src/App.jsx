import React, { useState } from 'react';
import { planeryku_backend } from 'declarations/planeryku_backend';
// import { AuthClient } from "@dfinity/auth-client";
function App() {
  const [greeting, setGreeting] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    planeryku_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });

    return false;
  }

  return (
    <main>
      <div className="text-green-400">HELLO WORLD</div>
    </main>
  );
}

export default App;
