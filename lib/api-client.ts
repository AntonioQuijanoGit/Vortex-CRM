/**
 * API Client for CRM
 * 
 * This file provides a structure for connecting to a real API.
 * Currently, the app uses localStorage, but you can replace the store
 * methods to use this API client instead.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem("auth_token"); // If you add auth

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data: ApiResponse<T> = await response.json();
      return data.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Contacts
  async getContacts() {
    return this.request("/contacts");
  }

  async getContact(id: string) {
    return this.request(`/contacts/${id}`);
  }

  async createContact(contact: any) {
    return this.request("/contacts", {
      method: "POST",
      body: JSON.stringify(contact),
    });
  }

  async updateContact(id: string, updates: any) {
    return this.request(`/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteContact(id: string) {
    return this.request(`/contacts/${id}`, {
      method: "DELETE",
    });
  }

  // Deals
  async getDeals() {
    return this.request("/deals");
  }

  async getDeal(id: string) {
    return this.request(`/deals/${id}`);
  }

  async createDeal(deal: any) {
    return this.request("/deals", {
      method: "POST",
      body: JSON.stringify(deal),
    });
  }

  async updateDeal(id: string, updates: any) {
    return this.request(`/deals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteDeal(id: string) {
    return this.request(`/deals/${id}`, {
      method: "DELETE",
    });
  }

  // Activities
  async getActivities() {
    return this.request("/activities");
  }

  async createActivity(activity: any) {
    return this.request("/activities", {
      method: "POST",
      body: JSON.stringify(activity),
    });
  }

  // Notes
  async getNotes() {
    return this.request("/notes");
  }

  async createNote(note: any) {
    return this.request("/notes", {
      method: "POST",
      body: JSON.stringify(note),
    });
  }

  async updateNote(id: string, updates: any) {
    return this.request(`/notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteNote(id: string) {
    return this.request(`/notes/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

/**
 * Usage example:
 * 
 * To connect to a real API, you would modify the store.ts file:
 * 
 * Instead of:
 *   const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
 * 
 * You would do:
 *   const contacts = await apiClient.getContacts();
 * 
 * And update the store methods to use async/await and call the API.
 */




