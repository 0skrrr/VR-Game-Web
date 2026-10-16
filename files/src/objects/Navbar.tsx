import React from 'react';
import { useT } from '@/hooks/useTranslationProxy';
import './Navbar.scss';
import logo from '../images/logo3.svg';

interface NavbarProps {
    currentPage: number;
    onPageChange: (page: number) => void;
    isLoggedIn: boolean;
    onLoginClick: () => void;
    onLogoutClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
                                                  currentPage,
                                                  onPageChange,
                                                  isLoggedIn,
                                                  onLoginClick,
                                                  onLogoutClick
                                              }) => {
    const { t } = useT();

    const pages = [
        { id: 2, label: t.navPage2 },
        { id: 3, label: t.navPage3 },
        { id: 4, label: t.navPage4 },
        { id: 5, label: t.navPage5 },
        ...(isLoggedIn ? [{ id: 6, label: "Admin Portal" }] : []),
    ];

    return (
        <nav className="site-navbar">
            <div className="navbar-brand">
                <img src={logo} alt="VR Logo" onClick={() => onPageChange(1)}/>
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

                {isLoggedIn ? (
                    <button onClick={onLogoutClick} className="nav-btn auth-btn logout">
                        Logout
                    </button>
                ) : (
                    <button onClick={onLoginClick} className="nav-btn auth-btn login">
                        Admin Login
                    </button>
                )}
            </div>
        </nav>
    );
};