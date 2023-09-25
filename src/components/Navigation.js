import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home, Login, Register, Layout, About, NoteDetail, UserProfile, Recovery, ConfirmRecovery, LoginPage, RegisterPage, WorkspaceDetail, ActivateAccount, AuthenLayout } from '../pages';
import SearchResult from '../pages/SearchResult';

const Navigation = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthenLayout />} >
                    <Route index path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/recovery" element={<Recovery />} />
                    <Route path="/confirm-recovery" element={<ConfirmRecovery />} />
                    <Route path="/activate-account" element={<ActivateAccount />} />
                </Route>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/note/:id' element={<NoteDetail />} />
                    <Route path='/search/:name' element={<SearchResult />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/workspace/:id" element={<WorkspaceDetail />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default Navigation