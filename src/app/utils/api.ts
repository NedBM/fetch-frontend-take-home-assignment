import { Dog, SearchResponse, LoginFormData } from '../../../types/api';

const BASE_URL = 'https://frontend-take-home-service.fetch.com';

export const login = async (data: LoginFormData): Promise<void> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }
};

export const logout = async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }
};

interface SearchParams {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: string;
    sort?: string;
}

export const searchDogs = async (params: SearchParams): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.breeds?.length) {
        params.breeds.forEach(breed => queryParams.append('breeds', breed));
    }
    if (params.zipCodes?.length) {
        params.zipCodes.forEach(zip => queryParams.append('zipCodes', zip));
    }
    if (params.ageMin) queryParams.append('ageMin', params.ageMin.toString());
    if (params.ageMax) queryParams.append('ageMax', params.ageMax.toString());
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.from) queryParams.append('from', params.from);
    if (params.sort) queryParams.append('sort', params.sort);

    const response = await fetch(`${BASE_URL}/dogs/search?${queryParams}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Search failed');
    }

    return response.json();
};

export const getBreeds = async (): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/dogs/breeds`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch breeds');
    }

    return response.json();
};

export const getDogs = async (ids: string[]): Promise<Dog[]> => {
    const response = await fetch(`${BASE_URL}/dogs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ids),
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch dogs');
    }

    return response.json();
};

export const fetchLocations = async (zipCodes: string[]): Promise<Location[]> => {
    if (!zipCodes.length) return [];

    const chunkedZipCodes = zipCodes.slice(0, 100);

    try {
        const response = await fetch(`${BASE_URL}/locations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(chunkedZipCodes)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch locations');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
};

export const searchLocations = async (
    zipCodes: string[],
    city?: string,
    states?: string[]
): Promise<Location[]> => {
    try {
        const response = await fetch(`${BASE_URL}/locations/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                city,
                states,
                size: 100,
            })
        });

        if (!response.ok) {
            throw new Error('Failed to search locations');
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error searching locations:', error);
        return [];
    }
};