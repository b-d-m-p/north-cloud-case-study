import { json } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';

export async function GET() {
    try {
        const response = await fetch('https://north-case-api.vercel.app/api', {
            headers: {
                'Authorization': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return json(data);
    } catch (error) {
        console.error('Server-side error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}