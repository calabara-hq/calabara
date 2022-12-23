import makeServer from "../../lib/makeServer";
import schema from "./schema";
makeServer(schema, 'dashboard', 5051);