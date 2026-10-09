import React from 'react';
import { useT } from '@/hooks/useTranslationProxy';

export const EuDisclaimer: React.FC = () => {
    const { t } = useT();
    const projectRef = "2025-1-CZ01-KA220-VET-000352944";

    return (
        <footer className="eu-footer-box">
            <div className="eu-ref-badge">
                <span>{t.projectReferenceLabel || 'Project Reference:'} {projectRef}</span>
            </div>
            <p className="eu-disclaimer-text">
                {t.euDisclaimerText ||
                    `Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor the granting authority can be held responsible for them.`
                }
            </p>
        </footer>
    );
};