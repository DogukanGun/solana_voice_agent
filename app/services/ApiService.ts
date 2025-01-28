import { Message } from "ai/react";

type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};
type UserCodeType = {
  id: number;
  code: string;
  is_used: boolean;
  used_by: string;
};

// Define proper types instead of any
type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

// Define response types based on your API endpoints
type UserCode = {
  id: number;
  code: string;
  is_used: boolean;
  used_by: string;
};

type AdminResponse = {
  token: string;
};

type ChatResponse = {
  text: string;
  audio?: string;
};

type BotResponse = {
  text?: string;
  transaction?: string;
};

type TranscribeResponse = {
  text: string;
};

type CheckResponse = {
  exists: boolean;
};

type RegisterResponse = {
  success: boolean;
};

class ApiService {
  private async fetchWithToken<T>(url: string, options: FetchOptions = {}): Promise<T> {
    const token = localStorage.getItem("token");

    options.headers = {
      ...(options.headers || {}),
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  // Existing methods
  async getUserCodes(): Promise<UserCode[]> {
    return this.fetchWithToken("/api/user/codes", { method: "GET" });
  }

  async postAdmin(address: string, signature: number[]): Promise<ApiResponse<AdminResponse>> {
    return this.fetchWithToken("/api/user/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: address, signature }),
    });
  }

  async checkAdmin(token: string): Promise<ApiResponse<{ isAdmin: boolean }>> {
    return this.fetchWithToken("/api/user/admin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async postUserCode(): Promise<ApiResponse<UserCode>> {
    return this.fetchWithToken("/api/user/code", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  }

  async checkUsercode(code: string, walletAddress: string): Promise<ApiResponse<CheckResponse>> {
    return this.fetchWithToken("/api/user/code/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, walletAddress }),
    });
  }

  async registerUser(
    address: string,
    transactionSignature: string,
  ): Promise<ApiResponse<RegisterResponse>> {
    return this.fetchWithToken("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, transactionSignature }),
    });
  }

  async checkUser(): Promise<ApiResponse<{ isAllowed: boolean }>> {
    return this.fetchWithToken("/api/user/check", { method: "GET" });
  }

  async deleteUserCode(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.fetchWithToken("/api/user/code", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  async updateUserCode(id: string): Promise<ApiResponse<UserCode>> {
    return this.fetchWithToken("/api/user/code", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  async getAllUserCodes(): Promise<UserCodeType[]> {
    const data = await this.fetchWithToken<{ code: UserCodeType[] }>("/api/user/codes");
    return data.code;
  }

  // New methods
  async postChat(caption: string, messageHistory: Message[]): Promise<ApiResponse<ChatResponse>> {
    return this.fetchWithToken("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption, messageHistory }),
    });
  }

  async postBot(text: string, address: string): Promise<ApiResponse<BotResponse>> {
    return this.fetchWithToken("/api/bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.split("op")[0], address }),
    });
  }

  async postTranscribe(formData: FormData): Promise<ApiResponse<TranscribeResponse>> {
    return this.fetchWithToken("/api/transcribe", {
      method: "POST",
      body: formData,
    });
  }
}

// Export a single instance of the ApiService
export const apiService = new ApiService();
