import { createRoot } from "react-dom/client";
import "./index.css";

// Simple test component to verify React is working
function TestApp() {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      background: '#f0f4f8'
    }}>
      <div style={{ 
        background: 'red', 
        padding: '20px',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        WebCeph Test - Direct Component
      </div>
      <button 
        style={{
          background: '#3182ce',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
        onClick={() => alert('React is working!')}
      >
        Click Me
      </button>
    </div>
  );
}

// Directly render the test component without importing from App.tsx
createRoot(document.getElementById("root")!).render(<TestApp />);
