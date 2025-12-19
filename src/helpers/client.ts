const BASE_URL = 'http://localhost:8080/api/v1';

interface RequestOptions extends RequestInit {
    body?: any;
}

export const apiClient = async (path: string, options: RequestOptions = {}) => {
    const {body, ...rest} = options;
    const headers: HeadersInit = {'Content-Type': 'application/json'};
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}${path}`, {
        ...rest,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
        const text = await response.text();
        console.log('Error response from API:', text);
        let errorMessage = response.statusText;
        try {
            const data = JSON.parse(text);
            if (data?.message) errorMessage = data.message;
        } catch (err) {
            errorMessage = text || response.statusText;
        }
        throw new Error(errorMessage);
    }

    return response.json();
};
