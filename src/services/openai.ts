import OpenAI from 'openai';

// In a real production app, this should be a backend call.
// For this "Option B" client-side demo, we use the key from env vars.
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Initialize the client
// dangerouslyAllowBrowser: true is required for client-side usage
export const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key', // Fallback to avoid crash on init, but calls will fail if missing
  dangerouslyAllowBrowser: true
});

export const getLoanAnalysisPrompt = (filename: string, fileContent: string) => `
You are an expert financial analyst AI (LMA DocPulse).
Analyze the following loan agreement document (or filename context if content is minimal).

Filename: "${filename}"
Content Snippet: "${fileContent.substring(0, 1000)}..."

Extract or generate a JSON object with the following fields:
- counterparty (string): Name of the borrower/company.
- amount (string): Loan amount (e.g., "$50.0M").
- type (string): Type of loan (e.g., "Term Loan B", "Revolver").
- risk (string): One of ["Low", "Medium", "High", "Critical"].
- status (string): "Approved" or "In Review".
- deadline (string): A date string (e.g., "Oct 24, 2025").

Return ONLY the JSON object.
`;

export const getChatPrompt = (query: string, context: string) => `
You are LMA DocPulse, an advanced AI assistant for loan compliance.
User Query: "${query}"

Context (Current Active Loans):
${context}

Answer the user's question accurately based on the context. If the answer isn't in the context, use your general knowledge but mention it's general advice. Keep it professional and concise.
`;
