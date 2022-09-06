export enum Role {
  ADMIN = 1,
  SUPPORT = 2,
  USER = 3
}

export function getRoleName(role: Role): string {
  switch (role) {
    case Role.ADMIN:
      return "Admin";
    case Role.SUPPORT:
      return "Support";
    case Role.USER:
      return "User";
    default:
      return "Unknown";
  }
}

export function canSeeSpecialContent(role: Role): boolean {
  return role === Role.ADMIN || role === Role.SUPPORT;
}
