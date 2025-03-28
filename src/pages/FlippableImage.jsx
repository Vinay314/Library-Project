import { motion } from "framer-motion";
import { useState } from "react";

const FlippableImage = ({ product, handleOpenModal }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlipAndOpenModal = () => {
        setIsFlipped(true);
        setTimeout(() => {
            handleOpenModal(product);
            setIsFlipped(false); // Reset flip after modal opens
        }, 600); 
    };

    return (
        <motion.div
            className="flip-container mt-4"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            onClick={handleFlipAndOpenModal}
        >
            <img
                src={product.image || "https://via.placeholder.com/300x200"}
                className="book-image clickable-image"
                alt={product.title}
            />
        </motion.div>
    );
};

export default FlippableImage;
