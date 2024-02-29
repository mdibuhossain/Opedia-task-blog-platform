export class Utils {
  static excludeFields(user, keys) {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key))
    );
  }
}
