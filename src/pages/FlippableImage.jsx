import { motion } from "framer-motion";
import { useState } from "react";
import './ProductListingPage.css';
const FlippableImage = ({ product, cartItems, handleOpenModal, handleEditBook1, removeBookByTitle, handleRemoveFromCart, handleAddToCart,book,admins }) => {
    const [isOpening, setIsOpening] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const username = localStorage.getItem("username"); // Get user info
    
    const canEditOrDelete = () => {
        
        if (!Array.isArray(admins)) {
            console.warn("admins is not an array or is null/undefined.");
            return false;
        }

        return admins.includes(username);
    };


    const handlePageTurnAndOpenModal = () => {
        if (!isMenuOpen){
        setIsOpening(true); // Start book opening animation
        setTimeout(() => {
            handleOpenModal(product); // Open modal after animation
            setIsOpening(false); // Reset animation
        }, 600);
    }
    };
    const handleMouseEnter = () => {
        setIsMenuOpen(true);
}
    const handleMouseLeave = () => {
        setIsMenuOpen(false);
}
    return (
        <motion.div
            className="flip-container mt-4"
            /*animate={{
                rotateY: !isMenuOpen && isOpening ? -120 : 0, // Opens outward towards the viewer
                opacity: !isMenuOpen && isOpening ? 0.9 : 1,
                scale: !isMenuOpen && isOpening ? 1.1 : 1, // Slightly zooms forward
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}*/
            onClick={handlePageTurnAndOpenModal}
            style={{
                display: "inline-block",
                position: "relative",
                transformOrigin: "left center", // Opens from the LEFT side
                perspective: 1000, // Creates a 3D effect
            }}
        >
            {/* Inner White Pages Effect */}
            <motion.div
                className="book-page"
               style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                    zIndex: 1, // Below the book cover
                    borderRadius: "5px",
                }}              animate={{
                  opacity: !isMenuOpen && isOpening ? 0 : 0, // Pages fade out as book opens
                  scaleX: !isMenuOpen && isOpening ? 0 : 0, // Expands before disappearing
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            <div key={product.id} className="col">
                
                    <div className="book-card">
                        


                    {/* Out of Stock Badge */}
                    {product.availableCopies === 0 && (
                        <div className="out-of-stock-badge">Out of Stock</div>
                    )}
                    <div className="settings-container" onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave} >
                        <i className="bi bi-three-dots-vertical settings-icon"></i>
                        <div className="dropdown-menu">
                            {canEditOrDelete(book) && (
                                <>
                            <button onClick={() => handleEditBook1(product)} className="dropdown-item">
                                <i className="bi bi-pencil"></i> Edit
                            </button>

                            <button onClick={() => removeBookByTitle(product.title, product.id)} className="dropdown-item">
                                <i className="bi bi-trash3"></i> Delete
                                    </button>
                            </>
                            )}

                            {/* Disable 'Place in Cart' if out of stock */}
                            <button
                                onClick={() => {
                                    if (product.availableCopies > 0) {
                                        if (cartItems[product.id]) {
                                            handleRemoveFromCart(product.id);
                                        } else {
                                            handleAddToCart(product);
                                        }

                                        // Update localStorage
                                        const updatedCart = cartItems[product.id]
                                            ? { ...cartItems, [product.id]: undefined }
                                            : { ...cartItems, [product.id]: product };

                                        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
                                    }
                                }}
                                className={`dropdown-item ${product.availableCopies === 0 ? 'disabled' : ''}`}
                                disabled={product.availableCopies === 0}
                            >
                                <i className="bi bi-cart"></i>
                                {cartItems[product.id] ? " Remove from Cart" : " Place in Cart"}
                            </button>
                        </div>
                    </div>
            {/* Book Cover (Stays on Top) */}
            <motion.img

                src={product.image || "https://via.placeholder.com/300x200"}
                className="book-image clickable-image"
                alt={product.title}
                style={{ position: "relative", zIndex: 2 , height:'330px',width:'200px'}}
                animate={{
                    rotateY: !isMenuOpen && isOpening ? -120 : 0, // Moves outward
                    scale: !isMenuOpen && isOpening ? 1.1 : 1, // Slightly zooms forward
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <div className="card-body">
                <strong><h1 className="fw-bold card-title">{product.title}</h1></strong>
                <h4 className="card-author">{product.author}</h4>
            </div>
        </div>
                </div >
                                   
        </motion.div>
    );
};

export default FlippableImage;
