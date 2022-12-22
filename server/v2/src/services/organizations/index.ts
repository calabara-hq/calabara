import makeServer from "../../lib/makeServer";
import schema from "./schema";
makeServer(schema, 'organizations', 5050);