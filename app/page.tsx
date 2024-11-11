'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'

type Video = {
  title: string;
  url: string;
  speaker: string;
  date: string;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        if (!res.ok) throw new Error('Failed to fetch videos.');

        const data = await res.json();
        setVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchVideos();
  }, []);

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;
  };

  if (error) {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  if (videos.length === 0) {
    return <p className="text-gray-500 text-center">Loading videos...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto p-4">
      {videos.map((video, index) => {
        const thumbnail = getYouTubeThumbnail(video.url);

        return (
          <Link
            key={index}
            href={`/announcements/${encodeURIComponent(video.title)}`}
            className="block border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            {thumbnail && (
              <img
                src={thumbnail}
                alt={`${video.title} thumbnail`}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
              <p className="text-sm text-gray-600">Speaker: {video.speaker}</p>
              <p className="text-sm text-gray-600">Date: {video.date}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
