import React from "react";
import { Link } from "react-router-dom";

const categories = ["Men", "Women", "Kids", "Footwear", "Winterwear", "Sportswear"];

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-primary">
      <div className="max-padd-container py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link to="/" className="bold-22 uppercase font-paci">
              Shoppr <span className="text-secondary bold-28">.</span>
            </Link>
            <p className="mt-4 max-w-sm leading-6">
              Find everyday styles for the whole family, from comfortable basics
              to your next favorite outfit.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="mb-4 font-semibold text-tertiary">Explore</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              <li>
                <Link className="transition hover:text-secondary" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-secondary" to="/collection">
                  All products
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    className="transition hover:text-secondary"
                    to={`/collection/${category.toLowerCase()}`}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 font-semibold text-tertiary">Shop with confidence</h2>
            <p className="max-w-sm leading-6">
              Browse our collections and discover pieces made for comfort,
              quality, and everyday confidence.
            </p>
            <Link
              to="/collection"
              className="mt-5 inline-flex rounded-full bg-tertiary px-5 py-3 text-sm font-medium text-white transition hover:bg-secondary"
            >
              Browse collection
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-300/70 pt-5 text-center text-sm">
          <p>© {new Date().getFullYear()} Shoppr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
