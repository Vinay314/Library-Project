import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { User, BookCopy, BookOpen, FileText, Layers,IdCard, Image as ImageIcon, X } from 'lucide-react';

const styles = {
    option: {
        color:"black",
    },
    form: {
        backgroundColor: '#184d59',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
        width: '100%',
        maxWidth: '650px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'transparent !important',
        boxShadow: 'none !important',
        marginLeft: 'auto',
        marginRight: 'auto',
        
       
    },


    formGroup: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        justifyContent: 'space-between',

    },
    icon: {
        color: 'black',
        marginRight: '10px',
    },
    input: {
        backgroundColor: 'white',
        border: 'none',
        color: 'black',
        outline: 'none',
        flex: 1,
    },

    textarea: {
        backgroundColor: 'white',
        color: 'black', // Ensure typed text is black

        border: 'none',
        color: 'black',
        outline: 'none',
        flex: 1,
        height: '50px',
        resize: 'none',
    },
    button: {
        padding: '10px',
        backgroundColor: 'teal',
        color: 'white',
        border: '100px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop:'20px',
        height:'70px',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
    },
};

const AddBookPage = ({onClose ,onBookAdded}) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [availableCopies, setAvailableCopies] = useState(1);
    const [isbn, setIsbn] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const handleAddBook = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        if (!image) {
            Swal.fire("Error", "Please upload an image!", "error");
            return;
        }

        const formData = new FormData();
        formData.append('file', image);
        formData.append('title', title);
        formData.append('author', author);
        formData.append('category', category);
        formData.append('availableCopies', availableCopies);
        formData.append('description', description);
        formData.append('isbn', isbn);

        try {
            const response = await fetch('http://localhost:5198/api/books', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const newBook = await response.json();

                onClose();  
                onBookAdded(newBook); 

                setTimeout(() => {  
                    Swal.fire({
                        title: "Success",
                        text: "Book added successfully!",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#008080" // Teal color
                    });
                }, 300);

            } else {
                Swal.fire("Error", "Failed to add book", "error");
            }
        } catch (error) {
            console.error("Error adding book:", error);
            Swal.fire("Error", "Something went wrong!", "error");
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith("image/")) {
                Swal.fire({
                    title: "Invalid File",
                    text: "Please upload a valid image file!",
                    icon: "error"
                }).then(() => {
                    onClose(); // Close the modal after the alert is dismissed
                });
                return;
            }
            setImage(file);
        }
    };


    const handlePreviewClick = () => {
        if (image) {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    //const handleClose = () => {
    //    sessionStorage.setItem("bookAdded", "false");
    //    navigate('/products');
    //};
    const handleClose = () => {
        sessionStorage.setItem("bookAdded", "false");
        onClose();
    };

    return (
        
        <form onSubmit={handleAddBook} style={styles.form}>
            {/* Close Button */}
            <h1 style={{
                color: 'white',
                textAlign: 'center',
                marginBottom: '50px' // Adjust the spacing as needed
            }}>Add a new book</h1>

            {/* Placeholder styling */}
            <style>
                {`
        input::placeholder, 
        textarea::placeholder {
            color: black !important; /* Force black placeholder */
            opacity: 1; /* Ensure full visibility */
        }
        `}
            </style>
            <button type="button" onClick={onClose} style={styles.closeButton}>
                <X size={18} />
            </button>

            {/* Title */}
            <div style={styles.formGroup}>
                <BookOpen size={18} style={styles.icon} />
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>

            {/* Author */}
            <div style={styles.formGroup}>
                <User size={18} style={styles.icon} />
                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>

            {/* Category */}
            <div style={styles.formGroup}>
                <Layers size={18} style={styles.icon} />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={styles.input}
                    required
                >
                    <option style={styles.option}  value="">Select Region</option>
                    <option style={styles.option} value="Wilrijk">Wilrijk</option>
                    <option style={styles.option} value="Gecia">Gecia</option>
                    <option style={styles.option} value="Brno">Brno</option>
                </select>
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
                <FileText size={18} style={styles.icon} />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.textarea}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <BookCopy size={18} style={styles.icon} />
                <input
                    type="number"
                    value={availableCopies}
                    onChange={(e) => setAvailableCopies(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            {/* ISBN */}
            <div style={styles.formGroup}>
                <IdCard size={18} style={styles.icon} />
                <input
                    placeholder="ISBN"
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>

            {/* Image Upload */}
            <div style={styles.formGroup}>
                <ImageIcon size={18} style={styles.icon} />
                <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={styles.input}
                    required
                />
            </div>

            {/* Submit Button */}
            <button type="submit" style={styles.button}>Add Book</button>

            {/* Image Preview Modal */}
            {isModalOpen && image && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <span style={styles.modalClose} onClick={handleCloseModal}>&times;</span>
                        <img src={URL.createObjectURL(image)} alt="Preview" style={styles.modalImage} />
                    </div>
                </div>
            )}
        </form>
    );
};

export default AddBookPage;