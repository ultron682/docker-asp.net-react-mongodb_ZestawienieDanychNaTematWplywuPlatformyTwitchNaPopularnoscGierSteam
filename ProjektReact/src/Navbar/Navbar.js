import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

const links = [
  { name: "gamePopularity", title: "Popularność gier", url: "/" },
  { name: "genrePopularity", title: "Popularność gatunków", url: "/genrePopularity" },
  { name: "sources", title: "Źródła", url: "/sources" },
];

const Navbar = ({ currentPage }) => {
  const [token, setToken] = useState(null);
  const currectPage = currentPage;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.links}>
        {links.map((link) =>
          link.name === currectPage ? (
            <a key={link.url} href={link.url} className={styles.currentPage}>
              {link.title}
            </a>
          ) : (
            <a key={link.url} href={link.url}>
              {link.title}
            </a>
          )
        )}
      </div>
      <div className={styles.buttons}>
        <Link to="/login">{token === null ? <button className={styles.button}>Zaloguj</button> : null}</Link>
        <Link to="/signup">{token === null ? <button className={styles.button}>Zarejestruj</button> : null}</Link>
        {token !== null ? (
          <button className={styles.button} onClick={handleLogout}>
            Wyloguj
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
