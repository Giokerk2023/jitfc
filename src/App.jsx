import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Section from './components/Section';
import SimpleTest from './pages/SimpleTest';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Simple Navigation */}
        <nav className="bg-gray-800 text-white p-4">
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/simple-test" className="mr-4">Simple Test</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/simple-test" element={<SimpleTest />} />
          <Route path="/" element={
            <div className="max-w-6xl mx-auto p-8">
              <header className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">YouTube Annotation Extension</h1>
                <p className="text-xl text-gray-600">JIT Fact-Checking Solution</p>
              </header>
              <Section title="Value Propositions" level={1}>
                <Section title="For Content Consumers" level={2}>
                  <ul className="list-disc pl-4">
                    <li>Real-time fact verification while watching</li>
                    <li>Enhanced information accuracy</li>
                    <li>Community-driven truth validation</li>
                  </ul>
                </Section>
                
                <Section title="For Content Creators" level={2}>
                  <ul className="list-disc pl-4">
                    <li>Increased content credibility</li>
                    <li>Automated fact-checking assistance</li>
                    <li>Improved viewer trust</li>
                  </ul>
                </Section>
                <Section title="For Moderators" level={2}>
                  <ul className="list-disc pl-4">
                    <li>Streamlined verification process</li>
                    <li>AI-assisted moderation tools</li>
                    <li>Collaborative fact-checking platform</li>
                  </ul>
                </Section>
              </Section>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;