import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { 
    Home, 
    Layout, 
    NoteDetail, 
    UserProfile, 
    ConfirmRecovery, 
    LoginPage, 
    RegisterPage, 
    WorkspaceDetail, 
    ActivateAccount, 
    AuthenLayout, 
    ForgotPassword, 
    ChatAssistants, 
    Dashboard} from '../pages';
import SearchResult from '../pages/SearchResult';

const Navigation = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthenLayout />} >
                    <Route index path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/confirm-recovery" element={<ConfirmRecovery />} />
                    <Route path="/activate-account" element={<ActivateAccount />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='/note/:id' element={<NoteDetail />} />
                    <Route path='/search/:name' element={<SearchResult />} />
                    <Route path='/chat-ai' element={<ChatAssistants />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/workspace/:id" element={<WorkspaceDetail />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default Navigation