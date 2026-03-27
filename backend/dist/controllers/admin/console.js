import { z } from 'zod';
import { adminProcedure } from '../../middleware/orpc.js';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
const LOGS_DIR = join(process.cwd(), 'logs');
const ERRORS_DIR = join(process.cwd(), 'logs', 'errors');
export const getLogFiles = adminProcedure
    .handler(async () => {
    try {
        const files = await readdir(LOGS_DIR);
        const logFiles = files
            .filter(file => file.endsWith('.log'))
            .sort((a, b) => b.localeCompare(a)); // Sort newest first
        return logFiles;
    }
    catch (error) {
        console.error('Failed to read log directory:', error);
        return [];
    }
});
export const getLogContent = adminProcedure
    .input(z.string())
    .handler(async ({ input }) => {
    try {
        const filePath = join(LOGS_DIR, input);
        const content = await readFile(filePath, 'utf-8');
        // Parse log lines and filter for ERROR, WARN, INFO
        const lines = content.split('\n').filter(line => line.trim());
        const parsedLogs = lines
            .map(line => {
            try {
                const json = JSON.parse(line);
                return json;
            }
            catch {
                return null;
            }
        })
            .filter(log => {
            if (!log)
                return false;
            const level = log.level?.toUpperCase();
            return level === 'ERROR' || level === 'WARN' || level === 'INFO';
        });
        return parsedLogs;
    }
    catch (error) {
        console.error('Failed to read log file:', error);
        throw new Error('Failed to read log file');
    }
});
export const getErrorFiles = adminProcedure
    .handler(async () => {
    try {
        const files = await readdir(ERRORS_DIR);
        const errorFiles = files
            .filter(file => file.endsWith('.json'))
            .sort((a, b) => b.localeCompare(a)); // Sort newest first
        return errorFiles;
    }
    catch (error) {
        console.error('Failed to read errors directory:', error);
        return [];
    }
});
export const getErrorContent = adminProcedure
    .input(z.string())
    .handler(async ({ input }) => {
    try {
        const filePath = join(ERRORS_DIR, input);
        const content = await readFile(filePath, 'utf-8');
        // Parse error JSON file
        const errors = JSON.parse(content);
        // Sort by timestamp (newest first)
        return errors.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    catch (error) {
        console.error('Failed to read error file:', error);
        throw new Error('Failed to read error file');
    }
});
//# sourceMappingURL=console.js.map