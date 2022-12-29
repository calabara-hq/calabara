import { QueryData } from "./interfaces"

export const clean = (data: QueryData): any[] | null => {
    if (data.rows.length == 0) return null
    if (data.rows.length == 1) return data.rows[0]
    return data.rows
}

export const asArray = (data: QueryData): any[] => {
    if (Array.isArray(data)) return data
    if (!data) return []
    return [data]
}