"use strict";
var cli = require("@sanity/cli");
const envPrefix = "SANITY_STUDIO_", appEnvPrefix = "SANITY_APP_";
function getStudioEnvironmentVariables(options = {}) {
  const {
    prefix = "",
    envFile = !1,
    jsonEncode = !1
  } = options, fullEnv = envFile ? {
    ...process.env,
    ...cli.loadEnv(envFile.mode, envFile.envDir || process.cwd(), [envPrefix])
  } : process.env, studioEnv = {};
  for (const key in fullEnv)
    key.startsWith(envPrefix) && (studioEnv[`${prefix}${key}`] = jsonEncode ? JSON.stringify(fullEnv[key] || "") : fullEnv[key] || "");
  return studioEnv;
}
function getAppEnvironmentVariables(options = {}) {
  const {
    prefix = "",
    envFile = !1,
    jsonEncode = !1
  } = options, fullEnv = envFile ? {
    ...process.env,
    ...cli.loadEnv(envFile.mode, envFile.envDir || process.cwd(), [envPrefix])
  } : process.env, appEnv = {};
  for (const key in fullEnv)
    key.startsWith(appEnvPrefix) && (appEnv[`${prefix}${key}`] = jsonEncode ? JSON.stringify(fullEnv[key] || "") : fullEnv[key] || "");
  return appEnv;
}
exports.getAppEnvironmentVariables = getAppEnvironmentVariables;
exports.getStudioEnvironmentVariables = getStudioEnvironmentVariables;
//# sourceMappingURL=cli.js.map
