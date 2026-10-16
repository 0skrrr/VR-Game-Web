import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useT } from '@/hooks/useTranslationProxy';
import { NewsCard } from '../objects/NewsCard';
import './Page04.scss';
import photo01 from '../images/photo01.jpg';
import photo02 from '../images/Empty.png';

gsap.registerPlugin(useGSAP);

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

    // Default static items as fallback
    const defaultItems: FeedItemData[] = [
        {
            id: 'news-1',
            imagePath: photo01,
            title: 'First group photo of the Erasmus+ VET project student team',
            desc: 'Work on the project still continues, and this time in Croatia',
            date: '2026-10-06',
        },
        {
            id: 'mobility-1',
            imagePath: photo02,
            title: 'Transnational Workshop Updates',
            desc: 'Collaborative student and teacher sessions ongoing.',
            date: '2026-10-05',
        },
    ];

    useEffect(() => {
        fetch('/api/articles')
            .then((res) => res.json())
            .then((data: any[]) => {
                if (data && data.length > 0) {
                    const formatted: FeedItemData[] = data.map((item) => ({
                        id: String(item.id),
                        imagePath: item.image_url || photo02,
                        title: item.title,
                        desc: item.content,
                        date: item.created_at ? item.created_at.split('T')[0] : '2026-10-16',
                    }));
                    setFeedItems(formatted);
                } else {
                    // Check local storage fallback
                    loadLocalArticles();
                }
            })
            .catch(() => {
                loadLocalArticles();
            });
    }, []);

    const loadLocalArticles = () => {
        const localArticles = JSON.parse(localStorage.getItem('local_vet_articles') || '[]');
        if (localArticles.length > 0) {
            const formatted = localArticles.map((item: any) => ({
                id: item.id,
                imagePath: item.image_url,
                title: item.title,
                desc: item.content,
                date: item.created_at.split('T')[0],
            }));
            setFeedItems([...formatted, ...defaultItems]);
        } else {
            setFeedItems(defaultItems);
        }
        setLoading(false);
    };

    useGSAP(() => {
        gsap.from('.page-04-header', {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: 'power3.out',
        });
        gsap.from('.news-grid > div', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.2,
        });
    }, { scope: containerRef, dependencies: [feedItems] });

    return (
        <div ref={containerRef} className="page-04 page-container">
            <div className="page-04-header">
                <h2>{t.newsPageTitle || 'News & Mobility'}</h2>
                <p>{t.newsPageSubtitle || 'Explore project meetings, interim reports, technical milestones, and our transnational mobility activities.'}</p>
            </div>

            <div className="news-grid">
                {loading ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1 / -1' }}>Loading updates...</p>
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