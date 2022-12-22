export { };


interface Session {
    user: Address;
}

interface Address {
    address: string;
}


declare global {
    namespace Express {
        interface Request {
        }
    }
}
