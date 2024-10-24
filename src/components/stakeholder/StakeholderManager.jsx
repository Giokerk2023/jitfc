import React from "react";

const StakeholderManager = () => {
  return (
    <div style={{ 
      backgroundColor: 'yellow',
      padding: '40px',
      margin: '20px',
      border: '5px solid red'
    }}>
      <h1 style={{ 
        color: 'red',
        fontSize: '32px',
        textAlign: 'center'
      }}>
        NEW TEST PAGE - IF YOU SEE THIS, ROUTING WORKS!
      </h1>
      <div style={{
        backgroundColor: 'lime',
        padding: '20px',
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: 'blue' }}>This is a very different design to test if changes are working</h2>
        <button 
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '15px 30px',
            fontSize: '20px',
            margin: '20px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
          onClick={() => alert('THIS IS A NEW TEST ALERT!')}
        >
          CLICK THIS NEW TEST BUTTON!
        </button>
      </div>
    </div>
  );
};

export default StakeholderManager;