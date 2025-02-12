import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBookPage = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [availableCopies, setAvailableCopies] = useState(1);
    const navigate = useNavigate();

    const handleAddBook = async (e) => {
        e.preventDefault();

        if (!image) {
            console.error('No image provided.');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);
        formData.append('title', title);
        formData.append('author', author);
        formData.append('category', category);
        formData.append('availableCopies', availableCopies);
        formData.append('description', description);

        try {
            const response = await fetch('http://localhost:5198/api/books', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                navigate('/products');
            } else {
                console.error('Failed to add the book:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleClose = () => {
        navigate('/products');
    };

    return (
        <div style={styles.container}>
            <div style={styles.closeButton} onClick={handleClose}>X</div>
            <form onSubmit={handleAddBook} style={styles.form}>
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
                        required
                    />
                </div>
                <button type="submit" style={styles.button}>Add Book</button>
            </form>

            {image && (
                <div style={styles.imageContainer}>
                    <img src={URL.createObjectURL(image)} alt="Preview" style={styles.image} />
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
        height: '100px',  // Same height as input fields
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
};

export default AddBookPage;
