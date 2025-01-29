import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div>
            <div></div>
            <h1>Paradise of Books</h1>
            <h3>Feels Like Heaven!!!</h3>
            <p>Welcome to Paradise of Books, your one-stop shop for the best books. We offer a wide variety of books to read, from various authors. Our mission is to provide high-quality reading material and exceptional customer service, ensuring your reading experience is as enjoyable and fulfilling as possible.</p>
            <Link to="/products">
                <button>Get Started</button>
            </Link>
            <footer>
                <p>
                    Made with <img src="/assets/atlas_copco.png" alt="atlas_copco"/>
                    by Paradise of Books Team
                </p>
            </footer>
        </div>
    );
};



export default LandingPage;

