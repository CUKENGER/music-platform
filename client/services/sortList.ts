

export const sortList = (items: any, selectedSort: string, setSortedItems: (arg0: any[]) => void) => {
    const sorted = [...items].sort((a, b) => {
        switch (selectedSort) {
            case 'Все':
                if (a.id && b.id) {
                    return a.id - b.id;
                }
            case 'По алфавиту':
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                return nameA.localeCompare(nameB);
            case 'Популярные':
                if (b.listens && a.listens) {
                    return b.listens - a.listens;
                }
            default:
                return 0;
        }
    });
    setSortedItems(sorted);
};