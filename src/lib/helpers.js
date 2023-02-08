export const serializeNonPOJO = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

export const serializeNonPOJOProm = async (obj) => {
    return JSON.parse(JSON.stringify(await obj))
}