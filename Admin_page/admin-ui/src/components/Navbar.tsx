import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4">
      {/* Replace the Payments link (or button) with a Link (or button) that navigates to /payments. For example, if the Payments link is rendered as a button (or a div) with an onClick (or a "to" prop) (for example, "<button onClick={() => {}}>Payments</button>"), change it to: */}
      <Link to="/payments" className="text-gray-600 hover:text-primary-600 transition">Payments</Link>
    </div>
  );
};

export default Navbar; 