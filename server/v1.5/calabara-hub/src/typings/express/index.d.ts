export { };

declare global {
    namespace Express {
        interface Request {
            session:? Session;
            sessionID?: string;
        }
    }
}

interface Session {
    user: Address;
}

interface Address {
    address: string;
}