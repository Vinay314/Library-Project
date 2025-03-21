import React, { useState, useEffect , useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../components/CartItem';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../store/actions';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from "../components/Header";
import emptyCartImage from './assets/shopping.png';
import Swal from 'sweetalert2';

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
                const storedCart = JSON.parse(localStorage.getItem("cartItems")) || {};

                // Remove the item from cart
                delete storedCart[item.id];

                // Update localStorage
                localStorage.setItem("cartItems", JSON.stringify(storedCart));
            }));

            // Alert the user with a summary before navigating
            /*const summaryMessage = `Purchase Summary:\n\nBorrowing Date: ${today.toDateString()}\nReturn Date: ${returnDate.toDateString()}\n\nThank you for your purchase!`;*/

            Swal.fire({
                title: "Purchase Summary",
                html: `<p><strong>Borrowing Date:</strong> ${today.toDateString()}</p>
           <p><strong>Return Date:</strong> ${returnDate.toDateString()}</p>
           <p>Thank you for your purchase!</p>`,
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor:"#008080"
            });


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
            {/*<div ref={buttonsRef} style={styles.topRightButtons}>*/}
            {/*    <Link to="/products">*/}
            {/*        <button style={styles.continueShoppingButton}>Continue Shopping</button>*/}
            {/*    </Link>*/}
            {/*    <button*/}
            {/*        onClick={checkout}*/}
            {/*        style={{*/}
            {/*            ...styles.checkoutButton,*/}
            {/*            backgroundColor: cartItems.length === 0 ? 'gray' : 'teal',*/}
            {/*            cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer'*/}
            {/*        }}*/}
            {/*        disabled={cartItems.length === 0}*/}
            {/*    >*/}
            {/*        Checkout*/}
            {/*    </button>*/}

            {/*</div>*/}

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
          

               <div className="cart-container"> {/* Updated class for overall layout */}
            {!checkoutComplete && (
                <div className="shopping-cart">
                    {cartItems.length > 0 ? (
                        <>
                            {cartItems.map(item => (
                                <div className="outer-cart-item" key={item.id}> {/* Updated layout */}
                                    <CartItem item={item} />
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="empty-cart">
                            <img src={emptyCartImage} alt="No Product" className="empty-cart-image" />
                            <p className="empty-cart-text">Go find the books you like.....</p>
                        </div>
                    )}
                </div>
            )}

            {showSummary && (
                <div className="purchase-summary">
                    <h2>Summary</h2>
                    <p>Borrowing Date: {purchaseDate && purchaseDate.toDateString()}</p>
                    <p>Return Date: {returnDate && returnDate.toDateString()}</p>
                    <ul>
                        {bookTitles.map((title, index) => (
                            <li key={index}>{title}</li>
                        ))}
                    </ul>
                    <button onClick={() => navigate("/products")} className="back-button">Back to Books</button>
                </div>
            )}

            {/* Action buttons for shopping and checkout */}

        </div>

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
    //stickyButtons: {
    //    position: 'fixed',
    //    bottom: '20px',
    //    right: '-20px',
    //    display: 'flex',
    //    gap: '10px',
    //    background: 'white',
    //    padding: '10px',
    //    //borderRadius: '8px',
    //    //boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    //},
    //continueShoppingButton: {
    //    padding: '12px 20px',
    //    backgroundColor: 'teal',
    //    color: 'white',
    //    border: 'none',
    //    borderRadius: '5px',
    //    cursor: 'pointer',
    //    fontSize: '16px',
    //    transition: 'background-color 0.3s ease',
    //    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Add subtle shadow for depth
    //},
    //checkoutButton: {
    //    padding: '12px 20px',
    //    backgroundColor: 'teal',
    //    color: 'white',
    //    marginRight:'5vw',
    //    border: 'none',
    //    borderRadius: '5px',
    //    cursor: 'pointer',
    //    fontSize: '16px',
    //    transition: 'background-color 0.3s ease',
    //    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Add subtle shadow for depth
    //},

    stickyButtons: {
        position: 'fixed',  // Keeps it in the viewport
        bottom: '20px',     // Positions it near the bottom
        right: '20px',      // Positions it near the right corner
        display: 'flex',
        gap: '10px',
        background: 'transparent',
        padding: '12px 15px',
        borderRadius: '8px', // Optional: Adds smooth edges
        //boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Adds a slight shadow for visibility
        zIndex: 1000, // Ensures it stays above other elements
    },

    continueShoppingButton: {
        padding: '12px 20px',
        backgroundColor: 'teal',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },

    checkoutButton: {
        padding: '12px 20px',
        backgroundColor: 'teal',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
