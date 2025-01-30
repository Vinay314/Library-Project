import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/actions';
import { useNavigate } from 'react-router-dom';
import { REMOVE_FROM_CART, INCREASE_QUANTITY, DECREASE_QUANTITY } from '../store/actions';

//import penImage from './assets/edit_pen1.png';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(state => state.cart.items);
    const cartItem = cartItems.find(item => item.id === product?.id);
    const isInCart = cartItem !== undefined;
    const availableCopies = product?.availableCopies - (cartItem ? cartItem.quantity : 0);

    const handleRemoveBook = () => {
        dispatch({
            type: REMOVE_FROM_CART,
            payload: { id: product.id },
        });
    };

    const handleIncreaseBook = () => {
        if (cartItem.quantity < product.availableCopies) {
            dispatch({
                type: INCREASE_QUANTITY,
                payload: { id: product.id }
            });
        }
        else {
            alert('No more available copies');
        }
    };

    const handleDecreaseBook = () => {
        if (cartItem.quantity > 1) {
            dispatch({
                type: DECREASE_QUANTITY,
                payload: { id: product.id }
            });
        } else {
            handleRemoveBook();
        }
    };

    const removeBookByTitle = (title) => {
        fetch(`http://localhost:5198/api/books/remove-by-title/${encodeURIComponent(title)}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to remove book');
                }
                return response.json();
            })
            .then(data => {
                alert(`Book titled "${title}" has been removed successfully!`);
                window.location.reload();
            })
            .catch(error => console.error('Error removing book:', error));
    };

    const handleAddToCart = () => {
        if (availableCopies > 0) {
            dispatch(addToCart(product));
        } else {
            alert('No more available copies');
        }
    };

    if (!product) {
        return <div>No product data available</div>;
    }

    const imageSrc = product.image ? `http://localhost:5198${product.image}` : '';

    return (
        <div style={styles.productCard}>
            {product.image && <img src={imageSrc} alt={product.title} style={styles.productImage} />}
            <h2 style={styles.title}>{product.title ? product.title.toString() : 'No Title'}</h2>
            <h3 style={styles.author}>{product.author ? product.author.toString() : 'No Author'}</h3>
            <p>Available Copies: {availableCopies}</p>

            {/* Add to Cart Button */}
            {!isInCart && availableCopies > 0 && (
                <button onClick={handleAddToCart} disabled={availableCopies <= 0} style={styles.addButton}>
                    Add to Cart
                </button>
            )}

            {/* Conditionally render the + and - buttons if the product is in the cart */}
            {isInCart && (
                <div style={styles.quantityButtonsContainer}>
                    <button onClick={handleDecreaseBook} style={styles.quantityButton}>-</button>
                    <span>{cartItem.quantity}</span>
                    <button onClick={handleIncreaseBook} style={styles.quantityButton}>+</button>
                </div>
            )}

            {/* Align all buttons horizontally */}
            <div style={styles.buttonsContainer}>
                <button onClick={() => navigate(`/books/${product.id}`)} style={styles.aboutButton}>
                    Description
                </button>
                <button onClick={() => removeBookByTitle(product.title)} style={styles.removeButton}>
                    Delete
                </button>
            </div>

            {/* Pen Image for updating the book, positioned at the top right */}
            <div style={styles.updateButtonContainer}>
                <button
                    onClick={() => navigate(`/update-book/${product.id}`)}  // Navigate to update page
                    style={styles.updateButton}
                >
                    <img alt="Update" style={styles.penImage} />
                </button>
            </div>
        </div>
    );
};

const styles = {
    productCard: {
        border: '1px solid #ddd',
        padding: '15px',
        margin: '10px',
        width: '200px',
        textAlign: 'center',
        backgroundColor: '#fff',
        position: 'relative',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
    },
    productImage: {
        width: '150px',
        height: '150px',
        objectFit: 'cover',
        marginBottom: '10px',
        borderRadius: '5px',
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        gap: '10px',
        width: '100%',
    },
    aboutButton: {
        padding: '10px 12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.3s ease',
        flexGrow: 1,
    },
    removeButton: {
        padding: '10px 12px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.3s ease',
        flexGrow: 1,
    },
    quantityButtonsContainer: {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButton: {
        padding: '5px 10px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '0 5px',
    },
    updateButtonContainer: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        padding: '0',
        cursor: 'pointer',
        borderRadius: '50%',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    },
    updateButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
    },
    penImage: {
        width: '20px',
        height: '20px',
        transition: 'transform 0.2s ease',
    },
    addButton: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.3s ease',
        width: '100%',
        marginTop: '10px',
    },
    // Adjust the margin between title and author here
    title: {
        marginBottom: '5px',  // Reduces the space between title and author
    },
    author: {
        marginTop: '0px',  // Ensures there's no unnecessary space above the author
    },
};



export default ProductCard;
