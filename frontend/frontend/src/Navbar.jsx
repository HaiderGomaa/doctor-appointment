import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "./img/logo.png";
import "./Navbar.css";
import { AuthContext } from "./context/AuthContext";

const baseLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
];

const authLinks = [
  { to: "/login", label: "Log In" },
  { to: "/register", label: "Sign Up" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const roleLinks =
    user?.role === "admin"
      ? [
          { to: "/admin/add-doctor", label: "Add Doctor" },
          { to: "/admin/add-department", label: "Add Department" },
        ]
      : user?.role === "user"
        ? [
            { to: "/appointments/new", label: "Book Appointment" },
            { to: "/my-appointments", label: "My Appointments" },
          ]
        : [];
  const links = user
    ? [...baseLinks, ...roleLinks, { to: "/logout", label: "Log Out" }]
    : [...baseLinks, ...authLinks];

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <NavLink
          to="/"
          className="navbar-brand"
          aria-label="Doctor Appointment home"
          onClick={() => setMenuOpen(false)}
        >
          <img src={logo} alt="Doctor Appointment" />
        </NavLink>

        <button
          type="button"
          className={`navbar-menu-toggle${menuOpen ? " is-open" : ""}`}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          id="primary-navigation"
          className={`navbar-links${menuOpen ? " is-open" : ""}`}
        >
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `navbar-link${isActive ? " is-active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
