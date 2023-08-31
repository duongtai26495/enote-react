import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home, Login, Register, Layout, About, NoteDetail, UserProfile } from '../pages';

const Navigation = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/note/:id' element={<NoteDetail />} />
                    <Route path="/profile" element={<UserProfile />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default Navigation