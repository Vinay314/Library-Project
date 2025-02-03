import React from 'react';
import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import './Header.css'; 


import cartImage from './assets/cart.png';
import atlascopcogroupimage from './assets/atlas_copco_group1.png';

const Header = () => {
    
    const totalQuantity = useSelector(state =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0)
    );

    return (
        <header className="header">
            <img src={atlascopcogroupimage} alt="atlasCopcoGroup" className="atlas-copco-group-icon"></img>
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
