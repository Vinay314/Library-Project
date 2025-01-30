import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import ProductCard from '../components/ProductCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductListingPage.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function ProductListingPage() {
    const [products, setProducts] = useState([]);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'enabled');
    const navigate = useNavigate();

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
            strings: ["read.", "explore.", "learn.", "grow.", "play."], // Words that will be typed
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 1500,
            loop: true
        };
        const typed = new Typed('.typed-text', options);

        return () => typed.destroy();
    }, []);

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
        <div className={`container ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            {/* Navbar */}
            <nav className={`navbar ${darkMode ? 'bg-dark navbar-dark' : 'bg-custom navbar-light'} p-3`}>
                <div className="container">
                    <a className="navbar-brand d-flex align-items-center" href="#">
                        <span className="me-2"></span>
                        <strong>Album</strong>
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-5 text-center container">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">CTS Library</h1>
                        <p className="fw-light">
                            Atlas Copco is a global industrial company that provides innovative and sustainable solutions in the areas of compressors, vacuum solutions, generators, industrial tools, and assembly systems. They serve a wide range of industries, including manufacturing, construction, and mining, with a strong focus on energy efficiency and technological advancement.
                        </p>
                    </div>
                </div>
            </section>

            {/* Dynamic Typing Section */}
            <section className="hero-section">
                <div className="hero-overlay">
                    <h1 className="hero-title">
                        Atlas Copco Group's space to <span className="typed-text"></span>
                        <span className="typed-cursor"></span>
                    </h1>
                    <p className="hero-subtitle">Technology that transforms the future.</p>
                </div>
            </section>

            {/* Creative Add Book Button */}
            <div className="text-center my-4">
                <button
                    onClick={() => navigate('/add-book')}
                    className={`btn add-book-btn ${darkMode ? 'btn-dark-mode' : 'btn-light-mode'}`}
                >
                    Add a New Book
                </button>
            </div>

            {/* Product Listing Section */}
            <div className={`album py-5 ${darkMode ? 'bg-dark' : 'bg-light'}`}>
                <div className="container">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {products.map(product => (
                            <div key={product.id} className="col">
                                <div className={`card shadow-sm ${darkMode ? 'bg-secondary text-white' : ''}`}>
                                    <img src={product.image || "https://via.placeholder.com/300x200"} className="card-img-top" alt={product.title} />
                                    <div className="card-body">
                                        <p className="card-text">{product.title}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="btn-group">
                                                <button onClick={() => navigate(`/books/${product.id}`)} className="btn btn-sm btn-outline-secondary">View</button>
                                                <button onClick={() => navigate(`/update-book/${product.id}`)} className="btn btn-sm btn-outline-secondary">Edit</button>
                                            </div>
                                            <button className="btn btn-sm btn-danger" onClick={() => removeBookByTitle(product.title)}>Remove</button>
                                            <small className="text-muted">{product.duration || '9 mins'}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={`text-muted py-5 ${darkMode ? 'bg-dark text-white' : ''}`}>
                <div className="container text-center">
                    <p className="mb-0">
                        Made with <img src="/assets/atlas_copco.png" alt="atlas_copco" width="16" height="16" /> by Paradise of Books Team
                    </p>
                </div>
            </footer>

            {/* Dark Mode Toggle Button */}
            <button onClick={toggleDarkMode} className="btn btn-primary position-fixed bottom-0 end-0 m-3">
                {darkMode ? <i className="bi bi-brightness-high-fill"></i> : <i className="bi bi-moon-fill"></i>}
            </button>

        </div>
    );
}

export default ProductListingPage;