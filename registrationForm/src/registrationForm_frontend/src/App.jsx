
import React, { useState } from 'react';

import { Actor, HttpAgent, Principal } from '@dfinity/agent';
import { idlFactory } from './.dfx/local/canister.did.js';

const agent = new HttpAgent();
const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: Principal.fromText("YOUR_BACKEND_CANISTER_ID_HERE"),
});

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await actor.register_user(username, email);
      setMessage(response);
    } catch (err) {
      console.error(err);
      setMessage('Error occurred while registering user');
    }
  };

  return (
    <div className="App">
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
