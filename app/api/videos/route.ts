import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET() {
    const filePath = path.join(process.cwd(), 'videos.json');

    try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load videos.'}, {status: 500})
    }
}