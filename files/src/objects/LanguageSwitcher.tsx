import React, { useState, useRef, useEffect } from 'react';
import { useT } from '@/hooks/useTranslationProxy';
import './LanguageSwitcher.scss';

interface Language {
    code: string;
    label: string;
    flag: string;
}

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useT();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages: Language[] = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'cz', label: 'Čeština', flag: '🇨🇿' },
        { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' },
        { code: 'sq', label: 'Shqip', flag: '🇦🇱' },
        { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
        { code: 'pt', label: 'Português', flag: '🇵🇹' },
        { code: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
    ];

    const currentLangCode = i18n.language ? i18n.language.substring(0, 2) : 'en';
    const currentLang = languages.find((l) => l.code === currentLangCode) || languages[0];

    const handleSelect = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="language-dropdown-container" ref={dropdownRef}>
            <button
                type="button"
                className="lang-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label="Select language"
            >
                <span className="lang-flag">{currentLang.flag}</span>
                <span className="lang-code">{currentLang.code.toUpperCase()}</span>
                <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="lang-dropdown-menu">
                    {languages.map((lang) => (
                        <button
                            type="button"
                            key={lang.code}
                            className={`lang-option ${currentLangCode === lang.code ? 'active' : ''}`}
                            onClick={() => handleSelect(lang.code)}
                        >
                            <span className="lang-flag">{lang.flag}</span>
                            <span className="lang-name">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};