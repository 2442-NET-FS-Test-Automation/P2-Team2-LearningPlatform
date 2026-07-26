interface LoadingProps {
    message?: string,
    fullh?: boolean
}

export default function Loading({ message = "Loading. . .", fullh = true }: LoadingProps){
    let classname = fullh ? "min-h-screen " : "h-full "
    classname += "bg-white dark:bg-slate-900 flex items-center justify-center"
    return (
        <div className={classname}>
            <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-slate-500 dark:text-slate-400">{message}</p>
            </div>
        </div>
    );
}