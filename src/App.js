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
import AboutUs from './pages/About';
import Loader from './pages/Loader';


const App = () => {
    const [userString, setUserString] = useState(""); // State to manage userString
    const [searchQuery, setSearchQuery] = useState("");

    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const location = useLocation();
    const handleOpenAboutModal = () => {
        setIsAboutModalOpen(true);
    };

    const handleCloseAboutModal = () => {
        setIsAboutModalOpen(false);
    };

    return (
        <>
            {location.pathname !== "/products" && location.pathname!=="/" && (
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} userString={userString} setUserString={setUserString} onOpenAbout={handleOpenAboutModal} />
            )}

            <Routes>
                <Route path="/" element={<ProductListingPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} userString={userString} onOpenAbout={handleOpenAboutModal} />} />
                <Route path="/products" element={<ProductListingPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} userString={userString} onOpenAbout={handleOpenAboutModal} />} />
                <Route path="/cart" element={<ShoppingCartPage onOpenAbout={handleOpenAboutModal} />} />
                <Route path="/add-book" element={<AddBookPage />} />
                <Route path="/remove-book" element={<RemoveBookPage />} />
                <Route path="/books/:id" element={<BookDescriptionPage />} />
                <Route path="/update-book/:id" element={<UpdateBookPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/cart" element={<ShoppingCartPage />} />
                <Route path="/loader" element={<Loader/>}/>
            </Routes>
            {/* Global About Us Modal */}
            {isAboutModalOpen && (
                <div className="modal-overlay" onClick={handleCloseAboutModal}>
                    <div className="modal-content-about" onClick={(e) => e.stopPropagation()}>
                        <AboutUs />
                        <button className="close-button" onClick={handleCloseAboutModal}>&times;</button>
                    </div>
                </div>
            )}
        </>

    );
};

export default App;
