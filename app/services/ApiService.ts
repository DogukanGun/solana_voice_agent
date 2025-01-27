type FetchOptions = RequestInit & {
    headers?: Record<string, string>;
};
type UserCodeType = {
    id: number;
    code: string;
    is_used: boolean;
    used_by: string;
}
class ApiService {
    private async fetchWithToken<T>(
        url: string,
        options: FetchOptions = {}
    ): Promise<T> {
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
                throw new Error(
                    `HTTP error! Status: ${response.status}, Message: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    }

    // Existing methods
    async getUserCode(): Promise<any> {
        return this.fetchWithToken("/api/user/codes", { method: "GET" });
    }

    async postAdmin(walletAddress: string, signature: number[]): Promise<any> {
        return this.fetchWithToken("/api/user/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress, signature }),
        });
    }

    async checkAdmin(token: string): Promise<any> {
        return this.fetchWithToken("/api/user/admin", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
    }

    async postUserCode(): Promise<any> {
        return this.fetchWithToken("/api/user/code", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    }

    async checkUsercode(code: string,walletAddress:string): Promise<any> {
        return this.fetchWithToken("/api/user/code/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code,
                walletAddress
            }),
        });
    }

    async registerUser(address: string, transactionSignature: string): Promise<any> {
        return this.fetchWithToken("/api/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, transactionSignature }),
        });
    }

    async checkUser(): Promise<any> {
        return this.fetchWithToken("/api/user/check", { method: "GET" });
    }

    async deleteUserCode(id: string): Promise<any> {
        return this.fetchWithToken("/api/user/code", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
    }

    async updateUserCode(id: string): Promise<any> {
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
    async postChat(caption: string, messageHistory: any): Promise<any> {
        return this.fetchWithToken("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ caption, messageHistory }),
        });
    }

    async postBot(text: string, address: string): Promise<any> {
        return this.fetchWithToken("/api/bot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text.split("op")[0], address }),
        });
    }

    async postTranscribe(formData: FormData): Promise<any> {
        return this.fetchWithToken("/api/transcribe", {
            method: "POST",
            body: formData,
        });
    }
}

// Export a single instance of the ApiService
export const apiService = new ApiService();
