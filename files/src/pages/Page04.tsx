import { useState, useEffect, useRef } from 'react';
import { useT } from '@/hooks/useTranslationProxy';
import { NewsCard } from '../objects/NewsCard';
import './Page04.scss';

interface FeedItemData {
    id: string;
    imagePath: string;
    title: string;
    desc: string;
    date: string;
}

export default function Page04() {
    const { t } = useT();
    const containerRef = useRef<HTMLDivElement>(null);
    const [feedItems, setFeedItems] = useState<FeedItemData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        fetch('/api/articles')
            .then(async (res) => {
                const text = await res.text();
                try {
                    return JSON.parse(text);
                } catch {
                    return [];
                }
            })
            .then((data: any[]) => {
                if (!isMounted) return;
                if (Array.isArray(data) && data.length > 0) {
                    const formatted: FeedItemData[] = data.map((item) => ({
                        id: String(item.id),
                        imagePath: item.image_url,
                        title: item.title,
                        desc: item.content,
                        date: item.created_at ? item.created_at.split('T')[0] : '2026-10-16',
                    }));
                    setFeedItems(formatted);
                } else {
                    setFeedItems([]);
                }
            })
            .catch(() => {
                if (!isMounted) return;
                setFeedItems([]);
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div ref={containerRef} className="page-04 page-container">
            <div className="page-04-header">
                <h2>{t.newsPageTitle || 'News & Mobility'}</h2>
                <p>{t.newsPageSubtitle || 'Explore project meetings, interim reports, technical milestones, and our transnational mobility activities.'}</p>
            </div>

            <div className="news-grid">
                {loading ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1 / -1' }}>Loading updates...</p>
                ) : feedItems.length === 0 ? (
                    <p style={{ color: 'var(--text-dim)', textAlign: 'center', gridColumn: '1 / -1' }}>No project feed updates available yet.</p>
                ) : (
                    feedItems.map((item) => (
                        <NewsCard
                            key={item.id}
                            imagePath={item.imagePath}
                            title={item.title}
                            desc={item.desc}
                            date={item.date}
                            tag="Project Update"
                            tagClass="news-tag"
                        />
                    ))
                )}
            </div>
        </div>
    );
}