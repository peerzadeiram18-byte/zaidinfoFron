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

      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <h2>
            ZAID <span>INFOTECH</span>
          </h2>
        </Link>
      </div>

      {/* Navigation */}
   <nav className="navbar">
  <ul>

    <li>
      <Link to="/">Home</Link>
    </li>

    <li>
      <Link to="/shop">Shop</Link>
    </li>

    <li>
      <Link to="/products">Products</Link>
    </li>

    <li>
      <Link to="/rental">Rental</Link>
    </li>

    <li>
      <Link to="/services">Repair Service</Link>
    </li>

    <li>
      <Link to="/categories">Categories</Link>
    </li>

    <li>
      <Link to="/offers">Offers</Link>
    </li>

    <li>
      <Link to="/about">About Us</Link>
    </li>

    <li>
      <Link to="/contact">Contact</Link>
    </li>

  </ul>
</nav>

      {/* Icons */}
     <div className="header-icons">

  <button className="icon-btn">
    <FaSearch />
  </button>

  <Link to="/wishlist" className="icon-btn">
    <FaHeart />
  </Link>

  <Link to="/cart" className="icon-btn">
    <FaShoppingCart />
  </Link>

  <Link to="/login" className="login-btn">
    <FaUser />
    <span>Login / Register</span>
  </Link>

</div>

    </header>
  );
}

export default Header;