/**
 * API Utility Functions
 * Handles all API calls to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost/mlm/index.php/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  sponsor_id: string;
  sponsor_name: string;
  posting: 'Left' | 'Right';
  nominee: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  address: string;
  sponsor_id: string;
  sponsor_name: string;
  posting: 'Left' | 'Right';
  nominee: string;
  password: string;
}

/**
 * Make API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

/**
 * Register a new user
 */
export async function registerUser(data: RegisterData): Promise<ApiResponse<LoginResponse>> {
  return apiRequest<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Login user
 */
export async function loginUser(
  email: string,
  password: string
): Promise<ApiResponse<LoginResponse>> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Verify JWT token
 */
export async function verifyToken(): Promise<ApiResponse<{ user: User }>> {
  return apiRequest<{ user: User }>('/auth/verify', {
    method: 'GET',
  });
}

/**
 * KYC Interfaces
 */
export interface KycData {
  id?: number;
  user_id: number;
  full_name: string;
  dob: string;
  pan_number: string;
  aadhar_number: string;
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  aadhar_front_path?: string;
  aadhar_back_path?: string;
  pan_card_path?: string;
  cancelled_cheque_path?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  created_at?: string;
  updated_at?: string;
}

/**
 * Get KYC details for logged-in user
 */
export async function getKyc(): Promise<ApiResponse<KycData>> {
  return apiRequest<KycData>('/kyc', {
    method: 'GET',
  });
}

/**
 * Submit KYC details (with file uploads)
 */
export async function submitKyc(
  formData: FormData
): Promise<ApiResponse<KycData>> {
  const token = localStorage.getItem('auth_token');
  const url = `${API_BASE_URL}/kyc/create`;
  
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
      };
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

