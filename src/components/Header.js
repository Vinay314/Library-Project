import React from 'react';
import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import './Header.css'; 
import { useNavigate } from 'react-router-dom';

//import cartImage from './assets/cart.png';
import atlascopcogroupimage from './assets/Atlas-Copco-Group-Logo.png';

const Header = () => {
    
    const totalQuantity = useSelector(state =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0)
    );
    const navigate = useNavigate();

    return (
        <header className="header">
            <img
                className="atlas-copco-group-icon" src={atlascopcogroupimage} onClick={() => navigate(`/products`)} alt="atlascopcogroup" />
            <nav>
                <ul>
                    
                    <li><Link to="/products">Home</Link></li>
                    <li>
                        <Link to="/cart" className="cart-link">
                            <span className="cart-icon"><i class="bi bi-cart2"></i></span>
                            
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
