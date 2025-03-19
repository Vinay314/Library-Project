import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import atlascopcogroupimage from "./assets/Atlas-Copco-Group-Logo.png";
import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { InteractionRequiredAuthError, InteractionType } from '@azure/msal-browser';

import axios from 'axios';
const Header = ({ searchQuery, setSearchQuery, products }) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { instance, accounts } = useMsal();
    const url = window.location.pathname;
    const [dropdown, setDropdown] = useState(false);

    const [user, setUser] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState();
    const totalQuantity = useSelector((state) =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0)

    );
    const signOutClickHandler = (instance) => {
        const logoutRequest = {
            // account: instance.getAccountByHomeId('homeId'),
           /* postLogoutRedirectUri: "http://localhost:3000/",*/
        };
        instance.logoutPopup(logoutRequest);
    };

    useMsalAuthentication(InteractionType.Redirect);
    function Render() {
        try {
            const username = accounts[0].name;
            const email = accounts[0].username;
            setUser(username);

            localStorage.setItem("username", email);
            const accessTokenRequest = {
                scopes: ["user.read"],
                account: accounts[0],
            };

            instance
                .acquireTokenSilent(accessTokenRequest)
                .then((accessTokenResponse) => {
                    let accessToken = accessTokenResponse.accessToken;

                    const headers = {
                        'Content-Type': 'image/jpeg',
                        "Authorization": `Bearer ${accessToken}`,
                    };

                    //axios.get(
                    //    'https://graph.microsoft.com/v1.0/me/photo/$value',
                    //    {
                    //        headers: headers,
                    //        responseType: 'blob',
                    //    }
                    //).then((res) => {
                    //    const blobUrl = window.URL.createObjectURL(res?.data);
                    //    setImageUrl(blobUrl);
                    //});
                })
                .catch((error) => {
                    if (error instanceof InteractionRequiredAuthError) {
                        instance.acquireTokenRedirect(accessTokenRequest);
                    }
                    console.log(error);
                });
        } catch (e) {
            console.log(e, "-- Error");
        }
    }
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigation = () => {
        setSearchQuery("");
        if (window.clearSearch) window.clearSearch();
        navigate("/products", { replace: true });
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length >= 3) {
            const suggestions = products
                .filter((product) =>
                    product?.title?.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 5);

            setFilteredSuggestions(suggestions);
            setShowSuggestions(suggestions.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    //const handleSelectSuggestion = (product) => {
    //    setSearchQuery(product.title);
    //    setShowSuggestions(false);
    //    navigate(`/products`);
    //};

    // Handle keyboard navigation
    //const handleKeyDown = (e) => {
    //    if (e.key === "ArrowDown") {
    //        setHighlightedIndex((prev) => Math.min(prev + 1, filteredSuggestions.length - 1));
    //    } else if (e.key === "ArrowUp") {
    //        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    //    } else if (e.key === "Enter" && highlightedIndex >= 0) {
    //        handleSelectSuggestion(filteredSuggestions[highlightedIndex]);
    //    }
    //};

    return (
        <header className="header">
            
            <div className="logo-container" onClick={handleNavigation}>
                <img
                    className="atlas-copco-group-icon"
                    src={atlascopcogroupimage}
                    alt="atlascopcogroup"
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '20px', // Increased size
                    fontWeight: 'bold',
                    paddingLeft: '9%', // Moves it more to the right
                    width: '100%',
                }}
            >
                BrainBank Library Project
            </div>

            {/* Search Bar */}
            {/*<div className="search-container" ref={inputRef}>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        className="search-input"*/}
            {/*        placeholder="Search books..."*/}
            {/*        value={searchQuery}*/}
            {/*        onChange={handleSearchChange}*/}
            {/*        onKeyDown={handleKeyDown}*/}
            {/*    />*/}
            {/*    <i className="bi bi-search search-icon"></i>*/}

            {/*    */}{/* Suggestions Dropdown */}
            {/*    {showSuggestions && (*/}
            {/*        <ul className="suggestions-list">*/}
            {/*            {filteredSuggestions.map((product, index) => (*/}
            {/*                <li*/}
            {/*                    key={product.id}*/}
            {/*                    className={`suggestion-item ${index === highlightedIndex ? "highlighted" : ""}`}*/}
            {/*                    onClick={() => handleSelectSuggestion(product)}*/}
            {/*                    onMouseEnter={() => setHighlightedIndex(index)}*/}
            {/*                >*/}
            {/*                    {product.title}*/}
            {/*                </li>*/}
            {/*            ))}*/}
            {/*        </ul>*/}
            {/*    )}*/}
            {/*</div>*/}

            <nav>
                <ul>
                    <div className="home-link">
                        <li onClick={handleNavigation} className="nav-item">
                            <span className="cart-icon">
                                <i class="bi bi-house-door"></i>
                            </span>
                        </li>
                    </div>
                    <li>
                        <Link to="/cart" className="cart-link position-relative">
                            <span className="cart-icon">
                                <i className="bi bi-cart2"></i>
                            </span>

                            {totalQuantity > 0 && (
                                <span className="cart-quantity">{totalQuantity}</span>
                            )}
                        </Link>
                    </li>
                    {/* Profile Dropdown */}
                    <div
                        className="navbar-profile"
                        onClick={() => setDropdown(!dropdown)}
                    >
                        <img
                            src={imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQCX5_wYEa6hyWoqSBOaPbaHw5Ff8Ljp0WcA&usqp=CAU"}
                            alt="Profile"
                        />
                        <div className="navbar-username">
                            <p>{user === "" && Render()} {user || ""}</p>
                        </div>
                        {dropdown && (
                            <div className="navbar-dropdown">
                                <ul>
                                    {window.location.pathname === "/about" ? (
                                        <li onClick={() => navigate("/")}>Home</li>
                                    ) : (
                                        <li onClick={() => navigate("/about")}>About</li>
                                    )}
                                    <li onClick={() => signOutClickHandler(instance)}>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
