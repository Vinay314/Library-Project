import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { addToCart } from '../store/actions';
import { REMOVE_FROM_CART, INCREASE_QUANTITY, DECREASE_QUANTITY } from '../store/actions';
import { useDispatch } from 'react-redux';

const BookDescriptionPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState({});
    const [inCart, setInCart] = useState(false);
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const dispatch = useDispatch();
    const isincart = false;

    const handleRemoveBook = () => {
        dispatch({ type: REMOVE_FROM_CART, payload: { id: book.id } });
        setInCart(false);
    };

    const handleIncreaseBook = () => {
        if (book.quantity < book.availableCopies) {
            dispatch({ type: INCREASE_QUANTITY, payload: { id: book.id } });
            setBook(prev => ({ ...prev, quantity: prev.quantity + 1 }));
        } else {
            alert('No more available copies');
        }
    };

    const handleDecreaseBook = () => {
        if (book.quantity > 1) {
            dispatch({ type: DECREASE_QUANTITY, payload: { id: book.id } });
            setBook(prev => ({ ...prev, quantity: prev.quantity - 1 }));
        } else {
            handleRemoveBook();
        }
    };

    const handleAddToCart = () => {
        if (book.availableCopies > 0) {
            dispatch(addToCart(book));
            setInCart(true);
            setBook(prev => ({ ...prev, quantity: 1 }));
        } else {
            alert('No more available copies');
        }
    };

    useEffect(() => {
        fetch(`http://localhost:5198/api/books/${id}`)
            .then(response => response.json())
            .then(data => setBook(data))
            .catch(error => console.error('Error fetching book details:', error));
    }, [id]);

    // Close modal if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                navigate('/products');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [navigate]);

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={styles.overlay}>
            <div className="modal-dialog modal-lg modal-dialog-centered" ref={modalRef}>
                <div className="modal-content d-flex flex-column p-4" style={{ height: '90vh' }}>
                    {/* Close Button */}
                    <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0 m-3"
                        onClick={() => navigate('/products')}
                    ></button>

                    <div className="row flex-grow-1 overflow-auto align-items-start">
                        {/* Book Image */}
                        <div className="col-md-4 d-flex justify-content-center align-items-start">
                            <img
                                src={book.image || 'https://via.placeholder.com/200'}
                                alt={book.title}
                                className="img-fluid rounded shadow"
                                style={{ maxHeight: '300px' }}
                            />

                        </div>

                        {/* Book Details */}
                        <div className="col-md-8 d-flex flex-column">
                            <div>
                                <h2 className="fw-bold">{book.title}</h2>
                                <h5 className="text-muted">by {book.author}</h5>
                            </div>
                            <p className="mt-3 flex-grow-1">{book.description}</p>
                            
                        </div>
                    </div>

                    {/* Sticky Footer */}
                    <div className="mt-auto p-3 border-top bg-white text-center">
                        {inCart ? (
                            <div className="d-flex justify-content-center align-items-center">
                                <button type="button" class="btn btn-secondary w-100" disabled>Added to Cart</button>
                            </div>
                        ) : (
                            <button onClick={handleAddToCart} className="btn btn-success w-100">Add to Cart</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'relative',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
};

export default BookDescriptionPage;
