import React from "react";
import { Link } from "react-router-dom";

const CustomerHeader: React.FC = () => {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/product/1">Example product</Link>
        {" | "}
        <Link to="/cart">Cart</Link>
      </nav>
    </header>
  );
};

export default CustomerHeader;
