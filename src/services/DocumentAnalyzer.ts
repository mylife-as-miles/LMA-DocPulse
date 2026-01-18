import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface ExtractedEventOfDefault {
    type: string;
    status: 'Active' | 'Potential' | 'Resolved';
    riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
    summary: string;
    clauseRef?: string;
    nextCriticalDate?: string;
}

export interface ExtractedCovenant {
    termName: string;
    value: string;
    clauseRef?: string;
    status: 'LMA STANDARD' | 'DEVIATION';
}

export interface DocumentExtractionResult {
    entities: string[];
    eventsOfDefault: ExtractedEventOfDefault[];
    financialCovenants: ExtractedCovenant[];
    criticalDates: { type: string; date: string }[];
    riskFlags: string[];
}

// Common events of default patterns
const EVENT_OF_DEFAULT_PATTERNS = [
    { pattern: /non[- ]?payment/i, type: 'Non-payment', riskLevel: 'Critical' as const },
    { pattern: /breach\s+(of\s+)?(other\s+)?obligations?/i, type: 'Breach of obligations', riskLevel: 'Medium' as const },
    { pattern: /misrepresentation/i, type: 'Misrepresentation', riskLevel: 'High' as const },
    { pattern: /insolvency|bankruptcy/i, type: 'Insolvency', riskLevel: 'Critical' as const },
    { pattern: /cross[- ]?default/i, type: 'Cross-default', riskLevel: 'High' as const },
    { pattern: /material\s+adverse\s+change/i, type: 'Material Adverse Change', riskLevel: 'High' as const },
    { pattern: /unlawfulness|illegality/i, type: 'Unlawfulness', riskLevel: 'Medium' as const },
    { pattern: /repudiation/i, type: 'Repudiation', riskLevel: 'Critical' as const },
    { pattern: /cessation\s+of\s+business/i, type: 'Cessation of Business', riskLevel: 'Critical' as const },
    { pattern: /audit\s+qualification/i, type: 'Audit Qualification', riskLevel: 'Medium' as const },
];

// Financial covenant patterns
const COVENANT_PATTERNS = [
    { pattern: /leverage\s+ratio[\s:]+([0-9.]+)x?/i, name: 'Leverage Ratio' },
    { pattern: /interest\s+cover(?:age)?[\s:]+([0-9.]+)x?/i, name: 'Interest Cover' },
    { pattern: /debt\s+service\s+cover(?:age)?[\s:]+([0-9.]+)x?/i, name: 'Debt Service Coverage' },
    { pattern: /current\s+ratio[\s:]+([0-9.]+)/i, name: 'Current Ratio' },
    { pattern: /net\s+worth[\s:]+\$?([0-9,.]+)/i, name: 'Minimum Net Worth' },
    { pattern: /ebitda[\s:]+\$?([0-9,.]+)/i, name: 'Minimum EBITDA' },
];

// Entity patterns (company names, parties)
const ENTITY_PATTERNS = [
    /(?:the\s+)?borrower[:\s]+([A-Z][A-Za-z\s&.,]+(?:Ltd|LLC|Inc|Corp|Limited|Corporation|PLC)?)/gi,
    /(?:the\s+)?lender[:\s]+([A-Z][A-Za-z\s&.,]+(?:Bank|Capital|Finance|Financial)?)/gi,
    /between\s+([A-Z][A-Za-z\s&.,]+)\s+and\s+/gi,
];

// Date patterns
const DATE_PATTERNS = [
    { pattern: /(?:maturity|termination)\s+date[:\s]+(\d{1,2}[\s\/\-]\w+[\s\/\-]\d{2,4})/i, type: 'Maturity Date' },
    { pattern: /(?:effective|commencement)\s+date[:\s]+(\d{1,2}[\s\/\-]\w+[\s\/\-]\d{2,4})/i, type: 'Effective Date' },
    { pattern: /(?:repayment|payment)\s+date[:\s]+(\d{1,2}[\s\/\-]\w+[\s\/\-]\d{2,4})/i, type: 'Payment Date' },
];

// Clause reference pattern
const CLAUSE_REF_PATTERN = /(?:clause|section|article)\s+(\d+(?:\.\d+)?)/gi;

/**
 * Extract text content from a PDF file
 */
export async function extractTextFromPdf(fileData: Blob): Promise<string> {
    try {
        const arrayBuffer = await fileData.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        return '';
    }
}

/**
 * Analyze extracted text for events of default
 */
function extractEventsOfDefault(text: string): ExtractedEventOfDefault[] {
    const events: ExtractedEventOfDefault[] = [];
    const foundTypes = new Set<string>();

    for (const { pattern, type, riskLevel } of EVENT_OF_DEFAULT_PATTERNS) {
        const matches = text.match(pattern);
        if (matches && !foundTypes.has(type)) {
            foundTypes.add(type);

            // Try to find associated clause reference
            const contextStart = Math.max(0, text.indexOf(matches[0]) - 100);
            const contextEnd = Math.min(text.length, text.indexOf(matches[0]) + 200);
            const context = text.slice(contextStart, contextEnd);

            const clauseMatch = context.match(CLAUSE_REF_PATTERN);

            events.push({
                type,
                status: 'Potential', // Default to potential since we're just detecting mentions
                riskLevel,
                summary: `Detected mention of ${type.toLowerCase()} clause in document`,
                clauseRef: clauseMatch ? `Clause ${clauseMatch[1]}` : undefined,
            });
        }
    }

    return events;
}

/**
 * Analyze extracted text for financial covenants
 */
function extractFinancialCovenants(text: string): ExtractedCovenant[] {
    const covenants: ExtractedCovenant[] = [];

    for (const { pattern, name } of COVENANT_PATTERNS) {
        const match = text.match(pattern);
        if (match && match[1]) {
            // Try to find associated clause reference
            const contextStart = Math.max(0, text.indexOf(match[0]) - 100);
            const contextEnd = Math.min(text.length, text.indexOf(match[0]) + 100);
            const context = text.slice(contextStart, contextEnd);

            const clauseMatch = context.match(CLAUSE_REF_PATTERN);

            // Determine if it's standard or deviation (simplified logic)
            const isDeviation = text.toLowerCase().includes('non-standard') ||
                text.toLowerCase().includes('deviation') ||
                text.toLowerCase().includes('modified');

            covenants.push({
                termName: name,
                value: match[1] + (name.includes('Ratio') || name.includes('Cover') ? 'x' : ''),
                clauseRef: clauseMatch ? `Clause ${clauseMatch[1]}` : undefined,
                status: isDeviation ? 'DEVIATION' : 'LMA STANDARD',
            });
        }
    }

    return covenants;
}

/**
 * Extract entities (company names, parties) from text
 */
function extractEntities(text: string): string[] {
    const entities: string[] = [];
    const seen = new Set<string>();

    for (const pattern of ENTITY_PATTERNS) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const entity = match[1].trim().replace(/[,.]$/, '');
            if (entity.length > 3 && entity.length < 100 && !seen.has(entity.toLowerCase())) {
                seen.add(entity.toLowerCase());
                entities.push(entity);
            }
        }
    }

    return entities.slice(0, 5); // Limit to 5 entities
}

/**
 * Extract critical dates from text
 */
function extractCriticalDates(text: string): { type: string; date: string }[] {
    const dates: { type: string; date: string }[] = [];

    for (const { pattern, type } of DATE_PATTERNS) {
        const match = text.match(pattern);
        if (match && match[1]) {
            dates.push({ type, date: match[1] });
        }
    }

    return dates;
}

/**
 * Identify risk flags in the document
 */
function extractRiskFlags(text: string): string[] {
    const flags: string[] = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes('libor') && !lowerText.includes('sofr')) {
        flags.push('LIBOR reference without SOFR fallback');
    }
    if (lowerText.includes('unlimited') && lowerText.includes('liability')) {
        flags.push('Unlimited liability clause detected');
    }
    if (lowerText.includes('waiver') && lowerText.includes('right')) {
        flags.push('Rights waiver clause detected');
    }
    if (!lowerText.includes('governing law')) {
        flags.push('Missing governing law clause');
    }
    if (!lowerText.includes('jurisdiction')) {
        flags.push('Missing jurisdiction clause');
    }

    return flags;
}

/**
 * Main function to analyze a document and extract all relevant data
 */
export async function analyzeDocument(fileData: Blob): Promise<DocumentExtractionResult> {
    const text = await extractTextFromPdf(fileData);

    if (!text || text.trim().length < 100) {
        // Return empty result if no meaningful text extracted
        return {
            entities: [],
            eventsOfDefault: [],
            financialCovenants: [],
            criticalDates: [],
            riskFlags: ['Unable to extract text from document'],
        };
    }

    return {
        entities: extractEntities(text),
        eventsOfDefault: extractEventsOfDefault(text),
        financialCovenants: extractFinancialCovenants(text),
        criticalDates: extractCriticalDates(text),
        riskFlags: extractRiskFlags(text),
    };
}
