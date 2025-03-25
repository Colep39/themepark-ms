const Unauthorized = () => {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>🚫 Unauthorized</h2>
        <p>You do not have permission to view this page.</p>
        <a href="/">Go back to Login</a>
      </div>
    );
  };
  
export default Unauthorized;