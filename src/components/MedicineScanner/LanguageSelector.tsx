import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

export const languages = [
    { code: "English", label: "English" },
    { code: "Hindi", label: "Hindi (हिंदी)" },
    { code: "Spanish", label: "Spanish (Español)" },
    { code: "French", label: "French (Français)" },
    { code: "German", label: "German (Deutsch)" },
    { code: "Arabic", label: "Arabic (العربية)" },
    { code: "Chinese", label: "Chinese (中文)" },
    { code: "Bengali", label: "Bengali (বাংলা)" },
    { code: "Portuguese", label: "Portuguese (Português)" },
    { code: "Russian", label: "Russian (Русский)" },
    { code: "Japanese", label: "Japanese (日本語)" },
    { code: "Korean", label: "Korean (한국어)" },
    { code: "Urdu", label: "Urdu (اردو)" },
    { code: "Marathi", label: "Marathi (मराठी)" },
    { code: "Telugu", label: "Telugu (తెలుగు)" },
    { code: "Tamil", label: "Tamil (தமிழ்)" },
    { code: "Gujarati", label: "Gujarati (ગુજરાતી)" },
    { code: "Malayalam", label: "Malayalam (മലയാളം)" },
    { code: "Kannada", label: "Kannada (ಕನ್ನಡ)" },
];

interface LanguageSelectorProps {
    selectedLanguage: string;
    onLanguageChange: (language: string) => void;
    disabled?: boolean;
}

export const LanguageSelector = ({
    selectedLanguage,
    onLanguageChange,
    disabled = false,
}: LanguageSelectorProps) => {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground whitespace-nowrap">
                <Languages className="h-4 w-4 text-primary" />
                <span>Output Language:</span>
            </div>
            <Select
                value={selectedLanguage}
                onValueChange={onLanguageChange}
                disabled={disabled}
            >
                <SelectTrigger className="w-[180px] bg-card/50 backdrop-blur-sm border-border">
                    <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                    {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            {lang.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
