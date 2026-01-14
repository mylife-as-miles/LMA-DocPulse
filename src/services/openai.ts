import OpenAI from 'openai';

// Helper to get key from storage or env
const getApiKey = () => {
  const localKey = localStorage.getItem('openai_api_key');
  if (localKey && localKey.trim() !== '') {
    return localKey;
  }
  return import.meta.env.VITE_OPENAI_API_KEY;
};

const apiKey = getApiKey();

// Initialize the client
// dangerouslyAllowBrowser: true is required for client-side usage
export const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key', // Fallback to avoid crash on init, but calls will fail if missing
  dangerouslyAllowBrowser: true
});

export const hasApiKey = () => {
  // Check if key exists and isn't the dummy fallback
  const currentKey = getApiKey();
  return !!currentKey && currentKey !== 'dummy-key';
};

// Force reload client if key changes (simple approach for now is to reload page,
// but we can also export a function to re-instantiate if needed, though OpenAI client is usually singleton-ish in usage here)
export const updateApiKey = (key: string) => {
  localStorage.setItem('openai_api_key', key);
  window.location.reload(); // Simple way to ensure new key is picked up by the module-level init
};

export const getLoanAnalysisPrompt = (filename: string, fileContent: string) => `
You are an expert financial analyst AI (LMA DocPulse).
Analyze the following loan agreement document.

Filename: "${filename}"
Content: "${fileContent.substring(0, 50000)}..."

Extract or generate a JSON object with the following fields:
- counterparty (string): Name of the borrower/company.
- amount (string): Loan amount (e.g., "$50.0M").
- type (string): Type of loan (e.g., "Term Loan B", "Revolver").
- risk (string): One of ["Low", "Medium", "High", "Critical"].
- status (string): "Approved" or "In Review" (Default to "In Review" if deviations found).
- deadline (string): A date string (e.g., "Oct 24, 2025").
- reviewData (object):
    - summary (string): A brief summary of the facility.
    - confidenceScore (number): 0-100 score representing extraction confidence.
    - standardizationScore (number): 0-100 score representing adherence to LMA standards.
    - clauseStats (object): { total: number, standard: number, deviations: number }.
    - borrowerDetails (object): { entityName, jurisdiction, registrationNumber, legalAddress }.
    - commercialViability (object):
        - valueProposition (string): Key value prop of the deal.
        - scalabilityPotential (string): Assessment of scalability.
        - efficiencyGains (string): Expected efficiency improvements.
        - potentialImpact (string): Strategic impact analysis.
    - financialCovenants (array of objects): MUST be a JSON array. If none, return []. Each object must have:
        - termName (string): e.g., "Interest Cover Ratio".
        - clauseRef (string): e.g., "Clause 22.1".
        - value (string): e.g., "4.00:1".
        - status (string): "LMA STANDARD" or "DEVIATION".
        - description (string): optional context (e.g., "stepping down to 4.00:1").
    - eventsOfDefault (array of strings): Key events.
    - signatures (string): Status summary.

Return ONLY the JSON object.
`;

export const getChatPrompt = (query: string, context: string) => `
You are LMA DocPulse, an advanced AI assistant for loan compliance.
User Query: "${query}"

Context (Current Active Loans):
${context}

Answer the user's question accurately based on the context. If the answer isn't in the context, use your general knowledge but mention it's general advice. Keep it professional and concise.
`;
