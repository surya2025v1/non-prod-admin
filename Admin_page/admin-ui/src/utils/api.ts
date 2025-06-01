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
  Website_id?: number;
}

export interface WebsiteRequest {
  id: number;
  name?: string;
  organization_name?: string;
  organization_type?: string;
  tagline?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  font?: string;
  hero_image_url?: string;
  banner_image_url?: string;
  intro_text?: string;
  photo_gallery_urls?: any[];
  video_youtube_link?: string;
  about?: string;
  mission?: string;
  history?: string;
  services_offerings?: any[];
  team_members?: any[];
  social_media_links?: any;
  paid_till?: string;
  domain?: string;
  is_active?: boolean;
  page_no?: number;
}

export interface WebsiteApiResponse {
  success: boolean;
  website_id: number;
  message: string;
}

export interface DeleteWebsiteRequest {
  id: number;
}

export interface DeleteWebsiteResponse {
  success: boolean;
  message: string;
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

async function makeAuthenticatedPostRequest<T>(endpoint: string, data: any): Promise<T> {
  const { token } = getAuthState();
  
  if (!token) {
    throw new ApiError(401, 'No authentication token available');
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createOrUpdateWebsite(websiteData: WebsiteRequest): Promise<WebsiteApiResponse> {
  try {
    console.log('Calling API with data:', websiteData);
    const response = await makeAuthenticatedPostRequest<WebsiteApiResponse>('/my_website', websiteData);
    console.log('API response:', response);
    return response;
  } catch (error) {
    console.error('Failed to create/update website:', error);
    throw error;
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

export async function deleteWebsite(websiteId: number): Promise<DeleteWebsiteResponse> {
  try {
    console.log('Calling delete API with website ID:', websiteId);
    const response = await makeAuthenticatedPostRequest<DeleteWebsiteResponse>('/delete_mysite', { id: websiteId });
    console.log('Delete API response:', response);
    return response;
  } catch (error) {
    console.error('Failed to delete website:', error);
    throw error;
  }
}

// Website cache management
const WEBSITES_CACHE_KEY = 'user_websites';

export function cacheWebsites(websites: Website[]): void {
  try {
    const websitesWithIndex = websites.map((w, i) => ({ ...w, tempIndex: i + 1 }));
    sessionStorage.setItem(WEBSITES_CACHE_KEY, JSON.stringify(websitesWithIndex));
  } catch (error) {
    console.warn('Failed to cache websites:', error);
  }
}

export function getCachedWebsites(): Website[] | null {
  try {
    const cached = sessionStorage.getItem(WEBSITES_CACHE_KEY);
    if (cached) {
      const websites = JSON.parse(cached);
      // Ensure tempIndex is present and sequential
      return websites.map((w: any, i: number) => ({ ...w, tempIndex: w.tempIndex || i + 1 }));
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