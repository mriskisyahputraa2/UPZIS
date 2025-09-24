// resources/js/components/ui/input-with-char-count.jsx

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input as ShadcnInput } from '@/components/ui/input';

const Input = React.forwardRef(
    ({ className, type, showCharCount, maxLength, value, ...props }, ref) => {
        const remainingChars = maxLength && value ? maxLength - String(value).length : maxLength;

        return (
            <div className="relative">
                <ShadcnInput
                    type={type}
                    className={cn(showCharCount ? 'pr-12' : '', className)} // Beri ruang jika ada countdown
                    ref={ref}
                    maxLength={maxLength}
                    value={value}
                    {...props}
                />
                {showCharCount && maxLength && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-sm text-gray-400">
                           {remainingChars}
                        </span>
                    </div>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
