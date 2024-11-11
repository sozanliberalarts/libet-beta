'use client';
import { DiscussionEmbed } from "disqus-react";
import React from 'react';

type Video = {
  title: string;
  url: string;
  speaker: string;
  date: string;
};

async function fetchVideos(): Promise<Video[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/videos`);
  if (!res.ok) throw new Error("Failed to fetch videos.");
  return res.json();
}

function VideoPage({ params }: { params: { title: string } }) {
  const [videoTitle, setVideoTitle] = React.useState<string>('');
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [loading, setLoading] = React.useState(true);  // ローディング状態を追加

  React.useEffect(() => {
    async function fetchData() {
      // `params`がPromiseであることに対応
      const title = await params.title;  // params.titleを非同期で解決
      setVideoTitle(decodeURIComponent(title));

      const fetchedVideos = await fetchVideos();
      setVideos(fetchedVideos);
      setLoading(false);  // データ取得後にローディングを終了
    }

    fetchData();
  }, [params]);  // paramsが変更されたら再実行

  if (loading) {
    return <div>ローディング中...</div>;
  }

  const video = videos.find((v) => v.title === videoTitle);

  if (!video) {
    return <div>ビデオが見つかりません</div>;
  }

  const { title, url, speaker, date } = video;
  const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!;
  const disqusConfig = {
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/announcements/${encodeURIComponent(title)}`,
    identifier: encodeURIComponent(title),
    title,
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 gap-6">
      {/* 左側: 動画と詳細 */}
      <div className="flex-1">
        <iframe width="560" height="315" src={`https://www.youtube.com/embed/${url.split("v=")[1]?.split("&")[0]}`} title={title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        <h1 className="text-2xl font-bold mt-4">{title}</h1>
        <p className="text-sm text-gray-600 mt-2">スピーカー: {speaker}</p>
        <p className="text-sm text-gray-600">日付: {date}</p>
      </div>

      {/* 右側: DISQUS コメント */}
      <div className="flex-1">
        <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
      </div>
    </div>
  );
}

export default VideoPage;
