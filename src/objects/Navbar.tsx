import React, { useState } from 'react';
import { useT } from '@/hooks/useTranslationProxy';
import './Navbar.scss';
import logo from '../images/logo3.svg';
import { LanguageSwitcher } from "@/objects/LanguageSwitcher.tsx";

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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const pages = [
        { id: 1, label: t.navPage1 || 'Home' },
        { id: 2, label: t.navPage2 || 'About' },
        { id: 3, label: t.navPage3 || 'Resources' },
        { id: 4, label: t.navPage4 || 'Project Feed' },
        { id: 5, label: t.navPage5 || 'Contact & Dissemination' },
        ...(isLoggedIn ? [{ id: 6, label: "Admin Portal" }] : []),
    ];

    const handleNavClick = (id: number) => {
        onPageChange(id);
        setMobileMenuOpen(false);
    };

    return (
        <nav className="site-navbar">
            <div className="navbar-top-row">
                <div className="navbar-brand">
                    <img src={logo} alt="VR Logo" onClick={() => handleNavClick(1)} />
                    <LanguageSwitcher />
                </div>

                <button
                    type="button"
                    className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            <div className={`navbar-nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                {pages.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => handleNavClick(p.id)}
                        className={`nav-btn ${currentPage === p.id ? 'active' : ''}`}
                    >
                        {p.label}
                    </button>
                ))}

                {isLoggedIn ? (
                    <button onClick={() => { onLogoutClick(); setMobileMenuOpen(false); }} className="nav-btn auth-btn logout">
                        Logout
                    </button>
                ) : (
                    <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="nav-btn auth-btn login">
                        Admin Login
                    </button>
                )}
            </div>
        </nav>
    );
};