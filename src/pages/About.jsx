import React from "react";
import img1 from "../pages/atlascopco/R.jpg"
const AboutUs = () => {
    return (
        <div style={styles.container}>
            {/* Background Image */}
            <div style={styles.backgroundImage}></div>

            {/* Overlay with Diagonal Cut */}
            <div style={styles.overlay}></div>

            {/* Content */}
            <div style={styles.content}>
                <h1 style={styles.title}>
                    About <span style={styles.highlight}>Us</span>
                </h1>
                <div style={styles.divider}></div>
                <p style={styles.text}>
                    This is a sample text. Insert your desired text here. This is a sample
                    text. Insert your desired text here. This is a sample text. Insert
                    your desired text here.
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    backgroundImage: {
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${img1})`, // Replace with actual image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: -2,
    },
    overlay: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to right, rgba(0, 100, 100, 0.85), rgba(100, 200, 200, 0.85))",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 30% 100%)",
        zIndex: -1,
    },
    content: {
        position: "relative",
        zIndex: 10,
        color: "white",
        maxWidth: "600px",
        padding: "20px",
        textAlign: "left",
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    highlight: {
        color: "#e0e0e0",
    },
    divider: {
        width: "60px",
        height: "4px",
        backgroundColor: "white",
        marginBottom: "20px",
    },
    text: {
        fontSize: "1.2rem",
        lineHeight: "1.6",
    },
};

export default AboutUs;
