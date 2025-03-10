import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import ProductCard from '../components/ProductCard';
import { Plus } from "lucide-react";
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

    


    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
       
        if (value.trim().length<3) {
            setSuggestions([]);
            setSearchQuery(""); 
        } else {
            const filteredSuggestions = products
                .filter(product => product.title.toLowerCase().includes(value.toLowerCase()))
                .map(product => product.title);

            setSuggestions(filteredSuggestions);
        }
    };
    const handleAddBook = () => {
        navigate("/add-book");
        
    };
    useEffect(() => {
        if (sessionStorage.getItem("bookAdded") === "true") {
            Swal.fire({
                title: "Book Added!",
                text: "The book has been successfully added.",
                icon: "success",
                confirmButtonColor: "#008080",
            });

            sessionStorage.removeItem("bookAdded"); // Remove flag after alert
        }
    }, []);

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

        // Update localStorage to remove the book
        const updatedCart = { ...cartItems };
        delete updatedCart[bookId];
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    };



    const handleAddToCart = (book) => {
        if (book.availableCopies > 0) {
            dispatch(addToCart(book));

            // Update cart state in localStorage
            const updatedCart = { ...cartItems, [book.id]: true };
            setCartItems(updatedCart);
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));

            setSelectedBook(prev => ({ ...prev, quantity: 1 }));
        } else {
            alert('No more available copies');
        }
    };

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

    const handleSearch = () => {
        setSearchQuery(searchTerm);
    };

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
            strings: ["Read.", "Explore.", "Learn.", "Grow.","Transform.","Enlighten.","Connect.","Absorb.","Engage.","Enrich.","Flourish.","Inspire." ],
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
    useEffect(() => {
        if (localStorage.getItem("bookUpdated") === "true") {
            Swal.fire({
                title: 'Book Updated!',
                text: 'The book has been successfully edited.',
                icon: 'success',
                confirmButtonColor: '#008080',
            });

            // Remove the flag to prevent showing the alert again
            localStorage.removeItem("bookUpdated");
        }
    }, []);
    const removeBookByTitle = (title) => {
        Swal.fire({
            title: `Are you sure?`,
            text: `Do you really want to delete "${title}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#008080', // Teal color
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5198/api/books/remove-by-title/${encodeURIComponent(title)}`, { method: 'DELETE' })
                    .then(response => {
                        if (!response.ok) throw new Error('Failed to remove book');
                        return response.json();
                    })
                    .then(() => {
                        setProducts(products.filter(product => product.title.toLowerCase() !== title.toLowerCase()));
                        Swal.fire({
                            title: 'Deleted!',
                            text: `Book titled "${title}" has been removed successfully.`,
                            icon: 'success',
                            confirmButtonColor: '#008080'
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



    return (
        <>
            
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} products={products} />
            
            <div className={`container-fluid full-page-container ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'} ${selectedBook ? 'blur-background' : ''}`}>

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
                    <div className="hero-overlay text-center w-100 d-flex flex-column align-items-center justify-content-center">
                        <h1 className="hero-title">
                            Atlas Copco Group's Space to <span className="typed-text"></span>
                        </h1>
                        <p className="hero-subtitle">Technology that transforms the future.</p>
                    </div>
                   
                    <div className="search-bar w-85">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for books..."
                            value={searchTerm}
                            onChange={handleSearchChange}
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

                            {filteredProducts.length > 0 ? (

                                filteredProducts.map(product => (
                                    <div key={product.id} className="col">
                                        <div className={`book-card ${darkMode ? 'bg-secondary text-white' : ''}`}>
                                            <div className="settings-container">
                                                <i className="bi bi-three-dots-vertical settings-icon"></i>
                                                <div className="dropdown-menu">
                                                    <button onClick={() => handleEditBook(product)} className="dropdown-item">
                                                        <i className="bi bi-pencil"></i> Edit
                                                    </button>
                                                    <button onClick={() => removeBookByTitle(product.title)} className="dropdown-item">
                                                        <i className="bi bi-trash3"></i> Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Button Container in Top Right */}
                                            {/*<div className="button-container">*/}
                                            {/*    <button onClick={() => handleEditBook(product)} className="edit-btn">*/}
                                            {/*        <i className="bi bi-pencil"></i>*/}
                                            {/*    </button>*/}
                                            {/*    <button onClick={() => removeBookByTitle(product.title)} className="btn btn-sm btn-danger remove-btn">*/}
                                            {/*        <i className="bi bi-trash3"></i>*/}
                                            {/*    </button>*/}
                                            {/*</div>*/}

                                            {/* Clickable Image moved slightly down */}
                                            <img

                                                src={product.image || "https://via.placeholder.com/300x200"}

                                                className="book-image clickable-image mt-4"

                                                alt={product.title}

                                                onClick={() => handleOpenModal(product)}

                                            />

                                            <div className="card-body">
                                                <strong><h1 className="fw-bold card-title">{product.title}</h1></strong>
                                                <h4 className="card-author">{product.author}</h4>
                                            </div>
                                        </div>
                                    </div>

                                ))

                            ) : (
                                <p className="text-center">No books found.</p>

                            )}
                        </div>
                    </div>


                </div>

            </div>

            {/* Floating Add Button above Footer */}
            <button className="add-book-button" onClick={handleAddBook}>
                <Plus size={30} />
            </button>
            {selectedBook && (
                <div className="modal-overlay">
                    <div className="modal-content d-flex">
                        {/* Image Section */}
                        <div className="col-md-4 d-flex justify-content-center align-items-start">
                            <img
                                src={selectedBook.image || 'https://via.placeholder.com/200'}
                                alt={selectedBook.title}
                                className="img-fluid rounded shadow"
                                style={{ maxHeight: '300px' }}
                            />
                        </div>

                        {/* Text Section */}
                        <div className="col-md-8 d-flex flex-column justify-content-between modal-text">
                            <div>
                                <h2 className="fw-bold">{selectedBook.title}</h2>
                                <p><strong>Author:</strong> {selectedBook.author}</p>
                                <p>{selectedBook.description}</p>
                            </div>

                            {/* Button at Bottom */}
                            <div className="modal-footer">
                                {cartItems[selectedBook?.id] ? (
                                    <button
                                        type="button"
                                        className="btn btn-danger w-100"
                                        onClick={() => handleRemoveFromCart(selectedBook.id)}
                                    >
                                        Remove from Cart
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAddToCart(selectedBook)}
                                        className="btn btn-success w-100"
                                        style={{ backgroundColor: "teal", color: "white" }}
                                    >
                                        Add to Cart
                                    </button>
                                )}



                            </div>

                        </div>

                        <span className="close-button" onClick={handleCloseModal}>&times;</span>
                    </div>

                </div>
            )}


            {/* Footer (Always Same in Light/Dark Mode) */}
            {/* <Footer />*/}

            {/* Sticky Dark Mode Toggle Button */}
            {/*<button onClick={toggleDarkMode} className="dark-mode-toggle">*/}
            {/*{darkMode ? <i className="bi bi-brightness-high-fill"></i> : <i className="bi bi-moon-fill"></i>}*/}
            {/*</button>*/}
        </>
    );
}

export default ProductListingPage;