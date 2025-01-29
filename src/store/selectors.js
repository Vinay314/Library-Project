// src/store/selectors.js

export const selectIsInCart = (state, productId) => {
    return state.cart.items.some(item => item.id === productId);
  };
  