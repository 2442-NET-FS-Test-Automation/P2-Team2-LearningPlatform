import { AlertCircle } from "lucide-react";

interface Props {
    error: string
}

export default function ErrorMessage({ error }: Props) {
    return (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
        </div>
    )
}