import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n';
import { Suspense } from 'react';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Suspense fallback="...loading">
        <App />
    </Suspense>
);
