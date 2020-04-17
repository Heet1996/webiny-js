import { pipe, withStorage, withCrudLogs, withSoftDelete, withFields } from "@webiny/commodo";
import { withUser } from "@webiny/api-security";
import cmsEnvironment from "./models/environment.model";
import cmsEnvironmentAlias from "./models/environmentAlias.model";

export default () => ({
    name: "graphql-context-models",
    type: "graphql-context",
    apply(context) {
        const driver = context.commodo && context.commodo.driver;

        if (!driver) {
            throw Error(
                `Commodo driver is not configured! Make sure you add a Commodo driver plugin to your service.`
            );
        }

        const createBase = () =>
            pipe(
                withFields({
                    id: context.commodo.fields.id()
                }),
                withStorage({ driver }),
                withUser(context),
                withSoftDelete(),
                withCrudLogs()
            )();

        context.models = { createBase };
        context.models.CmsEnvironment = cmsEnvironment({ createBase, context });
        context.models.CmsEnvironmentAlias = cmsEnvironmentAlias({ createBase, context });
    }
});