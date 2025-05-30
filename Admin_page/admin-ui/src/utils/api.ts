import { getAuthState } from './auth';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface Website {
  name: string;
  domain: string;
  status: string;
  organization_name: string;
  organization_type: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  font: string;
  hero_image_url: string;
  banner_image_url: string;
  intro_text: string;
  photo_gallery_urls: any[];
  video_youtube_link: string;
  about: string;
  mission: string;
  history: string;
  services_offerings: any[];
  team_members: any[];
  social_media_links: any;
  paid_till: string | null;
  is_active: boolean;
  page_no: number;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function makeAuthenticatedRequest<T>(endpoint: string): Promise<T> {
  const { token } = getAuthState();
  
  if (!token) {
    throw new ApiError(401, 'No authentication token available');
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchMyWebsites(forceRefresh: boolean = false): Promise<Website[]> {
  try {
    // Always clear cache before making API call to ensure fresh data
    if (forceRefresh) {
      clearWebsitesCache();
    }
    
    const response = await makeAuthenticatedRequest<Website[]>('/my_website');
    
    // Cache the fresh data
    cacheWebsites(response);
    
    return response;
  } catch (error) {
    console.error('Failed to fetch websites:', error);
    throw error;
  }
}

// New function specifically for refreshing data after edits/creates
export async function refreshWebsiteData(): Promise<Website[]> {
  clearWebsitesCache();
  return fetchMyWebsites(true);
}

// Website cache management
const WEBSITES_CACHE_KEY = 'user_websites';

export function cacheWebsites(websites: Website[]): void {
  try {
    sessionStorage.setItem(WEBSITES_CACHE_KEY, JSON.stringify(websites));
  } catch (error) {
    console.warn('Failed to cache websites:', error);
  }
}

export function getCachedWebsites(): Website[] | null {
  try {
    const cached = sessionStorage.getItem(WEBSITES_CACHE_KEY);
    if (cached) {
      const websites = JSON.parse(cached);
      return websites;
    }
  } catch (error) {
    console.warn('Failed to retrieve cached websites:', error);
  }
  return null;
}

export function clearWebsitesCache(): void {
  try {
    sessionStorage.removeItem(WEBSITES_CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear website cache:', error);
  }
} 