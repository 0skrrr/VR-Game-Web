import React, { useState } from 'react';
import { useT } from '@/hooks/useTranslationProxy';

export const ContactForm: React.FC = () => {
    const { t } = useT();
    const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/test.php', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            setStatus({
                success: result.success,
                message: result.message || (t.operationCompleted || 'Operation completed.'),
            });
            if (result.success) {
                (e.target as HTMLFormElement).reset();
            }
        } catch {
            setStatus({
                success: false,
                message: t.networkError || 'Network error: Unable to submit inquiry to server.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-card">
            <h3 className="section-title">{t.contactFormTitle || 'Send a General Inquiry'}</h3>

            {status && (
                <div className={`status-alert ${status.success ? 'success' : 'error'}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
                {/* Honeypot anti-spam trap */}
                <div style={{ display: 'none' }}>
                    <label htmlFor="website">{t.websiteLabel || 'Website'}</label>
                    <input type="text" id="website" name="website" autoComplete="off" />
                </div>

                <div className="form-group">
                    <label htmlFor="name">{t.fieldName || 'Your Full Name *'}</label>
                    <input type="text" id="name" name="name" required placeholder="Oskar Kopcil" />
                </div>

                <div className="form-group">
                    <label htmlFor="email">{t.fieldEmail || 'Email Address *'}</label>
                    <input type="email" id="email" name="email" required placeholder="oskar@example.com" />
                </div>

                <div className="form-group">
                    <label htmlFor="institution">{t.fieldInstitution || 'Institution / School (Optional)'}</label>
                    <input type="text" id="institution" name="institution" placeholder="VET Academy Zlín" />
                </div>

                <div className="form-group">
                    <label htmlFor="subject">{t.fieldSubject || 'Subject *'}</label>
                    <input type="text" id="subject" name="subject" required placeholder="VR Collaboration Inquiry" />
                </div>

                <div className="form-group">
                    <label htmlFor="message">{t.fieldMessage || 'Message *'}</label>
                    <textarea id="message" name="message" rows={4} required placeholder="Write your inquiry here..." />
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? (t.sendingButton || 'Sending...') : (t.submitButton || 'Send Message')}
                </button>
            </form>
        </div>
    );
};