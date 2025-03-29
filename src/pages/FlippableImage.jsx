import { motion } from "framer-motion";
import { useState } from "react";
import './ProductListingPage.css';
const FlippableImage = ({ product, handleOpenModal }) => {
    const [isOpening, setIsOpening] = useState(false);

    const handlePageTurnAndOpenModal = () => {
        setIsOpening(true); // Start book opening animation
        setTimeout(() => {
            handleOpenModal(product); // Open modal after animation
            setIsOpening(false); // Reset animation
        }, 600);
    };

    return (
        <motion.div
            className="flip-container mt-4"
            animate={{
                rotateY: isOpening ? -120 : 0, // Opens outward towards the viewer
                opacity: isOpening ? 0.9 : 1,
                scale: isOpening ? 1.1 : 1, // Slightly zooms forward
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
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
                className="book-pages"
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                    zIndex: 1, // Below the book cover
                    borderRadius: "5px",
                }}
                animate={{
                    opacity: isOpening ? 1 : 0, // Pages fade out as book opens
                    scaleX: isOpening ? 1 : 0, // Expands before disappearing
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {/* Book Cover (Stays on Top) */}
            <motion.img
                src={product.image || "https://via.placeholder.com/300x200"}
                className="book-image clickable-image"
                alt={product.title}
                style={{ position: "relative", zIndex: 2 , height:'330px',width:'200px'}}
                animate={{
                    rotateY: isOpening ? -120 : 0, // Moves outward
                    scale: isOpening ? 1.1 : 1, // Slightly zooms forward
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            />
        </motion.div>
    );
};

export default FlippableImage;
