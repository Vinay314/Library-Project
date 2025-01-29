import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './ProductListingPage.css';

function ProductListingPage() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

    const removeBookByTitle = (title) => {
        fetch(`http://localhost:5198/api/books/remove-by-title/${encodeURIComponent(title)}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to remove book');
                }
                return response.json();
            })
            .then(data => {
                setProducts(products.filter(product => product.title.toLowerCase() !== title.toLowerCase()));
                alert(`Book titled "${title}" has been removed successfully!`);
            })
            .catch(error => console.error('Error removing book:', error));
    };

    const categories = ['All', 'Comedy', 'Adventure', 'Fictional'];

    useEffect(() => {
        fetch('http://localhost:5198/api/books')
            .then(response => response.json())
            .then(data => {
                setProducts(data.books);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div style={styles.ProductListingPage}>
            <button
                onClick={() => navigate('/add-book')}
                className="add-book-button"
            >
                Add Book
            </button>
            <div className="category-filter">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="product-listing">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-item">
                        <ProductCard product={product} />
                        {/*<button*/}
                        {/*    onClick={() => removeBookByTitle(product.title)}*/}
                        {/*    className="remove-book-button"*/}
                        {/*>*/}
                        {/*    Remove Book*/}
                        {/*</button>*/}
                        {/*<button*/}
                        {/*    onClick={() => navigate(`/books/${product.id}`)}*/}
                        {/*    className="about-book-button"*/}
                        {/*>*/}
                        {/*    About this Book*/}
                        {/*</button>*/}
                    </div>
                ))}
            </div>
            <footer style={styles.footer}>
                <p style={styles.footerP}>
                    Made with <img src="/assets/atlas_copco.png" alt="atlas_copco" style={styles.footerIcon} />
                    by Paradise of Books Team
                </p>
            </footer>
        </div>
    );
}

const styles = {
    ProductListingPage: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        paddingBottom: '60px', // Prevent content from being hidden behind the footer
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
        marginTop: '20px',
    },
    footer: {
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #ddd',
        textAlign: 'center',
        zIndex: '1000',
    },
    footerP: {
        margin: '0',
        fontSize: '14px',
        color: '#6c757d',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerIcon: {
        width: '16px', // Adjust to a small icon size
        height: '16px', // Adjust to a small icon size
        marginLeft: '5px',
    },
};

styles.button[':hover'] = {
    backgroundColor: '#0056b3',
};

export default ProductListingPage;
