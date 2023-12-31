export const paginationHelper = (limit?: string, page?: string) => {
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;
    return { amount: limitNumber, offset };
};
