import { motion } from "framer-motion";

const BookModal = ({ book, onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white p-6 rounded-lg shadow-lg w-96"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-2">{book.title}</h2>
                <p>{book.description}</p>
                <button
                    onClick={onClose}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                    Close
                </button>
            </motion.div>
        </motion.div>
    );
};

export default BookModal;
