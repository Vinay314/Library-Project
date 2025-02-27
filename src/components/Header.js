import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "./Header.css";

import atlascopcogroupimage from "./assets/Atlas-Copco-Group-Logo.png";

const Header = () => {
    const totalQuantity = useSelector((state) =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0)
    );

    const navigate = useNavigate();
    const [loadingSource, setLoadingSource] = useState(null);

    const handleNavigation = (source) => {
        setLoadingSource(source);
        if (window.clearSearch) window.clearSearch();
        setTimeout(() => {
            navigate("/products");
            
        }, 1000); 
    };
    

    return (
        <header className="header">
            <div className="logo-container" onClick={() => handleNavigation("logo")}>
                <img
                    className="atlas-copco-group-icon"
                    src={atlascopcogroupimage}
                    alt="atlascopcogroup"
                />
                {/*{loadingSource === "logo" && (*/}
                {/*    <div className="spinner-border text-primary ms-2" role="status">*/}
                {/*        <span className="visually-hidden">Loading...</span>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>

            <nav>
                <ul>
                    <div className="home-link">
                        <li onClick={() => handleNavigation("home")} className="nav-item">
                            Home{" "}
                            
                        </li>
                    </div>
                    <li>
                        <Link to="/cart" className="cart-link position-relative">
                            <span className="cart-icon">
                                <i className="bi bi-cart2"></i>
                            </span>

                            {totalQuantity >= 0 && (
                                <span className="cart-quantity">{totalQuantity}</span>
                            )}
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
