import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import ProductListingPage from './pages/ProductListingPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import AddBookPage from './components/AddBookPage';
import RemoveBookPage from './components/RemoveBookPage'; // Adjust path if necessary
import BookDescriptionPage from './pages/BookDescriptionPage'; // Import the BookDescriptionPage component
import UpdateBookPage from './components/UpdateBookPage'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <>
       
            <Header />
            
            <Routes>
                <Route path="/" element={<ProductListingPage />} />
                <Route path="/products" element={<ProductListingPage />} />
                <Route path="/cart" element={<ShoppingCartPage />} />
                <Route path="/add-book" element={<AddBookPage />} />
                <Route path="/remove-book" element={<RemoveBookPage />} />
                <Route path="/books/:id" element={<BookDescriptionPage />} />
                <Route path="/update-book/:id" element={<UpdateBookPage />} />
                </Routes>
            
        </>
    );
};

export default App;