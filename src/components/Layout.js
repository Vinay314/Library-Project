import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
    return (
        <>
            <Header />
            <main className="container mt-4">
                <Outlet /> {/* This renders the current page inside Layout */}
            </main>
        </>
    );
};

export default Layout;
