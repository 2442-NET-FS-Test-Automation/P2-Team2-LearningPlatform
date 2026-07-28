import { AlertTriangle, Info } from "lucide-react";


export type ConfirmModalProps = {
    title: string,
    message: string,
    confirmLabel?: string,
    cancelLabel?: string,
    variant?: "default" | "danger",
    onConfirm: () => void,
    onCancel: () => void
}

export default function ConfirmModal({
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "default",
    onConfirm,
    onCancel
}: ConfirmModalProps){
    return (
        <div
            className="modal-container"
            onClick={onCancel}
        >
            <div
                className="card w-full max-w-sm animate-fade-in-up"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-3">
                    <div className={
                            variant === "danger"
                                ? "rounded-full bg-red-100 p-2.5 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                                : "rounded-full bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                        }>
                        {variant === "danger" ? <AlertTriangle size={20} /> : <Info size={20} />}
                    </div>
                    <div>
                        <h2 id="confirm-modal-title" className="text-lg font-semibold">
                            {title}
                        </h2>
                        <p className="mt-1.5 text-sm text-muted">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onCancel} className="btn-outline">
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={
                            variant === "danger"
                                ? "rounded-lg bg-red-600/70 px-5 py-2.5 font-medium text-white/90 shadow-sm transition-all hover:bg-red-700 hover:shadow-md active:scale-95 dark:bg-red-700/90 dark:hover:bg-red-600/60"
                                : "btn-primary"
                        }
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );

}