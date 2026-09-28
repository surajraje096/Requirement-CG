import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set up pdf.js worker URL if needed or configure workerSrc
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch {
    // Worker fallback
  }
}

export interface ParsedDocumentResult {
  fileName: string;
  fileSize: number;
  text: string;
  detectedTitle?: string;
  detectedDomain?: string;
  detectedPbiId?: string;
}

export async function parseUploadedDocument(file: File): Promise<ParsedDocumentResult> {
  const fileName = file.name;
  const fileSize = file.size;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  // Generate suggested PBI ID from file name, e.g. "PRD-PAY-4028-Specs.docx" -> "PAY-4028" or "DOC-101"
  let detectedPbiId = 'DOC-101';
  const pbiMatch = fileName.match(/([A-Z]{2,6}-\d{2,6})/i);
  if (pbiMatch) {
    detectedPbiId = pbiMatch[1].toUpperCase();
  } else {
    const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-').slice(0, 15).toUpperCase();
    detectedPbiId = cleanName.length > 2 ? `DOC-${cleanName}` : 'DOC-101';
  }

  // Generate suggested title
  const detectedTitle = fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  let text = '';

  try {
    if (extension === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await (mammoth as any).extractRawText({ arrayBuffer });
      text = result.value || '';
    } else if (extension === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = (pdfjsLib as any).getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const textParts: string[] = [];

      for (let i = 1; i <= Math.min(numPages, 30); i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        textParts.push(pageText);
      }
      text = textParts.join('\n\n');
    } else {
      // Plain text, markdown, json, csv, etc.
      text = await file.text();
    }
  } catch (err: any) {
    console.warn('Advanced file parsing encountered an issue, falling back to raw text read:', err);
    try {
      text = await file.text();
    } catch {
      throw new Error(`Could not parse ${fileName}: ${err.message || 'Unsupported format'}`);
    }
  }

  text = text.trim();

  // Simple heuristic for domain detection
  let detectedDomain = 'Enterprise Software';
  const lower = text.toLowerCase();
  if (lower.includes('bank') || lower.includes('transfer') || lower.includes('payment') || lower.includes('credit') || lower.includes('kyc') || lower.includes('aml')) {
    detectedDomain = 'Fintech & Banking';
  } else if (lower.includes('patient') || lower.includes('doctor') || lower.includes('hipaa') || lower.includes('medical') || lower.includes('health') || lower.includes('ehr')) {
    detectedDomain = 'Healthcare & Life Sciences';
  } else if (lower.includes('cart') || lower.includes('checkout') || lower.includes('discount') || lower.includes('sku') || lower.includes('order')) {
    detectedDomain = 'E-Commerce & Retail';
  } else if (lower.includes('subscription') || lower.includes('tenant') || lower.includes('seat') || lower.includes('saas') || lower.includes('billing')) {
    detectedDomain = 'SaaS & Cloud Platforms';
  }

  return {
    fileName,
    fileSize,
    text,
    detectedTitle,
    detectedDomain,
    detectedPbiId
  };
}
