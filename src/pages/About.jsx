import React from "react";

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
                    Welcome to BrainBank Library, your go-to digital hub for knowledge and learning.
                    Our platform provides a vast collection of books across various genres, making it easy for readers, students, and researchers to access valuable resources.<br />
                    <br></br>
                    Whether you're looking for academic materials, fiction, or industry insights, BrainBank Library is designed to support your intellectual growth.
                    With a user-friendly interface and seamless browsing experience, we aim to make reading and learning more accessible than ever.
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
        width: "100%",
        height: "100%", // Ensure height is explicitly set
        backgroundImage: `url(${require("../pages/atlascopco/R.jpg")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 0,
    },
    overlay: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(to right, rgba(0, 100, 100, 0.85), rgba(100, 200, 200, 0.85))",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 30% 100%)",
        
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
        color:'white',
    },
    highlight: {
        color: "white",
    },
    divider: {
        width: "160px",
        height: "4px",
        backgroundColor: "white",
        marginBottom: "20px",
    },
    text: {
        fontSize: "1.2rem",
        lineHeight: "1.6",
        color: 'white',
        textAlign:'justify',
    },

};

export default AboutUs;
