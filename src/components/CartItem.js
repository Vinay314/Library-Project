import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { REMOVE_FROM_CART, INCREASE_QUANTITY, DECREASE_QUANTITY } from '../store/actions';
import { useParams } from 'react-router-dom';

const CartItem = ({ item }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const cartItems = useSelector(state => state.cart.items);
    const cartItem = cartItems.find(cartItem => cartItem.id === item?.id);

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
    };

    const handleIncreaseBook = () => {
        if (item.quantity < item.availableCopies) {
            dispatch({
                type: INCREASE_QUANTITY,
                payload: { id: item.id }
            });
        }
        else {
            alert('No more available copies');
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
        <div style={styles.cartItem}>
            <img src={item.image} alt={item.name} style={styles.cartItemImage} />

            <div style={styles.cartItemDetails}>
                <div style={styles.textContainer}>
                    <p style={styles.itemName}>{item.name}</p>
                    <p style={styles.title}>Title: {title}</p>
                    <p style={styles.author}>Author: {author}</p>
                </div>
            </div>

            <div style={styles.buttonsContainer}>
                <button onClick={handleDecreaseBook} style={styles.button}>-</button>
                <button style={styles.removeButton}>{item.quantity}</button>
                <button onClick={handleIncreaseBook} style={styles.button}>+</button>
            </div>

            <button onClick={handleRemoveBook} style={styles.removeButtonBottom}>Remove</button>
        </div>
    );
};

const styles = {
    cartItem: {
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #ddd',
        padding: '15px 10px',
        marginBottom: '20px', // Space between items
        marginTop: '15px', // Slightly lower the cart item
        position: 'relative',  // Added to position the remove button at the bottom-right
    },
    cartItemImage: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        marginRight: '20px', // More spacing between image and text
        borderRadius: '5px',
    },
    cartItemDetails: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '5px',
    },
    itemName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
    },
    author: {
        fontSize: '16px',
        color: '#555',
        fontWeight: 'bold', // Make author text bold
        marginTop: '4px', // Reduce space between title and author
    },
    title: {
        fontSize: '16px',
        color: '#555',
        fontWeight: 'bold', // Make title text bold
        marginTop: '4px', // Reduce space between title and author
    },
    buttonsContainer: {
        display: 'flex',
        gap: '10px', // Space between buttons
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
    removeButton: {
        padding: '8px 12px',
        backgroundColor: '#f0f0f0',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    removeButtonBottom: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        padding: '8px 12px',
        backgroundColor: '#dc3545', // Red color
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
};

// Hover effect
styles.removeButtonBottom[':hover'] = {
    backgroundColor: '#c82333', // Darker red on hover
};

export default CartItem;
