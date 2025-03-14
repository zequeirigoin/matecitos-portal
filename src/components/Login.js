const Login = ({ onLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // ... existing login logic ...
    onLogin();
  };

  // ... rest of the component ...
};