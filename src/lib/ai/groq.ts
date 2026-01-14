import Groq from "groq-sdk";

let groqClient: Groq | null = null;

/**
 * Returns a Groq client instance with lazy initialization.
 * Returns null if GROQ_API_KEY is not configured.
 * 
 * This pattern prevents build-time crashes when the API key is missing
 * during Next.js static analysis.
 */
export function getGroqClient(): Groq | null {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === "your_groq_api_key_here" || apiKey === "") {
        return null;
    }

    if (!groqClient) {
        groqClient = new Groq({ apiKey });
    }

    return groqClient;
}

/**
 * Check if Groq is available for use (API key is configured)
 */
export function isGroqAvailable(): boolean {
    const apiKey = process.env.GROQ_API_KEY;
    return !!(apiKey && apiKey !== "your_groq_api_key_here" && apiKey !== "");
}
