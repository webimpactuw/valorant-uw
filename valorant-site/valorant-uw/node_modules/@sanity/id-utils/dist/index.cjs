"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var tsBrand = require("ts-brand"), lodashPartition = require("lodash/partition.js"), uuid = require("@sanity/uuid"), deburr = require("lodash/deburr.js");
function _interopDefaultCompat(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var lodashPartition__default = /* @__PURE__ */ _interopDefaultCompat(lodashPartition), deburr__default = /* @__PURE__ */ _interopDefaultCompat(deburr);
const VALID_ID = /^[a-z-A-Z0-9._-]+$/, DRAFTS_DIR = "drafts", VERSION_DIR = "versions", PATH_SEPARATOR = ".", DRAFTS_PREFIX = `${DRAFTS_DIR}${PATH_SEPARATOR}`, VERSION_PREFIX = `${VERSION_DIR}${PATH_SEPARATOR}`;
function error(error2) {
  return { success: !1, error: error2 };
}
function success(value) {
  return { success: !0, value };
}
function safe(fn) {
  try {
    return success(fn());
  } catch (err) {
    return error(err instanceof Error ? err : new Error(String(err)));
  }
}
function partition(array, predicate) {
  return lodashPartition__default.default(array, predicate);
}
const DocumentId = tsBrand.make((id) => {
  validateAnyId(id);
  const results = [validatePublishedId, validateDraftId, validateVersionId].map(
    (validator) => safe(() => validator(id))
  ), [successes, errors] = partition(results, (res) => res.success);
  if (successes.length > 0)
    return id;
  if (errors.length > 0)
    throw new AggregateError(
      errors.map((res) => res.error),
      `Invalid Document ID
 - ${errors.map((res) => res.error.message).join(`
 - `)}`
    );
  return id;
}), DraftId = tsBrand.make((id) => {
  validateAnyId(id), validateDraftId(id);
}), PublishedId = tsBrand.make((id) => {
  validateAnyId(id), validatePublishedId(id);
}), VersionId = tsBrand.make((id) => {
  validateAnyId(id), validateVersionId(id);
});
function validateAnyId(id) {
  if (id.length === 0)
    throw new Error("Must be a non-empty string");
  if (!VALID_ID.test(id))
    throw new Error(
      `Not a valid document ID: "${id}" \u2013 Must match the ${VALID_ID} RegExp`
    );
  return id;
}
function validateDraftId(id) {
  if (!id.startsWith(DRAFTS_PREFIX))
    throw new Error(
      `Not a valid draft ID: "${id}" \u2013 must start with "${DRAFTS_PREFIX}"`
    );
  if (id.length === DRAFTS_PREFIX.length)
    throw new Error(
      `Not a valid draft ID: "${id}" \u2013 must have at least one character followed by "${DRAFTS_PREFIX}"`
    );
  return id;
}
function validateVersionId(id) {
  if (!id.startsWith(VERSION_PREFIX))
    throw new Error(
      `Not a valid version ID: "${id}" \u2013 must start with "${VERSION_PREFIX}"`
    );
  if (id.length === VERSION_PREFIX.length)
    throw new Error(
      `Not a valid version ID: "${id}" \u2013 must have at least one character followed by "${VERSION_PREFIX}"`
    );
  const [, versionName, ...documentId] = id.split(".");
  if (!versionName || !VALID_ID.test(versionName))
    throw new Error(
      `Not a valid version ID: "${id}" \u2013 VERSION must match the ${VALID_ID} RegExp in versions.[VERSION].id`
    );
  if (documentId.length === 0)
    throw new Error(
      `Not a valid version ID: "${id}" \u2013 missing document ID in versions.bundle.[ID]`
    );
  if (versionName === "drafts" || versionName === "versions")
    throw new Error(
      `Not a valid version ID: "${id}" \u2013 invalid VERSION "${versionName}" in versions.[VERSION].id`
    );
  return id;
}
function validatePublishedId(id) {
  if (id.startsWith(DRAFTS_PREFIX) || id.startsWith(VERSION_PREFIX))
    throw new Error(
      `Not a valid published ID: "${id}" \u2013 cannot start with "${DRAFTS_PREFIX}" or "${VERSION_PREFIX}"`
    );
  return id;
}
function isPublishedIdEqual(id, otherId) {
  return getPublishedId(id) === getPublishedId(otherId);
}
function isDraftId(id) {
  return id.startsWith(DRAFTS_PREFIX);
}
function isPublishedId(id) {
  return !isDraftId(id) && !isVersionId(id);
}
function isVersionId(id) {
  return id.startsWith(VERSION_PREFIX);
}
function isDraftOf(id, candidate) {
  return isDraftId(candidate) && isPublishedIdEqual(id, candidate);
}
function isVersionOf(id, candidate) {
  return isVersionId(candidate) && isPublishedIdEqual(id, candidate);
}
function getPublishedId(id) {
  if (isDraftId(id))
    return PublishedId(id.slice(DRAFTS_PREFIX.length));
  if (isVersionId(id)) {
    const [, , ...publishedId] = id.split(PATH_SEPARATOR);
    return PublishedId(publishedId.join(PATH_SEPARATOR));
  }
  return id;
}
function getDraftId(id) {
  if (isVersionId(id)) {
    const [, , ...publishedId] = id.split(PATH_SEPARATOR);
    return DraftId(DRAFTS_PREFIX + publishedId.join(PATH_SEPARATOR));
  }
  return isPublishedId(id) ? DraftId(DRAFTS_PREFIX + id) : id;
}
function getVersionId(id, versionName) {
  return isVersionId(id) || isDraftId(id) ? getVersionId(getPublishedId(id), versionName) : VersionId(VERSION_PREFIX + versionName + PATH_SEPARATOR + id);
}
function getVersionNameFromId(id) {
  const [, versionId] = id.split(PATH_SEPARATOR);
  return versionId;
}
const UNSAFE_CHARS = /[^a-zA-Z0-9_-]+/g, LEADING = /^[_-]+/, TRAILING = /[_-]+$/, GENERATED_IDS_MAX_LENGTH = 96;
function createPublishedId(input) {
  return PublishedId(generateId(input));
}
function createDraftId(input) {
  return DraftId(DRAFTS_PREFIX + generateId(input));
}
function createVersionId(versionName, input) {
  return VersionId(
    VERSION_PREFIX + versionName + PATH_SEPARATOR + generateId(input)
  );
}
function generateId(input) {
  return input ? makeSafe(input) : uuid.uuid();
}
function makeSafe(input) {
  return deburr__default.default(input).replace(UNSAFE_CHARS, "").replace(TRAILING, "").replace(LEADING, "").slice(0, GENERATED_IDS_MAX_LENGTH);
}
exports.DocumentId = DocumentId;
exports.DraftId = DraftId;
exports.PublishedId = PublishedId;
exports.VersionId = VersionId;
exports.createDraftId = createDraftId;
exports.createPublishedId = createPublishedId;
exports.createVersionId = createVersionId;
exports.getDraftId = getDraftId;
exports.getPublishedId = getPublishedId;
exports.getVersionId = getVersionId;
exports.getVersionNameFromId = getVersionNameFromId;
exports.isDraftId = isDraftId;
exports.isDraftOf = isDraftOf;
exports.isPublishedId = isPublishedId;
exports.isPublishedIdEqual = isPublishedIdEqual;
exports.isVersionId = isVersionId;
exports.isVersionOf = isVersionOf;
//# sourceMappingURL=index.cjs.map
