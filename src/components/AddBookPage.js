import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBookPage = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [availableCopies, setAvailableCopies] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                sessionStorage.setItem("bookAdded", "true");

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

    const handlePreviewClick = () => {
        if (image) {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleClose = () => {
        sessionStorage.setItem("bookAdded", "false");
        navigate('/products');
    };

    return (
        <div style={styles.container}>
            <div style={styles.closeButton} onClick={handleClose}>X</div>
            <form onSubmit={handleAddBook} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Author:</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} style={styles.input} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Category:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input} required>
                        <option value="">Select Category</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Fictional">Fictional</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={styles.textarea} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Available Copies:</label>
                    <input type="number" value={availableCopies} onChange={(e) => setAvailableCopies(e.target.value)} style={styles.input} required />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Image:</label>
                    <input type="file" onChange={handleImageUpload} accept="image/*" style={styles.input} required />
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Preview:</label>
                        <button type="button" onClick={handlePreviewClick} style={styles.previewButton}>
                            <i className="bi bi-eye"></i>
                        </button>
                    </div>
                </div>
                <button type="submit" style={styles.button}>Add Book</button>
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
        position: 'relative',
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
        height: '100px',
        resize: 'none',
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
        top: '-2px',
        right: '6px',
        fontSize: '20px',
        cursor: 'pointer',
        color: 'black',
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
        color: 'darkblack',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '12px',



    }
};

export default AddBookPage;