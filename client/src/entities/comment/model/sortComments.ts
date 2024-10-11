/* eslint-disable @typescript-eslint/no-explicit-any */

export const sortComments = (items: any[], selectedSort: string) => {
  const sorted = [...items].sort((a, b) => {
    switch (selectedSort) {
      case 'Все':
        return a.id - b.id;

      case 'По дате':
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;

      case 'Популярные':
        return b.likes - a.likes;

      default:
        return 0;
    }
  });

  return sorted;
};
