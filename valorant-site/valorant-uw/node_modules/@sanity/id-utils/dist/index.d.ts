import {Brand} from 'ts-brand'
import {Brander} from 'ts-brand'

/**
 * Create a new draft id
 *
 * @param input Optional input string to create the id from.
 * The input string will be converted to a string safe to use as a sanity document id, i.e.
 * - stripped for any special characters
 * - capped at max 100 chars
 * If no input is provided, a random uuid will be used instead
 */
export declare function createDraftId(input?: string): DraftId

/**
 * Create a new document id
 *
 * @param input Optional input string to create the id from.
 * The input string will be converted to a string safe to use as a sanity document id, i.e.
 * - stripped for any special characters
 * - capped at max 100 chars
 * If no input is provided, a random uuid will be used instead
 */
export declare function createPublishedId(input?: string): PublishedId

/**
 * Create a new version id
 *
 * @param versionName - The name of the version to create
 * @param input Optional input string to create the id from.
 * The input string will be converted to a string safe to use as a sanity document id, i.e.
 * - stripped for any special characters
 * - capped at max 100 chars
 * If no input is provided, a random uuid will be used instead
 */
export declare function createVersionId(
  versionName: string,
  input?: string,
): VersionId

/**
 * @public
 */
export declare type DocumentId = DraftId | PublishedId | VersionId

/**
 * @public
 */
export declare const DocumentId: Brander<DocumentId>

/**
 * @public
 */
export declare type DraftId = Brand<string, 'draftId'>

/**
 * @public
 */
export declare const DraftId: Brander<DraftId>

/**
 * Returns the draft ID of the provided document ID
 * @public
 * @param id - the DocumentId to return the draft ID for
 */
export declare function getDraftId(id: DocumentId): DraftId

/**
 * Returns the published ID of the provided document ID
 * @public
 * @param id - the DocumentId to return the published ID for
 */
export declare function getPublishedId(id: DocumentId): PublishedId

/**
 * Returns a version ID of the provided document ID
 * @public
 * @param id - the DocumentId to return the version ID for
 * @param versionName - the name of the version to return a version ID for
 */
export declare function getVersionId(
  id: DocumentId,
  versionName: string,
): VersionId

/**
 *  @public
 *  Extracts and returns the version name of a version id
 *  e.g. getVersionNameFromId(VersionId(`versions.xyz.foo`)) = `xyz`
 *  @param id - the version id to extract version name from
 */
export declare function getVersionNameFromId(id: VersionId): string

/**
 * Check whether a given document ID is a draft ID
 * @public
 * @param id - The document ID to check
 */
export declare function isDraftId(id: DocumentId): id is DraftId

/**
 * Check whether a particular document ID is the draft ID of another document ID
 * @public
 * @param id - The document ID to check if the candidate is a draft of
 * @param candidate - The candidate document ID to check
 * Note: returns true for identical draft ids, i.e. isDraftOf(DraftId('drafts.foo'), DraftId('drafts.foo')) will be true.
 */
export declare function isDraftOf(
  id: DocumentId,
  candidate: DocumentId,
): candidate is DraftId

/**
 * Check whether a given document ID is a published ID
 * @public
 * @param id - The document ID to check
 */
export declare function isPublishedId(id: DocumentId): id is PublishedId

/**
 *
 * Checks if two document ids resolves to the same published ID, ignoring any draft or version prefix.
 *
 * @public
 *
 * @param id - The document ID to check
 * @param otherId - The other document ID to check
 *
 * @example
 * Draft vs published document ID, but representing the same document:
 * ```
 * // Prints "true":
 * console.log(isPublishedIdEqual('drafts.foo', 'foo'));
 * ```
 * @example
 * Version vs published document ID, but representing the same document:
 * ```
 * // Prints "true":
 * console.log(isPublishedIdEqual('versions.xyz.foo', 'foo'));
 * ```
 * @example
 * Different documents:
 * ```
 * // Prints "false":
 * console.log(isPublishedIdEqual('foo', 'bar'));
 * ```
 *
 * @returns `true` if the document IDs represents the same document, `false` otherwise
 */
export declare function isPublishedIdEqual(
  id: DocumentId,
  otherId: DocumentId,
): boolean

/**
 * Check whether a given document ID is a version ID
 * @public
 * @param id - The document ID to check
 */
export declare function isVersionId(id: DocumentId): id is VersionId

/**
 * Check whether a particular document ID is a version ID of another document ID
 * @public
 * @param id - The document ID to check if the candidate is a draft of
 * @param candidate - The candidate document ID to check
 *
 * Note: returns true for identical versions, i.e. isVersionOf(VersionId('versions.xyz.foo'), VersionId('versions.xyz.foo')) will be true.
 */
export declare function isVersionOf(
  id: DocumentId,
  candidate: DocumentId,
): candidate is VersionId

/**
 * @public
 */
export declare type PublishedId = Brand<string, 'publishedId'>

/**
 * @public
 */
export declare const PublishedId: Brander<PublishedId>

/**
 * @public
 */
export declare type VersionId = Brand<string, 'versionId'>

/**
 * @public
 */
export declare const VersionId: Brander<VersionId>

export {}
