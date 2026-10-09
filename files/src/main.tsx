import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {App } from './App';
import './styles/globals.scss';
import './i18n';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Failed to find the root element. Check your index.html');
}

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>
);