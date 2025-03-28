import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { User,BookCopy, BookOpen, FileText, Layers,IdCard, Image as ImageIcon, X } from 'lucide-react';
const styles = {
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
        color: 'black',
        border: 'none',
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
        marginTop: '20px',
        height: '70px',
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
const UpdateBookPage = ({ book, onClose, onBookUpdated }) => {
    /*const { id } = useParams();*/ // Get the book ID from URL parameters
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [availableCopies, setAvailableCopies] = useState(1);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isbn, setIsbn] = useState('');
    // Fetch the current book data from the API when the component mounts
    useEffect(() => {
        console.log("Received book:", book); 
        if (book) {
            setTitle(book.title || "");
            setAuthor(book.author || "");
            setCategory(book.category || "");
            setDescription(book.description || "");
            setAvailableCopies(book.availableCopies || 1);
            setIsbn(book.isbn || "");
        }
    }, [book]);



    const handleUpdateBook = async (event, bookId) => {
        event.preventDefault();

        console.log("Updating book with ID:", bookId);

        if (!bookId || typeof bookId !== "string") {
            console.error("Invalid bookId:", bookId);
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("isbn", isbn);
        formData.append("availableCopies", availableCopies);
        if (image) formData.append("file", image);

        try {
            const response = await fetch(`http://localhost:5198/api/books/${bookId}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                console.log("Book updated successfully!");
                onBookUpdated(); // Refresh book list

                // Show success message with Swal
                Swal.fire({
                    title: "Success!",
                    text: "Book updated successfully.",
                    icon: "success",
                    confirmButtonColor: "#008080", // Teal color
                }).then(() => {
                    // Navigate to the cart page and immediately return after Swal confirmation
                    navigate('/cart', { replace: true });
                    setTimeout(() => navigate('/products', { replace: true }), 50);
                });

            } else {
                console.error("Failed to update book:", await response.text());
            }
        } catch (error) {
            console.error("Error updating book:", error);
        }
    };








    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    //const handleClose = () => {
    //    localStorage.setItem("bookUpdated", "false");
    //    navigate('/products');
    //};
    const handleClose = () => {
        localStorage.setItem("bookUpdated", "false");
        console.log("onClose function:", onClose); 
        if (onClose) {
            onClose(); 
        } else {
            console.error("onClose is undefined!");
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
    const handleClose1 = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to discard your changes?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, discard",
            cancelButtonText: "No, keep editing",
            confirmButtonColor: "#008080"
        }).then((result) => {
            if (result.isConfirmed) {
                onClose(); // Call the actual close function if confirmed
            }
        });
    };

    return (
        <form onSubmit={(e) => handleUpdateBook(e, book.id)} style={styles.form}>
            <button type="button" onClick={handleClose1} style={styles.closeButton}>
                <X size={18} />
            </button>

            <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>Update Book</h1>

            <div style={styles.formGroup}>
                <BookOpen size={18} style={styles.icon} />
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />
            </div>

            <div style={styles.formGroup}>
                <User size={18} style={styles.icon} />
                <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} style={styles.input} required />
            </div>

            <div style={styles.formGroup}>
                <Layers size={18} style={styles.icon} />
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input} required>
                    <option value="">Select Region</option>
                    <option value="Wilrijk">Wilrijk</option>
                    <option value="Gecia">Gecia</option>
                    <option value="Brno">Brno</option>
                </select>
            </div>

            <div style={styles.formGroup}>
                <FileText size={18} style={styles.icon} />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={styles.textarea} required />
            </div>
            <div style={styles.formGroup}>
                <IdCard size={18} style={styles.icon} />
                <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} style={styles.input} required />
            </div>
            <div style={styles.formGroup}>
                <BookCopy size={18} style={styles.icon} />
                <input
                    type="number"
                    value={availableCopies}
                    onChange={(e) => {
                        const value = Math.max(0, Number(e.target.value)); // Ensures value is 0 or greater
                        setAvailableCopies(value);
                    }}
                    style={styles.input}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <ImageIcon size={18} style={styles.icon} />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" style={styles.input} />
            </div>

            <button type="submit" style={styles.button}>Update Book</button>
        </form>
    );
};




export default UpdateBookPage;
