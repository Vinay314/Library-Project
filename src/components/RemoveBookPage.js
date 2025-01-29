import React, { useState } from 'react';

const RemoveBookPage = () => {
    const [title, setTitle] = useState('');

    const handleRemove = async () => {
        try {
            const response = await fetch(`http://localhost:5198/api/books/remove-by-title/${encodeURIComponent(title)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert(`Book titled "${title}" has been removed successfully!`);
                setTitle(''); // Reset title input after removal
            } else {
                console.error('Failed to remove the book:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };

    return (
        <div>
            <h1>Remove a Book</h1>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the book title"
                style={{
                    padding: '10px',
                    margin: '10px 0',
                    width: '100%',
                    maxWidth: '400px'
                }}
            />
            <button
                onClick={handleRemove}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Remove Book
            </button>
        </div>
    );
};

export default RemoveBookPage;
