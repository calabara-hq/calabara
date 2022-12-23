export interface QueryData {
    rows: any[]
}

export interface QueryParams {
    [key: string]: string
}

export interface DBConfig {
    db: DBObj
}

interface DBObj {
    user?: string,
    host?: string,
    database?: string,
    password?: string,
    port?: any
}
