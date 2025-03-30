import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Loader.css";

const Loader = ({ onComplete }) => {
    const [exitAnimation, setExitAnimation] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setExitAnimation(true);
            setTimeout(onComplete, 2000); // Smooth exit delay
        }, 5000); // Show loader for 5 seconds
    }, [onComplete]);

    return (
        <motion.div
            className="loader-container"
            initial={{ opacity: 1 }}
            animate={{ opacity: exitAnimation ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        >
            <div className="cube">
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face left"></div>
                <div className="face right"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
            </div>

            <motion.div
                className="loader-text"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.5 }}
            >
                Loading...
            </motion.div>
        </motion.div>
    );
};

export default Loader;