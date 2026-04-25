export class ExportService {
    /**
     * Exports an array of row objects to a CSV file and triggers download.
     */
    public static exportToCsv(
        data: Record<string, string | number | boolean | undefined>[],
        filename: string
    ): void {
        if (!data || data.length === 0) {
            return;
        }

        const headers = Object.keys(data[0]);
        const csvRows: string[] = [];

        // Header row
        csvRows.push(headers.map((h) => ExportService._escapeField(h)).join(','));

        // Data rows
        for (const row of data) {
            const values = headers.map((h) => {
                const val = row[h];
                return ExportService._escapeField(val !== null && val !== undefined ? String(val) : '');
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\r\n');
        const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }

    /**
     * Generates a timestamped filename for CSV exports.
     */
    public static generateFilename(prefix: string): string {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
        return `${prefix}-${dateStr}.csv`;
    }

    private static _escapeField(value: string): string {
        if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }
}
