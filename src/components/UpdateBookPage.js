import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateBookPage = () => {
    const { id } = useParams(); // Get the book ID from URL parameters
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [availableCopies, setAvailableCopies] = useState(1);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Fetch the current book data from the API when the component mounts
    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const response = await fetch(`http://localhost:5198/api/books/${id}`);
                if (response.ok) {
                    const book = await response.json();
                    setTitle(book.title);
                    setAuthor(book.author);
                    setCategory(book.category);
                    setDescription(book.description);
                    setAvailableCopies(book.availableCopies);
                } else {
                    console.error('Failed to fetch book data');
                    alert('Book not found');
                }
            } catch (error) {
                console.error('Error fetching book data:', error);
                alert('Error fetching book data');
            }
        };

        fetchBookData();
    }, [id]);

    const handleUpdateBook = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Add all required fields (without price)
        formData.append('title', title);
        formData.append('author', author);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('availableCopies', parseInt(availableCopies, 10));

        if (image) {
            formData.append('file', image);  // Add the image if it's provided
        }

        // Log FormData entries to inspect the data being sent
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const response = await fetch(`http://localhost:5198/api/books/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                navigate('/products'); // Redirect to the products page after successful update
            } else {
                console.error('Failed to update the book:', response.statusText);
                alert('Failed to update the book');
            }
        } catch (error) {
            console.error('Error updating the book:', error);
            alert('Error updating the book');
        }
    };


    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleClose = () => {
        navigate('/products');
    };
    const handlePreviewClick = () => {
        if (image) {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.closeButton} onClick={handleClose}>X</div>
            <form onSubmit={handleUpdateBook} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Author:</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={styles.input}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Fictional">Fictional</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={styles.textarea}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Available Copies:</label>
                    <input
                        type="number"
                        value={availableCopies}
                        onChange={(e) => setAvailableCopies(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Image:</label>
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={styles.input}
                    />
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Preview:</label>
                        <button type="button" onClick={handlePreviewClick} style={styles.previewButton}>
                            <i className="bi bi-eye"></i>
                        </button>
                    </div>
                </div>

                <button type="submit" style={styles.button}>Update Book</button>
            </form>

            {isModalOpen && image && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <span style={styles.modalClose} onClick={handleCloseModal}>&times;</span>
                        <img src={URL.createObjectURL(image)} alt="Preview" style={styles.modalImage} />
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
        margin: 0,
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        position: 'relative',  // Added relative positioning
    },
    form: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#333',
        display: 'block',
    },
    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '100%',
        boxSizing: 'border-box',
    },
    textarea: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '100%',
        boxSizing: 'border-box',
        height: '40px',  // Same height as input fields
        resize: 'none',  // Prevent the user from resizing the textarea
    },
    button: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    imageContainer: {
        marginTop: '20px',
    },
    image: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '5px',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '5px 10px',
        backgroundColor: '#ff4d4d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    button: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    previewButton: {
        padding: '5px 10px',
        backgroundColor: '#184d59',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        textAlign: 'center',
    },
    modalClose: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '20px',
        cursor: 'pointer',
        color: '#ff4d4d',
    },
    modalImage: {
        maxWidth: '400px',
        maxHeight: '400px',
        borderRadius: '5px',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '5px 10px',
        backgroundColor: '#ff4d4d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default UpdateBookPage;
