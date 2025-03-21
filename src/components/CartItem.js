import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { REMOVE_FROM_CART, INCREASE_QUANTITY, DECREASE_QUANTITY } from '../store/actions';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './CartItem.css';

const CartItem = ({ item }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const cartItems = useSelector(state => state.cart.items);
    const cartItem = cartItems.find(cartItem => cartItem.id === item?.id);
    const [isHovered, setIsHovered] = React.useState(false);

    const availableCopies = item?.availableCopies - (cartItem ? cartItem.quantity : 0);

    useEffect(() => {
        fetch(`http://localhost:5198/api/books/${item.id}/title`)
            .then(response => response.text())
            .then(title => setTitle(title))
            .catch(error => console.error('Error fetching title:', error));
    }, [item.id]);

    useEffect(() => {
        fetch(`http://localhost:5198/api/books/${item.id}/author`)
            .then(response => response.text())
            .then(author => setAuthor(author))
            .catch(error => console.error('Error fetching Author:', error));
    }, [item.id]);

    const handleRemoveBook = () => {
        dispatch({
            type: REMOVE_FROM_CART,
            payload: { id: item.id },
        });

        // Retrieve current cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem("cartItems")) || {};

        // Remove the item from cart
        delete storedCart[item.id];

        // Update localStorage
        localStorage.setItem("cartItems", JSON.stringify(storedCart));

        console.log("Updated Cart in handleRemoveBook:", storedCart);

        // Force UI re-render
        setTimeout(() => {
            dispatch({ type: "FORCE_RENDER" });
        }, 100);
    };


    const handleIncreaseBook = () => {
        if (item.quantity < item.availableCopies) {
            dispatch({
                type: INCREASE_QUANTITY,
                payload: { id: item.id }
            });
        } else {
            Swal.fire({
                icon: 'warning',  // Warning icon
                title: 'Oops!',
                text: 'No more available copies',
                confirmButtonText: 'OK',
                timer: 3000,  // Auto-close after 3 seconds
                timerProgressBar: true
            });
        }
    };


    const handleDecreaseBook = () => {
        if (item.quantity > 1) {
            dispatch({
                type: DECREASE_QUANTITY,
                payload: { id: item.id }
            });
        } else {
            handleRemoveBook();
        }
    };

    return (
        //<div
        //    style={{ ...styles.cartItem, ...(isHovered ? styles.cartItemHover : {}) }}
        //    onMouseEnter={() => setIsHovered(true)}
        //    onMouseLeave={() => setIsHovered(false)}
        //>
        //    <img src={item.image} alt={item.name} style={styles.cartItemImage} />

        //    <div style={styles.cartItemDetails}>
        //        <div style={styles.textContainer}>
        //            <p style={styles.itemName}>{item.name}</p>
        //            <p style={styles.title}>Title: {title}</p>
        //            <p style={styles.author}>Author: {author}</p>
        //            <p style={styles.author}>Date of Return: {author}</p>
        //        </div>





        //        <div style={styles.buttonsContainer}>
        //            <button onClick={handleDecreaseBook} style={styles.button}>-</button>
        //            <button style={styles.quantityButton}>{item.quantity}</button>
        //            <button onClick={handleIncreaseBook} style={styles.button}>+</button>
        //            <button onClick={handleRemoveBook} style={styles.removeButtonBottom}>Remove</button>
        //        </div>
        //    </div>


        //</div>

        //<div
        //    className={`inner-cart-item ${isHovered ? 'cart-item-hover' : ''}`} // Apply CSS class for hover effect
        //    onMouseEnter={() => setIsHovered(true)}
        //    onMouseLeave={() => setIsHovered(false)}
        //>

        <div className="inner-cart-item">


            {/* Book Image */}
            <img src={item.image} alt={item.name} className="cart-item-image" />

            <div className="cart-item-details">
                {/* Book Information */}
                <div className="text-container">
                    <p className="item-name">{item.name}</p>
                    <p className="title">Title: {title}</p>
                    <p className="author">Author: {author}</p>
                    <p className="date-info">Date of Return: {author}</p> {/* Applied date-info class */}
                </div>

                {/* Action Buttons */}
                <div className="buttons-container">
                    <button onClick={handleDecreaseBook} className="button">-</button>
                    <button className="quantity-button">{item.quantity}</button>
                    <button onClick={handleIncreaseBook} className="button">+</button>
                    <button onClick={handleRemoveBook} className="remove-button">Remove</button>
                </div>
            </div>


        </div>
    );
};

//const styles = {
//    cartItem: {
//        display: 'flex',
//        flexDirection: 'row',
//        alignItems: 'center',
//        justifyContent: 'center',
//        width: '100%', // Changed from 190% to 100% for better layout
//        padding: '15px', // Kept a single padding definition
//        marginBottom: '10px', // Unified the marginBottom property
//        borderRadius: '10px',
//        height: '100%',
//        backgroundColor: 'white',
//        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)', // Soft shadow
//        border: '1px solid #ddd', // Light border
//    },


  

//    cartItemImage: {
//        width: '70px', // Reduced image size
//        height: 'auto',
//        borderRadius: '5px',
//        marginRight: '25px', // Increased spacing between image and details
//    },
//    cartItemDetails: {
//        display: 'flex',
//        flexDirection: 'row',
//        alignItems: 'center',
//        justifyContent: 'space-between',
//        flexGrow: 1,
//        gap: '30px', // Increased gap between details and buttons
//    },
//    textContainer: {
//        display: 'flex',
//        flexDirection: 'column',
//        alignItems: 'flex-start',
//    },
//    buttonsContainer: {
//        display: 'flex',
//        flexDirection: 'row',
//        alignItems: 'center',
//        justifyContent: 'center',
//        gap: '15px', // Increased spacing between buttons
//    },
//    button: {
//        padding: '8px 12px',
//        backgroundColor: '#f0f0f0',
//        color: '#333',
//        border: '1px solid #ccc',
//        borderRadius: '5px',
//        cursor: 'pointer',
//        fontSize: '16px',
//        transition: 'background-color 0.3s ease',
//    },
//    quantityButton: {
//        padding: '8px 12px',
//        backgroundColor: '#f0f0f0',
//        color: '#333',
//        border: '1px solid #ccc',
//        borderRadius: '5px',
//        fontSize: '16px',
//    },
//    removeButtonBottom: {
//        padding: '8px 12px', // Increased button padding
//        backgroundColor: '#dc3545',
//        color: 'white',
//        border: 'none',
//        borderRadius: '5px',
//        cursor: 'pointer',
//        fontSize: '14px',
//        marginleft: '62px',
//    },
//};


export default CartItem;