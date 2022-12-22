import { clean } from "../../lib/helpers";
import { fetchOrganization, fetchOrganizations } from "./methods";
//import { getDashboardRules, getDashboardWidgets } from "../dashboard/dashboard.methods";

const resolvers = {
    Query: {
        organization: async (root: any, { ens }: any) => {
            return await fetchOrganization(ens)
                .then(clean)
        },
        organizations: async () => {
            return await fetchOrganizations()
                .then(clean);
        }
    },
    /*
    Organization: {
        rules: async (organization: any) => {
            return await getDashboardRules(organization.ens)
        },
        widgets: async (organization: any) => {
            return await getDashboardWidgets(organization.ens)
        },
    }
    */
}

export default resolvers;


