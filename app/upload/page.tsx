'use client';
import { useState } from 'react';

export default function UploadPage() {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const videoData = {
            title,
            url,
            date: new Date().toISOString().split('T')[0],
        };

        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Cotent-Type': 'application/json',
            },
            body: JSON.stringify(videoData),
        });

        if (res.ok) {
            setMessage('Uploaded video!');
            setTitle('');
            setUrl('');
        } else {
            setMessage('Error');
        }
    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="url">URL</label>
                    <input type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)}  required/>
                </div>
                <button type="submit">Upload!</button>
            </form>
            {message && <p>{message}</p>}
        </main>
    )
}