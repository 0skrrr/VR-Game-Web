import React, { useState, useRef, useEffect } from 'react';
import { useT } from '@/hooks/useTranslationProxy';
import { GB, CZ, HR, AL, TR, PT, SK } from 'country-flag-icons/react/3x2';
import './LanguageSwitcher.scss';

interface Language {
    code: string;
    label: string;
    FlagComponent: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useT();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages: Language[] = [
        { code: 'en', label: 'English', FlagComponent: GB },
        { code: 'cz', label: 'Čeština', FlagComponent: CZ },
        { code: 'hr', label: 'Hrvatski', FlagComponent: HR },
        { code: 'sq', label: 'Shqip', FlagComponent: AL },
        { code: 'tr', label: 'Türkçe', FlagComponent: TR },
        { code: 'pt', label: 'Português', FlagComponent: PT },
        { code: 'sk', label: 'Slovenčina', FlagComponent: SK },
    ];

    const currentLangCode = i18n.language ? i18n.language.substring(0, 2) : 'en';
    const currentLang = languages.find((l) => l.code === currentLangCode) || languages[0];

    const handleSelect = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const CurrentFlagIcon = currentLang.FlagComponent;

    return (
        <div className="language-dropdown-container" ref={dropdownRef}>
            <button
                type="button"
                className="lang-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label="Select language"
            >
                <div className="lang-flag-wrapper">
                    <CurrentFlagIcon className="lang-flag-svg" />
                </div>
                <span className="lang-code">{currentLang.code.toUpperCase()}</span>
                <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="lang-dropdown-menu">
                    {languages.map((lang) => {
                        const FlagIcon = lang.FlagComponent;
                        return (
                            <button
                                type="button"
                                key={lang.code}
                                className={`lang-option ${currentLangCode === lang.code ? 'active' : ''}`}
                                onClick={() => handleSelect(lang.code)}
                            >
                                <div className="lang-flag-wrapper">
                                    <FlagIcon className="lang-flag-svg" />
                                </div>
                                <span className="lang-name">{lang.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};