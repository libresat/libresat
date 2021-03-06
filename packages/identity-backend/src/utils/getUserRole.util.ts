import { IScope } from "../types/scope.type";
import { WRITE_SELF } from "../constants/roles.constants";
import { IGetUserRoleParams } from "../types/getUserRole.type";

/**
 * Get a user's user role (to see whether they can change themselves)
 * @param userId Id of the user whoms scope should be retrieved
 * @param userWithRolesGetter Function that returns a user with populated scopes
 */
async function getUserRole(
  userId: IGetUserRoleParams["userId"],
  userWithRolesGetter: IGetUserRoleParams["userWithRolesGetter"]
): Promise<IScope> {
  const userRole = (await userWithRolesGetter(userId)).roles.find(
    (role: any) => role.name === WRITE_SELF
  );
  return userRole;
}

export { getUserRole };
