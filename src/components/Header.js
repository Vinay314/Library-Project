import React from 'react';
import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import './Header.css'; 


import cartImage from './assets/cart.png';  

const Header = () => {
    
    const totalQuantity = useSelector(state =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0)
    );

    return (
        <header className="header">
            <h1 className="logo">Atlas Copco Group</h1>
            <nav>
                <ul>
                    
                    <li><Link to="/products">Home</Link></li>
                    <li>
                        <Link to="/cart" className="cart-link">
                            <img src={cartImage} alt="Cart" className="cart-icon" />
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
