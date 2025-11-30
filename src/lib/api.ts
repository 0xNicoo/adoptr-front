export async function apiFetch<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("accessToken");
  
    const headers: HeadersInit = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  
    const res = await fetch(url, { ...options, headers });
  
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${await res.text()}`);
    }
  
    return res.json();
  }
  