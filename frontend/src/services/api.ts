const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api';

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token = localStorage.getItem('emr_token');
  
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If unauthorized (token expired), attempt automatic token refresh
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('emr_refresh_token');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const data: RefreshResponse = await refreshResponse.json();
          localStorage.setItem('emr_token', data.accessToken);
          localStorage.setItem('emr_refresh_token', data.refreshToken);
          
          // Re-attempt original request with new token
          headers.set('Authorization', `Bearer ${data.accessToken}`);
          response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
          });
        } else {
          // Refresh token also invalid/expired -> logout
          handleLogout();
        }
      } catch (err) {
        console.error('Failed to auto-refresh token', err);
        handleLogout();
      }
    }
  }
  
  if (response.status === 204) {
    return {} as T;
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  
  return response.json() as Promise<T>;
}

function handleLogout() {
  localStorage.removeItem('emr_token');
  localStorage.removeItem('emr_refresh_token');
  localStorage.removeItem('emr_user');
  localStorage.removeItem('emr_demo_mode');
  window.dispatchEvent(new Event('auth_change'));
}
