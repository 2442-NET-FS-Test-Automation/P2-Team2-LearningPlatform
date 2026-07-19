export function getGradeColor (grade: number): string {
    if (grade >= 80) return 'text-green-600 dark:text-green-400';
    if (grade >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
};

export function calculateAverage(array: number[]): number {
    if (array.length === 0) return 0; // Prevent NaN on empty array

    const total = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return total / array.length;
}