import log = require("loglevel");

export enum LogLevel {
  // noinspection JSUnusedGlobalSymbols
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  SILENT = 5
}
log.setLevel(LogLevel.INFO);

export default log;