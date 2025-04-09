import React, { useEffect } from 'react';
import './Loader.css';
import atlaslogo from './atlascopco/AtlasCopcoGroupLogo.jpg'
const pageTexts = [
    "At Atlas Copco, innovation starts with knowledge.",
    "Books open the door to understanding and ideas.",
    "We empower minds to build sustainable industries.",
    "Reading is how we stay curious and capable.",
    "A well-read mind shapes a better tomorrow.",
    "Atlas Copco supports continuous learning and growth."
];

const Loader = () => {
    useEffect(() => {
        const pages = document.querySelectorAll('.page');
        let z = pages.length;

        pages.forEach((page, i) => {
            if (i % 2 === 0) page.style.zIndex = z--;
            page.classList.add('flip');
            page.style.animationDelay = `${i * 1.2}s`; // Slower flip delay
        });
    }, []);



    return (
        <div className="loader-wrapper">
            <div className="loader-content">
                <div className="book">
                    <div className="cover">
                        <div className="page-content front">
                            <img src={atlaslogo} alt="Atlas Copco Logo" className="logo" />
                            <p className="logo-text">Innovation through Reading</p>
                        </div>
                    </div>

                    {pageTexts.map((text, i) => (
                        <div className="page" key={i}>
                            <div className="page-content">{text}</div>
                        </div>
                    ))}
                </div>

                <p className="quote">A reader lives a thousand lives before he dies.</p>

            </div>
        </div>



    );
};

export default Loader;