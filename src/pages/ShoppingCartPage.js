import React, { useState, useEffect , useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../components/CartItem';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../store/actions';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from "../components/Header";
import emptyCartImage from './assets/shopping.png';
const ShoppingCartPage = () => {
    const cartItems = useSelector(state => state.cart.items);
    const totalCost = useSelector(state => state.cart.totalCost);
    const [showSummary, setShowSummary] = useState(false);
    const [checkoutComplete, setCheckoutComplete] = useState(false);
    const [purchaseDate, setPurchaseDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [bookTitles, setBookTitles] = useState([]);
    const [isSticky, setIsSticky] = useState(false);
    const buttonsRef = useRef(null);

    const { id } = useParams();
    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5198/api/books/${id}/title`)
                .then(response => response.text())
                .then(title => setTitle(title))
                .catch(error => console.error('Error fetching title:', error));
        }
    }, [id]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSticky(!entry.isIntersecting);
            },
            { root: null, threshold: 0 }
        );

        if (buttonsRef.current) {
            observer.observe(buttonsRef.current);
        }

        return () => {
            if (buttonsRef.current) {
                observer.unobserve(buttonsRef.current);
            }
        };
    }, []);

    const calculateReturnDate = (date) => {
        let returnDate = new Date(date);
        returnDate.setDate(returnDate.getDate() + 28);
        while (returnDate.getDay() === 0 || returnDate.getDay() === 6) {
            returnDate.setDate(returnDate.getDate() + 1);
        }
        return returnDate;
    };

    const checkout = async () => {
        if (!cartItems || cartItems.length === 0) {
            console.error('No items in cart to checkout.');
            return;
        }

        const today = new Date();
        setPurchaseDate(today);
        const returnDate = calculateReturnDate(today);
        setReturnDate(returnDate);
        setShowSummary(true);
        setCheckoutComplete(true);

        try {
            // Fetch titles for all books in the cart
            const titles = await Promise.all(
                cartItems.map(async (item) => {
                    if (item.id) {  // Check if item.id exists and is not undefined
                        const response = await fetch(`http://localhost:5198/api/books/${item.id}/title`);
                        const title = await response.text();
                        return title;
                    } else {
                        return 'Unknown Title';  // Default value if id is missing
                    }
                })
            );

            setBookTitles(titles);  // Store the fetched titles

            // Handle available copies update
            await Promise.all(cartItems.map(async (item) => {
                const newAvailableCopies = Math.max(item.availableCopies - item.quantity, 0);
                await axios.post('/api/books/update-available-copies', {
                    bookId: item.id,
                    availableCopies: newAvailableCopies,
                });
            }));

            // Alert the user with a summary before navigating
            const summaryMessage = `Purchase Summary:\nBorrowing Date: ${today.toDateString()}\nReturn Date: ${returnDate.toDateString()}\n\nThank you for your purchase!`;
            alert(summaryMessage);

            // Clear the cart on successful checkout
            dispatch(clearCart());

            // Navigate back to the products page
            //navigate("/products");
        } catch (error) {
            console.error('Failed to fetch book titles or update available copies:', error);
        }
    };



    useEffect(() => {
        // When the component unmounts or navigation changes, clear the cart
        function handleNavigation() {
            const currentPath = window.location.pathname;
            if (currentPath === '/products') {
                dispatch(clearCart());
            }
        }

        handleNavigation(); // Run the handler when the component mounts
        window.addEventListener('popstate', handleNavigation); // Listen for browser back button navigation
        return () => {
            window.removeEventListener('popstate', handleNavigation); // Cleanup the listener on unmount
        };
    }, [dispatch]);

    return (
        <div>
            
            {/* Updated styles for the top-right buttons */}
            <div ref={buttonsRef} style={styles.topRightButtons}>
                <Link to="/products">
                    <button style={styles.continueShoppingButton}>Continue Shopping</button>
                </Link>
                <button onClick={checkout} style={styles.checkoutButton}>Checkout</button>
            </div>
            {/* Sticky Buttons */}
            {isSticky && (
                <div style={styles.stickyButtons}>
                    <Link to="/products">
                        <button style={styles.continueShoppingButton}>Continue Shopping</button>
                    </Link>
                    <button style={styles.checkoutButton} onClick={checkout}>
                        Checkout
                    </button>
                </div>
            )}
            {!checkoutComplete && (
                <div className="shopping-cart">
                    {cartItems.length > 0 ? (
                        <>
                            {cartItems.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </>
                    ) : (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '20px'
                            }}>
                                <img src={emptyCartImage} alt="No Product" style={{
                                    width: '150px',
                                    display: 'block'
                                }} />
                                <p style={{
                                    fontSize: '16px',
                                    color: '#555',
                                    marginTop: '10px',
                                    marginLeft: '20px' // Move text slightly to the right
                                }}>
                                    Go find the books you like.....
                                </p>
                            </div>



                    
                    )}
                </div>
            )}

            {showSummary && (
                <div className="purchase-summary" style={styles.summaryStyles}>
                    <h2 style={{ color: '#007bff' }}>Summary</h2>
                    <p>Borrowing Date: {purchaseDate && purchaseDate.toDateString()}</p>
                    <p>Return Date: {returnDate && returnDate.toDateString()}</p>
                    <ul style={{ paddingLeft: '20px' }}>
                        {bookTitles.map((title, index) => (
                            <li key={index}>
                                {title}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => navigate("/products")} style={styles.backButton}>Back to Products</button>
                </div>
            )}

        </div>
    );
};

const styles = {
    summaryStyles: {
        padding: '20px',
        border: '1px solid #007bff',
        borderRadius: '5px',
        marginTop: '20px',
        backgroundColor: '#f8f9fa',
    },
    // Remove fixed positioning for buttons
    topRightButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '20px',
        marginTop: '20px',
        marginRight:'-78px',
    },
    stickyButtons: {
        position: 'fixed',
        bottom: '20px',
        right: '-20px',
        display: 'flex',
        gap: '10px',
        background: 'white',
        padding: '10px',
        //borderRadius: '8px',
        //boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    continueShoppingButton: {
        padding: '12px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Add subtle shadow for depth
    },
    checkoutButton: {
        padding: '12px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        marginRight:'5vw',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Add subtle shadow for depth
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
        marginTop: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Add subtle shadow for depth
    },
};

// Button hover states (use CSS pseudo selectors)
styles.continueShoppingButton[':hover'] = {
    backgroundColor: '#5a6268',  // Slightly darker gray
};

styles.checkoutButton[':hover'] = {
    backgroundColor: '#218838',  // Slightly darker green
};

styles.backButton[':hover'] = {
    backgroundColor: '#0056b3',  // Slightly darker blue
};

export default ShoppingCartPage;
