import * as XLSX from 'xlsx';
import { createWorker } from 'tesseract.js';

/**
 * Parses Excel (.xlsx, .xls) and CSV files into structured task records
 * Expected columns: Name, Phone, Email, Role/Designation, Notes/Details
 */
export const parseSpreadsheet = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData || jsonData.length === 0) {
          resolve([]);
          return;
        }

        // Detect header row (first non-empty row)
        let headerRowIndex = 0;
        while (headerRowIndex < jsonData.length && (!jsonData[headerRowIndex] || jsonData[headerRowIndex].length === 0)) {
          headerRowIndex++;
        }

        const headers = (jsonData[headerRowIndex] || []).map(h => String(h || '').trim().toLowerCase());

        // Find column indices
        const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('contact') || h.includes('person') || h.includes('item'));
        const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('contact no') || h.includes('tel'));
        const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
        const roleIdx = headers.findIndex(h => h.includes('role') || h.includes('designation') || h.includes('work') || h.includes('company') || h.includes('task'));
        const notesIdx = headers.findIndex(h => h.includes('note') || h.includes('detail') || h.includes('remark') || h.includes('info'));

        const records = [];

        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0 || !row.some(cell => String(cell || '').trim() !== '')) {
            continue; // Skip empty rows
          }

          // Fallback indexing if headers not detected
          const name = nameIdx !== -1 ? String(row[nameIdx] || '') : String(row[0] || '');
          const phone = phoneIdx !== -1 ? String(row[phoneIdx] || '') : (row[1] ? String(row[1]) : '');
          const email = emailIdx !== -1 ? String(row[emailIdx] || '') : (row[2] ? String(row[2]) : '');
          const role_or_work = roleIdx !== -1 ? String(row[roleIdx] || '') : (row[3] ? String(row[3]) : '');
          const notes = notesIdx !== -1 ? String(row[notesIdx] || '') : (row[4] ? String(row[4]) : '');

          if (name.trim()) {
            records.push({
              id: `parsed-${Date.now()}-${i}`,
              name: name.trim(),
              phone: phone.trim(),
              email: email.trim(),
              role_or_work: role_or_work.trim() || 'Work Item / Contact',
              notes: notes.trim(),
              status: 'Not Started',
              student_notes: ''
            });
          }
        }

        resolve(records);
      } catch (err) {
        console.error('Spreadsheet parsing failed:', err);
        reject(new Error('Failed to parse spreadsheet file: ' + err.message));
      }
    };

    reader.onerror = () => reject(new Error('File reading error.'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * OCR Engine for Images (PNG, JPG, JPEG) using Tesseract.js
 * Extracts raw text and parses line-by-line tabular contacts or work items
 */
export const parseImageWithOCR = async (file, onProgress) => {
  try {
    const worker = await createWorker('eng');

    if (onProgress) {
      // Progress logger
      onProgress(25, 'Initializing OCR worker...');
    }

    const ret = await worker.recognize(file);
    if (onProgress) {
      onProgress(80, 'Extracting text and identifying entities...');
    }
    
    await worker.terminate();

    const rawText = ret.data.text || '';
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 2);

    const records = [];
    const phoneRegex = /(?:\+91[\s-]?)?[6789]\d{9}|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

    lines.forEach((line, index) => {
      // Skip obvious table headers like "Name Phone Email"
      if (line.toLowerCase().includes('name') && line.toLowerCase().includes('phone')) return;

      const emailMatch = line.match(emailRegex);
      const phoneMatch = line.match(phoneRegex);

      let email = emailMatch ? emailMatch[0] : '';
      let phone = phoneMatch ? phoneMatch[0] : '';

      // Strip email and phone from line to isolate name and notes
      let remaining = line.replace(email, '').replace(phone, '').trim();

      // Split remaining by commas or pipes if tabular
      const parts = remaining.split(/[,|;]/).map(p => p.trim()).filter(Boolean);
      let name = parts[0] || remaining;
      let role_or_work = parts[1] || '';
      let notes = parts.slice(2).join(' ') || '';

      // If name is too short or just numbers, skip
      if (name.length >= 2 && !/^\d+$/.test(name)) {
        records.push({
          id: `ocr-${Date.now()}-${index}`,
          name,
          phone,
          email,
          role_or_work: role_or_work || 'Extracted Contact',
          notes: notes,
          status: 'Not Started',
          student_notes: ''
        });
      }
    });

    if (onProgress) {
      onProgress(100, 'OCR parsing complete!');
    }

    return records;
  } catch (err) {
    console.error('OCR Processing error:', err);
    throw new Error('OCR recognition failed: ' + err.message);
  }
};
