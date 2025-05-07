import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('requiredRoles:', requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('user:',user)

    user.roles.forEach(role => {
      console.log(`Role: ${role.name}, StructureId: ${role.structureId}`);
    });
    
    console.log(`Role: ${requiredRoles}}, StructureId: ${user.structureId}`);

    // Check if the user's roles and structureId match the required roles
    return requiredRoles.some((role) => {

      const userRole = user.roles.find((userRole) => userRole.name === role);

      return userRole;
    });
  
  }
}
