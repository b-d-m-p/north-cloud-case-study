export async function GET({ request }) {
  const response = await fetch('https://north-case-api.vercel.app/api', {
      headers: {
          'Authorization': request.headers.get('Authorization')
      }
  });
  
  return new Response(response.body, {
      status: response.status,
      headers: {
          'Content-Type': 'application/json'
      }
  });
}