import { GraphQLMongoDBController as Controller } from "@libresat/service";
import { user } from "../resolvers/user.resolver";
import { scope } from "../resolvers/scope.resolver";
import { RoleIsMetaRoleError } from "../errors/RoleIsMetaRole.error";
import { RoleNotFoundError } from "../errors/RoleNotFound.error";
import { AccessToRoleNotConfiguredOrIncorrectCredentialsError } from "../errors/AccessToRoleNotConfiguredOrIncorrectCredentials.error";
import { WRITE_ROLE } from "../constants/roles.constants";
import { deleteNested } from "../utils/deleteNested.util";
import { IRoleController, IRoleCreateParams } from "../types/role.type";

class RoleController extends Controller implements IRoleController {
  getAllUsers = async (parent: any) =>
    (await this.model.findById(parent.id).populate("users")).users;

  getAllScopes = async (parent: any) =>
    (await this.model.findById(parent.id).populate("scopes")).scopes;

  private getWithScopes = async (id: string) =>
    this.model.findById(id).populate("scopes");

  async create(params: IRoleCreateParams) {
    const role = await super.create(params);
    const { id: roleScopeId } = await scope.create({
      name: role.id,
      isMeta: true
    });
    const { id: writeSelfRoleId } = await super.create({
      name: WRITE_ROLE,
      isMeta: true
    });

    await scope.assignRole({
      scopeId: roleScopeId,
      roleId: role.id
    });

    await scope.assignRole({
      scopeId: roleScopeId,
      roleId: writeSelfRoleId
    });

    return role;
  }

  async update(params: any) {
    try {
      const { id: roleId } = params;
      const role = await this.getWithScopes(roleId);
      if (!role) {
        throw new RoleNotFoundError();
      } else {
        if (role.isMeta) {
          throw new RoleIsMetaRoleError();
        } else {
          const { id: scopeId } = role.scopes.find(
            (scope: any) => scope.name === roleId
          );

          await user.auth({
            ...params,
            scopeId,
            validRolesNames: [WRITE_ROLE]
          });

          return super.update(roleId, {
            name: params.name
          });
        }
      }
    } catch (e) {
      throw new AccessToRoleNotConfiguredOrIncorrectCredentialsError(e);
    }
  }

  async deleteWithCredentials(params: any) {
    try {
      const { id: roleId } = params;
      const role = await this.getWithScopes(roleId);
      if (!role) {
        throw new RoleNotFoundError();
      } else {
        if (role.isMeta) {
          throw new RoleIsMetaRoleError();
        } else {
          const { id: scopeId } = role.scopes.find(
            (scope: any) => scope.name === roleId
          );

          await user.auth({
            ...params,
            scopeId,
            validRolesNames: [WRITE_ROLE]
          });

          const deletedRole: any = await deleteNested(
            this,
            roleId,
            async (deletableId: string) => await super.delete(deletableId),
            [
              {
                getter: async (roleId: string) =>
                  (await this.get(roleId)).users,
                controller: user,
                path: "scopes"
              }
            ]
          );

          return deletedRole;
        }
      }
    } catch (e) {
      throw new AccessToRoleNotConfiguredOrIncorrectCredentialsError(e);
    }
  }
}

export { RoleController };
