import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            YouTube Annotation Extension
          </Link>
          <nav className="flex gap-4">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/test" className="hover:text-blue-600">Test Panel</Link>
            <Link to="/department" className="hover:text-blue-600">Department</Link>
            <Link to="/profile" className="hover:text-blue-600">Profile</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;