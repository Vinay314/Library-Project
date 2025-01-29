import { ADD_TO_CART, REMOVE_FROM_CART, INCREASE_QUANTITY, DECREASE_QUANTITY, CLEAR_CART } from './actions';

const initialState = {
    products: [
        { id: 1, name: 'Sara Donati', price: '$20', image: 'sara-donati.jpg', category: 'Comedy' },
        { id: 2, name: 'lord-of-the-rings', price: '$15', image: 'lord-of-the-rings.jpg', category: 'Adventure' },
        { id: 3, name: 'Stephen King', price: '$10', image: 'stephen-king.jpg', category: 'Comedy' },
        { id: 4, name: 'Hobbit', price: '$12', image: 'hobbit.jpg', category: 'Adventure' },
        { id: 5, name: 'Blyton', price: '$18', image: 'blyton.jpg', category: 'Fictional' },
        { id: 6, name: 'Anthony', price: '$16', image: 'anthony.jpg', category: 'Fictional' },
    ],
    cart: {
        items: [],
        totalCost: 0,
    },
};

const parsePrice = (price) => {
    return typeof price === 'string' ? parseFloat(price.replace('$', '')) : price;
};

const calculateTotalCost = (items) => {
    return items.reduce((total, item) => total + (parsePrice(item.price) * item.quantity), 0);
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const existingItem = state.cart.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                const updatedItems = state.cart.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                return {
                    ...state,
                    cart: {
                        items: updatedItems,
                        totalCost: calculateTotalCost(updatedItems),
                    },
                };
            } else {
                const newItem = { ...action.payload, quantity: 1 };
                const updatedItems = [...state.cart.items, newItem];
                return {
                    ...state,
                    cart: {
                        items: updatedItems,
                        totalCost: calculateTotalCost(updatedItems),
                    },
                };
            }

        case REMOVE_FROM_CART:
            const itemToRemove = state.cart.items.find(item => item.id === action.payload.id);
            if (itemToRemove) {
                const updatedItems = state.cart.items.filter(item => item.id !== action.payload.id);
                return {
                    ...state,
                    cart: {
                        items: updatedItems,
                        totalCost: calculateTotalCost(updatedItems),
                    },
                };
            }
            return state;

        case INCREASE_QUANTITY:
            const itemToIncrease = state.cart.items.find(item => item.id === action.payload.id);
            if (itemToIncrease) {
                const updatedItems = state.cart.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                return {
                    ...state,
                    cart: {
                        items: updatedItems,
                        totalCost: calculateTotalCost(updatedItems),
                    },
                };
            }
            return state;

        case DECREASE_QUANTITY:
            const itemToDecrease = state.cart.items.find(item => item.id === action.payload.id);
            if (itemToDecrease && itemToDecrease.quantity > 1) {
                const updatedItems = state.cart.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
                return {
                    ...state,
                    cart: {
                        items: updatedItems,
                        totalCost: calculateTotalCost(updatedItems),
                    },
                };
            }
            return state;

        case CLEAR_CART:
            return {
                ...state,
                cart: {
                    items: [], // Reset cart items to an empty array
                    totalCost: 0, // Reset total cost to 0
                },
            };

        default:
            return state;
    }
};

export default rootReducer;