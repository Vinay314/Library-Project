import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { REMOVE_FROM_CART, INCREASE_QUANTITY, DECREASE_QUANTITY } from "../store/actions";
import "./CartItem.css"; // Import external CSS file

const CartItem = ({ item }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const cartItems = useSelector((state) => state.cart.items);
    const cartItem = cartItems.find((cartItem) => cartItem.id === item?.id);
    const initialState = {
        items: JSON.parse(localStorage.getItem("cartItems")) || [], // Load from localStorage
    };
    const availableCopies = item?.availableCopies - (cartItem ? cartItem.quantity : 0);

    useEffect(() => {
        fetch(`http://localhost:5198/api/books/${item.id}/title`)
            .then((response) => response.text())
            .then((title) => setTitle(title))
            .catch((error) => console.error("Error fetching title:", error));
    }, [item.id]);

    useEffect(() => {
        fetch(`http://localhost:5198/api/books/${item.id}/author`)
            .then((response) => response.text())
            .then((author) => setAuthor(author))
            .catch((error) => console.error("Error fetching Author:", error));
    }, [item.id]);

    const handleRemoveBook = () => {
        dispatch({
            type: REMOVE_FROM_CART,
            payload: { id: item.id },
        });

        // Update Local Storage
        //const storedCart = JSON.parse(localStorage.getItem("cartItems")) || {};
        //delete storedCart[item.id]; // Remove the book from storage
        //localStorage.setItem("cartItems", JSON.stringify(storedCart));
    };

    const handleIncreaseBook = () => {
        if (item.quantity < item.availableCopies) {
            dispatch({
                type: INCREASE_QUANTITY,
                payload: { id: item.id },
            });
        } else {
            alert("No more available copies");
        }
    };

    const handleDecreaseBook = () => {
        if (item.quantity > 1) {
            dispatch({
                type: DECREASE_QUANTITY,
                payload: { id: item.id },
            });
        } else {
            handleRemoveBook();
        }
    };

    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />

            <div className="cart-item-details">
                <p className="item-name">{item.name}</p>
                <p className="title">Title: {title}</p>
                <p className="author">Author: {author}</p>

                <div className="buttons-container">
                    <button onClick={handleDecreaseBook} className="button">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={handleIncreaseBook} className="button">+</button>
                </div>
            </div>

            <button onClick={handleRemoveBook} className="remove-button">Remove</button>
        </div>
    );
};

export default CartItem;
