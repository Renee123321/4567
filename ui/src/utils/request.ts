// Modified to add /api/ prefix and respect proxy configuration
export default function request(url: string, options?: any) {
  // Add /api/ prefix if not already present
  const apiUrl = url.startsWith('/api/') ? url : `/api${url.startsWith('/') ? '' : '/'}${url}`;
  
  return fetch(apiUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  }).then(res => res.json());
}