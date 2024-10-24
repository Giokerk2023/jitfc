import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import './App.css';
import Section from './components/Section';
import Home from './pages/Home';
import Register from './pages/Register';
import DepartmentHome from './pages/department/DepartmentHome';
import Profile from './pages/department/Profile';
import MainLayout from './components/layout/MainLayout';
import StakeholderTest from './components/stakeholder/StakeholderTest';

function App() {
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
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<LandingContent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/department" element={<DepartmentHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/test" element={<StakeholderTest />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;