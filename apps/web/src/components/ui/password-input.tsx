"use client"

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
    name,
    autoComplete,
    placeholder,
    required,
    value,
    onChange,
}: {
    name: string;
    autoComplete?: string;
    placeholder: string;
    required: boolean;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                value={value}
                name={name}
                autoComplete={autoComplete}
                placeholder={placeholder}
                required={required}
                minLength={8}
                className="retro-input w-full pl-10"
                onChange={onChange}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
            >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    )
}
