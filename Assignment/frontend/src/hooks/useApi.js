/**
 * useApi — Custom hook for making API calls to the backend gateway.
 * Provides get, post, put, del methods with built-in loading/error handling.
 *
 * Usage:
 *   const api = useApi();
 *   const students = await api.get('/api/students');
 *   await api.post('/api/students', { name: 'Alice', email: 'alice@test.com' });
 */

import { useState, useCallback } from 'react';

const BASE_URL = ''; // Vite proxy handles /api → localhost:3000

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, body = null) => {
    setLoading(true);
    setError(null);
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (body) options.body = JSON.stringify(body);

      const res = await fetch(`${BASE_URL}${url}`, options);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    get: (url) => request('GET', url),
    post: (url, body) => request('POST', url, body),
    put: (url, body) => request('PUT', url, body),
    del: (url) => request('DELETE', url),
  };
}
