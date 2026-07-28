import { X, type LucideIcon } from "lucide-react";

interface Props {
    Icon: LucideIcon,
    Title: string,
    Description: string,
    OnClose: () => void
}

export default function ModalHeader({
    Icon,
    Title,
    Description,
    OnClose
}: Props) {
    return (
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-3 w-full">
                <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                    <Icon size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">{Title}</h2>
                    <p className="text-sm text-muted">{Description}</p>
                </div>
                <button
                    onClick={OnClose}
                    className="rounded-full ml-auto p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    )
}