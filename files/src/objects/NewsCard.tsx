import React from 'react';
import './NewsCard.scss';

interface NewsCardProps {
    imagePath: string;
    title: string;
    desc: string;
    date: string;
    tag: string;
    tagClass?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
                                                      imagePath,
                                                      title,
                                                      desc,
                                                      date,
                                                      tag,
                                                      tagClass = 'default'
                                                  }) => {
    return (
        <div className="news-card">
            <div className="card-image-wrapper">
                <img src={imagePath} alt={title} className="card-image" loading="lazy" />
                <span className={`card-tag ${tagClass}`}>{tag}</span>
            </div>
            <div className="card-content">
                <span className="card-date">{date}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
            </div>
        </div>
    );
};