import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ActionState = 'idle' | 'processing' | 'success' | 'error';

interface ActionFeedbackProps {
    actionName: string;
    onComplete?: () => void;
    duration?: number;
}

export const useActionFeedback = (actionName: string, options?: { successMessage?: string, errorMessage?: string, duration?: number }) => {
    const [state, setState] = useState<ActionState>('idle');

    const trigger = async (promiseOrFn: () => Promise<void> | void) => {
        setState('processing');
        const toastId = toast.loading(`${actionName}...`, {
             description: 'Please wait while we process your request.',
        });

        try {
            await new Promise(resolve => setTimeout(resolve, options?.duration || 1500)); // Mock delay
            await (typeof promiseOrFn === 'function' ? promiseOrFn() : Promise.resolve());

            setState('success');
            toast.success(options?.successMessage || `${actionName} completed successfully!`, {
                id: toastId,
            });

            setTimeout(() => setState('idle'), 2000);
        } catch (error) {
            setState('error');
            toast.error(options?.errorMessage || `Failed to ${actionName.toLowerCase()}.`, {
                id: toastId,
            });
            setTimeout(() => setState('idle'), 3000);
        }
    };

    return { state, trigger };
};

// Also exporting a component if we want inline feedback
export const InlineActionFeedback = ({ state, message }: { state: ActionState, message?: string }) => {
    return (
        <AnimatePresence>
            {state !== 'idle' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-xl absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none",
                        state === 'processing' && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                        state === 'success' && "bg-green-500/20 text-green-400 border-green-500/30",
                        state === 'error' && "bg-red-500/20 text-red-400 border-red-500/30",
                    )}
                >
                    {state === 'processing' && <Loader2 size={14} className="animate-spin" />}
                    {state === 'success' && <CheckCircle2 size={14} />}
                    {state === 'error' && <XCircle size={14} />}
                    <span>{message || (state === 'processing' ? 'Processing...' : state === 'success' ? 'Done!' : 'Error')}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
