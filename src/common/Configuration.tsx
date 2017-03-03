/**
 * holds configuration info for the application, all external variable references are accessible here
 */
export let __GIT_COMMIT__;
export let __BUILD_NUMBER__;
export let __BUILD_TIME__;
export let __VERSION__;

export class Configuration {
  static readonly GIT_COMMIT: string = typeof __GIT_COMMIT__ === "undefined" ? "unknown" : __GIT_COMMIT__;
  static readonly VERSION: string = typeof __VERSION__ === "undefined" ? "0.0.0" : __VERSION__;
  static readonly BUILD_NUMBER: number = typeof  __BUILD_NUMBER__ === "undefined" ? "0" : __BUILD_NUMBER__;
  static readonly BUILD_TIME: string = typeof  __BUILD_TIME__ === "undefined" ? new Date().toUTCString() : __BUILD_TIME__;

  static version(): string {
    return Configuration.VERSION + "." + Configuration.BUILD_NUMBER;
  }

  static revision(): string {
    return "#" + Configuration.GIT_COMMIT;
  }

  static isDevelopment(): boolean {
    return process.env.NODE_ENV !== "production";
  }

}