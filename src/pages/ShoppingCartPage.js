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
import "./Tabs.css";
import Loader from './Loader.jsx'
import { REMOVE_FROM_CART, INCREASE_QUANTITY, DECREASE_QUANTITY } from '../store/actions';
import emptyhistory from './assets/emptyhistory1.png';
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
const Tabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: "borrowed", label: "Borrowed Books" },
        /*{ id: "current", label: "Books With You" },*/
        { id: "cart", label: "Cart" },
    ];
    const [currentBooks, setCurrentBooks] = useState([]);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [filterDate, setFilterDate] = useState("");
    const [title, setTitle] = useState('');
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [author, setAuthor] = useState('');
    
    const allBooks = [...borrowedBooks];

    let filteredBooks = allBooks.filter((book) => {
        const matchesDate = filterDate ? book.returnDate && book.returnDate.includes(filterDate) : true;
        const matchesSearch = searchTerm
            ? book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        return matchesDate && matchesSearch;
    });




    useEffect(() => {
        let checkedOutBooks = JSON.parse(localStorage.getItem("checkedOutBooks")) || [];

        let today = new Date();

        let current = checkedOutBooks.filter(book => new Date(book.returnDate) >= today);
        let borrowed = checkedOutBooks
            .filter(book => new Date(book.returnDate) > today)
            .sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate)); // Descending
        //filteredBooks = borrowed;
        console.log("test", borrowed);
        setCurrentBooks(current);
        setBorrowedBooks(borrowed);

        let objs = localStorage.getItem("cartItems");

    }, []);
    return (
        <div>
            {/* Tabs for Navigation */}
            <div className="tabs-container">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Display Books Based on Active Tab */}
            {activeTab === "current" && (
                <div className ="current-books">
                    <h2>Current Books</h2>
                    <div className="date-filter">
                        <label htmlFor="filter-date">Filter by Date:</label>
                        <input
                            type="date"
                            id="filter-date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (

                            <div className="shopping-cart">
                                <div className="outer-cart-item">
                            <div key={book.id} className="inner-cart-item">
                                {/* Book Image */}
                                <img src={book.image} alt={book.title} className="cart-item-image" />

                                <div className="cart-item-details">
                                    {/* Book Information */}
                                    <div className="text-container">
                                        <p className="item-name">{book.title}</p>
                                        <p className="author">Author: {book.author}</p>
                                        <p className="date-info">
                                            Date of Return: {book.returnDate ? new Date(book.returnDate).toDateString() : "Not Set"}
                                        </p>
                                    </div>
                                </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No books currently checked out.</p>
                    )}

                </div>
            )}

            {activeTab === "borrowed" && (
                <div className = "borrowed-books">

                    
                    <div className="filters" style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '24px', marginTop: '-62px' }}>

                        {/* Search Bar with horizontal label and input */}
                        <div className="search-bar1" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft:'12px' }}>
                            <label htmlFor="search" style={{ color: 'teal', fontWeight: '600' }}>
                                Search:
                            </label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Title or Author"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    width: '200px',
                                }}
                            />
                        </div>

                        {/* Date Filter - position unchanged */}
                        <div className="date-filter">
                            <label htmlFor="filter-date">Filter by Date:</label>
                            <input
                                type="date"
                                id="filter-date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </div>
                    </div>


                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <div className ="shopping-cart">
                            <div className ="outer-cart-item">
                            <div key={book.id} className="inner-cart-item">
                                {/* Book Image */}
                                <img src={book.image} alt={book.title} className="cart-item-image" />

                                <div className="cart-item-details">
                                    {/* Book Information */}
                                    <div className="text-container">
                                                <p className="item-name">{book.title}</p>
                                                <p className="author1">{book.author}</p>
                                                <p className="date-info1">
                                                    <span style={{ fontWeight: "bold" }}>Date of return:</span>{' '}
                                                    {book.returnDate
                                                        ? new Date(book.returnDate).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })
                                                        : "Not Set"}

                                        </p>
                                    </div>
                                </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
    style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column", // Stack items vertically
        textAlign: "center" // Center the text
    }}
>
<img
        src={emptyhistory}
        alt="No history illustration"
        style={{
            maxWidth: "15%",
            height: "auto",
            opacity: 0.8
        }}
    />
<p style={{ marginTop: "10px", fontSize: "18px", color: "#555" }}>
        No books to show in history...
</p>
</div>
                    )}

                </div>
            )}
        </div>
    );

};
const ShoppingCartPage = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));


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
    const [activeTab, setActiveTab] = useState("cart");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
 
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    
    let validCartItemsArray = [];// cartItems.filter(item => item?.title !== undefined && item?.title !== null);
    for (let key in cartItems) {
        if (cartItems[key].title) {
            validCartItemsArray.push(cartItems[key]);
        }
    }
    const [validCartItems, setValidCartItems] = useState(validCartItemsArray);

    const handleRemoveBook = (item, isDelete) => {

        if (isDelete)

            dispatch({

                type: REMOVE_FROM_CART,

                payload: { id: item.id },

            });

        const isLastItemInCart = (validCartItems?.length || 0) === 1;

        if (isDelete && isLastItemInCart) {

            Swal.fire({

                title: "Empty Cart?",

                text: "Are you sure you want to remove the last item and empty the cart?",

                icon: "warning",

                showCancelButton: true,

                confirmButtonText: "Yes, remove it",

                cancelButtonText: "Cancel",

                customClass: {

                    confirmButton: "swal-custom-ok-button",

                    cancelButton: "swal-custom-cancel-button"

                }

            }).then((result) => {

                if (result.isConfirmed) {

                    // Retrieve current cart from localStorage

                    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || {};

                    if (storedCart[item.id].quantity > 1 && !isDelete) {

                        storedCart[item.id].quantity--;

                    }

                    else {

                        // Remove the item from cart

                        delete storedCart[item.id];

                    }

                    // Update localStorage

                    localStorage.setItem("cartItems", JSON.stringify(storedCart));

                    console.log("Updated Cart in handleRemoveBook:", storedCart);

                    let validCartItemsArray1 = [];// cartItems.filter(item => item?.title !== undefined && item?.title !== null);

                    for (let key in storedCart) {

                        if (storedCart[key].title) {

                            validCartItemsArray1.push(storedCart[key]);

                        }

                    }

                    setValidCartItems(validCartItemsArray1);

                }

            });

        }

        else {

            // Retrieve current cart from localStorage

            const storedCart = JSON.parse(localStorage.getItem("cartItems")) || {};

            if (storedCart[item.id].quantity > 1 && !isDelete) {

                storedCart[item.id].quantity--;

            }

            else {

                // Remove the item from cart

                delete storedCart[item.id];

            }

            // Update localStorage

            localStorage.setItem("cartItems", JSON.stringify(storedCart));

            console.log("Updated Cart in handleRemoveBook:", storedCart);

            let validCartItemsArray1 = [];// cartItems.filter(item => item?.title !== undefined && item?.title !== null);

            for (let key in storedCart) {

                if (storedCart[key].title) {

                    validCartItemsArray1.push(storedCart[key]);

                }

            }

            setValidCartItems(validCartItemsArray1);

        }

    };

    useEffect(() => {
        const storedKey = localStorage.getItem("forceCartTabSwitch");

        if (storedKey) {
            setActiveTab("cart");
            localStorage.removeItem("forceCartTabSwitch");
        }
    }, [location.key]); // will run even if path doesn't change


    const handleIncreaseBook = (item) => {
        if (item.quantity < item.availableCopies) {
            dispatch({
                type: INCREASE_QUANTITY,
                payload: { id: item.id }
            });

            // Retrieve current cart from localStorage
            const storedCart = JSON.parse(localStorage.getItem("cartItems")) || {};

            // Remove the item from cart
            storedCart[item.id].quantity = storedCart[item.id].quantity + 1;

            // Update localStorage
            localStorage.setItem("cartItems", JSON.stringify(storedCart));

            console.log("Updated Cart in handleRemoveBook:", storedCart);


            let validCartItemsArray1 = [];// cartItems.filter(item => item?.title !== undefined && item?.title !== null);
            for (let key in storedCart) {
                if (storedCart[key].title) {
                    validCartItemsArray1.push(storedCart[key]);
                }
            }

            setValidCartItems(validCartItemsArray1);

        } else {
            Swal.fire({
                icon: 'warning',  // Warning icon
                title: 'Oops!',
                text: 'No more available copies',
                confirmButtonText: 'OK',
                confirmButtonColor: "#008080",
                //timer: 3000,  // Auto-close after 3 seconds
                //timerProgressBar: true
            });
        }
    };


    const handleDecreaseBook = (item) => {


        const isLastItemInCart = (validCartItems?.length || 0) === 1;


        if (item.quantity > 1) {

            dispatch({

                type: DECREASE_QUANTITY,

                payload: { id: item.id }

            });

            handleRemoveBook(item);

        } else if (isLastItemInCart) {

            Swal.fire({

                title: "Empty Cart?",

                text: "Are you sure you want to remove the last item and empty the cart?",

                icon: "warning",

                showCancelButton: true,

                confirmButtonText: "Yes, remove it",

                cancelButtonText: "Cancel",

                customClass: {

                    confirmButton: "swal-custom-ok-button",

                    cancelButton: "swal-custom-cancel-button"

                }

            }).then((result) => {

                if (result.isConfirmed) {

                    dispatch({

                        type: REMOVE_FROM_CART,

                        payload: { id: item.id }

                    });

                    handleRemoveBook?.(item); // Optional UI updates

                }

            });

        } else {

            dispatch({

                type: REMOVE_FROM_CART,

                payload: { id: item.id }

            });

            handleRemoveBook?.(item);

        }

    };

    const tabs = [
        { id: "borrowed", label: "Borrowed Books" },
        { id: "current", label: "Books With You" },
        { id: "cart", label: "Cart" },
    ];
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
        if (isTransitioning) {
            setTimeout(() => {
                navigate("/products"); // Redirect to products after transition
            }, 500); // Ensure it matches transition duration
        }
    }, [isTransitioning, navigate]);
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
            console.error("No items in cart to checkout.");
            return;
        }

        // Show confirmation popup before proceeding
        const confirmCheckout = await Swal.fire({
            title: "Confirm Checkout",
            text: "Are you sure you want to proceed with checkout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#008080",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Checkout",
            cancelButtonText: "Cancel",
        });

        if (!confirmCheckout.isConfirmed) {
            console.log("Checkout cancelled by user.");
            return; // Stop execution if user cancels
        }

        const today = new Date();
        setPurchaseDate(today);
        const returnDate = calculateReturnDate(today);
        setReturnDate(returnDate);
        setCheckoutComplete(true);

        try {
            // Fetch titles and images for all books in the cart
            const bookDetails = await Promise.all(
                validCartItems.map(async (item) => {
                    if (item.id) {
                        const [titleRes, imageRes, regionRes,authorRes] = await Promise.all([
                            fetch(`http://localhost:5198/api/books/${item.id}/title`),
                            fetch(`http://localhost:5198/api/books/${item.id}/image`),
                            fetch(`http://localhost:5198/api/books/${item.id}/category`),
                            fetch(`http://localhost:5198/api/books/${item.id}/author`),
                        ]);

                        const title = await titleRes.text();
                        const image = await imageRes.text();
                        const region = await regionRes.text();
                        const author = await authorRes.text();
                        return { id: item.id, title, image,region,author, quantity: item.quantity};
                    } else {
                        return { id: item.id, title: "Unknown Title", image: "/default-book.jpg",region : "N/A",author : "N/A", quantity: item.quantity };
                    }
                })
            );

            setBookTitles(bookDetails);

            // Store checked-out books in localStorage
            let checkedOutBooks = JSON.parse(localStorage.getItem("checkedOutBooks")) || [];

            bookDetails.forEach((book) => {
                checkedOutBooks.push({
                    ...book,
                    returnDate: returnDate.toISOString(), // Save due date
                });
            });

            localStorage.setItem("checkedOutBooks", JSON.stringify(checkedOutBooks));
            localStorage.removeItem("cartItems");
            // Generate the Swal popup with book images
            Swal.fire({
                title: "Borrow Summary",
                width: "950px",
                html: `
<div style="max-width: 900px; max-height: 400px; overflow-y: auto; padding: 20px;">
    <p><strong>Borrowing Date:</strong> ${today.toDateString()}</p>
    <p><strong>Return Date:</strong> ${returnDate.toDateString()}</p>
    
    <hr style="border: 0; height: 1px; background: #008080; margin: 10px 0;">

    <!-- Table Header -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
        <thead>
            <tr style="background-color: #008080; color: white;">
                <th style="padding: 10px; width: 8%; text-align: center;">Sr No.</th>
                <th style="padding: 10px; width: 15%; text-align: center;">Image</th>
                <th style="padding: 10px; width: 37%; text-align: left;">Book Name</th>
                <th style="padding: 10px; width: 15%; text-align: center;">Region</th>
                <th style="padding: 10px; width: 15%; text-align: center;">Quantity</th>
            </tr>
        </thead>
        <tbody>
            ${bookDetails
                        .map(
                            (book, index) => `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; text-align: center; font-weight: bold;">${index + 1}</td>
                    <td style="padding: 10px; text-align: center;">
                        <img src="http://localhost:5198${book.image}" alt="Book Image" 
                            style="width: 60px; height: 80px; border-radius: 6px; display: block; margin: 0 auto;">
                    </td>
                    <td style="padding: 10px; text-align: left; font-size: 16px;">${book.title}</td>
                    <td style="padding: 10px; text-align: center; font-size: 14px; font-weight: bold;">${book.region}</td>
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
            `
                        )
                        .join("")}
        </tbody>
    </table>

    <p style="margin-top: 10px; font-size: 16px;">Thank you for borrowing!</p>
</div>
`,
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#008080",
            }).then(() => {
                //navigate("/loader"); // Navigate to Loader component first
                //setTimeout(() => {
                //    navigate("/products"); // Navigate to products after 2s
                //}, 2000);
                /*navigate("/products?loader=true");*/
                sessionStorage.setItem("showLoaderOnce", "true"); // Set the flag
                navigate("/products");
            });  
            const transitionStyle = isTransitioning
                ? {
                    opacity: 0,
                    transform: "scale(0.95)",
                    transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                }
                : {};


                // Handle available copies update AFTER confirmation
                await Promise.all(
                    validCartItems.map(async (item) => {
                        const newAvailableCopies = Math.max(item.availableCopies - item.quantity, 0);
                        await axios.post("/api/books/update-available-copies", {
                            bookId: item.id,
                            availableCopies: newAvailableCopies,
                        });

                        // Remove the item from local storage cart
                        const storedCart = JSON.parse(localStorage.getItem("cartItems")) || {};
                        delete storedCart[item.id];
                        localStorage.setItem("cartItems", JSON.stringify(storedCart));
                    })
                );

                dispatch(clearCart());
                
            
        } catch (error) {
            console.error("Failed to fetch book titles or update available copies:", error);
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
    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
    return (
        <>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
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

                {activeTab === "cart" && !showSummary && validCartItems.length > 0 && (
                <div style={styles.stickyButtons}>
                    <Link to="/products">
                        <button style={styles.continueShoppingButton}>Continue Shopping</button>
                    </Link>
                    <button style={styles.checkoutButton} onClick={checkout}>
                        Checkout
                    </button>
                </div>
            )}

                {(showButton && activeTab==='borrowed') && (
                    <button
                        onClick={scrollToTop}
                        style={{
                            position: 'fixed',
                            bottom: '10px',
                            right: '15px',
                            width: '55px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(#257d77,#184d59)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                        }}
                    >
                        <ArrowUp size={30} />
                    </button>


                )}
               <div className="cart-container"> {/* Updated class for overall layout */}
                    {activeTab === "cart" && !checkoutComplete && (
                        <div className="shopping-cart">
                        {validCartItems.length > 0 ? (
                            validCartItems.map(item => (
                                <div className="outer-cart-item" key={item.id}>
                                    <CartItem item={item} handleRemoveBook={(isDelete) => { handleRemoveBook(item, isDelete) }} handleIncreaseBook={() => { handleIncreaseBook(item) }} handleDecreaseBook={() => { handleDecreaseBook(item) }} />
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

                    {activeTab === "cart" && showSummary && (
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
        </>
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
