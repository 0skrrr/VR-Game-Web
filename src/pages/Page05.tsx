import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useT } from '@/hooks/useTranslationProxy';
import { ContactForm } from '../objects/ContactForm';
import { PartnerGrid } from '../objects/PartnerGrid';
import { EuDisclaimer } from '../objects/EuDisclaimer';
import './Page05.scss';

gsap.registerPlugin(useGSAP);

export default function Page05() {
    const { t } = useT();
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.page-05-header', {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: 'power3.out',
        });
        gsap.from('.content-grid > div', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.2,
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="page-05 page-container">
            <div className="page-05-header">
                <h2>{t.contactPageTitle || 'Contact & Dissemination'}</h2>
                <p>{t.contactPageSubtitle || 'Get in touch with our lead coordinator or reach out directly to our consortium partner institutions across Europe.'}</p>
            </div>

            <div className="content-grid">
                <ContactForm />
                <PartnerGrid />
            </div>

            <EuDisclaimer />
        </div>
    );
}