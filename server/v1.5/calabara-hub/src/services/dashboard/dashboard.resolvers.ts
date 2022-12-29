import { clean } from "../../helpers/helpers";
import { getDashboardRules, getDashboardWidgets } from "./dashboard.methods";

const resolvers = {
    Query: {
        rules: async (root: any, { ens }: any) => {
            return await getDashboardRules(ens)
        },
        widgets: async (root: any, { ens }: any) => {
            return await getDashboardWidgets(ens)
        }
    },
};

export default resolvers;


