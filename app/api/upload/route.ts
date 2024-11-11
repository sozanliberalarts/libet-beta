import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from 'path';

export async function POST(req: Request) {
    const videoData = await req.json();

    if (!videoData.title || !videoData.url) {
        return NextResponse.json({error: 'Required Title and URL'}, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'videos.json');
    const jsonData = readFileSync(filePath, 'utf8');
    const videos = JSON.parse(jsonData);

    const newVideo = {
        id: videos.length + 1,
        ...videoData
    };

    videos.push(newVideo);

    writeFileSync(filePath, JSON.stringify(videos, null, 2));

    return NextResponse.json({message: 'uploaded video!', newVideo});
}