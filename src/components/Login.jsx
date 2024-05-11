// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import '../styles/login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('http://localhost:5000/loginUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);
      if (data.data.isAdmin === "true") {
        navigate("/admin", { state: { username } });
      } else {
        navigate('/home', { state: { username } });
      }

      // Redirect or update state as needed after successful login
    } else {
      console.error('Login failed:', response.statusText);
    }
  };

  return (
    <div className="login-container">
      <h1>QUIZ APPLICATION</h1>
      <label htmlFor="username">Username: </label>
      <input
        id="username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password: </label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <a href="/signup">Create New Account</a>
    </div>
  );
}

export default Login;
