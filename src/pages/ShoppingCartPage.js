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
    const [image, setImage] = useState([]);
   
    const validCartItems = cartItems.filter(item => item?.title !== undefined && item?.title !== null);

    const { id } = useParams();
    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5198/api/books/${id}/title`)
                .then(response => response.text())
                .then(title => setTitle(title))
                .catch(error => console.error('Error fetching title:', error));
        }
    }, [id]);
    const { id1 } = useParams();
    useEffect(() => {
        if (id1) {
            fetch(`http://localhost:5198/api/books/${id}/image`)
                .then(response => response.text())
                .then(image => setImage(image))
                .catch(error => console.error('Error fetching Image:', error));
        }
    }, [id1]);
   
    useEffect(() => {
    console.log("Current Cart Items in ShoppingCartPage:", cartItems);
}, [cartItems]);

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
        setCheckoutComplete(true);

        try {
            // Fetch titles and images for all books in the cart
            const bookDetails = await Promise.all(
                cartItems.map(async (item) => {
                    if (item.id) {
                        const [titleRes, imageRes] = await Promise.all([
                            fetch(`http://localhost:5198/api/books/${item.id}/title`),
                            fetch(`http://localhost:5198/api/books/${item.id}/image`)
                        ]);

                        const title = await titleRes.text();
                        const image = await imageRes.text();

                        return { title, image, quantity: item.quantity };
                    } else {
                        return { title: 'Unknown Title', image: '/default-book.jpg', quantity: item.quantity };
                    }
                })
            );

            setBookTitles(bookDetails);

            // Generate the Swal popup with book images
            Swal.fire({
                title: "Borrow Summary",
                width: "950px", // Reduced width for better structure
                html: `
<div style="
    max-width: 900px; 
    max-height: 300px; 
    overflow-y: auto; 
    padding: 20px;
">
    <p><strong>Borrowing Date:</strong> ${today.toDateString()}</p>
    <p><strong>Return Date:</strong> ${returnDate.toDateString()}</p>
    <hr style="border: 0; height: 1px; background: #008080; margin: 10px 0;">

    <!-- Table Header -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
        <thead>
            <tr style="background-color: #008080; color: white;">
                <th style="padding: 10px; width: 10%; text-align: center;">Sr No.</th>
                <th style="padding: 10px; width: 20%; text-align: center;">Image</th>
                <th style="padding: 10px; width: 50%; text-align: left;">Book Name</th>
                <th style="padding: 10px; width: 20%; text-align: center;">Quantity</th>
            </tr>
        </thead>
        <tbody>
            ${bookDetails.map((book, index) => `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; text-align: center; font-weight: bold;">${index + 1}</td>
                    <td style="padding: 10px; text-align: center;">
                        <img src="http://localhost:5198${book.image}" alt="Book Image" 
                            style="width: 60px; height: 80px; border-radius: 6px; display: block; margin: 0 auto;">
                    </td>
                    <td style="padding: 10px; text-align: left; font-size: 16px;">${book.title}</td>
                    <td style="padding: 10px; text-align: center;">
                        <span style="
                            background-color: teal;
                            color: white;
                            font-size: 14px;
                            font-weight: bold;
                            padding: 6px 12px;
                            border-radius: 4px;
                            display: inline-block;
                        ">x${book.quantity}</span>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <p style="margin-top: 10px; font-size: 16px;">Thank you for borrowing!</p>
</div>
`,
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#008080",
            }).then(() => {
                navigate("/products");
            });






            // Handle available copies update
            await Promise.all(cartItems.map(async (item) => {
                const newAvailableCopies = Math.max(item.availableCopies - item.quantity, 0);
                await axios.post('/api/books/update-available-copies', {
                    bookId: item.id,
                    availableCopies: newAvailableCopies,
                });

                const storedCart = JSON.parse(localStorage.getItem("cartItems")) || {};
                delete storedCart[item.id]; // Remove item from cart
                localStorage.setItem("cartItems", JSON.stringify(storedCart));
            }));

            dispatch(clearCart());

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
             
                {/*<div style={styles.stickyButtons}>*/}
                {/*    <Link to="/products">*/}
                {/*        <button style={styles.continueShoppingButton}>Continue Shopping</button>*/}
                {/*    </Link>*/}
                {/*    <button style={styles.checkoutButton} onClick={checkout}>*/}
                {/*        Checkout*/}
                {/*    </button>*/}
            {/*</div>*/}
            {/*{!showSummary && (*/}
            {/*    <div style={styles.stickyButtons}>*/}
            {/*        <Link to="/products">*/}
            {/*            <button style={styles.continueShoppingButton}>Continue Shopping</button>*/}
            {/*        </Link>*/}
            {/*        <button style={styles.checkoutButton} onClick={checkout}>*/}
            {/*            Checkout*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*)}*/}
            {(validCartItems.length === 0 && !showSummary) && (
                <div style={styles.stickyButtons}>
                    <Link to="/products">
                        <button style={styles.continueShoppingButton}>Continue Shopping</button>
                    </Link>
                </div>
            )}

            {!showSummary && validCartItems.length > 0 && (
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
                        {validCartItems.length > 0 ? (
                            validCartItems.map(item => (
                                <div className="outer-cart-item" key={item.id}>
                                    <CartItem item={item} />
                                </div>
                            ))
                        ) : (
                            <div className="empty-cart">
                                    <img
                                        src={emptyCartImage}
                                        alt="No Product"
                                        style={{ width: "310px", height: "auto", display: "block", marginTop: "150px"}}
                                    />

                                    <p className="empty-cart-text" style={{ marginLeft: "73px", marginTop: "32px", fontSize:"22px" }}>Go find the books you like.....</p>
                            </div>
                        )}
                    </div>
            )}

                {showSummary && (
                    <div className="purchase-summary">
                        <h2 className="summary-title">Summary</h2>
                        <p className="summary-text">
                            <strong>Borrowing Date:</strong> {purchaseDate && purchaseDate.toDateString()}
                        </p>
                        <p className="summary-text">
                            <strong>Return Date:</strong> {returnDate && returnDate.toDateString()}
                        </p>
                        <ul className="summary-list">
                            {bookTitles.map((book, index) => (
                                <li key={index} className="summary-item">
                                    <strong>{book.title}</strong> - {book.quantity} {book.quantity > 1 ? "copies" : "copy"}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => navigate("/products")} className="back-button" style={{
                            background: 'linear-gradient(to right, #184d59, #257d77)'
                        }} >
                            Back to Books
                        </button>
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
        marginRight: '-78px',
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
        background: 'linear-gradient(to right, #184d59, #257d77)',

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
        background: 'linear-gradient(to right, #184d59, #257d77)',
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
