"use strict";
var fs = require("node:fs/promises"), os = require("node:os"), path = require("node:path"), _internal = require("@sanity/schema/_internal"), types = require("@sanity/types"), node = require("esbuild-register/dist/node"), pluralize = require("pluralize-esm"), rxjs = require("rxjs"), determineTargetMediaLibrary = require("./determineTargetMediaLibrary.js"), withMediaLibraryConfig = require("./withMediaLibraryConfig.js");
function _interopDefaultCompat(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var fs__default = /* @__PURE__ */ _interopDefaultCompat(fs), path__default = /* @__PURE__ */ _interopDefaultCompat(path), pluralize__default = /* @__PURE__ */ _interopDefaultCompat(pluralize);
const deployAspectAction = async (args, context) => {
  const {
    output,
    apiClient,
    mediaLibrary
  } = withMediaLibraryConfig.withMediaLibraryConfig(context), [aspectId] = args.argsWithoutOptions, all = args.extOptions.all ?? !1;
  if (!all && typeof aspectId > "u") {
    output.error("Specify an aspect name, or use the `--all` option to deploy all aspect definitions.");
    return;
  }
  if (all && typeof aspectId < "u") {
    output.error("Specified both an aspect name and `--all`.");
    return;
  }
  const mediaLibraryId = args.extOptions["media-library-id"] ?? await determineTargetMediaLibrary.determineTargetMediaLibrary(context), client = apiClient().withConfig({
    apiVersion: determineTargetMediaLibrary.MINIMUM_API_VERSION,
    requestTagPrefix: "sanity.mediaLibraryCli"
  });
  importAspects({
    aspectsPath: mediaLibrary.aspectsPath,
    filterAspects: (entry) => all ? !0 : typeof entry == "object" && entry !== null && "_id" in entry ? entry._id === aspectId : !1
  }).pipe(rxjs.mergeMap(([status, aspects]) => status === "invalid" ? rxjs.of({
    status: "failure",
    reason: "invalidAspect",
    aspects
  }) : rxjs.of(aspects).pipe(deployAspects({
    client,
    mediaLibraryId,
    dryRun: !1
  }))), reportResult({
    context
  }), reportUnfoundAspect({
    aspectId,
    context
  })).subscribe();
};
function importAspects({
  aspectsPath,
  filterAspects = () => !0
}) {
  let unregister;
  const entries = fs__default.default.readdir(aspectsPath, {
    withFileTypes: !0
  });
  return rxjs.from(entries).pipe(rxjs.tap({
    subscribe() {
      unregister = node.register({
        target: `node${process.version.slice(1)}`,
        supported: {
          "dynamic-import": !0
        }
      }).unregister;
    }
  }), rxjs.mergeMap((entry) => rxjs.from(entry)), rxjs.filter((file) => file.isFile()), rxjs.filter((file) => determineTargetMediaLibrary.ASPECT_FILE_EXTENSIONS.includes(path__default.default.extname(file.name))), rxjs.switchMap((file) => importAspect({
    aspectsPath,
    filename: file.name
  })), rxjs.map(([filename, maybeAspect]) => {
    if (!types.isAssetAspect(maybeAspect))
      return {
        status: "invalid",
        aspect: maybeAspect,
        validationErrors: [],
        filename
      };
    const [valid, errors] = _internal.validateMediaLibraryAssetAspect(maybeAspect.definition);
    return valid ? {
      status: "valid",
      aspect: maybeAspect,
      validationErrors: [],
      filename
    } : {
      status: "invalid",
      aspect: maybeAspect,
      validationErrors: errors,
      filename
    };
  }), rxjs.groupBy((maybeAspect) => maybeAspect.status), rxjs.mergeMap((group) => rxjs.zip(rxjs.of(group.key), group.pipe(rxjs.filter(({
    aspect
  }) => filterAspects(aspect)), rxjs.toArray()))), rxjs.finalize(() => unregister?.()));
}
function importAspect({
  aspectsPath,
  filename
}) {
  return rxjs.of([filename, require(path__default.default.resolve(aspectsPath, filename)).default]);
}
function deployAspects({
  client,
  dryRun,
  mediaLibraryId
}) {
  return rxjs.pipe(rxjs.filter((aspects) => aspects.length !== 0), rxjs.switchMap((aspects) => client.observable.request({
    method: "POST",
    uri: `/media-libraries/${mediaLibraryId}/mutate`,
    tag: "deployAspects",
    query: {
      dryRun: String(dryRun)
    },
    body: {
      mutations: aspects.map(({
        aspect
      }) => ({
        createOrReplace: aspect
      }))
    }
  }).pipe(rxjs.mergeMap(() => rxjs.of({
    status: "success",
    aspects
  })), rxjs.catchError((error) => rxjs.of({
    status: "failure",
    reason: "failedMutation",
    error: error.message,
    aspects
  })))));
}
function reportResult({
  context
}) {
  return rxjs.tap((result) => {
    const {
      output,
      chalk
    } = context, list = formatAspectList({
      aspects: result.aspects,
      chalk
    });
    result.status === "success" && result.aspects.length !== 0 && (output.print(), output.success(chalk.bold(`Deployed ${result.aspects.length} ${pluralize__default.default("aspect", result.aspects.length)}`)), output.print(list)), result.status === "failure" && result.aspects.length !== 0 && result.reason === "invalidAspect" && (output.print(), output.warn(chalk.bold(`Skipped ${result.aspects.length} invalid ${pluralize__default.default("aspect", result.aspects.length)}`)), output.print(list)), result.status === "failure" && result.aspects.length !== 0 && result.reason === "failedMutation" && (output.print(), output.error(chalk.bold(`Failed to deploy ${result.aspects.length} ${pluralize__default.default("aspect", result.aspects.length)}`)), output.print(list), output.print(), output.print(chalk.red(result.error)));
  });
}
function reportUnfoundAspect({
  aspectId,
  context
}) {
  const {
    output,
    chalk
  } = context;
  return rxjs.pipe(rxjs.scan((aspects, result) => aspects.concat(result.aspects), []), rxjs.takeLast(1), rxjs.tap((aspects) => {
    aspects.length === 0 && aspectId && (output.print(), output.error(`Could not find aspect: ${chalk.bold(aspectId)}`));
  }));
}
function formatAspectList({
  aspects,
  chalk
}) {
  return aspects.map(({
    aspect,
    filename,
    validationErrors
  }) => {
    const label = typeof aspect == "object" && aspect !== null && "_id" in aspect && typeof aspect._id < "u" ? aspect._id : "Unnamed aspect", simplifiedErrors = validationErrors.flatMap((group) => group.map(({
      message
    }) => message)), errorLabel = simplifiedErrors.length === 0 ? "" : ` ${chalk.bgRed(simplifiedErrors[0])}`, remainingErrorsCount = simplifiedErrors.length - 1, remainingErrorsLabel = remainingErrorsCount > 0 ? chalk.italic(` and ${simplifiedErrors.length - 1} other ${pluralize__default.default("error", remainingErrorsCount)}`) : "";
    return `  - ${label} ${chalk.dim(filename)}${errorLabel}${remainingErrorsLabel}`;
  }).join(os.EOL);
}
exports.default = deployAspectAction;
//# sourceMappingURL=deployAspectAction.js.map
