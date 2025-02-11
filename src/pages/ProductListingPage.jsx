import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import ProductCard from '../components/ProductCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductListingPage.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from './Footer';

function ProductListingPage() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'enabled');
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

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
            strings: ["read.", "explore.", "learn.", "grow."],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 1500,
            loop: true
        };
        const typed = new Typed('.typed-text', options);

        return () => typed.destroy();
    }, []);

    
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const removeBookByTitle = (title) => {
        fetch(`http://localhost:5198/api/books/remove-by-title/${encodeURIComponent(title)}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Failed to remove book');
                return response.json();
            })
            .then(() => {
                setProducts(products.filter(product => product.title.toLowerCase() !== title.toLowerCase()));
                alert(`Book titled "${title}" has been removed successfully!`);
            })
            .catch(error => console.error('Error removing book:', error));
    };

    return (
        <>
            <div className={`container-fluid full-page-container ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>

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
                    <div className="hero-overlay text-center w-75">
                        <h1 className="hero-title">
                            Atlas Copco Group's space to <span className="typed-text"></span>
                        </h1>
                        <p className="hero-subtitle">Technology that transforms the future.</p>
                    </div>
                    <div className="search-bar w-75">
                        <input
                            type="text"
                            className="search-input w-100"
                            placeholder="Search for books..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="bi bi-search search-icon" onClick={handleSearch}></i>
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
                <div className="text-center my-4">
                    <button
                        onClick={() => navigate('/add-book')}
                        className={`btn add-book-btn ${darkMode ? 'btn-dark-mode' : 'btn-light-mode'}`}
                    >
                        Add a New Book
                    </button>
                </div>

                {/* Product Listing Section */}
                <div className="album py-5">
                    <div className="container">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <div key={product.id} className="col">
                                        <div className={`card shadow-sm product-card ${darkMode ? 'bg-secondary text-white' : ''}`}>
                                            {/* Clickable Image */}
                                            <img
                                                src={product.image || "https://via.placeholder.com/300x200"}
                                                className="card-img-top clickable-image"
                                                alt={product.title}
                                                onClick={() => navigate(`/books/${product.id}`)}
                                            />
                                            <div className="card-body">
                                                <strong><h1 className="fw-bold card-text-title">{product.title}</h1></strong>
                                                <h4 className="card-text-author">{product.author}</h4>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <button onClick={() => navigate(`/update-book/${product.id}`)} className="btn btn-sm btn-outline-secondary edit-btn"><i class="bi bi-pencil"></i></button>
                                                    {/*<button onClick={() => removeBookByTitle(product.title)} className="btn btn-sm btn-outline-secondary remove-btn">Remove</button>*/}
                                                    <button onClick={() => removeBookByTitle(product.title)} className="btn btn-sm btn-danger remove-btn d-none d-md-inline">
                                                        Remove
                                                    </button>
                                                    <button onClick={() => removeBookByTitle(product.title)} className="btn btn-sm btn-danger remove-btn d-md-none">
                                                        <i className="bi bi-x-lg"></i>
                                                    </button>


                                                </div>
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
            {/* Footer (Always Same in Light/Dark Mode) */}
            <Footer />

            {/* Sticky Dark Mode Toggle Button */}
            {/*<button onClick={toggleDarkMode} className="dark-mode-toggle">*/}
            {/*{darkMode ? <i className="bi bi-brightness-high-fill"></i> : <i className="bi bi-moon-fill"></i>}*/}
            {/*</button>*/}
        </>
    );
}

export default ProductListingPage;