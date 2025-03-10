import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/actions";
import "./BookDescriptionPage.css";

const BookDescriptionPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState({});
    const dispatch = useDispatch();

    // Load cart status from localStorage
    const [isAddedToCart, setIsAddedToCart] = useState(
        localStorage.getItem(`cart_${id}`) === "true"
    );

    useEffect(() => {
        fetch(`http://localhost:5198/api/books/${id}`)
            .then((response) => response.json())
            .then((data) => setBook(data))
            .catch((error) => console.error("Error fetching book details:", error));
    }, [id]);

    const handleAddToCart = () => {
        if (book.availableCopies > 0) {
            dispatch(addToCart(book));
            setIsAddedToCart(true);
            localStorage.setItem(`cart_${id}`, "true"); // Persist cart status
        } else {
            alert("No more available copies");
        }
    };

    return (
        <div className="book-page-container">
            {/* Left Section: Image & Metadata */}
            <div className="book-details-left">
                <img
                    src={book.image || "https://via.placeholder.com/400"}
                    alt={book.title}
                    className="book-cover"
                />
                <div className="book-meta">
                    <div className="meta-row">
                        <div className="meta-label">Title</div>
                        <div className="meta-value">{book.title || "N/A"}</div>
                    </div>
                    <div className="meta-row">
                        <div className="meta-label">Author</div>
                        <div className="meta-value">{book.author || "N/A"}</div>
                    </div>
                    <div className="meta-row">
                        <div className="meta-label">ISBN</div>
                        <div className="meta-value">{book.isbn || "N/A"}</div>
                    </div>
                    <div className="meta-row">
                        <div className="meta-label">Publisher</div>
                        <div className="meta-value">{book.publisher || "N/A"}</div>
                    </div>
                    <div className="meta-row">
                        <div className="meta-label">Language</div>
                        <div className="meta-value">{book.language || "N/A"}</div>
                    </div>
                    <div className="meta-row">
                        <div className="meta-label">Pages</div>
                        <div className="meta-value">{book.pages || "N/A"}</div>
                    </div>
                    <div className="meta-row">
                        <div className="meta-label">Stock</div>
                        <div className="meta-value">{book.availableCopies || "N/A"}</div>
                    </div>
                </div>
            </div>

            {/* Vertical Line Divider */}
            <div className="vertical-line"></div>

            {/* Right Section: Book Description */}
            <div className="book-details-right">
                <p className="book-description">
                    {book.description || "No description available."}
                </p>
            </div>

            {/* Floating Add to Cart Button */}
            <button
                className="floating-cart-btn btn btn-success"
                onClick={handleAddToCart}
                disabled={isAddedToCart}
            >
                {isAddedToCart ? "Added to Cart" : "Place in Cart"}
            </button>
        </div>
    );




};

export default BookDescriptionPage;
