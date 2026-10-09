import React from 'react';
import { useT } from '@/hooks/useTranslationProxy';

interface Partner {
    code: string;
    country: string;
    role: string;
}

export const PartnerGrid: React.FC = () => {
    const { t } = useT();

    const partners: Partner[] = [
        { code: '🇨🇿', country: t.partnerCzCountry || 'Czech Republic', role: t.partnerCzRole || 'Lead Coordinator & Project Management' },
        { code: '🇭🇷', country: t.partnerHrCountry || 'Croatia', role: t.partnerHrRole || 'Host Partner & VET Integration Work Package' },
        { code: '🇦🇱', country: t.partnerAlCountry || 'Albania', role: t.partnerAlRole || 'Pedagogy & Teacher Guide Development (WP4)' },
        { code: '🇹🇷', country: t.partnerTrCountry || 'Turkey', role: t.partnerTrRole || 'Standalone Mobile Application Development' },
        { code: '🇵🇹', country: t.partnerPtCountry || 'Portugal', role: t.partnerPtRole || 'Unity & VR Core Development' },
        { code: '🇸🇰', country: t.partnerSkCountry || 'Slovakia', role: t.partnerSkRole || '3D Modeling & Blender Asset Creation' },
    ];

    return (
        <div className="partners-container">
            <h3 className="section-title">{t.consortiumPartnersTitle || 'Consortium Partner Contacts'}</h3>
            <div className="partners-grid">
                {partners.map((p) => (
                    <div key={p.country} className="partner-item">
                        <span className="partner-flag">{p.code}</span>
                        <div>
                            <h4 className="partner-country">{p.country}</h4>
                            <p className="partner-role">{p.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};