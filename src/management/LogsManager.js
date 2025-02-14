var ArgumentError = require('rest-facade').ArgumentError;
var utils = require('../utils');
var Auth0RestClient = require('../Auth0RestClient');
var RetryRestClient = require('../RetryRestClient');

/**
 * @class LogsManager
 * Represents the relationship between Auth0 and an Identity provider.
 * @constructor
 * @memberOf module:management
 *
 * @param {Object} options            The client options.
 * @param {String} options.baseUrl    The URL of the API.
 * @param {Object} [options.headers]  Headers to be included in all requests.
 * @param {Object} [options.retry]    Retry Policy Config
 */
var LogsManager = function(options) {
  if (options === null || typeof options !== 'object') {
    throw new ArgumentError('Must provide client options');
  }

  if (options.baseUrl === null || options.baseUrl === undefined) {
    throw new ArgumentError('Must provide a base URL for the API');
  }

  if ('string' !== typeof options.baseUrl || options.baseUrl.length === 0) {
    throw new ArgumentError('The provided base URL is invalid');
  }

  /**
   * Options object for the Rest Client instance.
   *
   * @type {Object}
   */
  var clientOptions = {
    headers: options.headers,
    query: { repeatParams: false }
  };

  /**
   * Provides an abstraction layer for performing CRUD operations on
   * {@link https://auth0.com/docs/api/v2#!/LogsManagers Auth0
   *  Logs}.
   *
   * @type {external:RestClient}
   */
  var auth0RestClient = new Auth0RestClient(
    options.baseUrl + '/logs/:id ',
    clientOptions,
    options.tokenProvider
  );
  this.resource = new RetryRestClient(auth0RestClient, options.retry);
};

/**
 * Get all logs.
 *
 * @method    getAll
 * @memberOf  module:management.LogsManager.prototype
 *
 * @example <caption>
 *   This method takes an optional object as first argument that may be used to
 *   specify pagination settings and the search query. If pagination options are
 *   not present, the first page of a limited number of results will be returned.
 * </caption>
 *
 * // Pagination settings.
 * var params = {
 *   per_page: 10,
 *   page: 2
 * };
 *
 * management.logs.getAll(params, function (err, logs) {
 *   console.log(logs.length);
 * });
 *
 * @param   {Object}    [params]                Logs params.
 * @param   {String}    [params.q]              Search Criteria using Query String Syntax
 * @param   {Number}    [params.page]           Page number. Zero based
 * @param   {Number}    [params.per_page]       The amount of entries per page
 * @param   {String}    [params.sort]           The field to use for sorting.
 * @param   {String}    [params.fields]         A comma separated list of fields to include or exclude
 * @param   {Boolean}   [params.include_fields] true if the fields specified are to be included in the result, false otherwise.
 * @param   {Boolean}   [params.include_totals] true if a query summary must be included in the result, false otherwise. Default false
 * @param   {String}    [params.from]           For checkpoint pagination, log event Id from which to start selection from.
 * @param   {Number}    [params.take]           When using the `from` parameter, the number of entries to retrieve. Default 50, max 100.
 * @param   {Function}  [cb]                    Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(LogsManager, 'getAll', 'resource.getAll');

/**
 * Get an Auth0 log.
 *
 * @method    get
 * @memberOf  module:management.LogsManager.prototype
 *
 * @example
 * management.logs.get({ id: EVENT_ID }, function (err, log) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(log);
 * });
 *
 * @param   {Object}    params          Log parameters.
 * @param   {String}    params.id       Log ID.
 * @param   {Function}  [cb]            Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(LogsManager, 'get', 'resource.get');

module.exports = LogsManager;
