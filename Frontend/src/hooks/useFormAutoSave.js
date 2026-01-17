import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for auto-saving form data to localStorage
 * @param {Object} formData - The form data object to auto-save
 * @param {string} formKey - Unique key for localStorage (e.g., 'registration-event-slug')
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 2000)
 * @param {Array} excludeFields - Fields to exclude from auto-save (default: ['receiptFile'])
 * @returns {Object} - { restore, clearSaved, lastSaved }
 */
export function useFormAutoSave(formData, formKey, debounceMs = 2000, excludeFields = ['receiptFile']) {
    const [lastSaved, setLastSaved] = useState(null);
    const timeoutRef = useRef(null);
    const initialLoadRef = useRef(false);

    const storageKey = `autosave_${formKey}`;

    /**
     * Save form data to localStorage (excluding specified fields)
     */
    const saveToStorage = (data) => {
        try {
            // Filter out excluded fields (like File objects)
            const dataToSave = Object.entries(data).reduce((acc, [key, value]) => {
                if (!excludeFields.includes(key)) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            localStorage.setItem(storageKey, JSON.stringify({
                data: dataToSave,
                timestamp: Date.now()
            }));

            setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save form data:', error);
        }
    };

    /**
     * Restore form data from localStorage
     * @returns {Object|null} - Restored form data or null if not found
     */
    const restore = () => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (!saved) return null;

            const { data, timestamp } = JSON.parse(saved);

            // Don't restore if saved more than 7 days ago
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            if (timestamp < sevenDaysAgo) {
                localStorage.removeItem(storageKey);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Failed to restore form data:', error);
            return null;
        }
    };

    /**
     * Clear saved form data from localStorage
     */
    const clearSaved = () => {
        try {
            localStorage.removeItem(storageKey);
            setLastSaved(null);
        } catch (error) {
            console.error('Failed to clear saved data:', error);
        }
    };

    /**
     * Auto-save effect with debouncing
     */
    useEffect(() => {
        // Skip on initial mount to avoid saving default values
        if (!initialLoadRef.current) {
            initialLoadRef.current = true;
            return;
        }

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for debounced save
        timeoutRef.current = setTimeout(() => {
            // Only save if form has meaningful data
            const hasData = Object.entries(formData).some(([key, value]) => {
                if (excludeFields.includes(key)) return false;
                if (typeof value === 'string') return value.trim().length > 0;
                if (Array.isArray(value)) return value.length > 0;
                return value !== null && value !== undefined;
            });

            if (hasData) {
                saveToStorage(formData);
            }
        }, debounceMs);

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [formData, debounceMs, storageKey]);

    return {
        restore,
        clearSaved,
        lastSaved
    };
}
