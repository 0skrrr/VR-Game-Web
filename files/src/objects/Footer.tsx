import React from 'react';
import { useT } from '@/hooks/useTranslationProxy';
import './Footer.scss';
import euflag from '../images/euflag.jpg';

export const Footer: React.FC = () => {
    const { t } = useT();
    const projectRef = "2025-1-CZ01-KA220-VET-000352944";
    const currentYear = new Date().getFullYear();

    return (
        <footer className="global-site-footer">
            <div className="footer-content">

                {/* Top Section: Main Grid (Info + Flag Box) */}
                <div className="footer-main-grid">
                    <div className="footer-info-col">
                        <div className="footer-meta">
                            <span className="eu-badge">{t.euText || "EU Funded"}</span>
                            <span className="ref-number">{t.projectReferenceLabel} {projectRef}</span>
                        </div>

                        <p className="eu-disclaimer-text">
                            {t.euDisclaimerText ||
                                `Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor the granting authority can be held responsible for them.`
                            }
                        </p>
                    </div>

                    <div className="footer-brand-col">
                        <img className="euflag" src={euflag} alt="Funded by the European Union" />
                        <div className="eu-funding-caption">
                            Co-funded by the Erasmus+ Programme of the European Union
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Links & Copyright */}
                <div className="footer-bottom-bar">
                    <div className="social-links">
                        <a href="https://etwinning.net" target="_blank" rel="noopener noreferrer" className="social-link">
                            {t.eTwinningLink}
                        </a>
                    </div>

                    <p className="copyright">
                        © {currentYear} Erasmus+ VET VR Project. {t.allRightsReserved}
                    </p>
                </div>

            </div>
        </footer>
    );
};