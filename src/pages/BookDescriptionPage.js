import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';



const BookDescriptionPage = () => {
    const { id} = useParams();
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const navigate = useNavigate();
    

    useEffect(() => {
        fetch(`http://localhost:5198/api/books/${id}/description`)
            .then(response => response.text())
            .then(description => setDescription(description))
            .catch(error => console.error('Error fetching description:', error));
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:5198/api/books/${id}/title`)
            .then(response => response.text())
            .then(title => setTitle(title))
            .catch(error => console.error('Error fetching title:', error));
    }, [id]);
    useEffect(() => {
        fetch(`http://localhost:5198/api/books/${id}/author`)
            .then(response => response.text())
            .then(author => setAuthor(author))
            .catch(error => console.error('Error fetching Author:', error));
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:5198/api/books/${id}/category`)
            .then(response => response.text())
            .then(category => setCategory(category))
            .catch(error => console.error('Error fetching Category:', error));
    }, [id]);

    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/products')} style={styles.closeButton}>X</button>
            <h2 style={styles.title}>{title}</h2>
            <h3 style={styles.author}>Author Name : {author}</h3>
            <h3 style={styles.category}>Category : {category}</h3>
            <div style={styles.descriptionBox}>{description}</div>
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
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        position: 'relative', // Add position relative to position the close button
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: '#ff0000',
    },
    descriptionBox: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        marginTop: '20px',
        width: '80%',
        boxSizing: 'border-box',
    },
    title: {
        marginBottom: '5px', // Reduces space between title and author
    },
    author: {
        marginTop: '0px',   // Removes space above author
        marginBottom: '5px', // Adds a small space below author
    },
    category: {
        marginTop: '0px',   // Removes space above category
    },
};



export default BookDescriptionPage;
