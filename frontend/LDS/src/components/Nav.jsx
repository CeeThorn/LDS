import React from 'react'
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="navbar">
      {/* Left side: Logo + Title */}
      <div className="nav-brand">
        <div className="logo">LDS</div>
        <span className="brand-text">Legal Document Search</span>
      </div>

      {/* Right side: Links */}
      <ul className="nav-links">
        <li className="nav-item">
          <Link className="nav-link" to="/">
            Search
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/support">
            Support
          </Link>
        </li>
      </ul>
    </nav>
  );
}
