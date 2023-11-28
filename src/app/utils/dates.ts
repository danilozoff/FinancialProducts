function addOneYear(date: string) {
    const dateCopy = new Date(date);
    dateCopy.setFullYear(dateCopy.getFullYear() + 1);
    return dateCopy;
}

function getYYYYMMDD(date: Date) {
    return date.toISOString().split('T')[0];
}

export {
    addOneYear,
    getYYYYMMDD
};