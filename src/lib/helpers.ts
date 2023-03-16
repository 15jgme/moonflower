export const serializeNonPOJO = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

export const serializeNonPOJOProm = async (obj) => {
    return JSON.parse(JSON.stringify(await obj))
}

export function parseAuthors(authors_json: any): string {
    try {
        if (authors_json.length == 0) {
            return '';
        }

        if (authors_json.length == 1) {
            return authors_json[0][0];
        } else if (authors_json.length == 2) {
            return `${authors_json[0][0]} and ${authors_json[1][0]}`;
        } else {
            return `${authors_json[0][0]} et al.`;
        }
    } catch (erorr) {
        return '';
    }
}