import { useRef } from 'react';
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
    tag: string;
    tagClass: string;
}

export default function Page04() {
    const { t } = useT();
    const containerRef = useRef<HTMLDivElement>(null);

    // Using absolute paths starting from the /public directory
    const feedItems: FeedItemData[] = [
        {
            id: 'news-1',
            imagePath: photo01,
            title: 'First group photo of the Erasmus+ VET project student team',
            desc: 'Work on the project still continues, and this time in Croatia',
            date: '2026-10-06',
            tag: 'News Feed',
            tagClass: 'news-tag',
        },
        {
            id: 'mobility-1',
            imagePath: photo02,
            title: '',
            desc: '',
            date: '',
            tag: '',
            tagClass: 'mobility-tag',
        },
    ];

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
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="page-04 page-container">
            <div className="page-04-header">
                <h2>{t.newsPageTitle || 'News & Mobility'}</h2>
                <p>{t.newsPageSubtitle || 'Explore project meetings, interim reports, technical milestones, and our transnational mobility activities.'}</p>
            </div>

            <div className="news-grid">
                {feedItems.map((item) => (
                    <NewsCard
                        key={item.id}
                        imagePath={item.imagePath}
                        title={item.title}
                        desc={item.desc}
                        date={item.date}
                        tag={item.tag}
                        tagClass={item.tagClass}
                    />
                ))}
            </div>
        </div>
    );
}