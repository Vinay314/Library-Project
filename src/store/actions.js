// src/store/actions.js
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
export const DECREASE_QUANTITY = 'DECREASE_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';
export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});


export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: { id: productId },
});

export const increaseQuantity = (id) => ({
  type: INCREASE_QUANTITY,
  payload: { id },
});

export const decreaseQuantity = (id) => ({
  type: DECREASE_QUANTITY,
  payload: { id },
});

export const clearCart = () => ({
    type: CLEAR_CART,
});
