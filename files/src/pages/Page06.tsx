import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useT } from '@/hooks/useTranslationProxy';
import './Page06.scss';

gsap.registerPlugin(useGSAP);

export default function Page06({ onArticleAdded }: { onArticleAdded: () => void }) {
    const { t } = useT() as { t: any };
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'articles' | 'manage' | 'inquiries'>('articles');

    // Article form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
    const [loading, setLoading] = useState(false);

    // Lists state
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [articles, setArticles] = useState<any[]>([]);

    // Edit Modal / Inline Edit State
    const [editingArticle, setEditingArticle] = useState<any | null>(null);

    useEffect(() => {
        if (activeTab === 'inquiries') {
            fetchInquiries();
        } else if (activeTab === 'manage') {
            fetchArticles();
        }
    }, [activeTab]);

    const fetchInquiries = () => {
        window.fetch('/api/inquiries', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setInquiries(Array.isArray(data) ? data : []))
            .catch(() => setInquiries([]));
    };

    const fetchArticles = () => {
        window.fetch('/api/articles')
            .then(res => res.json())
            .then(data => setArticles(Array.isArray(data) ? data : []))
            .catch(() => setArticles([]));
    };

    useGSAP(() => {
        gsap.from('.page-06-header, .admin-form-card', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
        });
    }, { scope: containerRef, dependencies: [activeTab] });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleCreateArticle = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('category', 'feed');
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const res = await window.fetch('/api/articles', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const responseText = await res.text();
            let result;
            try {
                result = JSON.parse(responseText);
            } catch {
                console.error('Server Raw Response:', responseText);
                throw new Error('Server returned non-JSON response.');
            }

            if (res.ok && result.success) {
                setStatus({ success: true, message: t.admin?.form?.successMsg || 'Post successfully published to database!' });
                setTitle('');
                setContent('');
                setImageFile(null);
                setImagePreview(null);
                onArticleAdded();
            } else {
                setStatus({ success: false, message: result.message || 'Failed to create post.' });
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Network error occurred.';
            setStatus({ success: false, message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteArticle = async (id: number) => {
        if (!window.confirm(t.admin?.manage?.confirmDelete || 'Are you sure you want to delete this article?')) return;

        try {
            const res = await window.fetch('/api/articles', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id }),
            });
            const result = await res.json();
            if (result.success) {
                setArticles(articles.filter(a => a.id !== id));
                onArticleAdded();
            }
        } catch {
            alert('Failed to delete article.');
        }
    };

    const handleDeleteInquiry = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this contact inquiry?')) return;

        try {
            const res = await window.fetch('/api/inquiries', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id }),
            });
            const result = await res.json();
            if (result.success) {
                setInquiries(inquiries.filter(i => i.id !== id));
            }
        } catch {
            alert('Failed to delete contact inquiry.');
        }
    };

    const handleUpdateArticle = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingArticle) return;

        try {
            const res = await window.fetch('/api/articles', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    id: editingArticle.id,
                    title: editingArticle.title,
                    content: editingArticle.content,
                }),
            });
            const result = await res.json();
            if (result.success) {
                setEditingArticle(null);
                fetchArticles();
                onArticleAdded();
            }
        } catch {
            alert('Failed to update article.');
        }
    };

    return (
        <div ref={containerRef} className="page-06 page-container">
            <div className="page-06-header">
                <h2>{t.admin?.title || 'Admin Portal'}</h2>
                <p>{t.admin?.subtitle || 'Manage project database records, uniform feed posts, and contact submissions securely.'}</p>

                <div className="tab-switcher">
                    <button
                        type="button"
                        className={`nav-btn ${activeTab === 'articles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('articles')}
                    >
                        {t.admin?.tabs?.publish || 'Create Post'}
                    </button>
                    <button
                        type="button"
                        className={`nav-btn ${activeTab === 'manage' ? 'active' : ''}`}
                        onClick={() => setActiveTab('manage')}
                    >
                        {t.admin?.tabs?.manage || 'Manage News Feed'}
                    </button>
                    <button
                        type="button"
                        className={`nav-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inquiries')}
                    >
                        {t.admin?.tabs?.inquiries || 'View Contact Inquiries'}
                    </button>
                </div>
            </div>

            {activeTab === 'articles' && (
                <div className="admin-form-card">
                    <h3 className="section-title">{t.admin?.form?.sectionTitle || 'Create New Uniform Feed Post'}</h3>

                    {status && (
                        <div className={`status-alert ${status.success ? 'success' : 'error'}`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleCreateArticle} className="admin-form">
                        <div className="form-group">
                            <label htmlFor="article-title">{t.admin?.form?.titleLabel || 'Post Title *'}</label>
                            <input
                                id="article-title"
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder={t.admin?.form?.titlePlaceholder || 'e.g., Transnational Workshop Highlights'}
                            />
                        </div>

                        <div className="form-group">
                            <label>{t.admin?.form?.imageLabel || 'Upload Image / Photo (Optional)'}</label>
                            <div className="file-upload-wrapper">
                                <label htmlFor="article-image" className="file-upload-label" style={{ cursor: 'pointer', display: 'block' }}>
                                    <input
                                        id="article-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    <div className="file-upload-btn">
                                        {imageFile ? imageFile.name : (t.admin?.form?.chooseFile || 'Choose an image file...')}
                                    </div>
                                </label>
                            </div>

                            {imagePreview && (
                                <div className="image-preview-container">
                                    <img src={imagePreview} alt="Upload Preview" className="image-preview" />
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                    >
                                        {t.admin?.form?.removeImage || 'Remove Image'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="article-content">{t.admin?.form?.contentLabel || 'Content / Description *'}</label>
                            <textarea
                                id="article-content"
                                rows={5}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                required
                                placeholder={t.admin?.form?.contentPlaceholder || 'Write post summary or detailed report here...'}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? (t.admin?.form?.publishing || 'Publishing...') : (t.admin?.form?.submitBtn || 'Publish to Database')}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'manage' && (
                <div className="admin-form-card">
                    <h3 className="section-title">{t.admin?.manage?.sectionTitle || 'Manage News Feed Articles'}</h3>
                    {articles.length === 0 ? (
                        <p className="empty-notice">{t.admin?.manage?.empty || 'No articles found in the database.'}</p>
                    ) : (
                        <div className="inquiries-list">
                            {articles.map((item) => (
                                <div key={item.id} className="inquiry-item article-manage-item">
                                    {editingArticle?.id === item.id ? (
                                        <form onSubmit={handleUpdateArticle} className="edit-article-form">
                                            <input
                                                type="text"
                                                value={editingArticle.title}
                                                onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                                                required
                                            />
                                            <textarea
                                                rows={3}
                                                value={editingArticle.content}
                                                onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value })}
                                                required
                                            />
                                            <div className="action-buttons-row">
                                                <button type="submit" className="action-btn save-btn">Save Changes</button>
                                                <button type="button" onClick={() => setEditingArticle(null)} className="action-btn cancel-btn">Cancel</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="inquiry-meta">
                                                <strong>{item.title}</strong>
                                                <span>{item.created_at}</span>
                                            </div>
                                            <p>{item.content}</p>
                                            <div className="action-buttons-row">
                                                <button type="button" onClick={() => setEditingArticle(item)} className="action-btn edit-btn">Edit</button>
                                                <button type="button" onClick={() => handleDeleteArticle(item.id)} className="action-btn delete-btn">Delete</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'inquiries' && (
                <div className="admin-form-card">
                    <h3 className="section-title">{t.admin?.inquiriesList?.sectionTitle || 'Submitted Contact Inquiries'}</h3>
                    {inquiries.length === 0 ? (
                        <p className="empty-notice">{t.admin?.inquiriesList?.empty || 'No inquiries found in the SQLite database.'}</p>
                    ) : (
                        <div className="inquiries-list">
                            {inquiries.map((item) => (
                                <div key={item.id} className="inquiry-item article-manage-item">
                                    <div className="inquiry-meta">
                                        <strong>{item.name} ({item.email})</strong>
                                        <span>{item.created_at}</span>
                                    </div>
                                    <em>Subject: {item.subject}</em>
                                    <p>{item.message}</p>
                                    <div className="action-buttons-row">
                                        <button type="button" onClick={() => handleDeleteInquiry(item.id)} className="action-btn delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}