import React from 'react';
import { useT } from '@/hooks/useTranslationProxy';
import { CZ, HR, AL, TR, PT, SK } from 'country-flag-icons/react/3x2';

interface Partner {
    id: string;
    FlagComponent: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    country: string;
    role: string;
}

export const PartnerGrid: React.FC = () => {
    const { t } = useT();

    const partners: Partner[] = [
        { id: 'cz', FlagComponent: CZ, country: t.partnerCzCountry || 'Czechia', role: t.partnerCzRole || 'Lead Coordinator & Project Management' },
        { id: 'hr', FlagComponent: HR, country: t.partnerHrCountry || 'Croatia', role: t.partnerHrRole || 'Host Partner & VET Integration Work Package' },
        { id: 'al', FlagComponent: AL, country: t.partnerAlCountry || 'Albania', role: t.partnerAlRole || 'Pedagogy & Teacher Guide Development (WP4)' },
        { id: 'tr', FlagComponent: TR, country: t.partnerTrCountry || 'Türkiye', role: t.partnerTrRole || 'Standalone Mobile Application Development' },
        { id: 'pt', FlagComponent: PT, country: t.partnerPtCountry || 'Portugal', role: t.partnerPtRole || 'Unity & VR Core Development' },
        { id: 'sk', FlagComponent: SK, country: t.partnerSkCountry || 'Slovakia', role: t.partnerSkRole || '3D Modeling & Blender Asset Creation' },
    ];

    return (
        <div className="partners-container">
            <h3 className="section-title">{t.consortiumPartnersTitle || 'Consortium Partner Contacts'}</h3>
            <div className="partners-grid">
                {partners.map((p) => {
                    const FlagIcon = p.FlagComponent;
                    return (
                        <div key={p.id} className="partner-item">
                            <div className="partner-flag-container">
                                <FlagIcon className="partner-flag-svg" />
                            </div>
                            <div className="partner-info-text">
                                <h4 className="partner-country">{p.country}</h4>
                                <p className="partner-role">{p.role}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};