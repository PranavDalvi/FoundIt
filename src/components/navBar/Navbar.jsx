import React, { useState } from "react"
import Logo from "./assets/Foundit.svg"
import Menu from "./assets/menu.svg"
import Close from "./assets/close.svg"
import "./navbar1Style.css"
import { UserAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
export const Navbar = () => {

    const [clicked, setClicked] = useState(false);
    const { user } = UserAuth();

    const handleClick = () => {
        setClicked(!clicked);
    }

    return (
        <>
            <div className="space-for-nav"></div>
            <nav className="NavbarItems">
                <img className="logo-style" src={Logo} alt="FoundIt!" />
                <div className="navbar-menu" onClick={handleClick}>
                    <img className="menu-icon" src={clicked ? Close : Menu} alt="menu" />
                </div>
                <ul className={clicked ? "nav-menu active" : "nav-menu"}>

                    <li>
                        <Link className="nav-links" to="/">
                            <span>Home</span>
                        </Link>
                    </li>

                    <li>
                        <Link className="nav-links" to={user !== null ? ("/lostform") : ("/login")}>
                            <span>File Lost Form</span>
                        </Link>
                    </li>

                    <li>
                        <Link className="nav-links" to={user !== null ? ("/pastform") : ("/login")}>
                            <span>View Past Form</span>
                        </Link>
                    </li>

                    <li>
                        <a className="nav-links" href="https://gitlab.com/my-web-dev-projects/foundit/-/issues" target="_blank">
                            <span>Support</span>
                        </a>
                    </li>

                    <li>
                        <Link className="nav-links" to="/login">
                            <span>Account</span>
                        </Link>
                    </li>

                </ul>
            </nav>
        </>
    )
}