import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MinimalTest from './pages/MinimalTest';

function App() {
  return (
    <BrowserRouter>
      <div>
        <div style={{ padding: '10px', backgroundColor: 'black', color: 'white' }}>
          <Link to="/" style={{ color: 'white', marginRight: '10px' }}>Home</Link>
          <Link to="/minimal" style={{ color: 'white' }}>Minimal Test</Link>
        </div>

        <Routes>
          <Route path="/minimal" element={<MinimalTest />} />
          <Route path="/" element={
            <div>
              <h1>Home Page</h1>
              <p>This is the home page</p>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;