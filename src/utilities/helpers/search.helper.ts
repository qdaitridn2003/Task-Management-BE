export const searchHelper = (search: string) => {
    return new RegExp(`.*${search}.*`, 'i');
};
