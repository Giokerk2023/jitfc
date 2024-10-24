import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Section from './components/Section';
import MinimalTest from './pages/MinimalTest';
import StakeholderTest from './components/stakeholder/StakeholderTest';

function App() {
  // Landing page content as a separate component
  const LandingContent = () => (
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
  );

  return (
    <BrowserRouter>
      <div>
        <nav className="bg-gray-800 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex gap-4">
              <Link to="/" className="hover:text-blue-300">Home</Link>
              <Link to="/minimal" className="hover:text-blue-300">Minimal Test</Link>
              <Link to="/stakeholders" className="hover:text-blue-300">Stakeholder Manager</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/minimal" element={<MinimalTest />} />
          <Route path="/stakeholders" element={<StakeholderTest />} />
          <Route path="/" element={<LandingContent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;