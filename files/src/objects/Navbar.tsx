import React from 'react';
import { useT } from '@/hooks/useTranslationProxy';
import './Navbar.scss';
import {LanguageSwitcher} from "@/objects/LanguageSwitcher.tsx";
import logo from '../images/logo3.svg';

interface NavbarProps {
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
    const { t } = useT();

    const pages = [
        { id: 2, label: t.navPage2},
        { id: 3, label: t.navPage3},
        { id: 4, label: t.navPage4},
        { id : 5, label: t.navPage5},
    ];

    return (
        <nav className="site-navbar">
            <div className="navbar-brand">
                <img src={logo} alt="VR Logo" onClick={() => onPageChange(1)}/>
                <LanguageSwitcher />
            </div>

            <div className="navbar-nav-links">
                {pages.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => onPageChange(p.id)}
                        className={`nav-btn ${currentPage === p.id ? 'active' : ''}`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};