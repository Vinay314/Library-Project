import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { REMOVE_FROM_CART, INCREASE_QUANTITY, DECREASE_QUANTITY } from '../store/actions';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

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
        <div
            style={{ ...styles.cartItem, ...(isHovered ? styles.cartItemHover : {}) }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={item.image} alt={item.name} style={styles.cartItemImage} />

            <div style={styles.cartItemDetails}>
                <div style={styles.textContainer}>
                    <p style={styles.itemName}>{item.name}</p>
                    <p style={styles.title}>Title: {title}</p>
                    <p style={styles.author}>Author: {author}</p>
                </div>
                <div style={styles.buttonsContainer}>
                    <button onClick={handleDecreaseBook} style={styles.button}>-</button>
                    <button style={styles.quantityButton}>{item.quantity}</button>
                    <button onClick={handleIncreaseBook} style={styles.button}>+</button>
                    <button onClick={handleRemoveBook} style={styles.removeButtonBottom}>Remove</button>
                </div>
            </div>

            
        </div>
    );
};

const styles = {

    cartItem: {
        display: 'flex',
        flexDirection: 'row', // Horizontal layout
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
       /* borderBottom: '1px solid #ddd',*/
        padding: '10px',  // Reduce padding to decrease height
        marginBottom: '10px', // Reduce spacing between items
    },
    cartItemHover: {
        borderRadius: '20px',
        border: '4px solid lightgrey', // Teal border on hover
    },
    parentContainer: {
        display: 'flex',
        flexDirection: 'column',  // Force each item to be in a new line
        width: '100%',
    },

    cartItemImage: {
        width: '80px',
        height: 'auto',
        borderRadius: '5px',
        marginRight: '15px',
    },

    cartItemDetails: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Align text to the left
        flexGrow: 1, // Take remaining space
    },

    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', 
    },

    itemName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
    },

    author: {
        fontSize: '16px',
        color: '#555',
        fontWeight: 'bold',
        marginTop: '4px',
    },

    title: {
        fontSize: '16px',
        color: '#555',
        fontWeight: 'bold',
        marginTop: '4px',
    },

    buttonsContainer: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginLeft: 'auto', // Push to right corner
        marginBottom: '25px',
    },

    button: {
        padding: '8px 12px',
        backgroundColor: '#f0f0f0',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },

    quantityButton: {
        padding: '8px 12px',
        backgroundColor: '#f0f0f0',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
    },

    removeButtonBottom: {
        padding: '6px 10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default CartItem;