import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import ProductCard from '../components/ProductCard';
import { Plus , BotMessageSquare} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import './ProductListingPage.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from './Footer';
import { useDispatch } from 'react-redux';
import { Pencil, Trash } from "lucide-react";
import { addToCart } from '../store/actions';
import { removeFromCart } from '../store/actions'
import Header from "../components/Header";
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import emptyBookImage from './assets/dislike_9250694.png';
import AddBookPage from '../components/AddBookPage';
import UpdateBookPage from '../components/UpdateBookPage';
import Chatbot from './Chatbot';
import "./Chatbot.css";
import AboutUs from "./About";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowUp } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import FlippableImage from "./FlippableImage";
function ProductListingPage() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'enabled');
    const navigate = useNavigate();
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [inCart, setInCart] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const dispatch = useDispatch();
    const [bookAdded, setBookAdded] = useState(false);
    const location = useLocation();
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [products1, setProducts1] = useState([]);
    const [isUpdateBookModalOpen, setIsUpdateBookModalOpen] = useState(false);
    const [bookToUpdate, setBookToUpdate] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [books, setBooks] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [filterBy, setFilterBy] = useState("title");
    const handleFlip = () => {
        setIsFlipped(true);
        setTimeout(() => setIsFlipped(false), 600); // Reset flip after animation
    };
    const handleBookClick = (book) => {
        setSelectedBook(book);
        setIsAnimating(true);

        setTimeout(() => {
            setShowModal(true);
            setIsAnimating(false);
        }, 800); // Duration matches animation time
    };
    const handleOpenAboutModal = () => {
        setIsAboutModalOpen(true);
    };
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
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
    const fetchBooks = async () => {
        try {
            const response = await fetch("http://localhost:5198/api/books");
            const data = await response.json();

            if (!Array.isArray(data.books)) {
                console.error("Invalid data format:", data);
                return;
            }

           
            setBooks(data.books); // Ensure state updates

        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

  

    const handleBookUpdate = () => {
        fetchBooks(); // Call this function after update
    };


    const addBook = async (newBook) => {
        try {
            await axios.post("http://localhost:5198/api/books", newBook);
            fetchBooks(); // Re-fetch books after adding a new one
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const handleCloseAboutModal = () => {
        setIsAboutModalOpen(false);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim().length < 3) {
            setSuggestions([]);
            setSearchQuery("");
        } else {
            const filteredSuggestions = products
                .filter(product => {
                    if (filterBy === "title") {
                        return product.title.toLowerCase().includes(value.toLowerCase());
                    } else if (filterBy === "author") {
                        return product.author.toLowerCase().includes(value.toLowerCase());
                    }
                    return false;
                })
                .map(product => product[filterBy]); // Map only the selected field for suggestions

            setSuggestions(filteredSuggestions);
        }
    };

    const handleBookAdded = (newBook) => {
        setProducts(prevBooks => Array.isArray(prevBooks) ? [...prevBooks, newBook] : [newBook]);
    };
    const openUpdateBookModal = (book) => {
        setBookToUpdate(book);
        setIsUpdateBookModalOpen(true);
    };


    useEffect(() => {
        fetchBooks();
    }, [books]); // This ensures it refreshes when books change




    const handleAddBook = () => {
        /*navigate("/add-book");*/
        setIsAddBookModalOpen(true);
        

    };
    const handleCloseAddBookModal = () => {
        setIsAddBookModalOpen(false);
        
    };
    useEffect(() => {
        if (isAddBookModalOpen || isUpdateBookModalOpen || selectedBook || isAboutModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; // Cleanup function to reset overflow
        };
    }, [isAddBookModalOpen, isUpdateBookModalOpen, selectedBook, isAboutModalOpen]);


    useEffect(() => {
        if (bookAdded) {
            Swal.fire({
                title: "Book Added!",
                text: "The book has been successfully added.",
                icon: "success",
                customClass: {
                    confirmButton: "swal-custom-ok-button" // Apply teal color to the OK button
                }
               
            });
        }
    }, [bookAdded]); 

    const handleEditBook1 = (book) => {
        setBookToUpdate(book);
        setIsUpdateBookModalOpen(true);
        
    };
    const handleCloseUpdateBookModal = () => {
        setIsUpdateBookModalOpen(false);
        setBookToUpdate(null);
        
    };

    

    const handleBookUpdated = async () => {
        await fetchBooks(); // Ensure data is updated
        setIsUpdateBookModalOpen(false);
        forceUpdate(n => n + 1); // Force React to refresh component
    };



    useEffect(() => {
        window.clearSearch = () => {
            setSearchQuery(""); // Clear searchQuery first
            setTimeout(() => {
                setSearchTerm(""); // Ensure searchTerm also gets cleared after searchQuery updates
                setSuggestions([]);
            }, 0); // Allow state to update before clearing searchTerm
        };
    }, []);

    const handleRemoveFromCart = (bookId) => {
        dispatch(removeFromCart(bookId));

        setCartItems((prevCartItems) => {
            const updatedCart = { ...prevCartItems };
            delete updatedCart[bookId];

            // Ensure localStorage is updated
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));

            console.log("Updated Cart:", updatedCart); // Debugging log
            return updatedCart;
        });

        // Force a re-render
        setTimeout(() => {
            setInCart((prev) => !prev);
        }, 100);
    };




    const handleAddToCart = (book) => {
        if (book.availableCopies > 0) {
            dispatch(addToCart(book));

            setCartItems((prevCartItems) => {
                //const updatedCart = { ...cartItems, [selectedBook.id]: selectedBook }
                const updatedCart = {
                    ...prevCartItems, [book.id]: { ...book, quantity: 1 } };
                //updatedCart.Push(book);
                localStorage.setItem("cartItems", JSON.stringify(updatedCart));
                console.log("Cart before update:", cartItems);
                console.log("Updated Cart:", updatedCart);

                return updatedCart;
            });

            setInCart(true); // Trigger re-render
        } else {
            Swal.fire({
                icon: 'warning',  // Warning icon
                title: 'Oops!',
                text: 'No more available copies',
                confirmButtonText: 'OK',
                timer: 3000,  // Auto-close after 3 seconds
                timerProgressBar: true,
                confirmButtonColor: '#008080'
            });
        }
    };
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cartItems")) || {};
        setCartItems(storedCart);
    }, []);
    const [, forceUpdate] = useState();
    setTimeout(() => forceUpdate({}), 0);

    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart)); // Load cart from localStorage
            } catch (error) {
                console.error("Error parsing cart items from localStorage:", error);
                setCartItems({});
                localStorage.removeItem("cartItems"); // Remove corrupted data
            }
        } else {
            setCartItems({}); // Default to an empty object if nothing is stored
        }
    }, []);


    useEffect(() => {
        // Check if this is the first page load
        if (!sessionStorage.getItem("hasLoadedBefore")) {
            localStorage.removeItem("cartItems"); // Clear cart ONLY on full refresh
            setCartItems({}); // Reset cart state
            sessionStorage.setItem("hasLoadedBefore", "true"); // Set flag to prevent clearing on navigation
        }
    }, []);



    
    const filteredProducts = products.filter((product) =>
        product?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleSuggestionClick = (title) => {
        setSearchTerm(title);
        setSuggestions([]);
        setSearchQuery(title); // Perform search when a suggestion is selected
    };

    const handleOpenModal = (book) => {
        setSelectedBook(book);
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    };

    const handleCloseModal = () => {
        setSelectedBook(null);
        document.body.style.overflow = "auto"; // Restore scrolling
    };

    const handleSearch = (event) => {
        const value = searchTerm; // Ensure value is a string
        //setSearchTerm(value);
        //ttt
        if (value.length >= 3) {
            const filteredSuggestions = books
                .filter(book => book[filterBy] && book[filterBy].toLowerCase().includes(value.toLowerCase()))
                .map(book => book[filterBy]) // Only map after filtering
                .slice(0, 5); // Limit to 5 suggestions

            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };



    const handleFilterChange = (event) => {
        setFilterBy(event.target.value);
    };

    const filteredBooks = books.filter((book) => {
        if (filterBy === "title") {
            return book.title.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (filterBy === "author") {
            return book.author.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (filterBy === "region") {
            return book.category.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (filterBy === "stock") {
            return book.availableCopies === 0;
        }
        return true;
    });



    useEffect(() => {
        fetch('http://localhost:5198/api/books')
            .then(response => response.json())
            .then(data => setProducts(data.books))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode ? 'enabled' : 'disabled');
    };

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    useEffect(() => {
        const options = {
            strings: ["Read.", "Explore.", "Learn.", "Grow.", "Transform.", "Enlighten.", "Connect.", "Absorb.", "Engage.", "Enrich.", "Flourish.", "Inspire."],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 1500,
            loop: true
        };
        const typed = new Typed('.typed-text', options);

        return () => typed.destroy();
    }, []);
    

    const handleEditBook = (product) => {
        navigate(`/update-book/${product.id}`);
        localStorage.setItem("bookUpdated", "true");
    };



    {/*
        RIGHT CLICK DISABLED CODE

        useEffect(() => {
        const disableRightClick = (event) => {
            if (selectedBook || isAddBookModalOpen || isUpdateBookModalOpen) {
                event.preventDefault();
            }
        };

        document.addEventListener("contextmenu", disableRightClick);

        return () => {
            document.removeEventListener("contextmenu", disableRightClick);
        };



    }, [selectedBook, isAddBookModalOpen, isUpdateBookModalOpen]);
    
    
    */}
    




    useEffect(() => {
        if (localStorage.getItem("bookUpdated") === "true") {
            Swal.fire({
                title: 'Book Updated!',
                text: 'The book has been successfully edited.',
                icon: 'success',
                customClass: {
                    confirmButton: "swal-custom-ok-button" // Apply teal color to the OK button
                }
               
            });

            // Remove the flag to prevent showing the alert again
            localStorage.removeItem("bookUpdated");
        }
    }, []);
    const removeBookByTitle = (title, productId) => {
        Swal.fire({
            title: `Are you sure?`,
            text: `Do you really want to delete "${title}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            customClass: {
                confirmButton: "swal-custom-ok-button"
            },
            cancelButtonColor: 'gray',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5198/api/books/remove-by-title/${encodeURIComponent(title)}`, { method: 'DELETE' })
                    .then(response => {
                        if (!response.ok) throw new Error('Failed to remove book');
                        return response.text();  
                    })
                    .then(() => {
                        
                        setProducts(prevProducts =>
                            [...prevProducts.filter(product => product.title.toLowerCase() !== title.toLowerCase())]
                        );

                        
                        dispatch(removeFromCart(productId));

                        
                        setCartItems(prevCart => {
                            const updatedCart = { ...prevCart };
                            delete updatedCart[productId];
                            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
                            return updatedCart;
                        });

                        
                        Swal.fire({
                            title: 'Deleted!',
                            text: `Book titled "${title}" has been removed successfully.`,
                            icon: 'success',
                            customClass: {
                                confirmButton: "swal-custom-ok-button"
                            }
                        });

                    })
                    .catch(error => {
                        console.error('Error removing book:', error);
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to remove book.',
                            icon: 'error',
                            confirmButtonColor: '#d33'
                        });
                    });
            }
        });
    };







    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <>

            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} products={products} onOpenAbout={handleOpenAboutModal} />

            <div className={`container-fluid full-page-container ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'} ${selectedBook ? 'blur-background' : ''} ${isAddBookModalOpen ? 'blur-background' : ''} ${isUpdateBookModalOpen ? 'blur-background' : ''} ${isAboutModalOpen ? 'blur-background' : ''}`}>

                {/* Navbar */}

                {/*<div className="container">*/}
                {/*    <a className="navbar-brand d-flex align-items-center" href="#">*/}
                {/*        <strong>Album</strong>*/}
                {/*    </a>*/}
                {/*</div>*/}


                {/* Hero Section */}
                {/*<section className="py-5 text-center container">*/}
                {/*    <div className="row py-lg-5">*/}
                {/*        <div className="col-lg-6 col-md-8 mx-auto">*/}
                {/*            <h1 className="fw-light">CTIS Library</h1>*/}
                {/*            <p className="fw-light">*/}
                {/*                Atlas Copco is a global industrial company that provides innovative and sustainable solutions in the areas of compressors, vacuum solutions, generators, industrial tools, and assembly systems. They serve a wide range of industries, including manufacturing, construction, and mining, with a strong focus on energy efficiency and technological advancement.*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</section>*/}


                {/* Hero Section with Search Bar */}
                {/* Hero Section with Search Bar */}
                <section className="hero-section d-flex flex-column align-items-center mt-4"> {/* Added mt-4 for spacing */}
                    

                    {/*<div className="hero-overlay text-center w-100 d-flex flex-column align-items-center justify-content-center">*/}
                        <h1 className="hero-title">
                            Atlas Copco Group's Space to <span className="typed-text"></span>
                        </h1>
                        <p className="hero-subtitle">Technology that transforms the future.</p>
                   {/* </div>*/}

                    <div className="search-bar w-85">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for books..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                        />
                        <i className="bi bi-search search-icon" onClick={handleSearch}></i>

                        {suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((title, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(title)}>
                                        {title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="search-filter-container">
                    {/*<input*/}
                    {/*    type="text"*/}
                    {/*    placeholder={`Search by ${filterBy}`}*/}
                    {/*    value={searchTerm}*/}
                    {/*    onChange={handleSearch}*/}
                    {/*/>*/}
                    <select onChange={handleFilterChange} value={filterBy}>
                        <option value="title">Title</option>
                        <option value="author">Author</option>
                        <option value="region">Region</option>
                        <option value="stock">Out of stock</option>
                    </select>
            </div>
                </section>




                {/* Dynamic Typing Section */}
                {/*<section className="hero-section">*/}
                {/*    <div className="hero-overlay">*/}
                {/*        <h1 className="hero-title">*/}
                {/*            Atlas Copco Group's space to <span className="typed-text"></span>*/}
                {/*            <span className="typed-cursor"></span>*/}
                {/*        </h1>*/}
                {/*        <p className="hero-subtitle">Technology that transforms the future.</p>*/}
                {/*    </div>*/}
                {/*</section>*/}


                {/* Add Book Button */}
                {/*<div className="text-center my-4">*/}
                {/*    <button*/}
                {/*        onClick={() => navigate('/add-book')}*/}
                {/*        className={`btn add-book-btn ${darkMode ? 'btn-dark-mode' : 'btn-light-mode'}`}*/}
                {/*    >*/}
                {/*        Add a New Book*/}
                {/*    </button>*/}
                {/*</div>*/}

                {/* Product Listing Section */}
                <div className="album py-5">
                    {/*<div className="container">*/}
                    {/*    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">*/}
                    {/*        {filteredProducts.length > 0 ? (*/}
                    {/*            filteredProducts.map(product => (*/}
                    {/*                <div key={product.id} className="col">*/}
                    {/*                    <div className={`card shadow-sm product-card ${darkMode ? 'bg-secondary text-white' : ''}`}>*/}
                    {/*                        */}{/* Clickable Image */}
                    {/*                        <img*/}
                    {/*                            src={product.image || "https://via.placeholder.com/300x200"}*/}
                    {/*                            className="card-img-top clickable-image"*/}
                    {/*                            alt={product.title}*/}
                    {/*                            onClick={() => handleOpenModal(product)}*/}
                    {/*                        />*/}
                    {/*                        <div className="card-body">*/}
                    {/*                            <strong><h1 className="fw-bold card-text-title">{product.title}</h1></strong>*/}
                    {/*                            <h4 className="card-text-author">{product.author}</h4>*/}
                    {/*                            <div className="d-flex justify-content-between align-items-center">*/}
                    {/*                                <button onClick={() => navigate(`/update-book/${product.id}`)} className="btn btn-sm btn-outline-secondary edit-btn"><i class="bi bi-pencil"></i></button>*/}
                    {/*                                */}{/*<button onClick={() => removeBookByTitle(product.title)} className="btn btn-sm btn-outline-secondary remove-btn">Remove</button>*/}
                    {/*                                <button onClick={() => removeBookByTitle(product.title)} className="btn btn-sm btn-danger remove-btn d-none d-md-inline">*/}
                    {/*                                    Remove*/}
                    {/*                                </button>*/}
                    {/*                                <button onClick={() => removeBookByTitle(product.title)} className="btn btn-sm btn-danger remove-btn d-md-none">*/}
                    {/*                                    <i className="bi bi-x-lg"></i>*/}
                    {/*                                </button>*/}


                    {/*                            </div>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            )) */}
                    {/*        ) : (*/}
                    {/*            <p className="text-center">No books found.</p>*/}
                    {/*        )}*/}
                    {/*    </div>*/}
                    {/*</div>*/}





                    <div className="container">
                        <div className="book-grid">

                            {filteredBooks.length > 0 ? (

                                filteredBooks.map(product => 
                                    < FlippableImage product = { product } cartItems = { cartItems } handleOpenModal = { handleOpenModal } handleEditBook1 = { handleEditBook1 } removeBookByTitle = { removeBookByTitle } handleRemoveFromCart = { handleRemoveFromCart } handleAddToCart = { handleAddToCart } />

                                )

                            ) : (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        position: 'absolute',  // Absolute positioning for full-page centering
                                        top: '85%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',  // Moves the div exactly to the center
                                        padding: '20px'
                                    }}>
                                        <img src={emptyBookImage} alt="No Product" style={{
                                            width: '150px',
                                            display: 'block'
                                        }} />
                                        <p style={{
                                            fontSize: '16px',
                                            color: '#555',
                                            marginTop: '10px',
                                            marginLeft: '20px' // Adjust to move text slightly right
                                        }}>
                                            No books found.
                                        </p>
                                    </div>


                            )}
                        </div>
                    </div>


                </div>

            </div>

            {/* Floating Add Button above Footer */}
            <button className="add-book-button" onClick={handleAddBook}>
                <Plus size={30} />
            </button>
            <button className="chat-button" onClick={() => setIsChatOpen(!isChatOpen)} >
                <BotMessageSquare size={30} />
            </button>
            {showButton && (
                <button
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed',
                        bottom: '200px', // Adjusted for better placement
                        right: '0.8%', // Default for small screens, aligns to the right
                        transform: 'translateX(0)', // Default for small screens
                        padding: '10px 20px',
                        fontSize: '16px',
                        background:'linear-gradient(#257d77,#184d59)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '90px',
                        cursor: 'pointer',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        width: 'auto',
                        minWidth: '50px',
                        '@media (max-width: 768px)': {
                            left: '10px', // Adjusts for smaller screens
                            transform: 'translateX(0)',
                        },
                        '@media (min-width: 769px)': {
                            left: '50%', // Centers the button on larger screens
                            transform: 'translateX(-50%)',
                        },
                    }}
                >
                    <ArrowUp />
                </button>

            )}
s
     
            {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)}/>}
            {isAddBookModalOpen && (
                <div className="modal-overlay-add" onClick={handleCloseAddBookModal}>
                    <div className="modal-content-add" onClick={(e) => e.stopPropagation()}>
                        <AddBookPage onClose={handleCloseAddBookModal} onBookAdded={handleBookAdded} />
                   </div>
                </div>
            )}
            {isUpdateBookModalOpen && bookToUpdate && (
                <div className="modal-overlay-update" onClick={handleCloseUpdateBookModal}>
                    <div className="modal-content-update" onClick={(e) => e.stopPropagation()}>
                        <UpdateBookPage
                            book={bookToUpdate}
                            onClose={handleCloseUpdateBookModal}
                            onBookUpdated={handleBookUpdated}
                        />
                    </div>
                </div>
            )}
            {isAboutModalOpen && (
                <div className="modal-overlay" onClick={handleCloseAboutModal}>
                    <div className="modal-content-about" onClick={(e) => e.stopPropagation()}>
                        <AboutUs />
                        <button className="close-button" onClick={handleCloseAboutModal}>&times;</button>
                    </div>
                </div>
            )}
            {selectedBook && (
                //<div className="modal-overlay" onClick={handleCloseModal}>
                //    <div className="modal-content d-flex" onClick={(e) => e.stopPropagation()}>
                //        {/* Image Section */}
                //        <div className="col-md-4 d-flex justify-content-center align-items-start">
                //            <img
                //                src={selectedBook.image || 'https://via.placeholder.com/200'}
                //                alt={selectedBook.title}
                //                className="img-fluid rounded shadow"
                //                style={{ maxHeight: '300px' }}
                //            />
                //        </div>

                //        {/* Text Section */}
                //        <div className="col-md-8 d-flex flex-column justify-content-between modal-text">
                //            <div>
                //                <h2 className="fw-bold">{selectedBook.title}</h2>
                //                <p><strong>Author:</strong> {selectedBook.author}</p>
                //                <p>{selectedBook.description}</p>
                //            </div>

                //            {/* Button at Bottom */}
                //            <div className="modal-footer">
                //                <div className="modal-buttons">
                //                    {/*<button*/}
                //                    {/*    type="button"*/}
                //                    {/*    className="btn btn-warning w-100"*/}
                //                    {/*    onClick={() => navigate(`/books/${selectedBook.id}`)}*/}
                //                    {/*>*/}
                //                    {/*    View More Details*/}
                //                    {/*</button>*/}
                //                    {cartItems[selectedBook?.id] ? (
                //                        <button
                //                            type="button"
                //                            className="btn btn-danger w-100"
                //                            onClick={() => handleRemoveFromCart(selectedBook.id)}
                //                        >
                //                            Remove from Cart
                //                        </button>
                //                    ) : (
                //                        <button
                //                            onClick={() => handleAddToCart(selectedBook)}
                //                            className="btn btn-success w-100"
                //                            style={{ backgroundColor: "teal", color: "white" }}
                //                        >
                //                            Add to Cart
                //                        </button>
                //                    )}


                //                </div>

                //            </div>

                //        </div>

                //        <span className="close-button" onClick={handleCloseModal}>&times;</span>
                //    </div>

                //</div>
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {/* Left Side: Image and Book Details */}
                        <div className="book-image">
                            {/* Book Image */}
                            <img
                                src={selectedBook.image || 'https://via.placeholder.com/200'}
                                alt={selectedBook.title}
                                style={{ width: "65%" }}
                            />
                            {/* Book Details Table */}
                            <div className="book-details">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Title:</th>
                                            <td>{selectedBook.title}</td>
                                        </tr>
                                        <tr>
                                            <th>Author:</th>
                                            <td>{selectedBook.author}</td>
                                        </tr>
                                        <tr>
                                            <th>ISBN:</th>
                                            <td>{selectedBook.isbn || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Region:</th>
                                            <td>{selectedBook.category || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Copies:</th>
                                            <td>{selectedBook.availableCopies || '0'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Side: Book Summary */}
                        <div className="modal-text">
                            <h2 className="fw-bold">Book Summary</h2>
                            <p>{selectedBook.description || "No summary available."}</p>
                        </div>

                        {/* Add to Cart Button at Bottom Right */}
                        <div className="modal-footer">
                            {/* If the book is out of stock, disable the button */}
                            {selectedBook.availableCopies === 0 ? (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-secondary disabled-cart-btn"
                                    disabled
                                    style={{
                                        marginRight: "77px",
                                        marginBottom: "0px",
                                        //position: "fixed"
                                    }}
                                >
                                    Out of Stock
                                </button>
                            ) : cartItems[selectedBook?.id] ? (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger removecart"
                                        style={{
                                            marginRight: "77px",
                                            marginBottom: "0px",
                                            //position: "fixed"
                                        }}
                                    onClick={() => {
                                        handleRemoveFromCart(selectedBook.id);

                                        // Update localStorage
                                        const updatedCart = { ...cartItems };
                                        delete updatedCart[selectedBook.id];
                                        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
                                    }}
                                >
                                    Remove from Cart
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        handleAddToCart(selectedBook);

                                        // Update localStorage
                                        //const updatedCart = { ...cartItems, [selectedBook.id]: selectedBook };
                                        //localStorage.setItem("cartItems", JSON.stringify(updatedCart));
                                    }}
                                    className="place-cart-btn"
                                            style={{
                                                marginRight: "77px",
                                                marginBottom: "0px",
                                                //position: "fixed"
                                            }}
                                >
                                    Add to Cart
                                </button>
                            
                            )}
                        </div>


                        {/* Close Button */}
                        <span className="close-button" onClick={handleCloseModal}>&times;</span>
                    </div>
                </div>


            )}


            {/* Footer (Always Same in Light/Dark Mode) */}
            { <Footer />}

            {/* Sticky Dark Mode Toggle Button */}
            {/*<button onClick={toggleDarkMode} className="dark-mode-toggle">*/}
            {/*{darkMode ? <i className="bi bi-brightness-high-fill"></i> : <i className="bi bi-moon-fill"></i>}*/}
            {/*</button>*/}
        </>
    );
}

export default ProductListingPage;