import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5565b361`;

interface IPRight {
  id?: string;
  title: string;
  description: string;
  ipfsHash: string;
  category: string;
  applicantAddress: string;
  transactionHash: string;
  timestamp: number;
  ownerAddress?: string;
  createdAt?: string;
}

export async function saveIPRight(ipRight: Omit<IPRight, 'id' | 'ownerAddress' | 'createdAt'>): Promise<void> {
  try {
    // Generate a unique ID from the transaction hash
    const id = ipRight.transactionHash;
    
    const response = await fetch(`${API_BASE_URL}/ip-rights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        ...ipRight,
        id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save IP right');
    }

    const data = await response.json();
    console.log('IP right saved to database:', data);
  } catch (error: any) {
    console.error('Error saving IP right to database:', error.message);
    // Don't throw error - we don't want to fail the registration if DB save fails
  }
}

export async function fetchAllIPRights(): Promise<IPRight[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/ip-rights`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch IP rights');
    }

    const data = await response.json();
    
    // Transform database format to component format
    const transformedRights = (data.ipRights || []).map((right: any) => ({
      id: right.id,
      title: right.title,
      description: right.description,
      owner: right.applicantAddress || 'Unknown', // Use applicant address as owner
      ipfsHash: right.ipfsHash,
      registrationDate: right.timestamp,
      category: right.category,
      status: 'active' as const,
      applicantAddress: right.applicantAddress,
      transactionHash: right.transactionHash,
      transferHistory: [],
    }));
    
    return transformedRights;
  } catch (error: any) {
    console.error('Error fetching IP rights from database:', error.message);
    return [];
  }
}

export async function fetchIPRight(id: string): Promise<IPRight | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/ip-rights/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.ipRight || null;
  } catch (error: any) {
    console.error('Error fetching IP right from database:', error.message);
    return null;
  }
}

export async function deleteIPRight(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/ip-rights/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete IP right');
    }
  } catch (error: any) {
    console.error('Error deleting IP right from database:', error.message);
    throw error;
  }
}

export async function transferIPRight(id: string, newOwner: string, txHash: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/ip-rights/${id}/transfer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ newOwner, txHash }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to transfer IP right');
    }

    const data = await response.json();
    console.log('IP right transferred in database:', data);
  } catch (error: any) {
    console.error('Error transferring IP right in database:', error.message);
    // Don't throw error - we don't want to fail the transfer if DB update fails
  }
}