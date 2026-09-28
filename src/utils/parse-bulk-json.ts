// Mirrors BulkRowParser.MaxRows on the backend.
export const MAX_BULK_ROWS = 1000;

export type ParseBulkJsonResult =
  | { ok: true; rows: unknown[] }
  | { ok: false; error: string };

export const parseBulkJson = (text: string): ParseBulkJsonResult => {
  if (!text.trim()) {
    return { ok: false, error: 'Paste a JSON array to upload.' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error.';
    return { ok: false, error: `That isn't valid JSON. ${detail}` };
  }

  if (!Array.isArray(parsed)) {
    return {
      ok: false,
      error: 'The JSON must be an array, like [ { ... }, { ... } ].',
    };
  }

  if (parsed.length === 0) {
    return { ok: false, error: 'The array is empty. Add at least one row.' };
  }

  if (parsed.length > MAX_BULK_ROWS) {
    return {
      ok: false,
      error: `A single upload is limited to ${MAX_BULK_ROWS} rows. This one has ${parsed.length}.`,
    };
  }

  return { ok: true, rows: parsed };
};
