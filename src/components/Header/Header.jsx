import "./Header.css";

import { Link } from "react-router-dom";

import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";

function Header() {
  return (
    <header className="header">

      <div className="logo">
        <h2>
          ZAID <span>INFOTECH</span>
        </h2>
      </div>

      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/rental">Rental</Link></li>
          <li><Link to="/products">

Products

</Link></li>
          <li><Link to="/blogs">Blogs</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      <div className="header-icons">

        <FaSearch />

        <FaHeart />

        <FaShoppingCart />

        <Link to="/login" className="login-btn">

          <FaUser />

          <span>Login</span>

        </Link>

      </div>

    </header>
  );
}

export default Header;