import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProductListingPage from './pages/ProductListingPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import AddBookPage from './components/AddBookPage';
import RemoveBookPage from './components/RemoveBookPage';
import BookDescriptionPage from './pages/BookDescriptionPage';
import UpdateBookPage from './components/UpdateBookPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [userString, setUserString] = useState(""); // State to manage userString
    const [searchQuery, setSearchQuery] = useState("");

    const location = useLocation();

    return (
        <>
            {location.pathname !== "/products" && location.pathname!=="/" && (
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} userString={userString} setUserString={setUserString} />
            )}

            <Routes>
                <Route path="/" element={<ProductListingPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} userString={userString} />} />
                <Route path="/products" element={<ProductListingPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} userString={userString} />} />
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
