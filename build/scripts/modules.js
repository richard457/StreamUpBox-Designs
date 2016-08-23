/*
 angular-file-upload v2.2.0
 https://github.com/nervgh/angular-file-upload
*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["angular-file-upload"] = factory();
	else
		root["angular-file-upload"] = factory();
})(this, function() {
return  (function(modules) { // webpackBootstrap
 	// The module cache
 	var installedModules = {};

 	// The require function
 	function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId])
 			return installedModules[moduleId].exports;

 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			exports: {},
 			id: moduleId,
 			loaded: false
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		// Flag the module as loaded
 		module.loaded = true;

 		// Return the exports of the module
 		return module.exports;
 	}


 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;

 	// expose the module cache
 	__webpack_require__.c = installedModules;

 	// __webpack_public_path__
 	__webpack_require__.p = "";

 	// Load entry module and return exports
 	return __webpack_require__(0);
 })
/************************************************************************/
 ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var options = _interopRequire(__webpack_require__(2));

	var serviceFileUploader = _interopRequire(__webpack_require__(3));

	var serviceFileLikeObject = _interopRequire(__webpack_require__(4));

	var serviceFileItem = _interopRequire(__webpack_require__(5));

	var serviceFileDirective = _interopRequire(__webpack_require__(6));

	var serviceFileSelect = _interopRequire(__webpack_require__(7));

	var serviceFileDrop = _interopRequire(__webpack_require__(8));

	var serviceFileOver = _interopRequire(__webpack_require__(9));

	var directiveFileSelect = _interopRequire(__webpack_require__(10));

	var directiveFileDrop = _interopRequire(__webpack_require__(11));

	var directiveFileOver = _interopRequire(__webpack_require__(12));

	angular.module(CONFIG.name, []).value("fileUploaderOptions", options).factory("FileUploader", serviceFileUploader).factory("FileLikeObject", serviceFileLikeObject).factory("FileItem", serviceFileItem).factory("FileDirective", serviceFileDirective).factory("FileSelect", serviceFileSelect).factory("FileDrop", serviceFileDrop).factory("FileOver", serviceFileOver).directive("nvFileSelect", directiveFileSelect).directive("nvFileDrop", directiveFileDrop).directive("nvFileOver", directiveFileOver).run(["FileUploader", "FileLikeObject", "FileItem", "FileDirective", "FileSelect", "FileDrop", "FileOver", function (FileUploader, FileLikeObject, FileItem, FileDirective, FileSelect, FileDrop, FileOver) {
	    // only for compatibility
	    FileUploader.FileLikeObject = FileLikeObject;
	    FileUploader.FileItem = FileItem;
	    FileUploader.FileDirective = FileDirective;
	    FileUploader.FileSelect = FileSelect;
	    FileUploader.FileDrop = FileDrop;
	    FileUploader.FileOver = FileOver;
	}]);

/***/ },

/* 1 */
/***/ function(module, exports) {

	module.exports = {
		"name": "angularFileUpload"
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    url: "/",
	    alias: "file",
	    headers: {'authorization': 'Bearer 8EuqcMNkF2yP50Dicpv9hLRRp7WOSabPlCu22liY'},

	    queue: [],
	    progress: 0,
	    autoUpload: false,
	    removeAfterUpload: false,
	    method: "POST",
	    filters: [],
	    formData: [],
	    queueLimit: Number.MAX_VALUE,
	    withCredentials: false
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var copy = angular.copy;
	var extend = angular.extend;
	var forEach = angular.forEach;
	var isObject = angular.isObject;
	var isNumber = angular.isNumber;
	var isDefined = angular.isDefined;
	var isArray = angular.isArray;
	var element = angular.element;

	module.exports = function (fileUploaderOptions, $rootScope, $http, $window, FileLikeObject, FileItem) {
	    var File = $window.File;
	    var FormData = $window.FormData;

	    var FileUploader = (function () {
	        /**********************
	         * PUBLIC
	         **********************/
	        /**
	         * Creates an instance of FileUploader
	         * @param {Object} [options]
	         * @constructor
	         */

	        function FileUploader(options) {
	            _classCallCheck(this, FileUploader);

	            var settings = copy(fileUploaderOptions);

	            extend(this, settings, options, {
	                isUploading: false,
	                _nextIndex: 0,
	                _failFilterIndex: -1,
	                _directives: { select: [], drop: [], over: [] }
	            });

	            // add default filters
	            this.filters.unshift({ name: "queueLimit", fn: this._queueLimitFilter });
	            this.filters.unshift({ name: "folder", fn: this._folderFilter });
	        }

	        _createClass(FileUploader, {
	            addToQueue: {
	                /**
	                 * Adds items to the queue
	                 * @param {File|HTMLInputElement|Object|FileList|Array<Object>} files
	                 * @param {Object} [options]
	                 * @param {Array<Function>|String} filters
	                 */

	                value: function addToQueue(files, options, filters) {
	                    var _this = this;

	                    var list = this.isArrayLikeObject(files) ? files : [files];
	                    var arrayOfFilters = this._getFilters(filters);
	                    var count = this.queue.length;
	                    var addedFileItems = [];

	                    forEach(list, function (some /*{File|HTMLInputElement|Object}*/) {
	                        var temp = new FileLikeObject(some);

	                        if (_this._isValidFile(temp, arrayOfFilters, options)) {
	                            var fileItem = new FileItem(_this, some, options);

	                            addedFileItems.push(fileItem);
	                            _this.queue.push(fileItem);
	                            _this._onAfterAddingFile(fileItem);
	                        } else {
	                            var filter = arrayOfFilters[_this._failFilterIndex];
	                            _this._onWhenAddingFileFailed(temp, filter, options);
	                        }
	                    });

	                    if (this.queue.length !== count) {
	                        this._onAfterAddingAll(addedFileItems);
	                        this.progress = this._getTotalProgress();
	                    }

	                    this._render();
	                    if (this.autoUpload) this.uploadAll();
	                }
	            },
	            removeFromQueue: {
	                /**
	                 * Remove items from the queue. Remove last: index = -1
	                 * @param {FileItem|Number} value
	                 */

	                value: function removeFromQueue(value) {
	                    var index = this.getIndexOfItem(value);
	                    var item = this.queue[index];
	                    if (item.isUploading) item.cancel();
	                    this.queue.splice(index, 1);
	                    item._destroy();
	                    this.progress = this._getTotalProgress();
	                }
	            },
	            clearQueue: {
	                /**
	                 * Clears the queue
	                 */

	                value: function clearQueue() {
	                    while (this.queue.length) {
	                        this.queue[0].remove();
	                    }
	                    this.progress = 0;
	                }
	            },
	            uploadItem: {
	                /**
	                 * Uploads a item from the queue
	                 * @param {FileItem|Number} value
	                 */

	                value: function uploadItem(value) {
	                    var index = this.getIndexOfItem(value);
	                    var item = this.queue[index];
	                    var transport = this.isHTML5 ? "_xhrTransport" : "_iframeTransport";

	                    item._prepareToUploading();
	                    if (this.isUploading) {
	                        return;
	                    }this.isUploading = true;
	                    this[transport](item);
	                }
	            },
	            cancelItem: {
	                /**
	                 * Cancels uploading of item from the queue
	                 * @param {FileItem|Number} value
	                 */

	                value: function cancelItem(value) {
	                    var index = this.getIndexOfItem(value);
	                    var item = this.queue[index];
	                    var prop = this.isHTML5 ? "_xhr" : "_form";
	                    if (item && item.isUploading) item[prop].abort();
	                }
	            },
	            uploadAll: {
	                /**
	                 * Uploads all not uploaded items of queue
	                 */

	                value: function uploadAll() {
	                    var items = this.getNotUploadedItems().filter(function (item) {
	                        return !item.isUploading;
	                    });
	                    if (!items.length) {
	                        return;
	                    }forEach(items, function (item) {
	                        return item._prepareToUploading();
	                    });
	                    items[0].upload();
	                }
	            },
	            cancelAll: {
	                /**
	                 * Cancels all uploads
	                 */

	                value: function cancelAll() {
	                    var items = this.getNotUploadedItems();
	                    forEach(items, function (item) {
	                        return item.cancel();
	                    });
	                }
	            },
	            isFile: {
	                /**
	                 * Returns "true" if value an instance of File
	                 * @param {*} value
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function isFile(value) {
	                    return this.constructor.isFile(value);
	                }
	            },
	            isFileLikeObject: {
	                /**
	                 * Returns "true" if value an instance of FileLikeObject
	                 * @param {*} value
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function isFileLikeObject(value) {
	                    return this.constructor.isFileLikeObject(value);
	                }
	            },
	            isArrayLikeObject: {
	                /**
	                 * Returns "true" if value is array like object
	                 * @param {*} value
	                 * @returns {Boolean}
	                 */

	                value: function isArrayLikeObject(value) {
	                    return this.constructor.isArrayLikeObject(value);
	                }
	            },
	            getIndexOfItem: {
	                /**
	                 * Returns a index of item from the queue
	                 * @param {Item|Number} value
	                 * @returns {Number}
	                 */

	                value: function getIndexOfItem(value) {
	                    return isNumber(value) ? value : this.queue.indexOf(value);
	                }
	            },
	            getNotUploadedItems: {
	                /**
	                 * Returns not uploaded items
	                 * @returns {Array}
	                 */

	                value: function getNotUploadedItems() {
	                    return this.queue.filter(function (item) {
	                        return !item.isUploaded;
	                    });
	                }
	            },
	            getReadyItems: {
	                /**
	                 * Returns items ready for upload
	                 * @returns {Array}
	                 */

	                value: function getReadyItems() {
	                    return this.queue.filter(function (item) {
	                        return item.isReady && !item.isUploading;
	                    }).sort(function (item1, item2) {
	                        return item1.index - item2.index;
	                    });
	                }
	            },
	            destroy: {
	                /**
	                 * Destroys instance of FileUploader
	                 */

	                value: function destroy() {
	                    var _this = this;

	                    forEach(this._directives, function (key) {
	                        forEach(_this._directives[key], function (object) {
	                            object.destroy();
	                        });
	                    });
	                }
	            },
	            onAfterAddingAll: {
	                /**
	                 * Callback
	                 * @param {Array} fileItems
	                 */

	                value: function onAfterAddingAll(fileItems) {}
	            },
	            onAfterAddingFile: {
	                /**
	                 * Callback
	                 * @param {FileItem} fileItem
	                 */

	                value: function onAfterAddingFile(fileItem) {}
	            },
	            onWhenAddingFileFailed: {
	                /**
	                 * Callback
	                 * @param {File|Object} item
	                 * @param {Object} filter
	                 * @param {Object} options
	                 */

	                value: function onWhenAddingFileFailed(item, filter, options) {}
	            },
	            onBeforeUploadItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} fileItem
	                 */

	                value: function onBeforeUploadItem(fileItem) {}
	            },
	            onProgressItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} fileItem
	                 * @param {Number} progress
	                 */

	                value: function onProgressItem(fileItem, progress) {}
	            },
	            onProgressAll: {
	                /**
	                 * Callback
	                 * @param {Number} progress
	                 */

	                value: function onProgressAll(progress) {}
	            },
	            onSuccessItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onSuccessItem(item, response, status, headers) {}
	            },
	            onErrorItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onErrorItem(item, response, status, headers) {}
	            },
	            onCancelItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onCancelItem(item, response, status, headers) {}
	            },
	            onCompleteItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onCompleteItem(item, response, status, headers) {}
	            },
	            onCompleteAll: {
	                /**
	                 * Callback
	                 */

	                value: function onCompleteAll() {}
	            },
	            _getTotalProgress: {
	                /**********************
	                 * PRIVATE
	                 **********************/
	                /**
	                 * Returns the total progress
	                 * @param {Number} [value]
	                 * @returns {Number}
	                 * @private
	                 */

	                value: function _getTotalProgress(value) {
	                    if (this.removeAfterUpload) {
	                        return value || 0;
	                    }var notUploaded = this.getNotUploadedItems().length;
	                    var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
	                    var ratio = 100 / this.queue.length;
	                    var current = (value || 0) * ratio / 100;

	                    return Math.round(uploaded * ratio + current);
	                }
	            },
	            _getFilters: {
	                /**
	                 * Returns array of filters
	                 * @param {Array<Function>|String} filters
	                 * @returns {Array<Function>}
	                 * @private
	                 */

	                value: function _getFilters(filters) {
	                    if (!filters) {
	                        return this.filters;
	                    }if (isArray(filters)) {
	                        return filters;
	                    }var names = filters.match(/[^\s,]+/g);
	                    return this.filters.filter(function (filter) {
	                        return names.indexOf(filter.name) !== -1;
	                    });
	                }
	            },
	            _render: {
	                /**
	                 * Updates html
	                 * @private
	                 */

	                value: function _render() {
	                    if (!$rootScope.$$phase) $rootScope.$apply();
	                }
	            },
	            _folderFilter: {
	                /**
	                 * Returns "true" if item is a file (not folder)
	                 * @param {File|FileLikeObject} item
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function _folderFilter(item) {
	                    return !!(item.size || item.type);
	                }
	            },
	            _queueLimitFilter: {
	                /**
	                 * Returns "true" if the limit has not been reached
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function _queueLimitFilter() {
	                    return this.queue.length < this.queueLimit;
	                }
	            },
	            _isValidFile: {
	                /**
	                 * Returns "true" if file pass all filters
	                 * @param {File|Object} file
	                 * @param {Array<Function>} filters
	                 * @param {Object} options
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function _isValidFile(file, filters, options) {
	                    var _this = this;

	                    this._failFilterIndex = -1;
	                    return !filters.length ? true : filters.every(function (filter) {
	                        _this._failFilterIndex++;
	                        return filter.fn.call(_this, file, options);
	                    });
	                }
	            },
	            _isSuccessCode: {
	                /**
	                 * Checks whether upload successful
	                 * @param {Number} status
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function _isSuccessCode(status) {
	                    return status >= 200 && status < 300 || status === 304;
	                }
	            },
	            _transformResponse: {
	                /**
	                 * Transforms the server response
	                 * @param {*} response
	                 * @param {Object} headers
	                 * @returns {*}
	                 * @private
	                 */

	                value: function _transformResponse(response, headers) {
	                    var headersGetter = this._headersGetter(headers);
	                    forEach($http.defaults.transformResponse, function (transformFn) {
	                        response = transformFn(response, headersGetter);
	                    });
	                    return response;
	                }
	            },
	            _parseHeaders: {
	                /**
	                 * Parsed response headers
	                 * @param headers
	                 * @returns {Object}
	                 * @see https://github.com/angular/angular.js/blob/master/src/ng/http.js
	                 * @private
	                 */

	                value: function _parseHeaders(headers) {
	                    var parsed = {},
	                        key,
	                        val,
	                        i;

	                    if (!headers) {
	                        return parsed;
	                    }forEach(headers.split("\n"), function (line) {
	                        i = line.indexOf(":");
	                        key = line.slice(0, i).trim().toLowerCase();
	                        val = line.slice(i + 1).trim();

	                        if (key) {
	                            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
	                        }
	                    });

	                    return parsed;
	                }
	            },
	            _headersGetter: {
	                /**
	                 * Returns function that returns headers
	                 * @param {Object} parsedHeaders
	                 * @returns {Function}
	                 * @private
	                 */

	                value: function _headersGetter(parsedHeaders) {
	                    return function (name) {
	                        if (name) {
	                            return parsedHeaders[name.toLowerCase()] || null;
	                        }
	                        return parsedHeaders;
	                    };
	                }
	            },
	            _xhrTransport: {
	                /**
	                 * The XMLHttpRequest transport
	                 * @param {FileItem} item
	                 * @private
	                 */

	                value: function _xhrTransport(item) {
	                    var _this = this;

	                    var xhr = item._xhr = new XMLHttpRequest();
	                    var form = new FormData();

	                    this._onBeforeUploadItem(item);

	                    forEach(item.formData, function (obj) {
	                        forEach(obj, function (value, key) {
	                            form.append(key, value);
	                        });
	                    });

	                    if (typeof item._file.size != "number") {
	                        throw new TypeError("The file specified is no longer valid");
	                    }

	                    form.append(item.alias, item._file, item.file.name);

	                    xhr.upload.onprogress = function (event) {
	                        var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
	                        _this._onProgressItem(item, progress);
	                    };

	                    xhr.onload = function () {
	                        var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
	                        var response = _this._transformResponse(xhr.response, headers);
	                        var gist = _this._isSuccessCode(xhr.status) ? "Success" : "Error";
	                        var method = "_on" + gist + "Item";
	                        _this[method](item, response, xhr.status, headers);
	                        _this._onCompleteItem(item, response, xhr.status, headers);
	                    };

	                    xhr.onerror = function () {
	                        var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
	                        var response = _this._transformResponse(xhr.response, headers);
	                        _this._onErrorItem(item, response, xhr.status, headers);
	                        _this._onCompleteItem(item, response, xhr.status, headers);
	                    };

	                    xhr.onabort = function () {
	                        var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
	                        var response = _this._transformResponse(xhr.response, headers);
	                        _this._onCancelItem(item, response, xhr.status, headers);
	                        _this._onCompleteItem(item, response, xhr.status, headers);
	                    };

	                    xhr.open(item.method, item.url, true);

	                    xhr.withCredentials = item.withCredentials;

	                    forEach(item.headers, function (value, name) {
	                        xhr.setRequestHeader(name, value);
	                    });

	                    xhr.send(form);
	                    this._render();
	                }
	            },
	            _iframeTransport: {
	                /**
	                 * The IFrame transport
	                 * @param {FileItem} item
	                 * @private
	                 */

	                value: function _iframeTransport(item) {
	                    var _this = this;

	                    var form = element("<form style=\"display: none;\" />");
	                    var iframe = element("<iframe name=\"iframeTransport" + Date.now() + "\">");
	                    var input = item._input;

	                    if (item._form) item._form.replaceWith(input); // remove old form
	                    item._form = form; // save link to new form

	                    this._onBeforeUploadItem(item);

	                    input.prop("name", item.alias);

	                    forEach(item.formData, function (obj) {
	                        forEach(obj, function (value, key) {
	                            var element_ = element("<input type=\"hidden\" name=\"" + key + "\" />");
	                            element_.val(value);
	                            form.append(element_);
	                        });
	                    });

	                    form.prop({
	                        action: item.url,
	                        method: "POST",
	                        target: iframe.prop("name"),
	                        enctype: "multipart/form-data",
	                        encoding: "multipart/form-data" // old IE
	                    });

	                    iframe.bind("load", function () {
	                        var html = "";
	                        var status = 200;

	                        try {
	                            // Fix for legacy IE browsers that loads internal error page
	                            // when failed WS response received. In consequence iframe
	                            // content access denied error is thrown becouse trying to
	                            // access cross domain page. When such thing occurs notifying
	                            // with empty response object. See more info at:
	                            // http://stackoverflow.com/questions/151362/access-is-denied-error-on-accessing-iframe-document-object
	                            // Note that if non standard 4xx or 5xx error code returned
	                            // from WS then response content can be accessed without error
	                            // but 'XHR' status becomes 200. In order to avoid confusion
	                            // returning response via same 'success' event handler.

	                            // fixed angular.contents() for iframes
	                            html = iframe[0].contentDocument.body.innerHTML;
	                        } catch (e) {
	                            // in case we run into the access-is-denied error or we have another error on the server side
	                            // (intentional 500,40... errors), we at least say 'something went wrong' -> 500
	                            status = 500;
	                        }

	                        var xhr = { response: html, status: status, dummy: true };
	                        var headers = {};
	                        var response = _this._transformResponse(xhr.response, headers);

	                        _this._onSuccessItem(item, response, xhr.status, headers);
	                        _this._onCompleteItem(item, response, xhr.status, headers);
	                    });

	                    form.abort = function () {
	                        var xhr = { status: 0, dummy: true };
	                        var headers = {};
	                        var response;

	                        iframe.unbind("load").prop("src", "javascript:false;");
	                        form.replaceWith(input);

	                        _this._onCancelItem(item, response, xhr.status, headers);
	                        _this._onCompleteItem(item, response, xhr.status, headers);
	                    };

	                    input.after(form);
	                    form.append(input).append(iframe);

	                    form[0].submit();
	                    this._render();
	                }
	            },
	            _onWhenAddingFileFailed: {
	                /**
	                 * Inner callback
	                 * @param {File|Object} item
	                 * @param {Object} filter
	                 * @param {Object} options
	                 * @private
	                 */

	                value: function _onWhenAddingFileFailed(item, filter, options) {
	                    this.onWhenAddingFileFailed(item, filter, options);
	                }
	            },
	            _onAfterAddingFile: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 */

	                value: function _onAfterAddingFile(item) {
	                    this.onAfterAddingFile(item);
	                }
	            },
	            _onAfterAddingAll: {
	                /**
	                 * Inner callback
	                 * @param {Array<FileItem>} items
	                 */

	                value: function _onAfterAddingAll(items) {
	                    this.onAfterAddingAll(items);
	                }
	            },
	            _onBeforeUploadItem: {
	                /**
	                 *  Inner callback
	                 * @param {FileItem} item
	                 * @private
	                 */

	                value: function _onBeforeUploadItem(item) {
	                    item._onBeforeUpload();
	                    this.onBeforeUploadItem(item);
	                }
	            },
	            _onProgressItem: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 * @param {Number} progress
	                 * @private
	                 */

	                value: function _onProgressItem(item, progress) {
	                    var total = this._getTotalProgress(progress);
	                    this.progress = total;
	                    item._onProgress(progress);
	                    this.onProgressItem(item, progress);
	                    this.onProgressAll(total);
	                    this._render();
	                }
	            },
	            _onSuccessItem: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onSuccessItem(item, response, status, headers) {
	                    item._onSuccess(response, status, headers);
	                    this.onSuccessItem(item, response, status, headers);
	                }
	            },
	            _onErrorItem: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onErrorItem(item, response, status, headers) {
	                    item._onError(response, status, headers);
	                    this.onErrorItem(item, response, status, headers);
	                }
	            },
	            _onCancelItem: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onCancelItem(item, response, status, headers) {
	                    item._onCancel(response, status, headers);
	                    this.onCancelItem(item, response, status, headers);
	                }
	            },
	            _onCompleteItem: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onCompleteItem(item, response, status, headers) {
	                    item._onComplete(response, status, headers);
	                    this.onCompleteItem(item, response, status, headers);

	                    var nextItem = this.getReadyItems()[0];
	                    this.isUploading = false;

	                    if (isDefined(nextItem)) {
	                        nextItem.upload();
	                        return;
	                    }

	                    this.onCompleteAll();
	                    this.progress = this._getTotalProgress();
	                    this._render();
	                }
	            }
	        }, {
	            isFile: {
	                /**********************
	                 * STATIC
	                 **********************/
	                /**
	                 * Returns "true" if value an instance of File
	                 * @param {*} value
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function isFile(value) {
	                    return File && value instanceof File;
	                }
	            },
	            isFileLikeObject: {
	                /**
	                 * Returns "true" if value an instance of FileLikeObject
	                 * @param {*} value
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function isFileLikeObject(value) {
	                    return value instanceof FileLikeObject;
	                }
	            },
	            isArrayLikeObject: {
	                /**
	                 * Returns "true" if value is array like object
	                 * @param {*} value
	                 * @returns {Boolean}
	                 */

	                value: function isArrayLikeObject(value) {
	                    return isObject(value) && "length" in value;
	                }
	            },
	            inherit: {
	                /**
	                 * Inherits a target (Class_1) by a source (Class_2)
	                 * @param {Function} target
	                 * @param {Function} source
	                 */

	                value: function inherit(target, source) {
	                    target.prototype = Object.create(source.prototype);
	                    target.prototype.constructor = target;
	                    target.super_ = source;
	                }
	            }
	        });

	        return FileUploader;
	    })();

	    /**********************
	     * PUBLIC
	     **********************/
	    /**
	     * Checks a support the html5 uploader
	     * @returns {Boolean}
	     * @readonly
	     */
	    FileUploader.prototype.isHTML5 = !!(File && FormData);
	    /**********************
	     * STATIC
	     **********************/
	    /**
	     * @borrows FileUploader.prototype.isHTML5
	     */
	    FileUploader.isHTML5 = FileUploader.prototype.isHTML5;

	    return FileUploader;
	};

	module.exports.$inject = ["fileUploaderOptions", "$rootScope", "$http", "$window", "FileLikeObject", "FileItem"];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var copy = angular.copy;
	var isElement = angular.isElement;
	var isString = angular.isString;

	module.exports = function () {
	    var FileLikeObject = (function () {
	        /**
	         * Creates an instance of FileLikeObject
	         * @param {File|HTMLInputElement|Object} fileOrInput
	         * @constructor
	         */

	        function FileLikeObject(fileOrInput) {
	            _classCallCheck(this, FileLikeObject);

	            var isInput = isElement(fileOrInput);
	            var fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
	            var postfix = isString(fakePathOrObject) ? "FakePath" : "Object";
	            var method = "_createFrom" + postfix;
	            this[method](fakePathOrObject);
	        }

	        _createClass(FileLikeObject, {
	            _createFromFakePath: {
	                /**
	                 * Creates file like object from fake path string
	                 * @param {String} path
	                 * @private
	                 */

	                value: function _createFromFakePath(path) {
	                    this.lastModifiedDate = null;
	                    this.size = null;
	                    this.type = "like/" + path.slice(path.lastIndexOf(".") + 1).toLowerCase();
	                    this.name = path.slice(path.lastIndexOf("/") + path.lastIndexOf("\\") + 2);
	                }
	            },
	            _createFromObject: {
	                /**
	                 * Creates file like object from object
	                 * @param {File|FileLikeObject} object
	                 * @private
	                 */

	                value: function _createFromObject(object) {
	                    this.lastModifiedDate = copy(object.lastModifiedDate);
	                    this.size = object.size;
	                    this.type = object.type;
	                    this.name = object.name;
	                }
	            }
	        });

	        return FileLikeObject;
	    })();

	    return FileLikeObject;
	};

	module.exports.$inject = [];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var copy = angular.copy;
	var extend = angular.extend;
	var element = angular.element;
	var isElement = angular.isElement;

	module.exports = function ($compile, FileLikeObject) {
	    var FileItem = (function () {
	        /**
	         * Creates an instance of FileItem
	         * @param {FileUploader} uploader
	         * @param {File|HTMLInputElement|Object} some
	         * @param {Object} options
	         * @constructor
	         */

	        function FileItem(uploader, some, options) {
	            _classCallCheck(this, FileItem);

	            var isInput = isElement(some);
	            var input = isInput ? element(some) : null;
	            var file = !isInput ? some : null;

	            extend(this, {
	                url: uploader.url,
	                alias: uploader.alias,
	                headers: copy(uploader.headers),
	                formData: copy(uploader.formData),
	                removeAfterUpload: uploader.removeAfterUpload,
	                withCredentials: uploader.withCredentials,
	                method: uploader.method
	            }, options, {
	                uploader: uploader,
	                file: new FileLikeObject(some),
	                isReady: false,
	                isUploading: false,
	                isUploaded: false,
	                isSuccess: false,
	                isCancel: false,
	                isError: false,
	                progress: 0,
	                index: null,
	                _file: file,
	                _input: input
	            });

	            if (input) this._replaceNode(input);
	        }

	        _createClass(FileItem, {
	            upload: {
	                /**********************
	                 * PUBLIC
	                 **********************/
	                /**
	                 * Uploads a FileItem
	                 */

	                value: function upload() {
	                    try {
	                        this.uploader.uploadItem(this);
	                    } catch (e) {
	                        this.uploader._onCompleteItem(this, "", 0, []);
	                        this.uploader._onErrorItem(this, "", 0, []);
	                    }
	                }
	            },
	            cancel: {
	                /**
	                 * Cancels uploading of FileItem
	                 */

	                value: function cancel() {
	                    this.uploader.cancelItem(this);
	                }
	            },
	            remove: {
	                /**
	                 * Removes a FileItem
	                 */

	                value: function remove() {
	                    this.uploader.removeFromQueue(this);
	                }
	            },
	            onBeforeUpload: {
	                /**
	                 * Callback
	                 * @private
	                 */

	                value: function onBeforeUpload() {}
	            },
	            onProgress: {
	                /**
	                 * Callback
	                 * @param {Number} progress
	                 * @private
	                 */

	                value: function onProgress(progress) {}
	            },
	            onSuccess: {
	                /**
	                 * Callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onSuccess(response, status, headers) {}
	            },
	            onError: {
	                /**
	                 * Callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onError(response, status, headers) {}
	            },
	            onCancel: {
	                /**
	                 * Callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onCancel(response, status, headers) {}
	            },
	            onComplete: {
	                /**
	                 * Callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onComplete(response, status, headers) {}
	            },
	            _onBeforeUpload: {
	                /**********************
	                 * PRIVATE
	                 **********************/
	                /**
	                 * Inner callback
	                 */

	                value: function _onBeforeUpload() {
	                    this.isReady = true;
	                    this.isUploading = true;
	                    this.isUploaded = false;
	                    this.isSuccess = false;
	                    this.isCancel = false;
	                    this.isError = false;
	                    this.progress = 0;
	                    this.onBeforeUpload();
	                }
	            },
	            _onProgress: {
	                /**
	                 * Inner callback
	                 * @param {Number} progress
	                 * @private
	                 */

	                value: function _onProgress(progress) {
	                    this.progress = progress;
	                    this.onProgress(progress);
	                }
	            },
	            _onSuccess: {
	                /**
	                 * Inner callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onSuccess(response, status, headers) {
	                    this.isReady = false;
	                    this.isUploading = false;
	                    this.isUploaded = true;
	                    this.isSuccess = true;
	                    this.isCancel = false;
	                    this.isError = false;
	                    this.progress = 100;
	                    this.index = null;
	                    this.onSuccess(response, status, headers);
	                }
	            },
	            _onError: {
	                /**
	                 * Inner callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onError(response, status, headers) {
	                    this.isReady = false;
	                    this.isUploading = false;
	                    this.isUploaded = true;
	                    this.isSuccess = false;
	                    this.isCancel = false;
	                    this.isError = true;
	                    this.progress = 0;
	                    this.index = null;
	                    this.onError(response, status, headers);
	                }
	            },
	            _onCancel: {
	                /**
	                 * Inner callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onCancel(response, status, headers) {
	                    this.isReady = false;
	                    this.isUploading = false;
	                    this.isUploaded = false;
	                    this.isSuccess = false;
	                    this.isCancel = true;
	                    this.isError = false;
	                    this.progress = 0;
	                    this.index = null;
	                    this.onCancel(response, status, headers);
	                }
	            },
	            _onComplete: {
	                /**
	                 * Inner callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onComplete(response, status, headers) {
	                    this.onComplete(response, status, headers);
	                    if (this.removeAfterUpload) this.remove();
	                }
	            },
	            _destroy: {
	                /**
	                 * Destroys a FileItem
	                 */

	                value: function _destroy() {
	                    if (this._input) this._input.remove();
	                    if (this._form) this._form.remove();
	                    delete this._form;
	                    delete this._input;
	                }
	            },
	            _prepareToUploading: {
	                /**
	                 * Prepares to uploading
	                 * @private
	                 */

	                value: function _prepareToUploading() {
	                    this.index = this.index || ++this.uploader._nextIndex;
	                    this.isReady = true;
	                }
	            },
	            _replaceNode: {
	                /**
	                 * Replaces input element on his clone
	                 * @param {JQLite|jQuery} input
	                 * @private
	                 */

	                value: function _replaceNode(input) {
	                    var clone = $compile(input.clone())(input.scope());
	                    clone.prop("value", null); // FF fix
	                    input.css("display", "none");
	                    input.after(clone); // remove jquery dependency
	                }
	            }
	        });

	        return FileItem;
	    })();

	    return FileItem;
	};

	module.exports.$inject = ["$compile", "FileLikeObject"];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var extend = angular.extend;

	module.exports = function () {
	    var FileDirective = (function () {
	        /**
	         * Creates instance of {FileDirective} object
	         * @param {Object} options
	         * @param {Object} options.uploader
	         * @param {HTMLElement} options.element
	         * @param {Object} options.events
	         * @param {String} options.prop
	         * @constructor
	         */

	        function FileDirective(options) {
	            _classCallCheck(this, FileDirective);

	            extend(this, options);
	            this.uploader._directives[this.prop].push(this);
	            this._saveLinks();
	            this.bind();
	        }

	        _createClass(FileDirective, {
	            bind: {
	                /**
	                 * Binds events handles
	                 */

	                value: function bind() {
	                    for (var key in this.events) {
	                        var prop = this.events[key];
	                        this.element.bind(key, this[prop]);
	                    }
	                }
	            },
	            unbind: {
	                /**
	                 * Unbinds events handles
	                 */

	                value: function unbind() {
	                    for (var key in this.events) {
	                        this.element.unbind(key, this.events[key]);
	                    }
	                }
	            },
	            destroy: {
	                /**
	                 * Destroys directive
	                 */

	                value: function destroy() {
	                    var index = this.uploader._directives[this.prop].indexOf(this);
	                    this.uploader._directives[this.prop].splice(index, 1);
	                    this.unbind();
	                    // this.element = null;
	                }
	            },
	            _saveLinks: {
	                /**
	                 * Saves links to functions
	                 * @private
	                 */

	                value: function _saveLinks() {
	                    for (var key in this.events) {
	                        var prop = this.events[key];
	                        this[prop] = this[prop].bind(this);
	                    }
	                }
	            }
	        });

	        return FileDirective;
	    })();

	    /**
	     * Map of events
	     * @type {Object}
	     */
	    FileDirective.prototype.events = {};

	    return FileDirective;
	};

	module.exports.$inject = [];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var extend = angular.extend;

	module.exports = function (FileDirective) {
	    var FileSelect = (function (_FileDirective) {
	        /**
	         * Creates instance of {FileSelect} object
	         * @param {Object} options
	         * @constructor
	         */

	        function FileSelect(options) {
	            _classCallCheck(this, FileSelect);

	            var extendedOptions = extend(options, {
	                // Map of events
	                events: {
	                    $destroy: "destroy",
	                    change: "onChange"
	                },
	                // Name of property inside uploader._directive object
	                prop: "select"
	            });

	            _get(Object.getPrototypeOf(FileSelect.prototype), "constructor", this).call(this, extendedOptions);

	            if (!this.uploader.isHTML5) {
	                this.element.removeAttr("multiple");
	            }
	            this.element.prop("value", null); // FF fix
	        }

	        _inherits(FileSelect, _FileDirective);

	        _createClass(FileSelect, {
	            getOptions: {
	                /**
	                 * Returns options
	                 * @return {Object|undefined}
	                 */

	                value: function getOptions() {}
	            },
	            getFilters: {
	                /**
	                 * Returns filters
	                 * @return {Array<Function>|String|undefined}
	                 */

	                value: function getFilters() {}
	            },
	            isEmptyAfterSelection: {
	                /**
	                 * If returns "true" then HTMLInputElement will be cleared
	                 * @returns {Boolean}
	                 */

	                value: function isEmptyAfterSelection() {
	                    return !!this.element.attr("multiple");
	                }
	            },
	            onChange: {
	                /**
	                 * Event handler
	                 */

	                value: function onChange() {
	                    var files = this.uploader.isHTML5 ? this.element[0].files : this.element[0];
	                    var options = this.getOptions();
	                    var filters = this.getFilters();

	                    if (!this.uploader.isHTML5) this.destroy();
	                    this.uploader.addToQueue(files, options, filters);
	                    if (this.isEmptyAfterSelection()) {
	                        this.element.prop("value", null);
	                        this.element.replaceWith(this.element = this.element.clone(true)); // IE fix
	                    }
	                }
	            }
	        });

	        return FileSelect;
	    })(FileDirective);

	    return FileSelect;
	};

	module.exports.$inject = ["FileDirective"];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var extend = angular.extend;
	var forEach = angular.forEach;

	module.exports = function (FileDirective) {
	    var FileDrop = (function (_FileDirective) {
	        /**
	         * Creates instance of {FileDrop} object
	         * @param {Object} options
	         * @constructor
	         */

	        function FileDrop(options) {
	            _classCallCheck(this, FileDrop);

	            var extendedOptions = extend(options, {
	                // Map of events
	                events: {
	                    $destroy: "destroy",
	                    drop: "onDrop",
	                    dragover: "onDragOver",
	                    dragleave: "onDragLeave"
	                },
	                // Name of property inside uploader._directive object
	                prop: "drop"
	            });

	            _get(Object.getPrototypeOf(FileDrop.prototype), "constructor", this).call(this, extendedOptions);
	        }

	        _inherits(FileDrop, _FileDirective);

	        _createClass(FileDrop, {
	            getOptions: {
	                /**
	                 * Returns options
	                 * @return {Object|undefined}
	                 */

	                value: function getOptions() {}
	            },
	            getFilters: {
	                /**
	                 * Returns filters
	                 * @return {Array<Function>|String|undefined}
	                 */

	                value: function getFilters() {}
	            },
	            onDrop: {
	                /**
	                 * Event handler
	                 */

	                value: function onDrop(event) {
	                    var transfer = this._getTransfer(event);
	                    if (!transfer) {
	                        return;
	                    }var options = this.getOptions();
	                    var filters = this.getFilters();
	                    this._preventAndStop(event);
	                    forEach(this.uploader._directives.over, this._removeOverClass, this);
	                    this.uploader.addToQueue(transfer.files, options, filters);
	                }
	            },
	            onDragOver: {
	                /**
	                 * Event handler
	                 */

	                value: function onDragOver(event) {
	                    var transfer = this._getTransfer(event);
	                    if (!this._haveFiles(transfer.types)) {
	                        return;
	                    }transfer.dropEffect = "copy";
	                    this._preventAndStop(event);
	                    forEach(this.uploader._directives.over, this._addOverClass, this);
	                }
	            },
	            onDragLeave: {
	                /**
	                 * Event handler
	                 */

	                value: function onDragLeave(event) {
	                    if (event.currentTarget === this.element[0]) {
	                        return;
	                    }this._preventAndStop(event);
	                    forEach(this.uploader._directives.over, this._removeOverClass, this);
	                }
	            },
	            _getTransfer: {
	                /**
	                 * Helper
	                 */

	                value: function _getTransfer(event) {
	                    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
	                }
	            },
	            _preventAndStop: {
	                /**
	                 * Helper
	                 */

	                value: function _preventAndStop(event) {
	                    event.preventDefault();
	                    event.stopPropagation();
	                }
	            },
	            _haveFiles: {
	                /**
	                 * Returns "true" if types contains files
	                 * @param {Object} types
	                 */

	                value: function _haveFiles(types) {
	                    if (!types) {
	                        return false;
	                    }if (types.indexOf) {
	                        return types.indexOf("Files") !== -1;
	                    } else if (types.contains) {
	                        return types.contains("Files");
	                    } else {
	                        return false;
	                    }
	                }
	            },
	            _addOverClass: {
	                /**
	                 * Callback
	                 */

	                value: function _addOverClass(item) {
	                    item.addOverClass();
	                }
	            },
	            _removeOverClass: {
	                /**
	                 * Callback
	                 */

	                value: function _removeOverClass(item) {
	                    item.removeOverClass();
	                }
	            }
	        });

	        return FileDrop;
	    })(FileDirective);

	    return FileDrop;
	};

	module.exports.$inject = ["FileDirective"];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var extend = angular.extend;

	module.exports = function (FileDirective) {
	    var FileOver = (function (_FileDirective) {
	        /**
	         * Creates instance of {FileDrop} object
	         * @param {Object} options
	         * @constructor
	         */

	        function FileOver(options) {
	            _classCallCheck(this, FileOver);

	            var extendedOptions = extend(options, {
	                // Map of events
	                events: {
	                    $destroy: "destroy"
	                },
	                // Name of property inside uploader._directive object
	                prop: "over",
	                // Over class
	                overClass: "nv-file-over"
	            });

	            _get(Object.getPrototypeOf(FileOver.prototype), "constructor", this).call(this, extendedOptions);
	        }

	        _inherits(FileOver, _FileDirective);

	        _createClass(FileOver, {
	            addOverClass: {
	                /**
	                 * Adds over class
	                 */

	                value: function addOverClass() {
	                    this.element.addClass(this.getOverClass());
	                }
	            },
	            removeOverClass: {
	                /**
	                 * Removes over class
	                 */

	                value: function removeOverClass() {
	                    this.element.removeClass(this.getOverClass());
	                }
	            },
	            getOverClass: {
	                /**
	                 * Returns over class
	                 * @returns {String}
	                 */

	                value: function getOverClass() {
	                    return this.overClass;
	                }
	            }
	        });

	        return FileOver;
	    })(FileDirective);

	    return FileOver;
	};

	module.exports.$inject = ["FileDirective"];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var CONFIG = _interopRequire(__webpack_require__(1));

	module.exports = function ($parse, FileUploader, FileSelect) {

	    return {
	        link: function (scope, element, attributes) {
	            var uploader = scope.$eval(attributes.uploader);

	            if (!(uploader instanceof FileUploader)) {
	                throw new TypeError("\"Uploader\" must be an instance of FileUploader");
	            }

	            var object = new FileSelect({
	                uploader: uploader,
	                element: element
	            });

	            object.getOptions = $parse(attributes.options).bind(object, scope);
	            object.getFilters = function () {
	                return attributes.filters;
	            };
	        }
	    };
	};

	module.exports.$inject = ["$parse", "FileUploader", "FileSelect"];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var CONFIG = _interopRequire(__webpack_require__(1));

	module.exports = function ($parse, FileUploader, FileDrop) {

	    return {
	        link: function (scope, element, attributes) {
	            var uploader = scope.$eval(attributes.uploader);

	            if (!(uploader instanceof FileUploader)) {
	                throw new TypeError("\"Uploader\" must be an instance of FileUploader");
	            }

	            if (!uploader.isHTML5) return;

	            var object = new FileDrop({
	                uploader: uploader,
	                element: element
	            });

	            object.getOptions = $parse(attributes.options).bind(object, scope);
	            object.getFilters = function () {
	                return attributes.filters;
	            };
	        }
	    };
	};

	module.exports.$inject = ["$parse", "FileUploader", "FileDrop"];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var CONFIG = _interopRequire(__webpack_require__(1));

	module.exports = function (FileUploader, FileOver) {

	    return {
	        link: function (scope, element, attributes) {
	            var uploader = scope.$eval(attributes.uploader);

	            if (!(uploader instanceof FileUploader)) {
	                throw new TypeError("\"Uploader\" must be an instance of FileUploader");
	            }

	            var object = new FileOver({
	                uploader: uploader,
	                element: element
	            });

	            object.getOverClass = function () {
	                return attributes.overClass || object.overClass;
	            };
	        }
	    };
	};

	module.exports.$inject = ["FileUploader", "FileOver"];

/***/ }
 ])
});
;
//# sourceMappingURL=angular-file-upload.js.map

// --Author Muragijimana Richard <beastar457@gmail.com>
// var sync = angular.module("sync", ["ngRoute","angularFileUpload","ionic","ngResource","ui.bootstrap","infinite-scroll"]);
var Logger=angular.module("Logger",[]);
Logger.run(['$rootScope',function($rootScope){
      // $rootScope.endPoint='https://streamupbox.com';
      $rootScope.endPoint='http://localhost:8000';
}])
.constant('DEBUG',true);
Logger.directive('signup', [function () {
  return {
    restrict: 'AE',
    templateUrl:'App/scripts/views/signup.html'
  };
}])
.directive('login', [function () {
  return {
    restrict: 'AE',
    templateUrl:'App/scripts/views/login.html'
  };
}])
.directive('shortcut', [function () {
  return {
    restrict: 'AE',
    templateUrl:'App/scripts/views/shortcut.html'
  };
}]);

//remove dependecies
//,"infinite-scroll", ngfolderLists 'ng-mfb' ngContextMenu ngDialog
angular.module("sync", ["ngRoute","angularFileUpload","ui.bootstrap","ui.router",'ngMaterial', 'material.svgAssetsCache',"pascalprecht.translate","ui.select","ngSanitize"])
.constant('DEBUG',true)

.run(['$rootScope','$log','$location','folderLists','$stateParams','cacheFactory', function($rootScope,$log,$location,folderLists,$stateParams,cacheFactory){
  $rootScope.endPoint='http://localhost:8000';
  var cashed_folders =[],
   folder_ids     =[];
  $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
        // console.log("location"+ $rootScope.actualLocation);
        $rootScope.$on('handle',function(e,r) {
          // console.log('route with Id:' + r);
        });
    });        

   $rootScope.$watch(function () {return $location.path();}, function (newLocation, oldLocation) {
     
        if($rootScope.actualLocation !== newLocation){
            cashed_folders.push(newLocation);
            folder_ids.push($stateParams.folderId);
        }
        if(newLocation === "/Files"){
          cacheFactory.get('userData');
          cacheFactory.removeAll();
          localStorage.folderStructure ='';
          cashed_folders = [];
        }
       
        
        if($rootScope.actualLocation === newLocation) {
            var index = cashed_folders.indexOf(oldLocation);
                cashed_folders.pop(index);
             var indexerOfFolder = folder_ids.pop();
                 indexerOfFolder = folder_ids.pop();//go back twice to get current folder Id
            
            $rootScope.$emit('app:on:browser:back', indexerOfFolder);
            folderLists.addFolder(cashed_folders);
        }
        // folderLists.addFolder(cashed_folders);
        cacheFactory.put('folderStructure',cashed_folders);
        // if(localStorage.getItem('folderStructure') !==null || localStorage.getItem('folderStructure')  ){

        // }
        
        localStorage.setItem('folderStructure',JSON.stringify(cashed_folders));
        // if(JSON.parse(localStorage.getItem('folderStructure')).length ===0){
          
        // }
        console.log(JSON.parse(localStorage.getItem('folderStructure')));
    });
}])

.config(['$sceProvider','$httpProvider','$mdThemingProvider',function($sceProvider,$httpProvider,$mdThemingProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post.Accept = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post.Accept = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common.authorization = 'Bearer 8EuqcMNkF2yP50Dicpv9hLRRp7WOSabPlCu22liY';
    $httpProvider.defaults.useXDomain = true;
    $sceProvider.enabled(false);
    
}])
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider,$scope){
          
          $stateProvider
          .state('Home', {
            url: "/Files",
            templateUrl: '/App/scripts/views/files.html',
            controller: 'FilesController'
          })
          .state('preview', {
            url: '/!/:preview/:extension/:of/:user',
            templateUrl: '/App/scripts/views/filePreview.html',
            controller : 'previewController'
          })
          .state('folder', {
            url: '/{folderName:[a-zA-Z0-9/]*}',
            params:{folderId:null,VisibleName:null},
            templateUrl: '/App/scripts/views/files.html',
            controller: 'FolderController'
          }) 
          .state('Groups', {
             url: "/Groups",
             templateUrl: '/App/scripts/views/groups.html',
             controller: 'GroupController',
             requireLogin: true
          });
          $urlRouterProvider.otherwise('/Files');
}])
//application components
.directive('files', [function () {
  return {
    restrict: 'E',
    templateUrl: '/App/scripts/views/components/files.html',
    link: function (scope, el, attr) {
      //implements hover on files
      // el.hover(function() {
       
      //   $(".share").css({
      //     display: 'inline',
          
      //   }).addClass('btn btn-success');
      // }, function() {
        
      //   $(".share").hide('slow', function() {
          
      //   });
      // });
    }
  };
}])
.directive('folders', [function () {
  return {
    restrict: 'E',
    templateUrl: '/App/scripts/views/components/folders.html',
    link: function (scope, el, iAttrs) {
      // el.hover(function() {
      //   /* Stuff to do when the mouse enters the element */
      //   $(".share").css({
      //     display: 'inline',
          
      //   }).addClass('btn btn-success');
      // }, function() {
      //   $(".share").hide('slow', function() {
          
      //   });
      // });
    }
  };
}]);
//-----------------------done with Muragijimana Richard <beastar457@gmail.com>---------------//
//-----------------------deal with user's actions and interaction with other users---------------//

/* global $window */
/* global Logger */

Logger.controller('loginController',['$scope','$http','$rootScope','$window', function ($scope,$http,$rootScope,$window) {
    var options = {
        'crededential-not-found'       : 'Credentials not found!',
        'success'                      : 'logging in...'
    };
  $scope.login = function (info)
  {
    function notVerified(){
         $window.location.href = '/notVerified';
    }
    function redirecting(){
        $window.location.href = '/Home';
    }
    //before notify that we are loggingin
    $('.login-form-main-message').addClass('show success').html(options.success);
    $http.post($rootScope.endPoint + '/login',info)
    .success(function(response){
        
        if(response ==="1"){
            redirecting();

        }else if(response === "0"){
             $('.login-form-main-message').addClass('show error').html(options['crededential-not-found']);
        }else if(response === "notVerified"){
            notVerified();
        }
    })
    .error(function(error) {
        console.log('error:'+ error);
    });
    
  };
}]);

angular.module("Logger")
.controller('RegisterController', ['$scope','$rootScope','$http','DEBUG',function ($scope,$rootScope,$http,DEBUG) {
    var options = {
        'password-notMatch': 'password do not match',
        'SignUpInProgress' : 'Wait we are setting up your account.'
    };
    function messageRemove(){
            $('.register-form-main-message').removeClass('show error');
    }
    function redirecting(){
            window.location = '/checkEmail';
    }
    $scope.register=function(user){
      $('.register-form-main-message').addClass('show success').html(options.SignUpInProgress);
        if($('#password').val() !== $('#password-confirm').val()){
          $('.register-form-main-message').addClass('show error').html(options['password-notMatch']);
          setTimeout(messageRemove, 2000);
          
          return;
        }
        var username=$('#username').val();
        var email=$('#email').val();


        jQuery.post('/register', {username: username, password:user.password, email:email, option:user.option, phone:user.phone}, function(data, textStatus, xhr) {
            if(data.status === 200){
                 redirecting();
            }else if(data !==200){
                if(DEBUG === true)
                    console.log("can not sign up!what?");
                // console.log('we are fired this can not happen');
            }
        }).error(function(error) {
            if(DEBUG === true)
                console.log(error);
        });
        
    };
}]);
angular.module("Logger")
.directive('uniqueUsername', ['isUsernameAvailable',function(isUsernameAvailable) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.uniqueUsername = isUsernameAvailable;
        }
    };
}]);
angular.module("Logger")
.factory('isUsernameAvailable', ['$q','$http','$rootScope',function($q, $http,$rootScope) {
     function messageRemove(){
            $('.register-form-main-message').removeClass('show success');
     }
      function usernameTaken(){
            $('.register-form-main-message').removeClass('show error');
        }
    var options = {
        'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
        'btn-success': '<i class="fa fa-check"></i>',
        'btn-error': '<i class="fa fa-remove"></i>',
        'msg-success': 'All Good! redirecting...',
        'msg-username-available': 'good username available!',
        'msg-username-taken'    : 'oops username taken',
        'msg-email-taken'       : 'email taken',
        'msg-your-phone-suck'   : 'your phone is not valid',
        'useAJAX': true,
    };
    return function(username) {

        var deferred = $q.defer();

        $http.get($rootScope.endPoint + '/api/v1/users?username=' + username + '&access_token=8EuqcMNkF2yP50Dicpv9hLRRp7WOSabPlCu22liY').success(function(data){
            if(data  === 'available'){
                $('.register-form-main-message').addClass('show success').html(options['msg-username-available']);
                setTimeout(messageRemove, 2000);
               
            }else if(data === 'taken'){
                $('.register-form-main-message').addClass('show error').html(options['msg-username-taken']);
                setTimeout(usernameTaken, 2000);
               
            }
            deferred.reject();
        }).error(function(err) {
           deferred.resolve();
        });
        return deferred.promise;
    };
}]);
angular.module("Logger")
.directive('uniqueEmail', ['isEmailAvailable',function(isEmailAvailable) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.uniqueEmail = isEmailAvailable;
        }
    };
}]);
angular.module("Logger")
.factory('isEmailAvailable', ['$q','$http','$rootScope',function ($q, $http, $rootScope) {
    var options = {
        'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
        'btn-success': '<i class="fa fa-check"></i>',
        'btn-error': '<i class="fa fa-remove"></i>',
        'msg-success': 'All Good! redirecting...',
        'msg-username-available': 'good username available!',
        'msg-username-taken'    : 'oops username taken',
        'msg-email-taken'       : 'email taken',
        'msg-email-available'   : 'email available',
        'msg-your-phone-suck'   : 'your phone is not valid',
        'useAJAX': true,
    };
    function messageEmailTaken(){
        $('.register-form-main-message').removeClass('show error');
    }
     function messageRemove(){
                    $('.register-form-main-message').removeClass('show success');
                }
    return function(email) {
         var deferred = $q.defer();

        $http.get($rootScope.endPoint + '/api/v1/users?email=' + email + '&access_token=8EuqcMNkF2yP50Dicpv9hLRRp7WOSabPlCu22liY').success(function(data){

            if(data === 'email-available'){
                $('.register-form-main-message').addClass('show success').html(options['msg-email-available']);
                setTimeout(messageRemove, 2000);
               

            }else if(data === 'email-taken'){
                $('.register-form-main-message').addClass('show error').html(options['msg-email-taken']);
                setTimeout(messageEmailTaken, 2000);
                
            }
             deferred.reject();
         }).error(function() {
            deferred.resolve();
         });
         return deferred.promise;
    };
}]);

angular.module('sync').
service('Files', ['$http','$q','$rootScope',function Files ($http,$q,$rootScope) {
    this.getGroupFiles =function(groupId) {
        var differed = $q.defer();
        //down endpoint return all files I own
        $http.get($rootScope.endPoint +'/api/v1/groups/'+groupId+'/groupfiles')
        .success(function(response){
            differed.resolve(response);
        })
        .error(function(error) {
            differed.reject(error);
        });
        return differed.promise;
    };
    this.creazy = function(object){
        var differed = $q.defer();
        //down endpoint return all files I own
        $http.get($rootScope.endPoint +'/api/v1/?+query='+'query+FetchUsers'+object)
        .success(function(response){
            differed.resolve(response);
        })
        .error(function(error) {
            differed.reject(error);
        });
        return differed.promise;
    };
    this.single = function(file){
      var promise = $q.defer();
      $http.get($rootScope.endPoint+ '/preview/'+ file)
      .success(function(response){
        promise.resolve(response);
      })
      .error(function(err){
        promise.reject(err);
      });
      return promise.promise;
    };
    this.getBoxFiles = function(folderId){
        var groupId = 1;//by default this can be any number
        var differed = $q.defer();
        //the idea is to get a file either from groups or individual account group is optional
        // console.log(folderId);
        $http.get($rootScope.endPoint + '/api/v1/files/'+groupId+'/boxfiles/' +folderId)
        .success(function(response){
        //   $rootScope.$emit('file:list');
          differed.resolve(response);
        })
        .error(function(err){
          differed.reject(err);
        });
        return differed.promise;
    };
    this.getMimeType = function(file_name){
      var promise = $q.defer();
      $http.get($rootScope.endPoint + '/api/v1/files/mimeType/'+ file_name)
      .success(function(response){
          promise.resolve(response);
      })
      .error(function(err){
          promise.reject(err);
      });
      return promise.promise;
    };
    this.downloadFile = function(file_name){

      var promise = $q.defer();
      //hard coded a user StrimUp! need to inject him dyamically
      $http.get($rootScope.endPoint+ '/api/v1/files/download/'+file_name+'/of/'+ 'StrimUp')
      .success(function(response){
        promise.resolve(response);
      })
      .error(function(err){
        promise.reject(err);
      });
      return promise.promise;
    };
    return this;
}]);



angular.module('sync').service('Folder', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
	   this.createFolder = function(name) {
        var promiss = $q.defer();
        $http.post($rootScope.endPoint +'/api/v1/folders',name)
            .success(function(response) {
                $rootScope.$broadcast('folder:list');
                promiss.resolve(response);
            })
            .error(function(error) {
                promiss.reject(error);
            });

        return promiss.promise;
    };
    this.getFolders = function(Foldernames) {
 
        var promiss = $q.defer();
        $http.get($rootScope.endPoint +'/api/v1/folders/list/'+Foldernames)
            .success(function(response) {
                promiss.resolve(response);
            })
            .error(function(error) {
                promiss.reject(error);
            });
        return promiss.promise;
    };


     this.deleteFolders = function(folder_id) {

        var promiss = $q.defer();
        $http.get($rootScope.endPoint +'/api/v1/folders/delete/'+folder_id)
            .success(function(response) {
                $rootScope.$broadcast('folder:list');
                promiss.resolve(response);
            })
            .error(function(error) {
                promiss.reject(error);
            });
        return promiss.promise;
    };

  return this;

}]);


angular.module('sync').service('People', ['$q','$http','$rootScope',function ($q, $http, $rootScope) {
	this.get  = function (){
		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/suggestions')
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		});
		return differed.promise;
	};
	this.allIfollow = function () {
		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/me/followings')
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		});
		return differed.promise;
	};
	this.unFollow = function(id){
		var differed = $q.defer();
		$http.delete($rootScope.endPoint + '/api/v1/me/following/' +id)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		});
		return differed.promise;
	};
	this.follow = function(param){
		var differed = $q.defer();
		$http.put($rootScope.endPoint + '/api/v1/me/followings', param)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error){
			differed.reject(error);
		});
		return differed.promise;
	};
	return this;
}]);

angular.module('sync').service('SMS',['$http','$q','$rootScope',function($http,$q,$rootScope){
  this.send  = function(message){
    var differ = $q.defer();
    $http.post($rootScope.endPoint + '/api/v1/messages/send',message)
    .success(function(response){
      differ.resolve(response);
    },function(err){
      differ.reject(err);
    });
    return differ.promise;
  };
  return this;
}]);

angular.module('sync')
.service('Share',['$log','$http','$q','$rootScope', function ($log,$http,$q,$rootScope) {
	this.share = function(sharebleObj){
		var differed = $q.defer();
        $http.post($rootScope.endPoint + '/api/v1/share',sharebleObj)
        .success(function(response){
            differed.resolve(response);
        })
        .error(function(err){
            differed.reject(err);
        });
        return differed.promise;
	};
	this.getUser = function(user){

		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/me/users/'+ user)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		});
		return differed.promise;
	};
	this.fileMime = function(file){
		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/mimeType/'+ file)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		});
		return differed.promise;
	};
    return this;
}]);
angular.module('sync')
.service('folderLists', ['$rootScope',function($rootScope) {
  var folderLists = {};

//   folderLists.list = [];

  folderLists.add = function(folderList){
   
    $rootScope.$emit("folder:structure", folderList);
  };
   folderLists.addFolder = function(folderList){
   
    // console.log('waiting....');
    $rootScope.$emit("folder:structure", folderList);
  };
  return folderLists;
}]);
angular.module('sync')
.service('SubFolder', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) 
	{


	this.createSubFolder = function(name) {
        var promiss = $q.defer();
        $http.post($rootScope.endPoint +'/api/v1/subfolder',name)
            .success(function(response) {
                promiss.resolve(response);
            })
            .error(function(error) {
                promiss.reject(error);
            });
        return promiss.promise;
    };
    this.getSubFolders = function(id) {
        var promiss = $q.defer();
        $http.get($rootScope.endPoint +'/api/v1/subfolder/list/'+id)
            .success(function(response) 

            {
                promiss.resolve(response);
            })
            .error(function(error) {
                promiss.reject(error);
            });
        return promiss.promise;
    };
    

  return this;
}]);
angular.module('sync')
.service('Test',[function(){
    this.testingMethod = function() {
        return {name:'richard'};
    };
    return this;
}]);
angular.module('sync').service('User', ['$http','$q','$rootScope',function Files ($http,$q,$rootScope) {
	this.getUserId = function(){
		var promise = $q.defer();
		$http.get($rootScope.endPoint +"/api/v1/users/id")
		.success(function(res){
			promise.resolve(res);
		})
		.error(function() {
			promise.reject();
		});
		return promise.promise;
	};
	this.getUsername = function(){
		var promise = $q.defer();
		$http.get($rootScope.endPoint +"/api/v1/users/username")
		.success(function(res){
			promise.resolve(res);
		})
		.error(function() {
			promise.reject();
		});
		return promise.promise;
	};
	this.groups = function(user){
      var differed = $q.defer();
      $http.get($rootScope.endPoint + '/api/v1/me/groups')
      .success(function(response){
        differed.resolve(response);
      })
      .error(function(err){
        differed.reject(err);
      });
      return differed.promise;
    };

	return this;
}]);

/* global sync */
angular.module('sync')
.service('Notification', ['$http', '$q', '$rootScope', function Notification($http, $q, $rootScope) {
    this.getNotification = function (user_id) {
        var differed = $q.defer();
        $http.get($rootScope.endPoint + '/api/v1/notifications', {cache: false})
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    };
    this.createNotification = function (Notification) {
        var differed = $q.defer();
        $http.post($rootScope.endPoint + '/api/v1/notifications', Notification)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    };
    this.deleteNotification = function (notification) {
        var differed = $q.defer();
        $http.delete($rootScope.endPoint + '/api/v1/notifications/' + notification)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
            return differed.promise;
    };
    return this;
}]);

angular.module('sync')
.controller('notificationController', ['$scope','Notification','$log', function ($scope,Notification,$log) {
    $scope.init = function(){
        $scope.getNotification();
    };
    $scope.clearNotification = function(notification){


      Notification.clearNotification(notification)
      .then(function(response){
        //load remaining notification
        $scope.getNotification();
      },function(err){
        console.log(err);
      });
    };
    $scope.getNotification = function(){
        Notification.getNotification()
        .then(function(result){
            // $log.info(result);
            $scope.notifications = result;
            
        },function(error){
            // $log.info(error);
        });
    };
    $scope.init();
}]);
angular.module('sync')
.directive('notify',[function(){
  function notifyBrowser(title,desc,url)
      {
        if (!Notification) {
            console.log('Desktop notifications not available in your browser..');
        return;
        }
        if (Notification.permission !== "granted"){
          Notification.requestPermission();
        }
        else {
          var notification = new Notification(title, {
            icon:'https://lh3.googleusercontent.com/-aCFiK4baXX4/VjmGJojsQ_I/AAAAAAAANJg/h-sLVX1M5zA/s48-Ic42/eggsmall.png',
            body: desc,
        });
        // Remove the notification from Notification Center when clicked.
        notification.onclick = function () {
            window.open(url);
        };
        // Callback function when the notification is closed.
        notification.onclose = function () {
          console.log('Notification closed');
        };
        }
      }
  return{
    restrict:'AE',
    scope:{

    },
    link: function(scope, el, iAttrs){
      setTimeout(function(){
              var title='This will be title';
              var desc='Most popular article.';
              var url='sync.com:8000';
              notifyBrowser(title,desc,url);
          }, 2000);
          document.addEventListener('DOMContentLoaded', function (){
                if (Notification.permission !== "granted"){
                  Notification.requestPermission();
            }
      });

      
    }
  };
}]);

angular.module('sync')
.factory('userInteractionNotification', function () {
    return {
        success: function (message) {
            toastr.success(message, "Success");
        },
        warn: function (message) {
            toastr.warning(message, "Hey");
        },
        info: function (message) {
            toastr.info(message, "FYI");
        },
        error: function (message) {
            toastr.error(message, "Oh No");
        }
    };
});

angular.module('sync')
.factory('userInteractionNotification', function () {
    return {
        success: function (message) {
            toastr.success(message, "Success");
        },
        warn: function (message) {
            toastr.warning(message, "Hey");
        },
        info: function (message) {
            toastr.info(message, "FYI");
        },
        error: function (message) {
            toastr.error(message, "Oh No");
        }
    };
});

angular.module('sync')
.controller('dialogController', ['$scope','$uibModal','$mdDialog','$mdMedia','urlShortener','Share','User', function ($scope,$uibModal, $mdDialog, $mdMedia,urlShortener,Share,User) {
	/*** upload modal template
	 * @upload.tpl.html 
	 * @no param requires
	 * @cancel dialogController function that is shared among all function
	**/
	var DialogController = function ($scope, $mdDialog) {
	  $scope.hide = function() {
	    $mdDialog.hide();
	  };
	  $scope.cancel = function() {
	    $mdDialog.cancel();
	  };
	 
	};
	DialogController.$inject = ["$scope", "$mdDialog"];
	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

	/**
	 * end of shared function
	 */

	$scope.upload = function(ev) {
	  $mdDialog.show({
		  parent: angular.element(document.body),
	    controller: DialogController,
	    templateUrl: '/App/scripts/views/upload.tpl.html',
	    clickOutsideToClose:false
	  }).catch();
	};
	

/**end of function
 * 
*/

$scope.shareFolder = function(folder_id) {
	$mdDialog.show({
		  parent: angular.element(document.body),
	    controller: DialogController,
	    templateUrl: '/App/scripts/views/share.tpl.html',
	    clickOutsideToClose:false
	  }).catch();

	
};


}]);

;(function(window, angular, undefined) {

  'use strict';

  var mfb = angular.module('ng-mfb', []);

  mfb.run(['$templateCache', function($templateCache) {
    $templateCache.put('ng-mfb-menu-default.tpl.html',
      '<ul class="mfb-component--{{position}} mfb-{{effect}}"' +
      '    data-mfb-toggle="{{togglingMethod}}" data-mfb-state="{{menuState}}">' +
      '  <li class="mfb-component__wrap">' +
      '    <a ng-click="clicked()" ng-mouseenter="hovered()" ng-mouseleave="hovered()"' +
      '       ng-attr-data-mfb-label="{{label}}" class="mfb-component__button--main">' +
      '     <i class="mfb-component__main-icon--resting {{resting}}"></i>' +
      '     <i class="mfb-component__main-icon--active {{active}}"></i>' +
      '    </a>' +
      '    <ul class="mfb-component__list" ng-transclude>' +
      '    </ul>' +
      '</li>' +
      '</ul>'
    );

    $templateCache.put('ng-mfb-menu-md.tpl.html',
      '<ul class="mfb-component--{{position}} mfb-{{effect}}"' +
      '    data-mfb-toggle="{{togglingMethod}}" data-mfb-state="{{menuState}}">' +
      '  <li class="mfb-component__wrap">' +
      '    <a ng-click="clicked()" ng-mouseenter="hovered()" ng-mouseleave="hovered()"' +
      '       style="background: transparent; box-shadow: none;"' +
      '       ng-attr-data-mfb-label="{{label}}" class="mfb-component__button--main">' +
      '     <md-button class="md-fab md-accent" aria-label={{label}} style="position:relative; margin: 0; padding:0;">' +
      '       <md-icon style="left: 0; position: relative;" md-svg-icon="{{resting}}"' +
      '         class="mfb-component__main-icon--resting"></md-icon>' +
      '       <md-icon style="position:relative;" md-svg-icon="{{active}}"' +
      '         class="mfb-component__main-icon--active"></md-icon>' +
      '     </md-button>' +
      '    </a>' +
      '    <ul class="mfb-component__list" ng-transclude>' +
      '    </ul>' +
      '</li>' +
      '</ul>'
    );

    $templateCache.put('ng-mfb-button-default.tpl.html',
      '<li>' +
      '  <a data-mfb-label="{{label}}" class="mfb-component__button--child">' +
      '    <i class="mfb-component__child-icon {{icon}}">' +
      '    </i>' +
      '  </a>' +
      '</li>'
    );

    $templateCache.put('ng-mfb-button-md.tpl.html',
      '<li>' +
      '  <a href="" data-mfb-label="{{label}}" class="mfb-component__button--child" ' +
      '     style="background: transparent; box-shadow: none;">' +
      '     <md-button style="margin: 0;" class="md-fab md-accent" aria-label={{label}}>' +
      '       <md-icon md-svg-src="img/icons/android.svg"></md-icon>' +
      '       <md-icon md-svg-icon="{{icon}}"></md-icon>' +
      '     </md-button>' +
      '  </a>' +
      '</li>'
    );
  }]);

  mfb.directive('mfbButtonClose', function() {
    return {
      restrict: 'A',
      require: '^mfbMenu',
      link: function($scope, $element, $attrs, mfbMenuController) {
        $element.bind('click', function() {
          mfbMenuController.close();
        });
      },
    };

  });

  mfb.directive('mfbMenu', ['$timeout', function($timeout) {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      scope: {
        position: '@',
        effect: '@',
        label: '@',
        resting: '@restingIcon',
        active: '@activeIcon',
        mainAction: '&',
        menuState: '=?',
        togglingMethod: '@'
      },
      templateUrl: function(elem, attrs) {
        return attrs.templateUrl || 'ng-mfb-menu-default.tpl.html';
      },
      controller: ['$scope', '$attrs', function($scope, $attrs) {
        var openState = 'open',
          closedState = 'closed';

        // Attached toggle, open and close to the controller to give other
        // directive access
        this.toggle = toggle;
        this.close = close;
        this.open = open;

        $scope.clicked = clicked;
        $scope.hovered = hovered;

        /**
         * Set the state to user-defined value. Fallback to closed if no
         * value is passed from the outside.
         */
        if (!$scope.menuState) {
          $scope.menuState = closedState;
        }

        /**
         * If on touch device AND 'hover' method is selected:
         * wait for the digest to perform and then change hover to click.
         */
        if (_isTouchDevice() && _isHoverActive()) {
          $timeout(useClick);
        }

        $attrs.$observe('menuState', function() {
          $scope.currentState = $scope.menuState;
        });

        function clicked() {
          // If there is a main action, let's fire it
          if ($scope.mainAction) {
            $scope.mainAction();
          }

          if (!_isHoverActive()) {
            toggle();
          }
        }

        function hovered() {
          if (_isHoverActive()) {
            //toggle();
          }
        }

        /**
         * Invert the current state of the menu.
         */
        function toggle() {
          if ($scope.menuState === openState) {
            close();
          } else {
            open();
          }
        }

        function open() {
          $scope.menuState = openState;
        }

        function close() {
          $scope.menuState = closedState;
        }

        /**
         * Check if we're on a touch-enabled device.
         * Requires Modernizr to run, otherwise simply returns false
         */
        function _isTouchDevice() {
          return window.Modernizr && Modernizr.touch;
        }

        function _isHoverActive() {
          return $scope.togglingMethod === 'hover';
        }

        /**
         * Convert the toggling method to 'click'.
         * This is used when 'hover' is selected by the user
         * but a touch device is enabled.
         */
        function useClick() {
          $scope.$apply(function() {
            $scope.togglingMethod = 'click';
          });
        }
      }]
    };
  }]);

  mfb.directive('mfbButton', [function() {
    return {
      require: '^mfbMenu',
      restrict: 'EA',
      transclude: true,
      replace: true,
      scope: {
        icon: '@',
        label: '@'
      },
      templateUrl: function(elem, attrs) {
        return attrs.templateUrl || 'ng-mfb-button-default.tpl.html';
      }
    };
  }]);

})(window, angular);

angular.module('sync')
.directive('leftMenu',function(){
  return {
        restrict: 'AE',
        scope: {
            data: '=',
            user: '=',
            type: '='
        },
        templateUrl: "/App/scripts/directives/leftMenu.html"
    };
});
angular.module('sync')
.directive('feeds',function(){
  return {
        restrict: 'AE',
        scope: {
            posts: '=',
            replies: '=',
            createPost:'='
        },
        templateUrl: "/App/scripts/directives/middleContent.html"
    };
});
angular.module('sync')
.directive('header',function(){
  return {
        restrict: 'AE',
        scope: {
            data: '=',
            user: '=',
            type: '='
        },
        templateUrl: "/App/scripts/directives/header.html"
    };
});


angular.module('sync')
.directive('keybinding', function () {
    return {
        restrict: 'E',
        scope: {
            invoke: '&'
        },
        link: function (scope, el, attr) {
            Mousetrap.bind(attr.on, scope.invoke);
        }
    };
});

angular.module('sync')
.service('Post', ['$http', '$q', '$rootScope', function Post($http, $q, $rootScope) {
    this.getPost = function (user_id) {
        var differed = $q.defer();
        $http.get($rootScope.endPoint + '/api/v1/me/posts?user_id' + user_id, {cache: false})
            .success(function (response) {

                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    };
    this.participate = function(obj){
      var differed = $q.defer();
      $http.put($rootScope.endPoint + '/api/v1/me/posts/',obj)
      .success(function(response){
        differed.resolve(response);
      })
      .error(function(err){
        differed.reject(err);
      });
      return differed.promise;
    };
    this.createPost = function (post) {
        var differed = $q.defer();
        $http.post($rootScope.endPoint + '/api/v1/me/posts', post)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    };
    this.deletePost = function (id) {
        var differed = $q.defer();
        $http.delete($rootScope.endPoint + '/api/v1/me/posts/' + id)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    };
    return this;
}]);

angular.module('sync')
.controller('PostingController', [
  '$scope',
  'Post',
  '$timeout',
  'User',
  '$interval',
  'Notification',
  // '$ionicListDelegate',
  '$log',
  'userInteractionNotification',
  function (
  $scope,
  Post,
  $timeout,
  User,
  $interval,
  Notification,
  $ionicListDelegate,
  $log,
  userInteractionNotification
) {

    $scope.init = function () {
        $scope.postLoader();
        $scope.getUser();

    };

    $interval(function () {
        $scope.postLoader();
    }, 8000);
    $scope.getUser =function(){

      User._id()
      .then(function(response){

        $scope.user = response;
        console.log(response);
      },function(err){
        //quit slintly
      });
    };
    $scope.loadMore = function(){

    };
    $scope.participateIntoPost = function(post,user){
      // console.log(user);
      var obj ={
        'post_id':post,
        'user_id':user
      };
      Post.participate(obj)
      .then(function(response){
        $scope.postLoader();
      },function(err){
        //quit slently

      });
    };
    $scope.postLoader = function () {
        $scope.dataLoading = true;
        Post.getPost()
            .then(function (tree) {

                $scope.posts =tree;
                //navigate trough tree response which is require much attention
                $scope.friends=[];
                $scope.replies=[];
                for (var i = 0; i < tree.length; i++) {
                    if (tree[i].hasOwnProperty.friends && tree[i].replies  && tree[i].friends ) {
                      $scope.friends.push(tree[i].friends);
                      $scope.replies.push(tree[i].replies);
                    } else if (tree[i].hasOwnProperty('friends')) {
                        $scope.friends = friends.concat(traverse(tree[i].friends));
                        $scope.replies = replies.concat(traverse(tree[i].replies));
                    }
                }
            }, function (error) {
        });
    };
    $scope.imageDesc = function(index){
      //show images with different pixel
      switch (index) {
        case 0:
          return '60px';

          case 1:
            return "60px";

          case 2:
            return "60px";

          case 3:
            return "60px";

          case 4:
            return "60px";

        default:
        return "60px";

      }
      console.log(index);
    };
    $scope.share = function(id){
        $ionicListDelegate.closeOptionButtons();
        $log.info(id);
    };
    $scope.createPost = function (posting) {
      //if image is uploaded uploaded
        var _this = { message: posting };
        Post.createPost(_this)
            .then(function (postCreated) {
                  $scope.message = '';
                  $scope.posts.push(postCreated);
                  userInteractionNotification.success("New Post feed created!");
            }, function (error) {

            });
    };

    $scope.init();
}]);
angular.module('sync')
.directive('feedsUploader',[function(){
  return {
    restrict: 'AE',
    replace: false,
    templateUrl: 'App/js/scripts/views/feedAttachment.html',
    scope: {
      action: '@'
    },
    controller: ['$scope', function ($scope) {
      $scope.progress = 0;
      $scope.avatar = '';
      $scope.sendFile = function(el) {
        var $form = $(el).parents('form');
        if ($(el).val() === '') {
          return false;
        }
        $form.attr('action', $scope.action);
        $scope.$apply(function() {
          $scope.progress = 0;
        });
        $form.ajaxSubmit({
          type: 'POST',
        	beforeSend: function (xhr) {
        		xhr.setRequestHeader('authorization', 'Bearer OqFirQS44RQTjRuWniXjdHZJQXdCuEx49rq8JY5A');
        	},
          uploadProgress: function(evt, pos, tot, percComplete) {
            $scope.$apply(function() {
              // upload the progress bar during the upload
              // $scope.progress = percentComplete;
            });
          },
          error: function(evt, statusText, response, form) {
            // remove the action attribute from the form
            $form.removeAttr('action');
          },
          success: function(response, status, xhr, form) {
            var ar = $(el).val().split('\\'),
              filename =  ar[ar.length-1];
            // remove the action attribute from the form
            $form.removeAttr('action');
            $scope.$apply(function() {
              $scope.avatar = filename;
            });
          },
        });
      };
    }],
    link: function(scope, elem, attrs, ctrl) {

      elem.find('.fake-uploader').click(function() {
        elem.find('input[type="file"]').click();
      });

    }
  };
}]);

angular.module('sync').controller('FilesController',['$scope','Files','$log','$window','User','$uibModal','$timeout','$stateParams','$rootScope','$exceptionHandler','$cacheFactory','cacheFactory','DEBUG', function ($scope, Files,$log,$window,User,$uibModal,$timeout,$stateParams,$rootScope,$exceptionHandler,$cacheFactory,cacheFactory,DEBUG) {
    $scope.files =[];
    var cache = cacheFactory.get('userData'),
        _loadFiles = function(folderId){
            $scope.dataLoading = true;
            Files.getBoxFiles(folderId)
                .then(function(res){
                    $scope.files 	=	res;
                }, function(error){
                    
                })
            .finally(function () {
                
                $scope.dataLoading = false;
            });
    }; 
    $rootScope.$on('app:on:browser:back',function(e,id){

    });
    $rootScope.$on('folder:id',function(r,folderId){ 
        
        if(typeof(folderId) === 'number'){
            _loadFiles($stateParams.folderId); 
        }
        
    });
    
    $rootScope.$on('file:list',function(){ 
       _loadFiles($stateParams.folderId); 
    });
    
    $scope.fileType  = function(type) {
        var cases = {
            'pdf': 'img/pdf.png',
            'png': 'img/universal_folder.png',
            'JPG': 'img/code.png',
            'docx': 'img/word.png',
        };
        if (cases[type]) {
           return cases[type];
        }
  };
$scope.init = function(){ 
        _loadFiles($stateParams.folderId);
};

$scope.init();

}]);




angular.module("sync")
.controller('FolderController',['$scope','Folder','User','DEBUG','$stateParams','$rootScope','folderLists','cacheFactory','Files', function($scope,Folder,User,DEBUG,$stateParams,$rootScope,folderLists,cacheFactory,Files){
     $scope.folders =[];
     $scope.type  = function(type) {
        var cases = {
            'folder': 'img/universal_folder.png'
        };
        if (cases[type]) {
           return cases[type];
        }
    };

    var getuser = function(){
        User.getUserId()
        .then(function(response){
            $scope.user_id=response;
        }).catch();
    };
    
    $scope.structure ='';
    var getFolders = function(){

        Folder.getFolders($stateParams.folderId)
        .then(function(folders){
            
            $scope.folders = folders;
            
        },function(err){
            if(DEBUG === true)
                console.log(err);
        });
    };
    $scope.$on('folder:list', function(event, args) {
        getFolders();
    });

    $rootScope.$on('folder:structure',function(r,structure){

         $scope.structure  = structure;

    });

    $scope.showFilesIn = function(folder_id){
        $rootScope.$emit('folder:id',folder_id);
    };
    $scope.deleteFolder = function (folder_id){

    Folder.deleteFolders(folder_id)

            .then(function(response){
                if(response.Deletefolder === false){
                    notie.alert(3, 'Not Deleted!', 2);
                }
                else{
                    notie.alert(4, 'Folder Deleted.', 2);
                }
            },function(err){

                if(DEBUG === true)
                    console.log(err);
            });
    };

    $scope.create = function(folder){
        
        var paths = JSON.parse(localStorage.getItem('folderStructure')),
            combinedPath_structure = paths.join(''),
            params,
            creatingFolder = function name(params) {
                 Folder.createFolder(params)
                .then(function(response){
                    
                    if(response.folderCreated === false){
                        notie.alert(3, 'Folder  exist!', 2);
                    }
                    else{
                        
                        notie.alert(4, 'New Folder created.', 2);
                    }

                },function(err){

                    if(DEBUG === true)
                        console.log(err);
                });
            };
            
            console.log(combinedPath_structure);

            // return;
            
            if(!combinedPath_structure){
                // console.log(localStorage.folderStructure);
                params = {
                    "parent_folder" :    $stateParams.folderId,
                    "nested_name"   :    folder,
                    "hierachy"      :    localStorage.folderStructure
                }
                console.log('!path:' + localStorage.folderStructure);
                creatingFolder(params);
            }else{
                
                localStorage.folderStructure = combinedPath_structure;
                params = {
                    "parent_folder" :    $stateParams.folderId,
                    "nested_name"   :    folder,
                    "hierachy"      :    combinedPath_structure
                }
                // console.log(localStorage.folderStructure);
                creatingFolder(params);
            }
           
  };
  var init = function(){
        getuser();
        getFolders();
    };
  init();
}])
.factory("cacheFactory", ["$cacheFactory", function($cacheFactory)
{
    //be cautious with this!
    return $cacheFactory("userData");
}]);

angular.module('sync')
.controller('previewController',
 [
	'$scope','pdfDelegate','$timeout','$stateParams','$rootScope','$exceptionHandler','Files', 'FileSaver','Blob',function (
		$scope,pdfDelegate,$timeout,$stateParams,$rootScope,$exceptionHandler,Files,FileSaver, Blob) {

      if($stateParams.preview && $stateParams.extension === 'pdf'){
        $scope.previewable = true;
        try {
            //a user StrimUp is injected in bellow url it should be dynamic in future!
            $scope.pdfUrl = $rootScope.endPoint+ '/preview/'+ $stateParams.preview+'/of/'+$stateParams.user;
            $timeout(function() {
                pdfDelegate.$getByHandle('my-pdf-container').zoomIn(0.5);
            }, 3000);
        } catch (e) {

           throw( new Error(e));
        }
      }else if($stateParams.preview && $stateParams.extension === 'jpg'||$stateParams.extension === 'png'){
        $scope.file_name = $stateParams.preview;
        $scope.previewable = false;
        //as by now images are not ready to be previewed so set it to false!provide only option to download them!
          // $scope.previewable = false;
          // Files.single($stateParams.preview)
          // .then(function(response){
          //   $scope.imagePreview = response;
          // },function(err){
          //   console.log(err);
          // });
      }else {
        //send a filename to a download button
        $scope.file_name = $stateParams.preview;
        $scope.previewable = false;
      }

      $scope.goNext = function() {
          $scope.increment = 1;
          pdfDelegate.$getByHandle('my-pdf-container').next($scope.increment+1);
      };
      $scope.donwload="Download";
      $scope.goPrev = function(page){
          pdfDelegate.$getByHandle('my-pdf-container').prev($scope.increment-1);
      };
}]);

angular.module('sync')
.directive('fileDownload', ['User',function (User) {
        return {
            restrict: 'A',
            replace: true,
             scope: { obj: '=',name:'=' },
            template: '<span  data-ng-click="download(obj)">{{name}}</span>',
            controller: ['$rootScope', '$scope', '$element', '$attrs', '$timeout', function ($rootScope, $scope, $element, $attrs, $timeout) {
                function fakeProgress() {
                    $timeout(function () {
                        if ($scope.progress < 95) {
                            $scope.progress += (96 - $scope.progress) / 2;
                            // $rootScope.$broadcast('dialogs.wait.progress', { 'progress': $scope.progress });
                            fakeProgress();
                        }
                    }, 250);
                }
                
                $scope.progress = 0;
                function prepare(url) {
                    // dialogs.wait("Please wait", "Your download starts in a few seconds.", $scope.progress);
                    fakeProgress();
                }
                function success(url) {
                    $rootScope.$broadcast('dialogs.wait.complete');
                }
                function error(response, url) {
                    // dialogs.error("Couldn't process your download!");
                }
                
                User.getUsername()
                .then(function(user){
                  $scope.user = user;
                }).catch();
                $scope.download = function (file) {
                    $.fileDownload($rootScope.endPoint+'/downloads/file/'+file+'/of/'+$scope.user, { prepareCallback: prepare, successCallback: success, failCallback: error });
                };
            }]
        };
}]);

/* global sync */

angular.module('sync')
.controller('PeopleController', ['$scope','People',function ($scope, People) {
		$scope.init = function(){
			$scope.getPeopleToFollow();
		};
		$scope.getPeopleToFollow  = function(){
			People.get()
			.then(function(response){
				
				$scope.people = response;
			}, function(error){

			});
		};
		$scope.$on('followMember',function(event,params){
			event.preventDefault();
			People.follow(params)
			.then(function(response){
				//console.log(response);
				$scope.getPeopleToFollow();
			},function(error){
				console.log(error);
			});
		});
		$scope.follow = function(id){
			var follow ={id: id, option:'addPeople'};
			$scope.$emit("followMember", follow);
		};
		$scope.init();
}]);

/* global Files */
/* global sync */
/* global $scope */
/* global angular */
/*Author Muragijimana Founder & CEO of sync call him on StrimUp@gmail.com*/

angular.module('sync')
.service('Group', [
	'$http',
	'$rootScope',
	'$q',function Group (
		$http,
		$rootScope,
		$q) {
	this.create 		=	function(name){
		var differed 	=	$q.defer();
		$http.post($rootScope.endPoint + '/api/v1/me/groups', name)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		});
		return differed.promise;
	};
	this.delete 		=	function(id){
		var differed 	=	$q.defer();
		$http.delete($rootScope.endPoint + '/api/v1/me/groups/'+id)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		});
		return differed.promise;
	};
	this.myGroups		=	function(){
		var differed 	=	$q.defer();

		$http.get($rootScope.endPoint + '/api/v1/me/groups')
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			console.log('differed slow:' + error);
			differed.reject(error);
		});
		return differed.promise;
	};

	this.addPeople 	=	function(member){
		var differed 	=	$q.defer();
		$http.put($rootScope.endPoint + '/api/v1/me/groups/'+JSON.stringify(member))
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.resolve(error);
		});
		return differed.promise;
	};
	this.addFileToGroup = function(fileObj){
		var differed = $q.defer();
		$http.put($rootScope.endPoint + '/api/v1/me/groups/'+ JSON.stringify(fileObj))
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		});
		return differed.promise;
	};
	this.removePeople 	=	function(member){
		var differed 	=	$q.defer();
		$http.put($rootScope.endPoint +'/api/v1/me/groups/'+JSON.stringify(member))
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		});
		return differed.promise;
	};
  this.suggestPeople = function(id){

    	var differed = $q.defer();
    	$http.get($rootScope.endPoint + '/api/v1/me/groups/' + id)
    	.success(function(res){
    		differed.resolve(res);
    	})
    	.error(function(err) {
    		differed.reject(err);
    	});
    	return differed.promise;
    };
	return this;
}]);

angular.module('sync')
.controller('GroupController', [
	'$scope',
	'Group',
	'User',
	'Files',
	'userInteractionNotification',
	function GroupController (
		$scope,
		Group,
		User,
		Files,
		userInteractionNotification
	) {
	$scope.init 	=	function(){
		$scope.myGroups();

		$scope.suggestedPeopleToGroup();//ofcause they are arleady your friend but not participant in your stuff work!
	};
	$scope.userId 				=	function(){
		User._id()
		.then(function(response){
			$scope.userId 	=	response;
		}, function(error){
			console.log(error);
		});
	};
	$scope.myGroups 			=	function(){
		Group.myGroups()
		.then(function(response){
			$scope.group 	= response;
		}, function(error){
		});
	};
	$scope.suggestedPeopleToGroup 	=	function(id){
		//clearing all view rendered before
		$scope.showFiles=false;
		$scope.showGroup=false;
		$scope.showBox=false;
		if(!angular.isUndefined(id)){
			Group.suggestPeople(id).then(function(response){
				// console.log(response);
				$scope.followers = response;
			}, function(error){
				console.log(error);
			});
		}
	};
	$scope.$on('refreshGroup',function(){
       $scope.init();
  	});
	$scope.$on('groupDeleted', function (event, args) {
		event.preventDefault();
		$scope.myGroups();
	});
	$scope.$on('groupTobindwith', function (event, groupid) {
		event.preventDefault();
        $scope.emitted =groupid;
        if( $scope.showFiles === true){
            $scope.showFiles=false;
        }
        $scope.suggestedPeopleToGroup(groupid);
        $scope.addPeople=true;
	});
	$scope.getGroupFiles = function(owner){
    Files.getGroupFiles(owner)
		.then(function(tree){
			$scope.files = tree;
				//navigate trough tree response which is require much attention
				$scope.groups=[];
				for (var i = 0; i < tree.length; i++) {
						if (tree[i].hasOwnProperty.groups && tree[i].groups) {
								$scope.groups.push(tree[i].friends);
						} else if (tree[i].hasOwnProperty('groups')) {
							return;
								//FIXME groups is not defined here
								// $scope.groups = groups.concat(traverse(tree[i].groups));
						}
				}
		}, function(error){
			console.log(error);
		});
  };
	$scope.getBoxFiles = function(groupId){
		$scope.emitted =groupId;
  	Files.getBoxFiles(groupId)
		.then(function(tree){
			$scope.files = tree;
				//navigate trough tree response which is require much attention
				$scope.groups=[];
				var groups;
				for (var i = 0; i < tree.length; i++) {
						if (tree[i].hasOwnProperty.groups && tree[i].groups) {
								$scope.groups.push(tree[i].friends);
						} else if (tree[i].hasOwnProperty('groups')) {
				            $scope.groups = groups.concat(traverse(tree[i].groups));
						}
				}
		}, function(error){
			console.log(error);
		});
  };
$scope.$on('showOptions',function(_,params){
     if(params.owner ==="box"){
			 $scope.addPeople=false;
			 $scope.showGroup=false;
       $scope.showBox=true;
       if( $scope.addPeople === true){
           $scope.addPeople=false;
       }
			 //set files scope to show files of box files is repeated in view directive
       $scope.getBoxFiles (params.group_id);
		 }else if (params.owner === "group") {
			 $scope.showBox=false;
			 $scope.addPeople=false;
			 $scope.showGroup=true;
			 if( $scope.addPeople === true){
					 $scope.addPeople=false;
			 }
			 //change files to new scope files to show files of groups  is repeated in view directive
			 $scope.getGroupFiles (params.group_id);
		 }
});
$scope.init();
}]);
angular.module('sync')
.directive('myGroups', [
	'Group',
	'Report',
	'userInteractionNotification',
	function myGroups (
		Group,
		Report,
		userInteractionNotification,
		Notification) {
	return {
		priority: 10,
		templateUrl: 'App/scripts/js/directives/groups.html',
		restrict: 'E',
		scope: {
			  id: '=userId',
          groups: '=',
          followers: '=',
          emitted:'=',
          showPeople:'=',
          showGroup   :  '=',
          files   :  '=',
	  			showBox:  '='
		},
		link: function (scope, iElement, iAttrs) {
			scope.deleteGroup = function(id){
				Group.delete(id)
				.then(function(res){
						userInteractionNotification.info("Group deleted");
					 	scope.$emit("groupDeleted", 'group deleted');
				}, function(err){
					Report.send('delete group error:'+err)
					.then(function(){}, function(){});
				});
			};
      scope.createGroup	=	function(name){
          Group.create(name)
                  .then(function(response){
											userInteractionNotification.success("Created new Group");
                      scope.$emit('refreshGroup',null);
                  }, function(error){
                      console.log(error);
                  });
              };
			scope.initAddPeople = function(groupid){
				scope.$emit("groupTobindwith", groupid);
			};

			scope.addPeople = function(params){
				var newParams ={
					'option':'addMember',
					'userId':params.userId,
					'groupId':params.groupId
				};
				if(angular.isUndefined(params)){
					return;
					//won't happen!or if ti happen we quit
				}else{

					Group.addPeople(newParams)
					.then(function (response){
						//refresh group with new member status
							userInteractionNotification.success("Added Member in group.");
              scope.initAddPeople(params.groupId);
              scope.$emit('refreshGroup','');
              console.log(response);
					}, function (error,status){
              console.log(error);
					});
				}
			};
			scope.removePeople = function(params){

				var newParams ={
					'option':'removeMember',
					'userId':params.userId,
					'groupId':params.groupId
				};

				if(angular.isUndefined(params)){
					return;
					//won't happen!or if ti happen we quit too bad hierachy!
				}else{
				Group.removePeople(newParams)
					.then(function (response){
							userInteractionNotification.info("Removed Member in group.");
	            scope.initAddPeople(params.groupId);
	            scope.$emit('refreshGroup','');
            	console.log(response);
					}, function (error,status){
              console.log(error);
					});
				}
			};
			scope.removeFromGroup = function(){
				console.log('we can remove file in group');
			};
			scope.addFileToGroup = function(params){
				var fileObj ={
					'option':'addFiles',
					'fileId':params.fileId,
					'groupId':params.groupId
				};

				Group.addFileToGroup(fileObj)
				.then(function(response){
					console.log(response);
					// userInteractionNotification.success("A file is added in group");
				},function(err){
					userInteractionNotification.warn("Some error occured during adding file");
				});

			};
			scope.filesInBox = function(groupid){
				var params ={'group_id':groupid,'owner':'box'};
				scope.$emit('showOptions',params);

			};
			scope.filesInGroup = function(groupid){

				var params ={'group_id':groupid,'owner':'group'};
				scope.$emit('showOptions',params);
			};
		}
	};
}]);

angular.module('sync')
.service('Report', [function Report ($http,$q,$rootScope) {
	this.send = function(issue){
		var differed = $q.defer();
		$http.post($rootScope.endPoint + '/api/v1/issues', issue)
		.success(function(res){
			differed.resolve(res);
		})
		.error(function(err) {
			differed.reject(err);
		});
		return differed.promise;
	};
	return this;
}]);

/* global sync */
angular.module('sync')
.service('Settings', ['$http','$rootScope','$q',function ($http,$rootScope,$q) {
	this.current = function(){
        var differed = $q.defer();
        $http.get($rootScope.endPoint + '/api/v1/settings')
        .success(function(resp){
            differed.resolve(resp);
        })
        .error(function(err){
            differed.reject(err);
        });
        return differed.promise;
    };
    return this;
}]);

angular.module('sync')
.controller('SettingsController', ['$scope','Settings','$log', function ($scope,Settings,$log) {
	$scope.init = function(){
        $scope.loadCurrentSettings();
    };
     $scope.loadCurrentSettings = function(){
         Settings.current().then(function(resp){
             $scope.settings = resp;
         }, function(err){
             $log.info('errror prevent promise to be fullfill');
         });
     };
     $scope.init();
}]);

/* global sync */
angular.module('sync').controller('ShareController', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'$route',
	'$log',
	'$uibModal',
	'Share',
	'User',
	function (
		$scope,
		$rootScope,
		$routeParams,
		$route,
		$log,
		$uibModal,
		Share,
		User
	)
{

	$scope.share = function(file_id){
		// alert('here');
		console.log(file_id);
	};
}
]);

/* global sync */
/* global angular */

    angular.module('sync')
    .controller('UploadController', ['$scope', 'FileUploader','$rootScope','Files','$stateParams','DEBUG','cacheFactory', function($scope, FileUploader,$rootScope,Files,$stateParams,DEBUG,cacheFactory) {
        var uploader = $scope.uploader = new FileUploader({
            url: $rootScope.endPoint+'/api/v1/upload'
        });
        //FILTERS
        uploader.filters.push({
            name: 'customFilter',

            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });
        var splited = cacheFactory.get('folderStructure').splice(''),
            combinesPath_structure = splited.join('');
        uploader.formData.push({
            //access this folderId in your backend! with request or input::get('folderId')
             folderId:$stateParams.folderId,
             folderStructure:combinesPath_structure

        });
        console.log($stateParams.folderId);
        //CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            // if(DEBUG === true)
            //     console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            // if(DEBUG === true)
            //     console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            // if(DEBUG === true)
            //     console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            // if(DEBUG === true)
            //     console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            // if(DEBUG === true)
            //     console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            // if(DEBUG === true)
            //     console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            // if(DEBUG === true)
            //     console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            // if(DEBUG === true)
            //     console.info('onErrorItem', fileItem, response, status, headers);
    };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            // if(DEBUG === true)
            //     console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            $rootScope.$emit('file:list');
            // if(DEBUG === true)
            //     console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function()
        {
          Files.getBoxFiles()
            .then(function(res){
              $scope.files 	=	res;

            }, function(error){
              console.log(error);
            })
            .finally(function () {
                $scope.dataLoading = false;
           });
            console.info('onCompleteAll');
        };
        if(DEBUG === true)
            console.info('uploader', uploader);
}]);

angular.module('sync')
.service('urlShortener',[function(){
  this.makeShort = function(longUrl){
    return longUrl;
  };
  // this.makeShort = function(longUrl)
  // {
  //   //  var longUrl=document.getElementById("longurl").value;
  //     var request = gapi.client.urlshortener.url.insert({
  //     'resource': {
  //       'longUrl': longUrl
  // 	}
  //     });
  //     request.execute(function(response)
  // 	{
  //
  // 		if(response.id != null)
  // 		{
  // 			str ="<b>Long URL:</b>"+longUrl+"<br>";
  // 			str +="<b>your File is:</b> <a href='"+response.id+"'>"+response.id+"</a><br>";
  // 			return str;
  // 		}
  // 		else
  // 		{
  // 			console.log("error: unable to create short url");
  // 		}
  //
  //     });
  //  }
  //
  // this.getShortInfo = function()
  //  {
  //      var shortUrl=document.getElementById("shorturl").value;
  //
  //      var request = gapi.client.urlshortener.url.get({
  //        'shortUrl': shortUrl,
  //  	     'projection':'FULL'
  //      });
  //      request.execute(function(response)
  //  	{
  //  		if(response.longUrl!= null)
  //  		{
  //  			str ="<b>Long URL:</b>"+response.longUrl+"<br>";
  //  			str +="<b>Create On:</b>"+response.created+"<br>";
  //  			document.getElementById("output").innerHTML = str;
  //  		}
  //  		else
  //  		{
  //  			console.log("error: unable to get URL information");
  //  		}
  //
  //      });
  //
  //  }
  //  function load()
  //  {
  //  	gapi.client.setApiKey('AIzaSyDSn7z7V1f6H3yXrgAlgVGw52dSEmqALIc'); //get your ownn Browser API KEY
  //  	gapi.client.load('urlshortener', 'v1',function(){});
  //  }
  //  window.onload = load;
}]);

angular.module('sync')
.controller('userController',['User','$scope',function(User,$scope){

  $scope.options =[{logout:'logout'}];
  User.getUsername()
  .then(function(user){
    $scope.user = user;
  }).catch();
  // $scope.user = 'StrimUp';

}]);

  //
  // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  // (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  // m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  // })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  //
  // ga('create', 'UA-64955866-2', 'auto');
  // ga('send', 'pageview');

        //this function can remove an array element.
        var element ;
            Array.remove = function(array, from, to) {
                var rest = array.slice((to || from) + 1 || array.length);
                array.length = from < 0 ? array.length + from : from;
                return array.push.apply(array, rest);
            };
            var total_popups = 0;
            var popups = [];
            function close_popup(id)
            {
                for(var iii = 0; iii < popups.length; iii++)
                {
                    if(id === popups[iii])
                    {
                        Array.remove(popups, iii);

                        document.getElementById(id).style.display = "none";

                        calculate_popups();

                        return;
                    }
                }
            }

            //displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
            function display_popups()
            {
                var right = 220;

                var iii = 0;
                for(iii; iii < total_popups; iii++)
                {
                    if(popups[iii] !== undefined)
                    {
                         element = document.getElementById(popups[iii]);
                        element.style.right = right + "px";
                        right = right + 320;
                        element.style.display = "block";
                    }
                }

                for(var jjj = iii; jjj < popups.length; jjj++)
                {
                     element = document.getElementById(popups[jjj]);
                    element.style.display = "none";
                }
            }
             /*
                this script has been added by me for my custome

                */
                $(document).ready(function() {
                    $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                    });


                    $("#chat").keypress(function(evt) {
                        if(evt.which === 13) {
                            alert("we are listning to enter event");
                                var iusername = $('#shout_username').val();
                                var imessage = $('#shout_message').val();
                                post_data = {'username':iusername, 'message':imessage};

                                //send data to "shout.php" using jQuery $.post()
                                $.post('shout.php', post_data, function(data) {

                                    //append data into messagebox with jQuery fade effect!
                                    $(data).hide().appendTo('.message_box').fadeIn();

                                    //keep scrolled to bottom of chat!
                                    var scrolltoh = $('.message_box')[0].scrollHeight;
                                    $('.message_box').scrollTop(scrolltoh);

                                    //reset value of message box
                                    $('#shout_message').val('');

                                }).fail(function(err) {

                                //alert HTTP server error
                                alert(err.statusText);
                                });
                            }
                    });

                    //toggle hide/show shout box
                    $(".close_btn").click(function (e) {
                        //get CSS display state of .toggle_chat element
                        var toggleState = $('.toggle_chat').css('display');

                        //toggle show/hide chat box
                        $('.toggle_chat').slideToggle();

                        //use toggleState var to change close/open icon image
                        if(toggleState === 'block')
                        {
                            $(".header div").attr('class', 'open_btn');
                        }else{
                            $(".header div").attr('class', 'close_btn');
                        }


                    });
                });
                /*done adding my custom scripts*/
            //creates markup for a new popup. Adds the id to popups array.
            function register_popup(id, name)
            {

                for(var iii = 0; iii < popups.length; iii++)
                {
                    //already registered. Bring it to front.
                    if(id === popups[iii])
                    {
                        Array.remove(popups, iii);

                        popups.unshift(id);

                        calculate_popups();


                        return;
                    }
                }

                var element='<div class="popup-box chat-popup" id="'+ id +'">';
                    element =element + '<div style="background:#ddd;color:#fff;" class="header">Group<div class="close_btn">&nbsp;</div></div>';
                    element =element + ' <div class="toggle_chat">';
                    element =element + '<div class="message_box"></div>';
                    element =element + '<textarea style="background:white;margin-top:180px;" id="chat" class="form-control" rows="3" required="required"></textarea>';
                   
                document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;

                popups.unshift(id);

                calculate_popups();

            }

            //calculate the total number of popups suitable and then populate the toatal_popups variable.
            function calculate_popups()
            {
                var width = window.innerWidth;
                if(width < 540)
                {
                    total_popups = 0;
                }
                else
                {
                    width = width - 200;
                    //320 is width of a single popup box
                    total_popups = parseInt(width/320);
                }

                display_popups();

            }

            //recalculate when window is loaded and also when window is resized.
            window.addEventListener("resize", calculate_popups);
            window.addEventListener("load", calculate_popups);
//Author Muragijimana Richard strimup@gmail.com beastar457@gmail.com

  angular.module('sync')
  .controller('MessageController', ["$http", "$scope", "$q", "$rootScope", function ($http,$scope,$q,$rootScope) {
       $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
      
         $scope.name="Muragijimana";
         var posts=$http.get($rootScope.endPoint + '/api/v1/post'),
             institutions=$http.get($rootScope.endPoint + '/api/v1/post');

          $q.all([posts,institutions]).then(function(result) {
            var tmp = [];
            angular.forEach(result, function(response) {
              tmp.push(response.data);
            });
            return tmp;
          }).then(function(tmpResult) {
              // posts=tmpResult;
              // console.log(angular.toJson(tmpResult[0], true));
            $scope.posts = tmpResult[0];
          });
         $('.post-in').atwho({
            at: "@",
            data:['Peter', 'Tom', 'Anne'],

         });

  }]);


angular.module('sync')
.controller("TutorialModal", ["$scope", function($scope) {

  $scope.open = function() {
    $scope.showModal = true;
  };
  $scope.ok = function() {
    $scope.showModal = false;
  };

  $scope.cancel = function() {
    $scope.showModal = false;
  };

}]);

angular.module('sync')
.controller("StriminModal", ["$scope", function($scope) {

  $scope.open = function() {
    $scope.showModal = true;
  };
  $scope.ok = function() {
    $scope.showModal = false;
  };

  $scope.cancel = function() {
    $scope.showModal = false;
  };

}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXItdXBsb2FkLmpzIiwiYXBwQ29uZmlnLmpzIiwibG9naW5Db250cm9sbGVyLmpzIiwicmVnaXN0ZXJDb250cm9sbGVyLmpzIiwiY29tbW9uL0ZpbGVzLmpzIiwiY29tbW9uL0ZvbGRlci5qcyIsImNvbW1vbi9QZW9wbGVTZXJ2aWNlLmpzIiwiY29tbW9uL1NNUy5qcyIsImNvbW1vbi9TaGFyZVNlcnZpY2UuanMiLCJjb21tb24vU2hhcmVkLmpzIiwiY29tbW9uL1N1YkZvbGRlci5qcyIsImNvbW1vbi9UZXN0LmpzIiwiY29tbW9uL1VzZXJTZXJ2aWNlLmpzIiwiY29tbW9uL25vdGlmaWNhdGlvbi5qcyIsImNvbW1vbi91c2VySW50ZXJhY3Rpb25NYW5hZ2VyLmpzIiwiY29tbW9uL3VzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbi5qcyIsImRpYWxvZ3MvZGlhbG9nQ3RybC5qcyIsImRpcmVjdGl2ZXMvYnV0dG9uLmpzIiwiZGlyZWN0aXZlcy9kaXJlY3RpdmVzLmpzIiwiZmVlZHMvZmVlZHMuanMiLCJmaWxlcy9maWxlcy5qcyIsImZpbGVzL2ZvbGRlcnMuanMiLCJmaWxlcy9wcmV2aWV3LmpzIiwiZm9sbG93ZXJzL2ZvbGxvd2Vycy5qcyIsImdyb3Vwcy9ncm91cHMuanMiLCJzZXR0aW5ncy9zZXR0aW5ncy5qcyIsInNoYXJpbmcvc2hhcmluZy5qcyIsInVwbG9hZGVyL3VwbG9hZGVyLmpzIiwidXJsU2hvcnRuZXIvc2hvcnRuZXIuanMiLCJ1c2VyL3VzZXJDb250cm9sbGVyLmpzIiwiZmVlZHMvY29udHJvbGxlci9hbmFseXRpY3MuanMiLCJmZWVkcy9jb250cm9sbGVyL2NoYXRQb3B1cENvbnRyb2xsZXIuanMiLCJmZWVkcy9jb250cm9sbGVyL21lc3NhZ2VDb250cm9sbGVyLmpzIiwiZmVlZHMvY29udHJvbGxlci9tb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUFLQSxDQUFDLFNBQVMsaUNBQWlDLE1BQU0s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T0FBTyxZQUFZOzs7O0FBSXZCIiwiZmlsZSI6Im1vZHVsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIGFuZ3VsYXItZmlsZS11cGxvYWQgdjIuMi4wXG4gaHR0cHM6Ly9naXRodWIuY29tL25lcnZnaC9hbmd1bGFyLWZpbGUtdXBsb2FkXG4qL1xuXG4oZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhbmd1bGFyLWZpbGUtdXBsb2FkXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFuZ3VsYXItZmlsZS11cGxvYWRcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAgKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIG9wdGlvbnMgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygyKSk7XG5cblx0dmFyIHNlcnZpY2VGaWxlVXBsb2FkZXIgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygzKSk7XG5cblx0dmFyIHNlcnZpY2VGaWxlTGlrZU9iamVjdCA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDQpKTtcblxuXHR2YXIgc2VydmljZUZpbGVJdGVtID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oNSkpO1xuXG5cdHZhciBzZXJ2aWNlRmlsZURpcmVjdGl2ZSA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDYpKTtcblxuXHR2YXIgc2VydmljZUZpbGVTZWxlY3QgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXyg3KSk7XG5cblx0dmFyIHNlcnZpY2VGaWxlRHJvcCA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDgpKTtcblxuXHR2YXIgc2VydmljZUZpbGVPdmVyID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oOSkpO1xuXG5cdHZhciBkaXJlY3RpdmVGaWxlU2VsZWN0ID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMTApKTtcblxuXHR2YXIgZGlyZWN0aXZlRmlsZURyb3AgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxMSkpO1xuXG5cdHZhciBkaXJlY3RpdmVGaWxlT3ZlciA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEyKSk7XG5cblx0YW5ndWxhci5tb2R1bGUoQ09ORklHLm5hbWUsIFtdKS52YWx1ZShcImZpbGVVcGxvYWRlck9wdGlvbnNcIiwgb3B0aW9ucykuZmFjdG9yeShcIkZpbGVVcGxvYWRlclwiLCBzZXJ2aWNlRmlsZVVwbG9hZGVyKS5mYWN0b3J5KFwiRmlsZUxpa2VPYmplY3RcIiwgc2VydmljZUZpbGVMaWtlT2JqZWN0KS5mYWN0b3J5KFwiRmlsZUl0ZW1cIiwgc2VydmljZUZpbGVJdGVtKS5mYWN0b3J5KFwiRmlsZURpcmVjdGl2ZVwiLCBzZXJ2aWNlRmlsZURpcmVjdGl2ZSkuZmFjdG9yeShcIkZpbGVTZWxlY3RcIiwgc2VydmljZUZpbGVTZWxlY3QpLmZhY3RvcnkoXCJGaWxlRHJvcFwiLCBzZXJ2aWNlRmlsZURyb3ApLmZhY3RvcnkoXCJGaWxlT3ZlclwiLCBzZXJ2aWNlRmlsZU92ZXIpLmRpcmVjdGl2ZShcIm52RmlsZVNlbGVjdFwiLCBkaXJlY3RpdmVGaWxlU2VsZWN0KS5kaXJlY3RpdmUoXCJudkZpbGVEcm9wXCIsIGRpcmVjdGl2ZUZpbGVEcm9wKS5kaXJlY3RpdmUoXCJudkZpbGVPdmVyXCIsIGRpcmVjdGl2ZUZpbGVPdmVyKS5ydW4oW1wiRmlsZVVwbG9hZGVyXCIsIFwiRmlsZUxpa2VPYmplY3RcIiwgXCJGaWxlSXRlbVwiLCBcIkZpbGVEaXJlY3RpdmVcIiwgXCJGaWxlU2VsZWN0XCIsIFwiRmlsZURyb3BcIiwgXCJGaWxlT3ZlclwiLCBmdW5jdGlvbiAoRmlsZVVwbG9hZGVyLCBGaWxlTGlrZU9iamVjdCwgRmlsZUl0ZW0sIEZpbGVEaXJlY3RpdmUsIEZpbGVTZWxlY3QsIEZpbGVEcm9wLCBGaWxlT3Zlcikge1xuXHQgICAgLy8gb25seSBmb3IgY29tcGF0aWJpbGl0eVxuXHQgICAgRmlsZVVwbG9hZGVyLkZpbGVMaWtlT2JqZWN0ID0gRmlsZUxpa2VPYmplY3Q7XG5cdCAgICBGaWxlVXBsb2FkZXIuRmlsZUl0ZW0gPSBGaWxlSXRlbTtcblx0ICAgIEZpbGVVcGxvYWRlci5GaWxlRGlyZWN0aXZlID0gRmlsZURpcmVjdGl2ZTtcblx0ICAgIEZpbGVVcGxvYWRlci5GaWxlU2VsZWN0ID0gRmlsZVNlbGVjdDtcblx0ICAgIEZpbGVVcGxvYWRlci5GaWxlRHJvcCA9IEZpbGVEcm9wO1xuXHQgICAgRmlsZVVwbG9hZGVyLkZpbGVPdmVyID0gRmlsZU92ZXI7XG5cdH1dKTtcblxuLyoqKi8gfSxcblxuLyogMSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdFx0XCJuYW1lXCI6IFwiYW5ndWxhckZpbGVVcGxvYWRcIlxuXHR9O1xuXG4vKioqLyB9LFxuLyogMiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgICB1cmw6IFwiL1wiLFxuXHQgICAgYWxpYXM6IFwiZmlsZVwiLFxuXHQgICAgaGVhZGVyczogeydhdXRob3JpemF0aW9uJzogJ0JlYXJlciA4RXVxY01Oa0YyeVA1MERpY3B2OWhMUlJwN1dPU2FiUGxDdTIybGlZJ30sXG5cblx0ICAgIHF1ZXVlOiBbXSxcblx0ICAgIHByb2dyZXNzOiAwLFxuXHQgICAgYXV0b1VwbG9hZDogZmFsc2UsXG5cdCAgICByZW1vdmVBZnRlclVwbG9hZDogZmFsc2UsXG5cdCAgICBtZXRob2Q6IFwiUE9TVFwiLFxuXHQgICAgZmlsdGVyczogW10sXG5cdCAgICBmb3JtRGF0YTogW10sXG5cdCAgICBxdWV1ZUxpbWl0OiBOdW1iZXIuTUFYX1ZBTFVFLFxuXHQgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZVxuXHR9O1xuXG4vKioqLyB9LFxuLyogMyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHsgdmFyIHByb3AgPSBwcm9wc1trZXldOyBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTsgfSBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTsgfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5cdHZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdHZhciBjb3B5ID0gYW5ndWxhci5jb3B5O1xuXHR2YXIgZXh0ZW5kID0gYW5ndWxhci5leHRlbmQ7XG5cdHZhciBmb3JFYWNoID0gYW5ndWxhci5mb3JFYWNoO1xuXHR2YXIgaXNPYmplY3QgPSBhbmd1bGFyLmlzT2JqZWN0O1xuXHR2YXIgaXNOdW1iZXIgPSBhbmd1bGFyLmlzTnVtYmVyO1xuXHR2YXIgaXNEZWZpbmVkID0gYW5ndWxhci5pc0RlZmluZWQ7XG5cdHZhciBpc0FycmF5ID0gYW5ndWxhci5pc0FycmF5O1xuXHR2YXIgZWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudDtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmaWxlVXBsb2FkZXJPcHRpb25zLCAkcm9vdFNjb3BlLCAkaHR0cCwgJHdpbmRvdywgRmlsZUxpa2VPYmplY3QsIEZpbGVJdGVtKSB7XG5cdCAgICB2YXIgRmlsZSA9ICR3aW5kb3cuRmlsZTtcblx0ICAgIHZhciBGb3JtRGF0YSA9ICR3aW5kb3cuRm9ybURhdGE7XG5cblx0ICAgIHZhciBGaWxlVXBsb2FkZXIgPSAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG5cdCAgICAgICAgICogUFVCTElDXG5cdCAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBGaWxlVXBsb2FkZXJcblx0ICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlVXBsb2FkZXIob3B0aW9ucykge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZVVwbG9hZGVyKTtcblxuXHQgICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSBjb3B5KGZpbGVVcGxvYWRlck9wdGlvbnMpO1xuXG5cdCAgICAgICAgICAgIGV4dGVuZCh0aGlzLCBzZXR0aW5ncywgb3B0aW9ucywge1xuXHQgICAgICAgICAgICAgICAgaXNVcGxvYWRpbmc6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgX25leHRJbmRleDogMCxcblx0ICAgICAgICAgICAgICAgIF9mYWlsRmlsdGVySW5kZXg6IC0xLFxuXHQgICAgICAgICAgICAgICAgX2RpcmVjdGl2ZXM6IHsgc2VsZWN0OiBbXSwgZHJvcDogW10sIG92ZXI6IFtdIH1cblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgLy8gYWRkIGRlZmF1bHQgZmlsdGVyc1xuXHQgICAgICAgICAgICB0aGlzLmZpbHRlcnMudW5zaGlmdCh7IG5hbWU6IFwicXVldWVMaW1pdFwiLCBmbjogdGhpcy5fcXVldWVMaW1pdEZpbHRlciB9KTtcblx0ICAgICAgICAgICAgdGhpcy5maWx0ZXJzLnVuc2hpZnQoeyBuYW1lOiBcImZvbGRlclwiLCBmbjogdGhpcy5fZm9sZGVyRmlsdGVyIH0pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIF9jcmVhdGVDbGFzcyhGaWxlVXBsb2FkZXIsIHtcblx0ICAgICAgICAgICAgYWRkVG9RdWV1ZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBBZGRzIGl0ZW1zIHRvIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlfEhUTUxJbnB1dEVsZW1lbnR8T2JqZWN0fEZpbGVMaXN0fEFycmF5PE9iamVjdD59IGZpbGVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5PEZ1bmN0aW9uPnxTdHJpbmd9IGZpbHRlcnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkVG9RdWV1ZShmaWxlcywgb3B0aW9ucywgZmlsdGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cblx0ICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IHRoaXMuaXNBcnJheUxpa2VPYmplY3QoZmlsZXMpID8gZmlsZXMgOiBbZmlsZXNdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBhcnJheU9mRmlsdGVycyA9IHRoaXMuX2dldEZpbHRlcnMoZmlsdGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gdGhpcy5xdWV1ZS5sZW5ndGg7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGFkZGVkRmlsZUl0ZW1zID0gW107XG5cblx0ICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKGxpc3QsIGZ1bmN0aW9uIChzb21lIC8qe0ZpbGV8SFRNTElucHV0RWxlbWVudHxPYmplY3R9Ki8pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBuZXcgRmlsZUxpa2VPYmplY3Qoc29tZSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLl9pc1ZhbGlkRmlsZSh0ZW1wLCBhcnJheU9mRmlsdGVycywgb3B0aW9ucykpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlSXRlbSA9IG5ldyBGaWxlSXRlbShfdGhpcywgc29tZSwgb3B0aW9ucyk7XG5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkRmlsZUl0ZW1zLnB1c2goZmlsZUl0ZW0pO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucXVldWUucHVzaChmaWxlSXRlbSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25BZnRlckFkZGluZ0ZpbGUoZmlsZUl0ZW0pO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbHRlciA9IGFycmF5T2ZGaWx0ZXJzW190aGlzLl9mYWlsRmlsdGVySW5kZXhdO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uV2hlbkFkZGluZ0ZpbGVGYWlsZWQodGVtcCwgZmlsdGVyLCBvcHRpb25zKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucXVldWUubGVuZ3RoICE9PSBjb3VudCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkFmdGVyQWRkaW5nQWxsKGFkZGVkRmlsZUl0ZW1zKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHRoaXMuX2dldFRvdGFsUHJvZ3Jlc3MoKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXIoKTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRvVXBsb2FkKSB0aGlzLnVwbG9hZEFsbCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICByZW1vdmVGcm9tUXVldWU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmVtb3ZlIGl0ZW1zIGZyb20gdGhlIHF1ZXVlLiBSZW1vdmUgbGFzdDogaW5kZXggPSAtMVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbXxOdW1iZXJ9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUZyb21RdWV1ZSh2YWx1ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0SW5kZXhPZkl0ZW0odmFsdWUpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5xdWV1ZVtpbmRleF07XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaXNVcGxvYWRpbmcpIGl0ZW0uY2FuY2VsKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWV1ZS5zcGxpY2UoaW5kZXgsIDEpO1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX2Rlc3Ryb3koKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gdGhpcy5fZ2V0VG90YWxQcm9ncmVzcygpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBjbGVhclF1ZXVlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENsZWFycyB0aGUgcXVldWVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXJRdWV1ZSgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5xdWV1ZS5sZW5ndGgpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWV1ZVswXS5yZW1vdmUoKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHVwbG9hZEl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogVXBsb2FkcyBhIGl0ZW0gZnJvbSB0aGUgcXVldWVcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW18TnVtYmVyfSB2YWx1ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1cGxvYWRJdGVtKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleE9mSXRlbSh2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLnF1ZXVlW2luZGV4XTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNwb3J0ID0gdGhpcy5pc0hUTUw1ID8gXCJfeGhyVHJhbnNwb3J0XCIgOiBcIl9pZnJhbWVUcmFuc3BvcnRcIjtcblxuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX3ByZXBhcmVUb1VwbG9hZGluZygpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVXBsb2FkaW5nKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICAgICAgICAgICAgICB9dGhpcy5pc1VwbG9hZGluZyA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpc1t0cmFuc3BvcnRdKGl0ZW0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBjYW5jZWxJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbmNlbHMgdXBsb2FkaW5nIG9mIGl0ZW0gZnJvbSB0aGUgcXVldWVcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW18TnVtYmVyfSB2YWx1ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5jZWxJdGVtKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleE9mSXRlbSh2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLnF1ZXVlW2luZGV4XTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuaXNIVE1MNSA/IFwiX3hoclwiIDogXCJfZm9ybVwiO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtICYmIGl0ZW0uaXNVcGxvYWRpbmcpIGl0ZW1bcHJvcF0uYWJvcnQoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgdXBsb2FkQWxsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFVwbG9hZHMgYWxsIG5vdCB1cGxvYWRlZCBpdGVtcyBvZiBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1cGxvYWRBbGwoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5nZXROb3RVcGxvYWRlZEl0ZW1zKCkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhaXRlbS5pc1VwbG9hZGluZztcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW1zLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgICAgICAgICAgICAgfWZvckVhY2goaXRlbXMsIGZ1bmN0aW9uIChpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLl9wcmVwYXJlVG9VcGxvYWRpbmcoKTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgICAgICBpdGVtc1swXS51cGxvYWQoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgY2FuY2VsQWxsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbmNlbHMgYWxsIHVwbG9hZHNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY2FuY2VsQWxsKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtcyA9IHRoaXMuZ2V0Tm90VXBsb2FkZWRJdGVtcygpO1xuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2goaXRlbXMsIGZ1bmN0aW9uIChpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmNhbmNlbCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBpc0ZpbGU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBhbiBpbnN0YW5jZSBvZiBGaWxlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRmlsZSh2YWx1ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmlzRmlsZSh2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGlzRmlsZUxpa2VPYmplY3Q6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBhbiBpbnN0YW5jZSBvZiBGaWxlTGlrZU9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc0ZpbGVMaWtlT2JqZWN0KHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuaXNGaWxlTGlrZU9iamVjdCh2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGlzQXJyYXlMaWtlT2JqZWN0OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgXCJ0cnVlXCIgaWYgdmFsdWUgaXMgYXJyYXkgbGlrZSBvYmplY3Rcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgZ2V0SW5kZXhPZkl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBhIGluZGV4IG9mIGl0ZW0gZnJvbSB0aGUgcXVldWVcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7SXRlbXxOdW1iZXJ9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRJbmRleE9mSXRlbSh2YWx1ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBpc051bWJlcih2YWx1ZSkgPyB2YWx1ZSA6IHRoaXMucXVldWUuaW5kZXhPZih2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGdldE5vdFVwbG9hZGVkSXRlbXM6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBub3QgdXBsb2FkZWQgaXRlbXNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtBcnJheX1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Tm90VXBsb2FkZWRJdGVtcygpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5xdWV1ZS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFpdGVtLmlzVXBsb2FkZWQ7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGdldFJlYWR5SXRlbXM6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBpdGVtcyByZWFkeSBmb3IgdXBsb2FkXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFJlYWR5SXRlbXMoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVldWUuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlzUmVhZHkgJiYgIWl0ZW0uaXNVcGxvYWRpbmc7XG5cdCAgICAgICAgICAgICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoaXRlbTEsIGl0ZW0yKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtMS5pbmRleCAtIGl0ZW0yLmluZGV4O1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBkZXN0cm95OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIERlc3Ryb3lzIGluc3RhbmNlIG9mIEZpbGVVcGxvYWRlclxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cblx0ICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKHRoaXMuX2RpcmVjdGl2ZXMsIGZ1bmN0aW9uIChrZXkpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChfdGhpcy5fZGlyZWN0aXZlc1trZXldLCBmdW5jdGlvbiAob2JqZWN0KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZGVzdHJveSgpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25BZnRlckFkZGluZ0FsbDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheX0gZmlsZUl0ZW1zXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQWZ0ZXJBZGRpbmdBbGwoZmlsZUl0ZW1zKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkFmdGVyQWRkaW5nRmlsZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gZmlsZUl0ZW1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25BZnRlckFkZGluZ0ZpbGUoZmlsZUl0ZW0pIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uV2hlbkFkZGluZ0ZpbGVGYWlsZWQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZXxPYmplY3R9IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmaWx0ZXJcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uV2hlbkFkZGluZ0ZpbGVGYWlsZWQoaXRlbSwgZmlsdGVyLCBvcHRpb25zKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkJlZm9yZVVwbG9hZEl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGZpbGVJdGVtXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQmVmb3JlVXBsb2FkSXRlbShmaWxlSXRlbSkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25Qcm9ncmVzc0l0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGZpbGVJdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3Ncblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25Qcm9ncmVzc0l0ZW0oZmlsZUl0ZW0sIHByb2dyZXNzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvblByb2dyZXNzQWxsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3Ncblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25Qcm9ncmVzc0FsbChwcm9ncmVzcykge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25TdWNjZXNzSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25TdWNjZXNzSXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkVycm9ySXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25FcnJvckl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25DYW5jZWxJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNhbmNlbEl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25Db21wbGV0ZUl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ29tcGxldGVJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQ29tcGxldGVBbGw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25Db21wbGV0ZUFsbCgpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9nZXRUb3RhbFByb2dyZXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICAgICAgICAgICAgICogUFJJVkFURVxuXHQgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgdGhlIHRvdGFsIHByb2dyZXNzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ZhbHVlXVxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge051bWJlcn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRUb3RhbFByb2dyZXNzKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVtb3ZlQWZ0ZXJVcGxvYWQpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIHx8IDA7XG5cdCAgICAgICAgICAgICAgICAgICAgfXZhciBub3RVcGxvYWRlZCA9IHRoaXMuZ2V0Tm90VXBsb2FkZWRJdGVtcygpLmxlbmd0aDtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdXBsb2FkZWQgPSBub3RVcGxvYWRlZCA/IHRoaXMucXVldWUubGVuZ3RoIC0gbm90VXBsb2FkZWQgOiB0aGlzLnF1ZXVlLmxlbmd0aDtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgcmF0aW8gPSAxMDAgLyB0aGlzLnF1ZXVlLmxlbmd0aDtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9ICh2YWx1ZSB8fCAwKSAqIHJhdGlvIC8gMTAwO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQodXBsb2FkZWQgKiByYXRpbyArIGN1cnJlbnQpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfZ2V0RmlsdGVyczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIGFycmF5IG9mIGZpbHRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXk8RnVuY3Rpb24+fFN0cmluZ30gZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0FycmF5PEZ1bmN0aW9uPn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRGaWx0ZXJzKGZpbHRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIWZpbHRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVycztcblx0ICAgICAgICAgICAgICAgICAgICB9aWYgKGlzQXJyYXkoZmlsdGVycykpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG5cdCAgICAgICAgICAgICAgICAgICAgfXZhciBuYW1lcyA9IGZpbHRlcnMubWF0Y2goL1teXFxzLF0rL2cpO1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbHRlcnMuZmlsdGVyKGZ1bmN0aW9uIChmaWx0ZXIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVzLmluZGV4T2YoZmlsdGVyLm5hbWUpICE9PSAtMTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3JlbmRlcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBVcGRhdGVzIGh0bWxcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9yZW5kZXIoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCEkcm9vdFNjb3BlLiQkcGhhc2UpICRyb290U2NvcGUuJGFwcGx5KCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9mb2xkZXJGaWx0ZXI6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiBpdGVtIGlzIGEgZmlsZSAobm90IGZvbGRlcilcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZXxGaWxlTGlrZU9iamVjdH0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZm9sZGVyRmlsdGVyKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gISEoaXRlbS5zaXplIHx8IGl0ZW0udHlwZSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9xdWV1ZUxpbWl0RmlsdGVyOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgXCJ0cnVlXCIgaWYgdGhlIGxpbWl0IGhhcyBub3QgYmVlbiByZWFjaGVkXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9xdWV1ZUxpbWl0RmlsdGVyKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnF1ZXVlLmxlbmd0aCA8IHRoaXMucXVldWVMaW1pdDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2lzVmFsaWRGaWxlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgXCJ0cnVlXCIgaWYgZmlsZSBwYXNzIGFsbCBmaWx0ZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8T2JqZWN0fSBmaWxlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5PEZ1bmN0aW9uPn0gZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2lzVmFsaWRGaWxlKGZpbGUsIGZpbHRlcnMsIG9wdGlvbnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFpbEZpbHRlckluZGV4ID0gLTE7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFmaWx0ZXJzLmxlbmd0aCA/IHRydWUgOiBmaWx0ZXJzLmV2ZXJ5KGZ1bmN0aW9uIChmaWx0ZXIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2ZhaWxGaWx0ZXJJbmRleCsrO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLmZuLmNhbGwoX3RoaXMsIGZpbGUsIG9wdGlvbnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfaXNTdWNjZXNzQ29kZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDaGVja3Mgd2hldGhlciB1cGxvYWQgc3VjY2Vzc2Z1bFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaXNTdWNjZXNzQ29kZShzdGF0dXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDAgfHwgc3RhdHVzID09PSAzMDQ7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF90cmFuc2Zvcm1SZXNwb25zZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBUcmFuc2Zvcm1zIHRoZSBzZXJ2ZXIgcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Kn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF90cmFuc2Zvcm1SZXNwb25zZShyZXNwb25zZSwgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBoZWFkZXJzR2V0dGVyID0gdGhpcy5faGVhZGVyc0dldHRlcihoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKCRodHRwLmRlZmF1bHRzLnRyYW5zZm9ybVJlc3BvbnNlLCBmdW5jdGlvbiAodHJhbnNmb3JtRm4pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB0cmFuc2Zvcm1GbihyZXNwb25zZSwgaGVhZGVyc0dldHRlcik7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfcGFyc2VIZWFkZXJzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFBhcnNlZCByZXNwb25zZSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH1cblx0ICAgICAgICAgICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9ibG9iL21hc3Rlci9zcmMvbmcvaHR0cC5qc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3BhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnNlZCA9IHt9LFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBrZXksXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhbCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGlmICghaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkO1xuXHQgICAgICAgICAgICAgICAgICAgIH1mb3JFYWNoKGhlYWRlcnMuc3BsaXQoXCJcXG5cIiksIGZ1bmN0aW9uIChsaW5lKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBsaW5lLmluZGV4T2YoXCI6XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBsaW5lLnNsaWNlKDAsIGkpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBsaW5lLnNsaWNlKGkgKyAxKS50cmltKCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgXCIsIFwiICsgdmFsIDogdmFsO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfaGVhZGVyc0dldHRlcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyc2VkSGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2hlYWRlcnNHZXR0ZXIocGFyc2VkSGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAobmFtZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZEhlYWRlcnNbbmFtZS50b0xvd2VyQ2FzZSgpXSB8fCBudWxsO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWRIZWFkZXJzO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF94aHJUcmFuc3BvcnQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogVGhlIFhNTEh0dHBSZXF1ZXN0IHRyYW5zcG9ydFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3hoclRyYW5zcG9ydChpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuXHQgICAgICAgICAgICAgICAgICAgIHZhciB4aHIgPSBpdGVtLl94aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25CZWZvcmVVcGxvYWRJdGVtKGl0ZW0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChpdGVtLmZvcm1EYXRhLCBmdW5jdGlvbiAob2JqKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGZvckVhY2gob2JqLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5hcHBlbmQoa2V5LCB2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtLl9maWxlLnNpemUgIT0gXCJudW1iZXJcIikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIGZpbGUgc3BlY2lmaWVkIGlzIG5vIGxvbmdlciB2YWxpZFwiKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZChpdGVtLmFsaWFzLCBpdGVtLl9maWxlLCBpdGVtLmZpbGUubmFtZSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb2dyZXNzID0gTWF0aC5yb3VuZChldmVudC5sZW5ndGhDb21wdXRhYmxlID8gZXZlbnQubG9hZGVkICogMTAwIC8gZXZlbnQudG90YWwgOiAwKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uUHJvZ3Jlc3NJdGVtKGl0ZW0sIHByb2dyZXNzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSBfdGhpcy5fcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF90aGlzLl90cmFuc2Zvcm1SZXNwb25zZSh4aHIucmVzcG9uc2UsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ2lzdCA9IF90aGlzLl9pc1N1Y2Nlc3NDb2RlKHhoci5zdGF0dXMpID8gXCJTdWNjZXNzXCIgOiBcIkVycm9yXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXRob2QgPSBcIl9vblwiICsgZ2lzdCArIFwiSXRlbVwiO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpc1ttZXRob2RdKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ29tcGxldGVJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoZWFkZXJzID0gX3RoaXMuX3BhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBfdGhpcy5fdHJhbnNmb3JtUmVzcG9uc2UoeGhyLnJlc3BvbnNlLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uRXJyb3JJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ29tcGxldGVJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgeGhyLm9uYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoZWFkZXJzID0gX3RoaXMuX3BhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBfdGhpcy5fdHJhbnNmb3JtUmVzcG9uc2UoeGhyLnJlc3BvbnNlLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ2FuY2VsSXRlbShpdGVtLCByZXNwb25zZSwgeGhyLnN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vbkNvbXBsZXRlSXRlbShpdGVtLCByZXNwb25zZSwgeGhyLnN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHhoci5vcGVuKGl0ZW0ubWV0aG9kLCBpdGVtLnVybCwgdHJ1ZSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gaXRlbS53aXRoQ3JlZGVudGlhbHM7XG5cblx0ICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKGl0ZW0uaGVhZGVycywgZnVuY3Rpb24gKHZhbHVlLCBuYW1lKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKGZvcm0pO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfaWZyYW1lVHJhbnNwb3J0OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFRoZSBJRnJhbWUgdHJhbnNwb3J0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaWZyYW1lVHJhbnNwb3J0KGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGZvcm0gPSBlbGVtZW50KFwiPGZvcm0gc3R5bGU9XFxcImRpc3BsYXk6IG5vbmU7XFxcIiAvPlwiKTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaWZyYW1lID0gZWxlbWVudChcIjxpZnJhbWUgbmFtZT1cXFwiaWZyYW1lVHJhbnNwb3J0XCIgKyBEYXRlLm5vdygpICsgXCJcXFwiPlwiKTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSBpdGVtLl9pbnB1dDtcblxuXHQgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLl9mb3JtKSBpdGVtLl9mb3JtLnJlcGxhY2VXaXRoKGlucHV0KTsgLy8gcmVtb3ZlIG9sZCBmb3JtXG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fZm9ybSA9IGZvcm07IC8vIHNhdmUgbGluayB0byBuZXcgZm9ybVxuXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25CZWZvcmVVcGxvYWRJdGVtKGl0ZW0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaW5wdXQucHJvcChcIm5hbWVcIiwgaXRlbS5hbGlhcyk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKGl0ZW0uZm9ybURhdGEsIGZ1bmN0aW9uIChvYmopIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChvYmosIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudF8gPSBlbGVtZW50KFwiPGlucHV0IHR5cGU9XFxcImhpZGRlblxcXCIgbmFtZT1cXFwiXCIgKyBrZXkgKyBcIlxcXCIgLz5cIik7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Xy52YWwodmFsdWUpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5hcHBlbmQoZWxlbWVudF8pO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvcm0ucHJvcCh7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogaXRlbS51cmwsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogaWZyYW1lLnByb3AoXCJuYW1lXCIpLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBlbmN0eXBlOiBcIm11bHRpcGFydC9mb3JtLWRhdGFcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZW5jb2Rpbmc6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiIC8vIG9sZCBJRVxuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaWZyYW1lLmJpbmQoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdHVzID0gMjAwO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXggZm9yIGxlZ2FjeSBJRSBicm93c2VycyB0aGF0IGxvYWRzIGludGVybmFsIGVycm9yIHBhZ2Vcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gZmFpbGVkIFdTIHJlc3BvbnNlIHJlY2VpdmVkLiBJbiBjb25zZXF1ZW5jZSBpZnJhbWVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRlbnQgYWNjZXNzIGRlbmllZCBlcnJvciBpcyB0aHJvd24gYmVjb3VzZSB0cnlpbmcgdG9cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFjY2VzcyBjcm9zcyBkb21haW4gcGFnZS4gV2hlbiBzdWNoIHRoaW5nIG9jY3VycyBub3RpZnlpbmdcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdpdGggZW1wdHkgcmVzcG9uc2Ugb2JqZWN0LiBTZWUgbW9yZSBpbmZvIGF0OlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTEzNjIvYWNjZXNzLWlzLWRlbmllZC1lcnJvci1vbi1hY2Nlc3NpbmctaWZyYW1lLWRvY3VtZW50LW9iamVjdFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90ZSB0aGF0IGlmIG5vbiBzdGFuZGFyZCA0eHggb3IgNXh4IGVycm9yIGNvZGUgcmV0dXJuZWRcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZyb20gV1MgdGhlbiByZXNwb25zZSBjb250ZW50IGNhbiBiZSBhY2Nlc3NlZCB3aXRob3V0IGVycm9yXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBidXQgJ1hIUicgc3RhdHVzIGJlY29tZXMgMjAwLiBJbiBvcmRlciB0byBhdm9pZCBjb25mdXNpb25cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldHVybmluZyByZXNwb25zZSB2aWEgc2FtZSAnc3VjY2VzcycgZXZlbnQgaGFuZGxlci5cblxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZml4ZWQgYW5ndWxhci5jb250ZW50cygpIGZvciBpZnJhbWVzXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sID0gaWZyYW1lWzBdLmNvbnRlbnREb2N1bWVudC5ib2R5LmlubmVySFRNTDtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW4gY2FzZSB3ZSBydW4gaW50byB0aGUgYWNjZXNzLWlzLWRlbmllZCBlcnJvciBvciB3ZSBoYXZlIGFub3RoZXIgZXJyb3Igb24gdGhlIHNlcnZlciBzaWRlXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAoaW50ZW50aW9uYWwgNTAwLDQwLi4uIGVycm9ycyksIHdlIGF0IGxlYXN0IHNheSAnc29tZXRoaW5nIHdlbnQgd3JvbmcnIC0+IDUwMFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gNTAwO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHhociA9IHsgcmVzcG9uc2U6IGh0bWwsIHN0YXR1czogc3RhdHVzLCBkdW1teTogdHJ1ZSB9O1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGVhZGVycyA9IHt9O1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBfdGhpcy5fdHJhbnNmb3JtUmVzcG9uc2UoeGhyLnJlc3BvbnNlLCBoZWFkZXJzKTtcblxuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25TdWNjZXNzSXRlbShpdGVtLCByZXNwb25zZSwgeGhyLnN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vbkNvbXBsZXRlSXRlbShpdGVtLCByZXNwb25zZSwgeGhyLnN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBmb3JtLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgeGhyID0geyBzdGF0dXM6IDAsIGR1bW15OiB0cnVlIH07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoZWFkZXJzID0ge307XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZTtcblxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZnJhbWUudW5iaW5kKFwibG9hZFwiKS5wcm9wKFwic3JjXCIsIFwiamF2YXNjcmlwdDpmYWxzZTtcIik7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0ucmVwbGFjZVdpdGgoaW5wdXQpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vbkNhbmNlbEl0ZW0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICBpbnB1dC5hZnRlcihmb3JtKTtcblx0ICAgICAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZChpbnB1dCkuYXBwZW5kKGlmcmFtZSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBmb3JtWzBdLnN1Ym1pdCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25XaGVuQWRkaW5nRmlsZUZhaWxlZDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlfE9iamVjdH0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZpbHRlclxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vbldoZW5BZGRpbmdGaWxlRmFpbGVkKGl0ZW0sIGZpbHRlciwgb3B0aW9ucykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25XaGVuQWRkaW5nRmlsZUZhaWxlZChpdGVtLCBmaWx0ZXIsIG9wdGlvbnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25BZnRlckFkZGluZ0ZpbGU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQWZ0ZXJBZGRpbmdGaWxlKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQWZ0ZXJBZGRpbmdGaWxlKGl0ZW0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25BZnRlckFkZGluZ0FsbDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheTxGaWxlSXRlbT59IGl0ZW1zXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vbkFmdGVyQWRkaW5nQWxsKGl0ZW1zKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkFmdGVyQWRkaW5nQWxsKGl0ZW1zKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX29uQmVmb3JlVXBsb2FkSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiAgSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vbkJlZm9yZVVwbG9hZEl0ZW0oaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX29uQmVmb3JlVXBsb2FkKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkJlZm9yZVVwbG9hZEl0ZW0oaXRlbSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vblByb2dyZXNzSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25Qcm9ncmVzc0l0ZW0oaXRlbSwgcHJvZ3Jlc3MpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdG90YWwgPSB0aGlzLl9nZXRUb3RhbFByb2dyZXNzKHByb2dyZXNzKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gdG90YWw7XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fb25Qcm9ncmVzcyhwcm9ncmVzcyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vblByb2dyZXNzSXRlbShpdGVtLCBwcm9ncmVzcyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vblByb2dyZXNzQWxsKHRvdGFsKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXIoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX29uU3VjY2Vzc0l0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25TdWNjZXNzSXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fb25TdWNjZXNzKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25TdWNjZXNzSXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX29uRXJyb3JJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uRXJyb3JJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9vbkVycm9yKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25FcnJvckl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkNhbmNlbEl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25DYW5jZWxJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9vbkNhbmNlbChyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2FuY2VsSXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX29uQ29tcGxldGVJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQ29tcGxldGVJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9vbkNvbXBsZXRlKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cblx0ICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dEl0ZW0gPSB0aGlzLmdldFJlYWR5SXRlbXMoKVswXTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpZiAoaXNEZWZpbmVkKG5leHRJdGVtKSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS51cGxvYWQoKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZUFsbCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSB0aGlzLl9nZXRUb3RhbFByb2dyZXNzKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9LCB7XG5cdCAgICAgICAgICAgIGlzRmlsZToge1xuXHQgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcblx0ICAgICAgICAgICAgICAgICAqIFNUQVRJQ1xuXHQgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgXCJ0cnVlXCIgaWYgdmFsdWUgYW4gaW5zdGFuY2Ugb2YgRmlsZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc0ZpbGUodmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gRmlsZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIEZpbGU7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGlzRmlsZUxpa2VPYmplY3Q6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBhbiBpbnN0YW5jZSBvZiBGaWxlTGlrZU9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc0ZpbGVMaWtlT2JqZWN0KHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRmlsZUxpa2VPYmplY3Q7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGlzQXJyYXlMaWtlT2JqZWN0OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgXCJ0cnVlXCIgaWYgdmFsdWUgaXMgYXJyYXkgbGlrZSBvYmplY3Rcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgXCJsZW5ndGhcIiBpbiB2YWx1ZTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaW5oZXJpdDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbmhlcml0cyBhIHRhcmdldCAoQ2xhc3NfMSkgYnkgYSBzb3VyY2UgKENsYXNzXzIpXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0YXJnZXRcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHNvdXJjZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbmhlcml0KHRhcmdldCwgc291cmNlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc291cmNlLnByb3RvdHlwZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHRhcmdldDtcblx0ICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3VwZXJfID0gc291cmNlO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICByZXR1cm4gRmlsZVVwbG9hZGVyO1xuXHQgICAgfSkoKTtcblxuXHQgICAgLyoqKioqKioqKioqKioqKioqKioqKipcblx0ICAgICAqIFBVQkxJQ1xuXHQgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cdCAgICAvKipcblx0ICAgICAqIENoZWNrcyBhIHN1cHBvcnQgdGhlIGh0bWw1IHVwbG9hZGVyXG5cdCAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAqIEByZWFkb25seVxuXHQgICAgICovXG5cdCAgICBGaWxlVXBsb2FkZXIucHJvdG90eXBlLmlzSFRNTDUgPSAhIShGaWxlICYmIEZvcm1EYXRhKTtcblx0ICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG5cdCAgICAgKiBTVEFUSUNcblx0ICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXHQgICAgLyoqXG5cdCAgICAgKiBAYm9ycm93cyBGaWxlVXBsb2FkZXIucHJvdG90eXBlLmlzSFRNTDVcblx0ICAgICAqL1xuXHQgICAgRmlsZVVwbG9hZGVyLmlzSFRNTDUgPSBGaWxlVXBsb2FkZXIucHJvdG90eXBlLmlzSFRNTDU7XG5cblx0ICAgIHJldHVybiBGaWxlVXBsb2FkZXI7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtcImZpbGVVcGxvYWRlck9wdGlvbnNcIiwgXCIkcm9vdFNjb3BlXCIsIFwiJGh0dHBcIiwgXCIkd2luZG93XCIsIFwiRmlsZUxpa2VPYmplY3RcIiwgXCJGaWxlSXRlbVwiXTtcblxuLyoqKi8gfSxcbi8qIDQgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIga2V5IGluIHByb3BzKSB7IHZhciBwcm9wID0gcHJvcHNba2V5XTsgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7IH0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuXHR2YXIgX2NsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHR2YXIgY29weSA9IGFuZ3VsYXIuY29weTtcblx0dmFyIGlzRWxlbWVudCA9IGFuZ3VsYXIuaXNFbGVtZW50O1xuXHR2YXIgaXNTdHJpbmcgPSBhbmd1bGFyLmlzU3RyaW5nO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIEZpbGVMaWtlT2JqZWN0ID0gKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEZpbGVMaWtlT2JqZWN0XG5cdCAgICAgICAgICogQHBhcmFtIHtGaWxlfEhUTUxJbnB1dEVsZW1lbnR8T2JqZWN0fSBmaWxlT3JJbnB1dFxuXHQgICAgICAgICAqIEBjb25zdHJ1Y3RvclxuXHQgICAgICAgICAqL1xuXG5cdCAgICAgICAgZnVuY3Rpb24gRmlsZUxpa2VPYmplY3QoZmlsZU9ySW5wdXQpIHtcblx0ICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZpbGVMaWtlT2JqZWN0KTtcblxuXHQgICAgICAgICAgICB2YXIgaXNJbnB1dCA9IGlzRWxlbWVudChmaWxlT3JJbnB1dCk7XG5cdCAgICAgICAgICAgIHZhciBmYWtlUGF0aE9yT2JqZWN0ID0gaXNJbnB1dCA/IGZpbGVPcklucHV0LnZhbHVlIDogZmlsZU9ySW5wdXQ7XG5cdCAgICAgICAgICAgIHZhciBwb3N0Zml4ID0gaXNTdHJpbmcoZmFrZVBhdGhPck9iamVjdCkgPyBcIkZha2VQYXRoXCIgOiBcIk9iamVjdFwiO1xuXHQgICAgICAgICAgICB2YXIgbWV0aG9kID0gXCJfY3JlYXRlRnJvbVwiICsgcG9zdGZpeDtcblx0ICAgICAgICAgICAgdGhpc1ttZXRob2RdKGZha2VQYXRoT3JPYmplY3QpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIF9jcmVhdGVDbGFzcyhGaWxlTGlrZU9iamVjdCwge1xuXHQgICAgICAgICAgICBfY3JlYXRlRnJvbUZha2VQYXRoOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENyZWF0ZXMgZmlsZSBsaWtlIG9iamVjdCBmcm9tIGZha2UgcGF0aCBzdHJpbmdcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfY3JlYXRlRnJvbUZha2VQYXRoKHBhdGgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb2RpZmllZERhdGUgPSBudWxsO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gXCJsaWtlL1wiICsgcGF0aC5zbGljZShwYXRoLmxhc3RJbmRleE9mKFwiLlwiKSArIDEpLnRvTG93ZXJDYXNlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gcGF0aC5zbGljZShwYXRoLmxhc3RJbmRleE9mKFwiL1wiKSArIHBhdGgubGFzdEluZGV4T2YoXCJcXFxcXCIpICsgMik7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9jcmVhdGVGcm9tT2JqZWN0OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENyZWF0ZXMgZmlsZSBsaWtlIG9iamVjdCBmcm9tIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlfEZpbGVMaWtlT2JqZWN0fSBvYmplY3Rcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9jcmVhdGVGcm9tT2JqZWN0KG9iamVjdCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vZGlmaWVkRGF0ZSA9IGNvcHkob2JqZWN0Lmxhc3RNb2RpZmllZERhdGUpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSA9IG9iamVjdC5zaXplO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IG9iamVjdC50eXBlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IG9iamVjdC5uYW1lO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICByZXR1cm4gRmlsZUxpa2VPYmplY3Q7XG5cdCAgICB9KSgpO1xuXG5cdCAgICByZXR1cm4gRmlsZUxpa2VPYmplY3Q7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtdO1xuXG4vKioqLyB9LFxuLyogNSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHsgdmFyIHByb3AgPSBwcm9wc1trZXldOyBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTsgfSBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTsgfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5cdHZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdHZhciBjb3B5ID0gYW5ndWxhci5jb3B5O1xuXHR2YXIgZXh0ZW5kID0gYW5ndWxhci5leHRlbmQ7XG5cdHZhciBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50O1xuXHR2YXIgaXNFbGVtZW50ID0gYW5ndWxhci5pc0VsZW1lbnQ7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJGNvbXBpbGUsIEZpbGVMaWtlT2JqZWN0KSB7XG5cdCAgICB2YXIgRmlsZUl0ZW0gPSAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgRmlsZUl0ZW1cblx0ICAgICAgICAgKiBAcGFyYW0ge0ZpbGVVcGxvYWRlcn0gdXBsb2FkZXJcblx0ICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8SFRNTElucHV0RWxlbWVudHxPYmplY3R9IHNvbWVcblx0ICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgICAgICAgICAqIEBjb25zdHJ1Y3RvclxuXHQgICAgICAgICAqL1xuXG5cdCAgICAgICAgZnVuY3Rpb24gRmlsZUl0ZW0odXBsb2FkZXIsIHNvbWUsIG9wdGlvbnMpIHtcblx0ICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZpbGVJdGVtKTtcblxuXHQgICAgICAgICAgICB2YXIgaXNJbnB1dCA9IGlzRWxlbWVudChzb21lKTtcblx0ICAgICAgICAgICAgdmFyIGlucHV0ID0gaXNJbnB1dCA/IGVsZW1lbnQoc29tZSkgOiBudWxsO1xuXHQgICAgICAgICAgICB2YXIgZmlsZSA9ICFpc0lucHV0ID8gc29tZSA6IG51bGw7XG5cblx0ICAgICAgICAgICAgZXh0ZW5kKHRoaXMsIHtcblx0ICAgICAgICAgICAgICAgIHVybDogdXBsb2FkZXIudXJsLFxuXHQgICAgICAgICAgICAgICAgYWxpYXM6IHVwbG9hZGVyLmFsaWFzLFxuXHQgICAgICAgICAgICAgICAgaGVhZGVyczogY29weSh1cGxvYWRlci5oZWFkZXJzKSxcblx0ICAgICAgICAgICAgICAgIGZvcm1EYXRhOiBjb3B5KHVwbG9hZGVyLmZvcm1EYXRhKSxcblx0ICAgICAgICAgICAgICAgIHJlbW92ZUFmdGVyVXBsb2FkOiB1cGxvYWRlci5yZW1vdmVBZnRlclVwbG9hZCxcblx0ICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdXBsb2FkZXIud2l0aENyZWRlbnRpYWxzLFxuXHQgICAgICAgICAgICAgICAgbWV0aG9kOiB1cGxvYWRlci5tZXRob2Rcblx0ICAgICAgICAgICAgfSwgb3B0aW9ucywge1xuXHQgICAgICAgICAgICAgICAgdXBsb2FkZXI6IHVwbG9hZGVyLFxuXHQgICAgICAgICAgICAgICAgZmlsZTogbmV3IEZpbGVMaWtlT2JqZWN0KHNvbWUpLFxuXHQgICAgICAgICAgICAgICAgaXNSZWFkeTogZmFsc2UsXG5cdCAgICAgICAgICAgICAgICBpc1VwbG9hZGluZzogZmFsc2UsXG5cdCAgICAgICAgICAgICAgICBpc1VwbG9hZGVkOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzU3VjY2VzczogZmFsc2UsXG5cdCAgICAgICAgICAgICAgICBpc0NhbmNlbDogZmFsc2UsXG5cdCAgICAgICAgICAgICAgICBpc0Vycm9yOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIHByb2dyZXNzOiAwLFxuXHQgICAgICAgICAgICAgICAgaW5kZXg6IG51bGwsXG5cdCAgICAgICAgICAgICAgICBfZmlsZTogZmlsZSxcblx0ICAgICAgICAgICAgICAgIF9pbnB1dDogaW5wdXRcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgaWYgKGlucHV0KSB0aGlzLl9yZXBsYWNlTm9kZShpbnB1dCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2NyZWF0ZUNsYXNzKEZpbGVJdGVtLCB7XG5cdCAgICAgICAgICAgIHVwbG9hZDoge1xuXHQgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcblx0ICAgICAgICAgICAgICAgICAqIFBVQkxJQ1xuXHQgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFVwbG9hZHMgYSBGaWxlSXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1cGxvYWQoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlci51cGxvYWRJdGVtKHRoaXMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlci5fb25Db21wbGV0ZUl0ZW0odGhpcywgXCJcIiwgMCwgW10pO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLl9vbkVycm9ySXRlbSh0aGlzLCBcIlwiLCAwLCBbXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBjYW5jZWw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FuY2VscyB1cGxvYWRpbmcgb2YgRmlsZUl0ZW1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY2FuY2VsKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkZXIuY2FuY2VsSXRlbSh0aGlzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgcmVtb3ZlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJlbW92ZXMgYSBGaWxlSXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlci5yZW1vdmVGcm9tUXVldWUodGhpcyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQmVmb3JlVXBsb2FkOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkJlZm9yZVVwbG9hZCgpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uUHJvZ3Jlc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25Qcm9ncmVzcyhwcm9ncmVzcykge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25TdWNjZXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblN1Y2Nlc3MocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25FcnJvcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25FcnJvcihyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkNhbmNlbDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25DYW5jZWwocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25Db21wbGV0ZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25Db21wbGV0ZShyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25CZWZvcmVVcGxvYWQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG5cdCAgICAgICAgICAgICAgICAgKiBQUklWQVRFXG5cdCAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQmVmb3JlVXBsb2FkKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWFkeSA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGluZyA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGVkID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1N1Y2Nlc3MgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ2FuY2VsID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkJlZm9yZVVwbG9hZCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25Qcm9ncmVzczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25Qcm9ncmVzcyhwcm9ncmVzcykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSBwcm9ncmVzcztcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUHJvZ3Jlc3MocHJvZ3Jlc3MpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25TdWNjZXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uU3VjY2VzcyhyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1JlYWR5ID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGluZyA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRlZCA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1N1Y2Nlc3MgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDYW5jZWwgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRXJyb3IgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gMTAwO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25TdWNjZXNzKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25FcnJvcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vbkVycm9yKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUmVhZHkgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGVkID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDYW5jZWwgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRXJyb3IgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcihyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX29uQ2FuY2VsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQ2FuY2VsKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUmVhZHkgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGVkID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1N1Y2Nlc3MgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ2FuY2VsID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRXJyb3IgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gMDtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2FuY2VsKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25Db21wbGV0ZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vbkNvbXBsZXRlKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ29tcGxldGUocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVtb3ZlQWZ0ZXJVcGxvYWQpIHRoaXMucmVtb3ZlKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9kZXN0cm95OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIERlc3Ryb3lzIGEgRmlsZUl0ZW1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2Rlc3Ryb3koKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lucHV0KSB0aGlzLl9pbnB1dC5yZW1vdmUoKTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZm9ybSkgdGhpcy5fZm9ybS5yZW1vdmUoKTtcblx0ICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fZm9ybTtcblx0ICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5faW5wdXQ7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9wcmVwYXJlVG9VcGxvYWRpbmc6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUHJlcGFyZXMgdG8gdXBsb2FkaW5nXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcHJlcGFyZVRvVXBsb2FkaW5nKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmluZGV4IHx8ICsrdGhpcy51cGxvYWRlci5fbmV4dEluZGV4O1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWFkeSA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9yZXBsYWNlTm9kZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXBsYWNlcyBpbnB1dCBlbGVtZW50IG9uIGhpcyBjbG9uZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtKUUxpdGV8alF1ZXJ5fSBpbnB1dFxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3JlcGxhY2VOb2RlKGlucHV0KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGNsb25lID0gJGNvbXBpbGUoaW5wdXQuY2xvbmUoKSkoaW5wdXQuc2NvcGUoKSk7XG5cdCAgICAgICAgICAgICAgICAgICAgY2xvbmUucHJvcChcInZhbHVlXCIsIG51bGwpOyAvLyBGRiBmaXhcblx0ICAgICAgICAgICAgICAgICAgICBpbnB1dC5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcblx0ICAgICAgICAgICAgICAgICAgICBpbnB1dC5hZnRlcihjbG9uZSk7IC8vIHJlbW92ZSBqcXVlcnkgZGVwZW5kZW5jeVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICByZXR1cm4gRmlsZUl0ZW07XG5cdCAgICB9KSgpO1xuXG5cdCAgICByZXR1cm4gRmlsZUl0ZW07XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtcIiRjb21waWxlXCIsIFwiRmlsZUxpa2VPYmplY3RcIl07XG5cbi8qKiovIH0sXG4vKiA2ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajsgfTtcblxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGtleSBpbiBwcm9wcykgeyB2YXIgcHJvcCA9IHByb3BzW2tleV07IHByb3AuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKHByb3AudmFsdWUpIHByb3Aud3JpdGFibGUgPSB0cnVlOyB9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpOyB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cblx0dmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIGV4dGVuZCA9IGFuZ3VsYXIuZXh0ZW5kO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIEZpbGVEaXJlY3RpdmUgPSAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgaW5zdGFuY2Ugb2Yge0ZpbGVEaXJlY3RpdmV9IG9iamVjdFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMudXBsb2FkZXJcblx0ICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvcHRpb25zLmVsZW1lbnRcblx0ICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5ldmVudHNcblx0ICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5wcm9wXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlRGlyZWN0aXZlKG9wdGlvbnMpIHtcblx0ICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZpbGVEaXJlY3RpdmUpO1xuXG5cdCAgICAgICAgICAgIGV4dGVuZCh0aGlzLCBvcHRpb25zKTtcblx0ICAgICAgICAgICAgdGhpcy51cGxvYWRlci5fZGlyZWN0aXZlc1t0aGlzLnByb3BdLnB1c2godGhpcyk7XG5cdCAgICAgICAgICAgIHRoaXMuX3NhdmVMaW5rcygpO1xuXHQgICAgICAgICAgICB0aGlzLmJpbmQoKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZURpcmVjdGl2ZSwge1xuXHQgICAgICAgICAgICBiaW5kOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEJpbmRzIGV2ZW50cyBoYW5kbGVzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGJpbmQoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuZXZlbnRzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5ldmVudHNba2V5XTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmJpbmQoa2V5LCB0aGlzW3Byb3BdKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHVuYmluZDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBVbmJpbmRzIGV2ZW50cyBoYW5kbGVzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVuYmluZCgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5ldmVudHMpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnVuYmluZChrZXksIHRoaXMuZXZlbnRzW2tleV0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgZGVzdHJveToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBEZXN0cm95cyBkaXJlY3RpdmVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzW3RoaXMucHJvcF0uaW5kZXhPZih0aGlzKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzW3RoaXMucHJvcF0uc3BsaWNlKGluZGV4LCAxKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmluZCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZWxlbWVudCA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9zYXZlTGlua3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogU2F2ZXMgbGlua3MgdG8gZnVuY3Rpb25zXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfc2F2ZUxpbmtzKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmV2ZW50cykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZXZlbnRzW2tleV07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcF0gPSB0aGlzW3Byb3BdLmJpbmQodGhpcyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICByZXR1cm4gRmlsZURpcmVjdGl2ZTtcblx0ICAgIH0pKCk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogTWFwIG9mIGV2ZW50c1xuXHQgICAgICogQHR5cGUge09iamVjdH1cblx0ICAgICAqL1xuXHQgICAgRmlsZURpcmVjdGl2ZS5wcm90b3R5cGUuZXZlbnRzID0ge307XG5cblx0ICAgIHJldHVybiBGaWxlRGlyZWN0aXZlO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSBbXTtcblxuLyoqKi8gfSxcbi8qIDcgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIga2V5IGluIHByb3BzKSB7IHZhciBwcm9wID0gcHJvcHNba2V5XTsgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7IH0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuXHR2YXIgX2dldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikgeyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpOyB9IH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MgJiYgZGVzYy53cml0YWJsZSkgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH07XG5cblx0dmFyIF9pbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9O1xuXG5cdHZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdHZhciBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZDtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChGaWxlRGlyZWN0aXZlKSB7XG5cdCAgICB2YXIgRmlsZVNlbGVjdCA9IChmdW5jdGlvbiAoX0ZpbGVEaXJlY3RpdmUpIHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGluc3RhbmNlIG9mIHtGaWxlU2VsZWN0fSBvYmplY3Rcblx0ICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgICAgICAgICAqIEBjb25zdHJ1Y3RvclxuXHQgICAgICAgICAqL1xuXG5cdCAgICAgICAgZnVuY3Rpb24gRmlsZVNlbGVjdChvcHRpb25zKSB7XG5cdCAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGaWxlU2VsZWN0KTtcblxuXHQgICAgICAgICAgICB2YXIgZXh0ZW5kZWRPcHRpb25zID0gZXh0ZW5kKG9wdGlvbnMsIHtcblx0ICAgICAgICAgICAgICAgIC8vIE1hcCBvZiBldmVudHNcblx0ICAgICAgICAgICAgICAgIGV2ZW50czoge1xuXHQgICAgICAgICAgICAgICAgICAgICRkZXN0cm95OiBcImRlc3Ryb3lcIixcblx0ICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6IFwib25DaGFuZ2VcIlxuXHQgICAgICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgICAgIC8vIE5hbWUgb2YgcHJvcGVydHkgaW5zaWRlIHVwbG9hZGVyLl9kaXJlY3RpdmUgb2JqZWN0XG5cdCAgICAgICAgICAgICAgICBwcm9wOiBcInNlbGVjdFwiXG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKEZpbGVTZWxlY3QucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGV4dGVuZGVkT3B0aW9ucyk7XG5cblx0ICAgICAgICAgICAgaWYgKCF0aGlzLnVwbG9hZGVyLmlzSFRNTDUpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVBdHRyKFwibXVsdGlwbGVcIik7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgdGhpcy5lbGVtZW50LnByb3AoXCJ2YWx1ZVwiLCBudWxsKTsgLy8gRkYgZml4XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2luaGVyaXRzKEZpbGVTZWxlY3QsIF9GaWxlRGlyZWN0aXZlKTtcblxuXHQgICAgICAgIF9jcmVhdGVDbGFzcyhGaWxlU2VsZWN0LCB7XG5cdCAgICAgICAgICAgIGdldE9wdGlvbnM6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBvcHRpb25zXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRPcHRpb25zKCkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgZ2V0RmlsdGVyczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIGZpbHRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0FycmF5PEZ1bmN0aW9uPnxTdHJpbmd8dW5kZWZpbmVkfVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRGaWx0ZXJzKCkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNFbXB0eUFmdGVyU2VsZWN0aW9uOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElmIHJldHVybnMgXCJ0cnVlXCIgdGhlbiBIVE1MSW5wdXRFbGVtZW50IHdpbGwgYmUgY2xlYXJlZFxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRW1wdHlBZnRlclNlbGVjdGlvbigpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gISF0aGlzLmVsZW1lbnQuYXR0cihcIm11bHRpcGxlXCIpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkNoYW5nZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBFdmVudCBoYW5kbGVyXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ2hhbmdlKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlcyA9IHRoaXMudXBsb2FkZXIuaXNIVE1MNSA/IHRoaXMuZWxlbWVudFswXS5maWxlcyA6IHRoaXMuZWxlbWVudFswXTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJzID0gdGhpcy5nZXRGaWx0ZXJzKCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXBsb2FkZXIuaXNIVE1MNSkgdGhpcy5kZXN0cm95KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlci5hZGRUb1F1ZXVlKGZpbGVzLCBvcHRpb25zLCBmaWx0ZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5QWZ0ZXJTZWxlY3Rpb24oKSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucHJvcChcInZhbHVlXCIsIG51bGwpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZVdpdGgodGhpcy5lbGVtZW50ID0gdGhpcy5lbGVtZW50LmNsb25lKHRydWUpKTsgLy8gSUUgZml4XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICByZXR1cm4gRmlsZVNlbGVjdDtcblx0ICAgIH0pKEZpbGVEaXJlY3RpdmUpO1xuXG5cdCAgICByZXR1cm4gRmlsZVNlbGVjdDtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiRmlsZURpcmVjdGl2ZVwiXTtcblxuLyoqKi8gfSxcbi8qIDggKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIga2V5IGluIHByb3BzKSB7IHZhciBwcm9wID0gcHJvcHNba2V5XTsgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7IH0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuXHR2YXIgX2dldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikgeyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpOyB9IH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MgJiYgZGVzYy53cml0YWJsZSkgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH07XG5cblx0dmFyIF9pbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9O1xuXG5cdHZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdHZhciBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZDtcblx0dmFyIGZvckVhY2ggPSBhbmd1bGFyLmZvckVhY2g7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoRmlsZURpcmVjdGl2ZSkge1xuXHQgICAgdmFyIEZpbGVEcm9wID0gKGZ1bmN0aW9uIChfRmlsZURpcmVjdGl2ZSkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgaW5zdGFuY2Ugb2Yge0ZpbGVEcm9wfSBvYmplY3Rcblx0ICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgICAgICAgICAqIEBjb25zdHJ1Y3RvclxuXHQgICAgICAgICAqL1xuXG5cdCAgICAgICAgZnVuY3Rpb24gRmlsZURyb3Aob3B0aW9ucykge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZURyb3ApO1xuXG5cdCAgICAgICAgICAgIHZhciBleHRlbmRlZE9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge1xuXHQgICAgICAgICAgICAgICAgLy8gTWFwIG9mIGV2ZW50c1xuXHQgICAgICAgICAgICAgICAgZXZlbnRzOiB7XG5cdCAgICAgICAgICAgICAgICAgICAgJGRlc3Ryb3k6IFwiZGVzdHJveVwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGRyb3A6IFwib25Ecm9wXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZHJhZ292ZXI6IFwib25EcmFnT3ZlclwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGRyYWdsZWF2ZTogXCJvbkRyYWdMZWF2ZVwiXG5cdCAgICAgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICAgICAgLy8gTmFtZSBvZiBwcm9wZXJ0eSBpbnNpZGUgdXBsb2FkZXIuX2RpcmVjdGl2ZSBvYmplY3Rcblx0ICAgICAgICAgICAgICAgIHByb3A6IFwiZHJvcFwiXG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKEZpbGVEcm9wLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCBleHRlbmRlZE9wdGlvbnMpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIF9pbmhlcml0cyhGaWxlRHJvcCwgX0ZpbGVEaXJlY3RpdmUpO1xuXG5cdCAgICAgICAgX2NyZWF0ZUNsYXNzKEZpbGVEcm9wLCB7XG5cdCAgICAgICAgICAgIGdldE9wdGlvbnM6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBvcHRpb25zXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R8dW5kZWZpbmVkfVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRPcHRpb25zKCkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgZ2V0RmlsdGVyczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIGZpbHRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0FycmF5PEZ1bmN0aW9uPnxTdHJpbmd8dW5kZWZpbmVkfVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRGaWx0ZXJzKCkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25Ecm9wOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEV2ZW50IGhhbmRsZXJcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25Ecm9wKGV2ZW50KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZmVyID0gdGhpcy5fZ2V0VHJhbnNmZXIoZXZlbnQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICghdHJhbnNmZXIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgICAgICAgICAgICAgIH12YXIgb3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucygpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJzID0gdGhpcy5nZXRGaWx0ZXJzKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJldmVudEFuZFN0b3AoZXZlbnQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2godGhpcy51cGxvYWRlci5fZGlyZWN0aXZlcy5vdmVyLCB0aGlzLl9yZW1vdmVPdmVyQ2xhc3MsIHRoaXMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkZXIuYWRkVG9RdWV1ZSh0cmFuc2Zlci5maWxlcywgb3B0aW9ucywgZmlsdGVycyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uRHJhZ092ZXI6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRXZlbnQgaGFuZGxlclxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkRyYWdPdmVyKGV2ZW50KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZmVyID0gdGhpcy5fZ2V0VHJhbnNmZXIoZXZlbnQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5faGF2ZUZpbGVzKHRyYW5zZmVyLnR5cGVzKSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgICAgICAgICAgICAgfXRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmV2ZW50QW5kU3RvcChldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaCh0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzLm92ZXIsIHRoaXMuX2FkZE92ZXJDbGFzcywgdGhpcyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uRHJhZ0xlYXZlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEV2ZW50IGhhbmRsZXJcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25EcmFnTGVhdmUoZXZlbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuY3VycmVudFRhcmdldCA9PT0gdGhpcy5lbGVtZW50WzBdKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICAgICAgICAgICAgICB9dGhpcy5fcHJldmVudEFuZFN0b3AoZXZlbnQpO1xuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2godGhpcy51cGxvYWRlci5fZGlyZWN0aXZlcy5vdmVyLCB0aGlzLl9yZW1vdmVPdmVyQ2xhc3MsIHRoaXMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfZ2V0VHJhbnNmZXI6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSGVscGVyXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRUcmFuc2ZlcihldmVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudC5kYXRhVHJhbnNmZXIgPyBldmVudC5kYXRhVHJhbnNmZXIgOiBldmVudC5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2ZlcjsgLy8galF1ZXJ5IGZpeDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3ByZXZlbnRBbmRTdG9wOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEhlbHBlclxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcHJldmVudEFuZFN0b3AoZXZlbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfaGF2ZUZpbGVzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgXCJ0cnVlXCIgaWYgdHlwZXMgY29udGFpbnMgZmlsZXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaGF2ZUZpbGVzKHR5cGVzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlcykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgfWlmICh0eXBlcy5pbmRleE9mKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlcy5pbmRleE9mKFwiRmlsZXNcIikgIT09IC0xO1xuXHQgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZXMuY29udGFpbnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVzLmNvbnRhaW5zKFwiRmlsZXNcIik7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2FkZE92ZXJDbGFzczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfYWRkT3ZlckNsYXNzKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLmFkZE92ZXJDbGFzcygpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfcmVtb3ZlT3ZlckNsYXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9yZW1vdmVPdmVyQ2xhc3MoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVtb3ZlT3ZlckNsYXNzKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlRHJvcDtcblx0ICAgIH0pKEZpbGVEaXJlY3RpdmUpO1xuXG5cdCAgICByZXR1cm4gRmlsZURyb3A7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtcIkZpbGVEaXJlY3RpdmVcIl07XG5cbi8qKiovIH0sXG4vKiA5ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajsgfTtcblxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGtleSBpbiBwcm9wcykgeyB2YXIgcHJvcCA9IHByb3BzW2tleV07IHByb3AuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKHByb3AudmFsdWUpIHByb3Aud3JpdGFibGUgPSB0cnVlOyB9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpOyB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cblx0dmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQob2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHsgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpOyBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7IHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKHBhcmVudCA9PT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IGVsc2UgeyByZXR1cm4gZ2V0KHBhcmVudCwgcHJvcGVydHksIHJlY2VpdmVyKTsgfSB9IGVsc2UgaWYgKFwidmFsdWVcIiBpbiBkZXNjICYmIGRlc2Mud3JpdGFibGUpIHsgcmV0dXJuIGRlc2MudmFsdWU7IH0gZWxzZSB7IHZhciBnZXR0ZXIgPSBkZXNjLmdldDsgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTsgfSB9O1xuXG5cdHZhciBfaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfTtcblxuXHR2YXIgX2NsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHR2YXIgZXh0ZW5kID0gYW5ndWxhci5leHRlbmQ7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoRmlsZURpcmVjdGl2ZSkge1xuXHQgICAgdmFyIEZpbGVPdmVyID0gKGZ1bmN0aW9uIChfRmlsZURpcmVjdGl2ZSkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgaW5zdGFuY2Ugb2Yge0ZpbGVEcm9wfSBvYmplY3Rcblx0ICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgICAgICAgICAqIEBjb25zdHJ1Y3RvclxuXHQgICAgICAgICAqL1xuXG5cdCAgICAgICAgZnVuY3Rpb24gRmlsZU92ZXIob3B0aW9ucykge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZU92ZXIpO1xuXG5cdCAgICAgICAgICAgIHZhciBleHRlbmRlZE9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge1xuXHQgICAgICAgICAgICAgICAgLy8gTWFwIG9mIGV2ZW50c1xuXHQgICAgICAgICAgICAgICAgZXZlbnRzOiB7XG5cdCAgICAgICAgICAgICAgICAgICAgJGRlc3Ryb3k6IFwiZGVzdHJveVwiXG5cdCAgICAgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICAgICAgLy8gTmFtZSBvZiBwcm9wZXJ0eSBpbnNpZGUgdXBsb2FkZXIuX2RpcmVjdGl2ZSBvYmplY3Rcblx0ICAgICAgICAgICAgICAgIHByb3A6IFwib3ZlclwiLFxuXHQgICAgICAgICAgICAgICAgLy8gT3ZlciBjbGFzc1xuXHQgICAgICAgICAgICAgICAgb3ZlckNsYXNzOiBcIm52LWZpbGUtb3ZlclwiXG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKEZpbGVPdmVyLnByb3RvdHlwZSksIFwiY29uc3RydWN0b3JcIiwgdGhpcykuY2FsbCh0aGlzLCBleHRlbmRlZE9wdGlvbnMpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIF9pbmhlcml0cyhGaWxlT3ZlciwgX0ZpbGVEaXJlY3RpdmUpO1xuXG5cdCAgICAgICAgX2NyZWF0ZUNsYXNzKEZpbGVPdmVyLCB7XG5cdCAgICAgICAgICAgIGFkZE92ZXJDbGFzczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBBZGRzIG92ZXIgY2xhc3Ncblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkT3ZlckNsYXNzKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcyh0aGlzLmdldE92ZXJDbGFzcygpKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgcmVtb3ZlT3ZlckNsYXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJlbW92ZXMgb3ZlciBjbGFzc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVPdmVyQ2xhc3MoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKHRoaXMuZ2V0T3ZlckNsYXNzKCkpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBnZXRPdmVyQ2xhc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBvdmVyIGNsYXNzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRPdmVyQ2xhc3MoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub3ZlckNsYXNzO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSk7XG5cblx0ICAgICAgICByZXR1cm4gRmlsZU92ZXI7XG5cdCAgICB9KShGaWxlRGlyZWN0aXZlKTtcblxuXHQgICAgcmV0dXJuIEZpbGVPdmVyO1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSBbXCJGaWxlRGlyZWN0aXZlXCJdO1xuXG4vKioqLyB9LFxuLyogMTAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHBhcnNlLCBGaWxlVXBsb2FkZXIsIEZpbGVTZWxlY3QpIHtcblxuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcblx0ICAgICAgICAgICAgdmFyIHVwbG9hZGVyID0gc2NvcGUuJGV2YWwoYXR0cmlidXRlcy51cGxvYWRlcik7XG5cblx0ICAgICAgICAgICAgaWYgKCEodXBsb2FkZXIgaW5zdGFuY2VvZiBGaWxlVXBsb2FkZXIpKSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiXFxcIlVwbG9hZGVyXFxcIiBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIEZpbGVVcGxvYWRlclwiKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHZhciBvYmplY3QgPSBuZXcgRmlsZVNlbGVjdCh7XG5cdCAgICAgICAgICAgICAgICB1cGxvYWRlcjogdXBsb2FkZXIsXG5cdCAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIG9iamVjdC5nZXRPcHRpb25zID0gJHBhcnNlKGF0dHJpYnV0ZXMub3B0aW9ucykuYmluZChvYmplY3QsIHNjb3BlKTtcblx0ICAgICAgICAgICAgb2JqZWN0LmdldEZpbHRlcnMgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlcy5maWx0ZXJzO1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtcIiRwYXJzZVwiLCBcIkZpbGVVcGxvYWRlclwiLCBcIkZpbGVTZWxlY3RcIl07XG5cbi8qKiovIH0sXG4vKiAxMSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkcGFyc2UsIEZpbGVVcGxvYWRlciwgRmlsZURyb3ApIHtcblxuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcblx0ICAgICAgICAgICAgdmFyIHVwbG9hZGVyID0gc2NvcGUuJGV2YWwoYXR0cmlidXRlcy51cGxvYWRlcik7XG5cblx0ICAgICAgICAgICAgaWYgKCEodXBsb2FkZXIgaW5zdGFuY2VvZiBGaWxlVXBsb2FkZXIpKSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiXFxcIlVwbG9hZGVyXFxcIiBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIEZpbGVVcGxvYWRlclwiKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIGlmICghdXBsb2FkZXIuaXNIVE1MNSkgcmV0dXJuO1xuXG5cdCAgICAgICAgICAgIHZhciBvYmplY3QgPSBuZXcgRmlsZURyb3Aoe1xuXHQgICAgICAgICAgICAgICAgdXBsb2FkZXI6IHVwbG9hZGVyLFxuXHQgICAgICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudFxuXHQgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICBvYmplY3QuZ2V0T3B0aW9ucyA9ICRwYXJzZShhdHRyaWJ1dGVzLm9wdGlvbnMpLmJpbmQob2JqZWN0LCBzY29wZSk7XG5cdCAgICAgICAgICAgIG9iamVjdC5nZXRGaWx0ZXJzID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXMuZmlsdGVycztcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSBbXCIkcGFyc2VcIiwgXCJGaWxlVXBsb2FkZXJcIiwgXCJGaWxlRHJvcFwiXTtcblxuLyoqKi8gfSxcbi8qIDEyICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajsgfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEZpbGVVcGxvYWRlciwgRmlsZU92ZXIpIHtcblxuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcblx0ICAgICAgICAgICAgdmFyIHVwbG9hZGVyID0gc2NvcGUuJGV2YWwoYXR0cmlidXRlcy51cGxvYWRlcik7XG5cblx0ICAgICAgICAgICAgaWYgKCEodXBsb2FkZXIgaW5zdGFuY2VvZiBGaWxlVXBsb2FkZXIpKSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiXFxcIlVwbG9hZGVyXFxcIiBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIEZpbGVVcGxvYWRlclwiKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHZhciBvYmplY3QgPSBuZXcgRmlsZU92ZXIoe1xuXHQgICAgICAgICAgICAgICAgdXBsb2FkZXI6IHVwbG9hZGVyLFxuXHQgICAgICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudFxuXHQgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICBvYmplY3QuZ2V0T3ZlckNsYXNzID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXMub3ZlckNsYXNzIHx8IG9iamVjdC5vdmVyQ2xhc3M7XG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiRmlsZVVwbG9hZGVyXCIsIFwiRmlsZU92ZXJcIl07XG5cbi8qKiovIH1cbiBdKVxufSk7XG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmd1bGFyLWZpbGUtdXBsb2FkLmpzLm1hcFxuIiwiLy8gLS1BdXRob3IgTXVyYWdpamltYW5hIFJpY2hhcmQgPGJlYXN0YXI0NTdAZ21haWwuY29tPlxuLy8gdmFyIHN5bmMgPSBhbmd1bGFyLm1vZHVsZShcInN5bmNcIiwgW1wibmdSb3V0ZVwiLFwiYW5ndWxhckZpbGVVcGxvYWRcIixcImlvbmljXCIsXCJuZ1Jlc291cmNlXCIsXCJ1aS5ib290c3RyYXBcIixcImluZmluaXRlLXNjcm9sbFwiXSk7XG52YXIgTG9nZ2VyPWFuZ3VsYXIubW9kdWxlKFwiTG9nZ2VyXCIsW10pO1xuTG9nZ2VyLnJ1bihbJyRyb290U2NvcGUnLGZ1bmN0aW9uKCRyb290U2NvcGUpe1xuICAgICAgLy8gJHJvb3RTY29wZS5lbmRQb2ludD0naHR0cHM6Ly9zdHJlYW11cGJveC5jb20nO1xuICAgICAgJHJvb3RTY29wZS5lbmRQb2ludD0naHR0cDovL2xvY2FsaG9zdDo4MDAwJztcbn1dKVxuLmNvbnN0YW50KCdERUJVRycsdHJ1ZSk7XG5Mb2dnZXIuZGlyZWN0aXZlKCdzaWdudXAnLCBbZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlVXJsOidBcHAvc2NyaXB0cy92aWV3cy9zaWdudXAuaHRtbCdcbiAgfTtcbn1dKVxuLmRpcmVjdGl2ZSgnbG9naW4nLCBbZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlVXJsOidBcHAvc2NyaXB0cy92aWV3cy9sb2dpbi5odG1sJ1xuICB9O1xufV0pXG4uZGlyZWN0aXZlKCdzaG9ydGN1dCcsIFtmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGVVcmw6J0FwcC9zY3JpcHRzL3ZpZXdzL3Nob3J0Y3V0Lmh0bWwnXG4gIH07XG59XSk7XG5cbi8vcmVtb3ZlIGRlcGVuZGVjaWVzXG4vLyxcImluZmluaXRlLXNjcm9sbFwiLCBuZ2ZvbGRlckxpc3RzICduZy1tZmInIG5nQ29udGV4dE1lbnUgbmdEaWFsb2dcbmFuZ3VsYXIubW9kdWxlKFwic3luY1wiLCBbXCJuZ1JvdXRlXCIsXCJhbmd1bGFyRmlsZVVwbG9hZFwiLFwidWkuYm9vdHN0cmFwXCIsXCJ1aS5yb3V0ZXJcIiwnbmdNYXRlcmlhbCcsICdtYXRlcmlhbC5zdmdBc3NldHNDYWNoZScsXCJwYXNjYWxwcmVjaHQudHJhbnNsYXRlXCIsXCJ1aS5zZWxlY3RcIixcIm5nU2FuaXRpemVcIl0pXG4uY29uc3RhbnQoJ0RFQlVHJyx0cnVlKVxuXG4ucnVuKFsnJHJvb3RTY29wZScsJyRsb2cnLCckbG9jYXRpb24nLCdmb2xkZXJMaXN0cycsJyRzdGF0ZVBhcmFtcycsJ2NhY2hlRmFjdG9yeScsIGZ1bmN0aW9uKCRyb290U2NvcGUsJGxvZywkbG9jYXRpb24sZm9sZGVyTGlzdHMsJHN0YXRlUGFyYW1zLGNhY2hlRmFjdG9yeSl7XG4gICRyb290U2NvcGUuZW5kUG9pbnQ9J2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMCc7XG4gIHZhciBjYXNoZWRfZm9sZGVycyA9W10sXG4gICBmb2xkZXJfaWRzICAgICA9W107XG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICRyb290U2NvcGUuYWN0dWFsTG9jYXRpb24gPSAkbG9jYXRpb24ucGF0aCgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxvY2F0aW9uXCIrICRyb290U2NvcGUuYWN0dWFsTG9jYXRpb24pO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignaGFuZGxlJyxmdW5jdGlvbihlLHIpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygncm91dGUgd2l0aCBJZDonICsgcik7XG4gICAgICAgIH0pO1xuICAgIH0pOyAgICAgICAgXG5cbiAgICRyb290U2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtyZXR1cm4gJGxvY2F0aW9uLnBhdGgoKTt9LCBmdW5jdGlvbiAobmV3TG9jYXRpb24sIG9sZExvY2F0aW9uKSB7XG4gICAgIFxuICAgICAgICBpZigkcm9vdFNjb3BlLmFjdHVhbExvY2F0aW9uICE9PSBuZXdMb2NhdGlvbil7XG4gICAgICAgICAgICBjYXNoZWRfZm9sZGVycy5wdXNoKG5ld0xvY2F0aW9uKTtcbiAgICAgICAgICAgIGZvbGRlcl9pZHMucHVzaCgkc3RhdGVQYXJhbXMuZm9sZGVySWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmKG5ld0xvY2F0aW9uID09PSBcIi9GaWxlc1wiKXtcbiAgICAgICAgICBjYWNoZUZhY3RvcnkuZ2V0KCd1c2VyRGF0YScpO1xuICAgICAgICAgIGNhY2hlRmFjdG9yeS5yZW1vdmVBbGwoKTtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UuZm9sZGVyU3RydWN0dXJlID0nJztcbiAgICAgICAgICBjYXNoZWRfZm9sZGVycyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgXG4gICAgICAgIFxuICAgICAgICBpZigkcm9vdFNjb3BlLmFjdHVhbExvY2F0aW9uID09PSBuZXdMb2NhdGlvbikge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gY2FzaGVkX2ZvbGRlcnMuaW5kZXhPZihvbGRMb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgY2FzaGVkX2ZvbGRlcnMucG9wKGluZGV4KTtcbiAgICAgICAgICAgICB2YXIgaW5kZXhlck9mRm9sZGVyID0gZm9sZGVyX2lkcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgaW5kZXhlck9mRm9sZGVyID0gZm9sZGVyX2lkcy5wb3AoKTsvL2dvIGJhY2sgdHdpY2UgdG8gZ2V0IGN1cnJlbnQgZm9sZGVyIElkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJ2FwcDpvbjpicm93c2VyOmJhY2snLCBpbmRleGVyT2ZGb2xkZXIpO1xuICAgICAgICAgICAgZm9sZGVyTGlzdHMuYWRkRm9sZGVyKGNhc2hlZF9mb2xkZXJzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBmb2xkZXJMaXN0cy5hZGRGb2xkZXIoY2FzaGVkX2ZvbGRlcnMpO1xuICAgICAgICBjYWNoZUZhY3RvcnkucHV0KCdmb2xkZXJTdHJ1Y3R1cmUnLGNhc2hlZF9mb2xkZXJzKTtcbiAgICAgICAgLy8gaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2ZvbGRlclN0cnVjdHVyZScpICE9PW51bGwgfHwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2ZvbGRlclN0cnVjdHVyZScpICApe1xuXG4gICAgICAgIC8vIH1cbiAgICAgICAgXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdmb2xkZXJTdHJ1Y3R1cmUnLEpTT04uc3RyaW5naWZ5KGNhc2hlZF9mb2xkZXJzKSk7XG4gICAgICAgIC8vIGlmKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2ZvbGRlclN0cnVjdHVyZScpKS5sZW5ndGggPT09MCl7XG4gICAgICAgICAgXG4gICAgICAgIC8vIH1cbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZm9sZGVyU3RydWN0dXJlJykpKTtcbiAgICB9KTtcbn1dKVxuXG4uY29uZmlnKFsnJHNjZVByb3ZpZGVyJywnJGh0dHBQcm92aWRlcicsJyRtZFRoZW1pbmdQcm92aWRlcicsZnVuY3Rpb24oJHNjZVByb3ZpZGVyLCRodHRwUHJvdmlkZXIsJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG4gICAgZGVsZXRlICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtUmVxdWVzdGVkLVdpdGgnXTtcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucG9zdC5BY2NlcHQgPSAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0JztcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucG9zdC5BY2NlcHQgPSAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0JztcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uLmF1dGhvcml6YXRpb24gPSAnQmVhcmVyIDhFdXFjTU5rRjJ5UDUwRGljcHY5aExSUnA3V09TYWJQbEN1MjJsaVknO1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMudXNlWERvbWFpbiA9IHRydWU7XG4gICAgJHNjZVByb3ZpZGVyLmVuYWJsZWQoZmFsc2UpO1xuICAgIFxufV0pXG4uY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCckdXJsUm91dGVyUHJvdmlkZXInLGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsJHNjb3BlKXtcbiAgICAgICAgICBcbiAgICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgIC5zdGF0ZSgnSG9tZScsIHtcbiAgICAgICAgICAgIHVybDogXCIvRmlsZXNcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL0FwcC9zY3JpcHRzL3ZpZXdzL2ZpbGVzLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0ZpbGVzQ29udHJvbGxlcidcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdGF0ZSgncHJldmlldycsIHtcbiAgICAgICAgICAgIHVybDogJy8hLzpwcmV2aWV3LzpleHRlbnNpb24vOm9mLzp1c2VyJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL0FwcC9zY3JpcHRzL3ZpZXdzL2ZpbGVQcmV2aWV3Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciA6ICdwcmV2aWV3Q29udHJvbGxlcidcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdGF0ZSgnZm9sZGVyJywge1xuICAgICAgICAgICAgdXJsOiAnL3tmb2xkZXJOYW1lOlthLXpBLVowLTkvXSp9JyxcbiAgICAgICAgICAgIHBhcmFtczp7Zm9sZGVySWQ6bnVsbCxWaXNpYmxlTmFtZTpudWxsfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL0FwcC9zY3JpcHRzL3ZpZXdzL2ZpbGVzLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0ZvbGRlckNvbnRyb2xsZXInXG4gICAgICAgICAgfSkgXG4gICAgICAgICAgLnN0YXRlKCdHcm91cHMnLCB7XG4gICAgICAgICAgICAgdXJsOiBcIi9Hcm91cHNcIixcbiAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9BcHAvc2NyaXB0cy92aWV3cy9ncm91cHMuaHRtbCcsXG4gICAgICAgICAgICAgY29udHJvbGxlcjogJ0dyb3VwQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgcmVxdWlyZUxvZ2luOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL0ZpbGVzJyk7XG59XSlcbi8vYXBwbGljYXRpb24gY29tcG9uZW50c1xuLmRpcmVjdGl2ZSgnZmlsZXMnLCBbZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGVVcmw6ICcvQXBwL3NjcmlwdHMvdmlld3MvY29tcG9uZW50cy9maWxlcy5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsLCBhdHRyKSB7XG4gICAgICAvL2ltcGxlbWVudHMgaG92ZXIgb24gZmlsZXNcbiAgICAgIC8vIGVsLmhvdmVyKGZ1bmN0aW9uKCkge1xuICAgICAgIFxuICAgICAgLy8gICAkKFwiLnNoYXJlXCIpLmNzcyh7XG4gICAgICAvLyAgICAgZGlzcGxheTogJ2lubGluZScsXG4gICAgICAgICAgXG4gICAgICAvLyAgIH0pLmFkZENsYXNzKCdidG4gYnRuLXN1Y2Nlc3MnKTtcbiAgICAgIC8vIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgIC8vICAgJChcIi5zaGFyZVwiKS5oaWRlKCdzbG93JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgXG4gICAgICAvLyAgIH0pO1xuICAgICAgLy8gfSk7XG4gICAgfVxuICB9O1xufV0pXG4uZGlyZWN0aXZlKCdmb2xkZXJzJywgW2Z1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlVXJsOiAnL0FwcC9zY3JpcHRzL3ZpZXdzL2NvbXBvbmVudHMvZm9sZGVycy5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsLCBpQXR0cnMpIHtcbiAgICAgIC8vIGVsLmhvdmVyKGZ1bmN0aW9uKCkge1xuICAgICAgLy8gICAvKiBTdHVmZiB0byBkbyB3aGVuIHRoZSBtb3VzZSBlbnRlcnMgdGhlIGVsZW1lbnQgKi9cbiAgICAgIC8vICAgJChcIi5zaGFyZVwiKS5jc3Moe1xuICAgICAgLy8gICAgIGRpc3BsYXk6ICdpbmxpbmUnLFxuICAgICAgICAgIFxuICAgICAgLy8gICB9KS5hZGRDbGFzcygnYnRuIGJ0bi1zdWNjZXNzJyk7XG4gICAgICAvLyB9LCBmdW5jdGlvbigpIHtcbiAgICAgIC8vICAgJChcIi5zaGFyZVwiKS5oaWRlKCdzbG93JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgXG4gICAgICAvLyAgIH0pO1xuICAgICAgLy8gfSk7XG4gICAgfVxuICB9O1xufV0pO1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWRvbmUgd2l0aCBNdXJhZ2lqaW1hbmEgUmljaGFyZCA8YmVhc3RhcjQ1N0BnbWFpbC5jb20+LS0tLS0tLS0tLS0tLS0tLy9cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1kZWFsIHdpdGggdXNlcidzIGFjdGlvbnMgYW5kIGludGVyYWN0aW9uIHdpdGggb3RoZXIgdXNlcnMtLS0tLS0tLS0tLS0tLS0vL1xuIiwiLyogZ2xvYmFsICR3aW5kb3cgKi9cbi8qIGdsb2JhbCBMb2dnZXIgKi9cblxuTG9nZ2VyLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsWyckc2NvcGUnLCckaHR0cCcsJyRyb290U2NvcGUnLCckd2luZG93JywgZnVuY3Rpb24gKCRzY29wZSwkaHR0cCwkcm9vdFNjb3BlLCR3aW5kb3cpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgJ2NyZWRlZGVudGlhbC1ub3QtZm91bmQnICAgICAgIDogJ0NyZWRlbnRpYWxzIG5vdCBmb3VuZCEnLFxuICAgICAgICAnc3VjY2VzcycgICAgICAgICAgICAgICAgICAgICAgOiAnbG9nZ2luZyBpbi4uLidcbiAgICB9O1xuICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbiAoaW5mbylcbiAge1xuICAgIGZ1bmN0aW9uIG5vdFZlcmlmaWVkKCl7XG4gICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL25vdFZlcmlmaWVkJztcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVkaXJlY3RpbmcoKXtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9Ib21lJztcbiAgICB9XG4gICAgLy9iZWZvcmUgbm90aWZ5IHRoYXQgd2UgYXJlIGxvZ2dpbmdpblxuICAgICQoJy5sb2dpbi1mb3JtLW1haW4tbWVzc2FnZScpLmFkZENsYXNzKCdzaG93IHN1Y2Nlc3MnKS5odG1sKG9wdGlvbnMuc3VjY2Vzcyk7XG4gICAgJGh0dHAucG9zdCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9sb2dpbicsaW5mbylcbiAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIFxuICAgICAgICBpZihyZXNwb25zZSA9PT1cIjFcIil7XG4gICAgICAgICAgICByZWRpcmVjdGluZygpO1xuXG4gICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlID09PSBcIjBcIil7XG4gICAgICAgICAgICAgJCgnLmxvZ2luLWZvcm0tbWFpbi1tZXNzYWdlJykuYWRkQ2xhc3MoJ3Nob3cgZXJyb3InKS5odG1sKG9wdGlvbnNbJ2NyZWRlZGVudGlhbC1ub3QtZm91bmQnXSk7XG4gICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlID09PSBcIm5vdFZlcmlmaWVkXCIpe1xuICAgICAgICAgICAgbm90VmVyaWZpZWQoKTtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgLmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjonKyBlcnJvcik7XG4gICAgfSk7XG4gICAgXG4gIH07XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZShcIkxvZ2dlclwiKVxuLmNvbnRyb2xsZXIoJ1JlZ2lzdGVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywnJHJvb3RTY29wZScsJyRodHRwJywnREVCVUcnLGZ1bmN0aW9uICgkc2NvcGUsJHJvb3RTY29wZSwkaHR0cCxERUJVRykge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAncGFzc3dvcmQtbm90TWF0Y2gnOiAncGFzc3dvcmQgZG8gbm90IG1hdGNoJyxcbiAgICAgICAgJ1NpZ25VcEluUHJvZ3Jlc3MnIDogJ1dhaXQgd2UgYXJlIHNldHRpbmcgdXAgeW91ciBhY2NvdW50LidcbiAgICB9O1xuICAgIGZ1bmN0aW9uIG1lc3NhZ2VSZW1vdmUoKXtcbiAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLnJlbW92ZUNsYXNzKCdzaG93IGVycm9yJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlZGlyZWN0aW5nKCl7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSAnL2NoZWNrRW1haWwnO1xuICAgIH1cbiAgICAkc2NvcGUucmVnaXN0ZXI9ZnVuY3Rpb24odXNlcil7XG4gICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5hZGRDbGFzcygnc2hvdyBzdWNjZXNzJykuaHRtbChvcHRpb25zLlNpZ25VcEluUHJvZ3Jlc3MpO1xuICAgICAgICBpZigkKCcjcGFzc3dvcmQnKS52YWwoKSAhPT0gJCgnI3Bhc3N3b3JkLWNvbmZpcm0nKS52YWwoKSl7XG4gICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykuYWRkQ2xhc3MoJ3Nob3cgZXJyb3InKS5odG1sKG9wdGlvbnNbJ3Bhc3N3b3JkLW5vdE1hdGNoJ10pO1xuICAgICAgICAgIHNldFRpbWVvdXQobWVzc2FnZVJlbW92ZSwgMjAwMCk7XG4gICAgICAgICAgXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1c2VybmFtZT0kKCcjdXNlcm5hbWUnKS52YWwoKTtcbiAgICAgICAgdmFyIGVtYWlsPSQoJyNlbWFpbCcpLnZhbCgpO1xuXG5cbiAgICAgICAgalF1ZXJ5LnBvc3QoJy9yZWdpc3RlcicsIHt1c2VybmFtZTogdXNlcm5hbWUsIHBhc3N3b3JkOnVzZXIucGFzc3dvcmQsIGVtYWlsOmVtYWlsLCBvcHRpb246dXNlci5vcHRpb24sIHBob25lOnVzZXIucGhvbmV9LCBmdW5jdGlvbihkYXRhLCB0ZXh0U3RhdHVzLCB4aHIpIHtcbiAgICAgICAgICAgIGlmKGRhdGEuc3RhdHVzID09PSAyMDApe1xuICAgICAgICAgICAgICAgICByZWRpcmVjdGluZygpO1xuICAgICAgICAgICAgfWVsc2UgaWYoZGF0YSAhPT0yMDApe1xuICAgICAgICAgICAgICAgIGlmKERFQlVHID09PSB0cnVlKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbiBub3Qgc2lnbiB1cCF3aGF0P1wiKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd2UgYXJlIGZpcmVkIHRoaXMgY2FuIG5vdCBoYXBwZW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGlmKERFQlVHID09PSB0cnVlKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH07XG59XSk7XG5hbmd1bGFyLm1vZHVsZShcIkxvZ2dlclwiKVxuLmRpcmVjdGl2ZSgndW5pcXVlVXNlcm5hbWUnLCBbJ2lzVXNlcm5hbWVBdmFpbGFibGUnLGZ1bmN0aW9uKGlzVXNlcm5hbWVBdmFpbGFibGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xuICAgICAgICAgICAgbmdNb2RlbC4kYXN5bmNWYWxpZGF0b3JzLnVuaXF1ZVVzZXJuYW1lID0gaXNVc2VybmFtZUF2YWlsYWJsZTtcbiAgICAgICAgfVxuICAgIH07XG59XSk7XG5hbmd1bGFyLm1vZHVsZShcIkxvZ2dlclwiKVxuLmZhY3RvcnkoJ2lzVXNlcm5hbWVBdmFpbGFibGUnLCBbJyRxJywnJGh0dHAnLCckcm9vdFNjb3BlJyxmdW5jdGlvbigkcSwgJGh0dHAsJHJvb3RTY29wZSkge1xuICAgICBmdW5jdGlvbiBtZXNzYWdlUmVtb3ZlKCl7XG4gICAgICAgICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5yZW1vdmVDbGFzcygnc2hvdyBzdWNjZXNzJyk7XG4gICAgIH1cbiAgICAgIGZ1bmN0aW9uIHVzZXJuYW1lVGFrZW4oKXtcbiAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLnJlbW92ZUNsYXNzKCdzaG93IGVycm9yJyk7XG4gICAgICAgIH1cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgJ2J0bi1sb2FkaW5nJzogJzxpIGNsYXNzPVwiZmEgZmEtc3Bpbm5lciBmYS1wdWxzZVwiPjwvaT4nLFxuICAgICAgICAnYnRuLXN1Y2Nlc3MnOiAnPGkgY2xhc3M9XCJmYSBmYS1jaGVja1wiPjwvaT4nLFxuICAgICAgICAnYnRuLWVycm9yJzogJzxpIGNsYXNzPVwiZmEgZmEtcmVtb3ZlXCI+PC9pPicsXG4gICAgICAgICdtc2ctc3VjY2Vzcyc6ICdBbGwgR29vZCEgcmVkaXJlY3RpbmcuLi4nLFxuICAgICAgICAnbXNnLXVzZXJuYW1lLWF2YWlsYWJsZSc6ICdnb29kIHVzZXJuYW1lIGF2YWlsYWJsZSEnLFxuICAgICAgICAnbXNnLXVzZXJuYW1lLXRha2VuJyAgICA6ICdvb3BzIHVzZXJuYW1lIHRha2VuJyxcbiAgICAgICAgJ21zZy1lbWFpbC10YWtlbicgICAgICAgOiAnZW1haWwgdGFrZW4nLFxuICAgICAgICAnbXNnLXlvdXItcGhvbmUtc3VjaycgICA6ICd5b3VyIHBob25lIGlzIG5vdCB2YWxpZCcsXG4gICAgICAgICd1c2VBSkFYJzogdHJ1ZSxcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbih1c2VybmFtZSkge1xuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS91c2Vycz91c2VybmFtZT0nICsgdXNlcm5hbWUgKyAnJmFjY2Vzc190b2tlbj04RXVxY01Oa0YyeVA1MERpY3B2OWhMUlJwN1dPU2FiUGxDdTIybGlZJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGlmKGRhdGEgID09PSAnYXZhaWxhYmxlJyl7XG4gICAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykuYWRkQ2xhc3MoJ3Nob3cgc3VjY2VzcycpLmh0bWwob3B0aW9uc1snbXNnLXVzZXJuYW1lLWF2YWlsYWJsZSddKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KG1lc3NhZ2VSZW1vdmUsIDIwMDApO1xuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9ZWxzZSBpZihkYXRhID09PSAndGFrZW4nKXtcbiAgICAgICAgICAgICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5hZGRDbGFzcygnc2hvdyBlcnJvcicpLmh0bWwob3B0aW9uc1snbXNnLXVzZXJuYW1lLXRha2VuJ10pO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodXNlcm5hbWVUYWtlbiwgMjAwMCk7XG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgpO1xuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbn1dKTtcbmFuZ3VsYXIubW9kdWxlKFwiTG9nZ2VyXCIpXG4uZGlyZWN0aXZlKCd1bmlxdWVFbWFpbCcsIFsnaXNFbWFpbEF2YWlsYWJsZScsZnVuY3Rpb24oaXNFbWFpbEF2YWlsYWJsZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XG4gICAgICAgICAgICBuZ01vZGVsLiRhc3luY1ZhbGlkYXRvcnMudW5pcXVlRW1haWwgPSBpc0VtYWlsQXZhaWxhYmxlO1xuICAgICAgICB9XG4gICAgfTtcbn1dKTtcbmFuZ3VsYXIubW9kdWxlKFwiTG9nZ2VyXCIpXG4uZmFjdG9yeSgnaXNFbWFpbEF2YWlsYWJsZScsIFsnJHEnLCckaHR0cCcsJyRyb290U2NvcGUnLGZ1bmN0aW9uICgkcSwgJGh0dHAsICRyb290U2NvcGUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgJ2J0bi1sb2FkaW5nJzogJzxpIGNsYXNzPVwiZmEgZmEtc3Bpbm5lciBmYS1wdWxzZVwiPjwvaT4nLFxuICAgICAgICAnYnRuLXN1Y2Nlc3MnOiAnPGkgY2xhc3M9XCJmYSBmYS1jaGVja1wiPjwvaT4nLFxuICAgICAgICAnYnRuLWVycm9yJzogJzxpIGNsYXNzPVwiZmEgZmEtcmVtb3ZlXCI+PC9pPicsXG4gICAgICAgICdtc2ctc3VjY2Vzcyc6ICdBbGwgR29vZCEgcmVkaXJlY3RpbmcuLi4nLFxuICAgICAgICAnbXNnLXVzZXJuYW1lLWF2YWlsYWJsZSc6ICdnb29kIHVzZXJuYW1lIGF2YWlsYWJsZSEnLFxuICAgICAgICAnbXNnLXVzZXJuYW1lLXRha2VuJyAgICA6ICdvb3BzIHVzZXJuYW1lIHRha2VuJyxcbiAgICAgICAgJ21zZy1lbWFpbC10YWtlbicgICAgICAgOiAnZW1haWwgdGFrZW4nLFxuICAgICAgICAnbXNnLWVtYWlsLWF2YWlsYWJsZScgICA6ICdlbWFpbCBhdmFpbGFibGUnLFxuICAgICAgICAnbXNnLXlvdXItcGhvbmUtc3VjaycgICA6ICd5b3VyIHBob25lIGlzIG5vdCB2YWxpZCcsXG4gICAgICAgICd1c2VBSkFYJzogdHJ1ZSxcbiAgICB9O1xuICAgIGZ1bmN0aW9uIG1lc3NhZ2VFbWFpbFRha2VuKCl7XG4gICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLnJlbW92ZUNsYXNzKCdzaG93IGVycm9yJyk7XG4gICAgfVxuICAgICBmdW5jdGlvbiBtZXNzYWdlUmVtb3ZlKCl7XG4gICAgICAgICAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLnJlbW92ZUNsYXNzKCdzaG93IHN1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXG4gICAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvdXNlcnM/ZW1haWw9JyArIGVtYWlsICsgJyZhY2Nlc3NfdG9rZW49OEV1cWNNTmtGMnlQNTBEaWNwdjloTFJScDdXT1NhYlBsQ3UyMmxpWScpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG5cbiAgICAgICAgICAgIGlmKGRhdGEgPT09ICdlbWFpbC1hdmFpbGFibGUnKXtcbiAgICAgICAgICAgICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5hZGRDbGFzcygnc2hvdyBzdWNjZXNzJykuaHRtbChvcHRpb25zWydtc2ctZW1haWwtYXZhaWxhYmxlJ10pO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQobWVzc2FnZVJlbW92ZSwgMjAwMCk7XG4gICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgfWVsc2UgaWYoZGF0YSA9PT0gJ2VtYWlsLXRha2VuJyl7XG4gICAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykuYWRkQ2xhc3MoJ3Nob3cgZXJyb3InKS5odG1sKG9wdGlvbnNbJ21zZy1lbWFpbC10YWtlbiddKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KG1lc3NhZ2VFbWFpbFRha2VuLCAyMDAwKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcbiAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgfSk7XG4gICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N5bmMnKS5cbnNlcnZpY2UoJ0ZpbGVzJywgWyckaHR0cCcsJyRxJywnJHJvb3RTY29wZScsZnVuY3Rpb24gRmlsZXMgKCRodHRwLCRxLCRyb290U2NvcGUpIHtcbiAgICB0aGlzLmdldEdyb3VwRmlsZXMgPWZ1bmN0aW9uKGdyb3VwSWQpIHtcbiAgICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgLy9kb3duIGVuZHBvaW50IHJldHVybiBhbGwgZmlsZXMgSSBvd25cbiAgICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKycvYXBpL3YxL2dyb3Vwcy8nK2dyb3VwSWQrJy9ncm91cGZpbGVzJylcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5lcnJvcihmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdGhpcy5jcmVhenkgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAvL2Rvd24gZW5kcG9pbnQgcmV0dXJuIGFsbCBmaWxlcyBJIG93blxuICAgICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArJy9hcGkvdjEvPytxdWVyeT0nKydxdWVyeStGZXRjaFVzZXJzJytvYmplY3QpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9KVxuICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHRoaXMuc2luZ2xlID0gZnVuY3Rpb24oZmlsZSl7XG4gICAgICB2YXIgcHJvbWlzZSA9ICRxLmRlZmVyKCk7XG4gICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCsgJy9wcmV2aWV3LycrIGZpbGUpXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIHByb21pc2UucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycil7XG4gICAgICAgIHByb21pc2UucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlLnByb21pc2U7XG4gICAgfTtcbiAgICB0aGlzLmdldEJveEZpbGVzID0gZnVuY3Rpb24oZm9sZGVySWQpe1xuICAgICAgICB2YXIgZ3JvdXBJZCA9IDE7Ly9ieSBkZWZhdWx0IHRoaXMgY2FuIGJlIGFueSBudW1iZXJcbiAgICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgLy90aGUgaWRlYSBpcyB0byBnZXQgYSBmaWxlIGVpdGhlciBmcm9tIGdyb3VwcyBvciBpbmRpdmlkdWFsIGFjY291bnQgZ3JvdXAgaXMgb3B0aW9uYWxcbiAgICAgICAgLy8gY29uc29sZS5sb2coZm9sZGVySWQpO1xuICAgICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL2ZpbGVzLycrZ3JvdXBJZCsnL2JveGZpbGVzLycgK2ZvbGRlcklkKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIC8vICAgJHJvb3RTY29wZS4kZW1pdCgnZmlsZTpsaXN0Jyk7XG4gICAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB0aGlzLmdldE1pbWVUeXBlID0gZnVuY3Rpb24oZmlsZV9uYW1lKXtcbiAgICAgIHZhciBwcm9taXNlID0gJHEuZGVmZXIoKTtcbiAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvZmlsZXMvbWltZVR5cGUvJysgZmlsZV9uYW1lKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgIHByb21pc2UucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2UucHJvbWlzZTtcbiAgICB9O1xuICAgIHRoaXMuZG93bmxvYWRGaWxlID0gZnVuY3Rpb24oZmlsZV9uYW1lKXtcblxuICAgICAgdmFyIHByb21pc2UgPSAkcS5kZWZlcigpO1xuICAgICAgLy9oYXJkIGNvZGVkIGEgdXNlciBTdHJpbVVwISBuZWVkIHRvIGluamVjdCBoaW0gZHlhbWljYWxseVxuICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQrICcvYXBpL3YxL2ZpbGVzL2Rvd25sb2FkLycrZmlsZV9uYW1lKycvb2YvJysgJ1N0cmltVXAnKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICBwcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJvbWlzZS5wcm9taXNlO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG59XSk7XG4iLCJcblxuYW5ndWxhci5tb2R1bGUoJ3N5bmMnKS5zZXJ2aWNlKCdGb2xkZXInLCBbJyRodHRwJywgJyRxJywgJyRyb290U2NvcGUnLCBmdW5jdGlvbigkaHR0cCwgJHEsICRyb290U2NvcGUpIHtcblx0ICAgdGhpcy5jcmVhdGVGb2xkZXIgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHZhciBwcm9taXNzID0gJHEuZGVmZXIoKTtcbiAgICAgICAgJGh0dHAucG9zdCgkcm9vdFNjb3BlLmVuZFBvaW50ICsnL2FwaS92MS9mb2xkZXJzJyxuYW1lKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2ZvbGRlcjpsaXN0Jyk7XG4gICAgICAgICAgICAgICAgcHJvbWlzcy5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBwcm9taXNzLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzcy5wcm9taXNlO1xuICAgIH07XG4gICAgdGhpcy5nZXRGb2xkZXJzID0gZnVuY3Rpb24oRm9sZGVybmFtZXMpIHtcbiBcbiAgICAgICAgdmFyIHByb21pc3MgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArJy9hcGkvdjEvZm9sZGVycy9saXN0LycrRm9sZGVybmFtZXMpXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHByb21pc3MucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcHJvbWlzcy5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNzLnByb21pc2U7XG4gICAgfTtcblxuXG4gICAgIHRoaXMuZGVsZXRlRm9sZGVycyA9IGZ1bmN0aW9uKGZvbGRlcl9pZCkge1xuXG4gICAgICAgIHZhciBwcm9taXNzID0gJHEuZGVmZXIoKTtcbiAgICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKycvYXBpL3YxL2ZvbGRlcnMvZGVsZXRlLycrZm9sZGVyX2lkKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2ZvbGRlcjpsaXN0Jyk7XG4gICAgICAgICAgICAgICAgcHJvbWlzcy5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBwcm9taXNzLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc3MucHJvbWlzZTtcbiAgICB9O1xuXG4gIHJldHVybiB0aGlzO1xuXG59XSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdzeW5jJykuc2VydmljZSgnUGVvcGxlJywgWyckcScsJyRodHRwJywnJHJvb3RTY29wZScsZnVuY3Rpb24gKCRxLCAkaHR0cCwgJHJvb3RTY29wZSkge1xuXHR0aGlzLmdldCAgPSBmdW5jdGlvbiAoKXtcblx0XHR2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuXHRcdCRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvc3VnZ2VzdGlvbnMnKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuXHR0aGlzLmFsbElmb2xsb3cgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL2ZvbGxvd2luZ3MnKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fTtcblx0dGhpcy51bkZvbGxvdyA9IGZ1bmN0aW9uKGlkKXtcblx0XHR2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuXHRcdCRodHRwLmRlbGV0ZSgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZm9sbG93aW5nLycgK2lkKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fTtcblx0dGhpcy5mb2xsb3cgPSBmdW5jdGlvbihwYXJhbSl7XG5cdFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5wdXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL2ZvbGxvd2luZ3MnLCBwYXJhbSlcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuXHRyZXR1cm4gdGhpcztcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdzeW5jJykuc2VydmljZSgnU01TJyxbJyRodHRwJywnJHEnLCckcm9vdFNjb3BlJyxmdW5jdGlvbigkaHR0cCwkcSwkcm9vdFNjb3BlKXtcbiAgdGhpcy5zZW5kICA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgIHZhciBkaWZmZXIgPSAkcS5kZWZlcigpO1xuICAgICRodHRwLnBvc3QoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lc3NhZ2VzL3NlbmQnLG1lc3NhZ2UpXG4gICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgZGlmZmVyLnJlc29sdmUocmVzcG9uc2UpO1xuICAgIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgIGRpZmZlci5yZWplY3QoZXJyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGlmZmVyLnByb21pc2U7XG4gIH07XG4gIHJldHVybiB0aGlzO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuLnNlcnZpY2UoJ1NoYXJlJyxbJyRsb2cnLCckaHR0cCcsJyRxJywnJHJvb3RTY29wZScsIGZ1bmN0aW9uICgkbG9nLCRodHRwLCRxLCRyb290U2NvcGUpIHtcblx0dGhpcy5zaGFyZSA9IGZ1bmN0aW9uKHNoYXJlYmxlT2JqKXtcblx0XHR2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5wb3N0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9zaGFyZScsc2hhcmVibGVPYmopXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9KVxuICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG5cdH07XG5cdHRoaXMuZ2V0VXNlciA9IGZ1bmN0aW9uKHVzZXIpe1xuXG5cdFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL3VzZXJzLycrIHVzZXIpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyKXtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnIpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuXHR0aGlzLmZpbGVNaW1lID0gZnVuY3Rpb24oZmlsZSl7XG5cdFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21pbWVUeXBlLycrIGZpbGUpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyKXtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnIpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuICAgIHJldHVybiB0aGlzO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdzeW5jJylcbi5zZXJ2aWNlKCdmb2xkZXJMaXN0cycsIFsnJHJvb3RTY29wZScsZnVuY3Rpb24oJHJvb3RTY29wZSkge1xuICB2YXIgZm9sZGVyTGlzdHMgPSB7fTtcblxuLy8gICBmb2xkZXJMaXN0cy5saXN0ID0gW107XG5cbiAgZm9sZGVyTGlzdHMuYWRkID0gZnVuY3Rpb24oZm9sZGVyTGlzdCl7XG4gICBcbiAgICAkcm9vdFNjb3BlLiRlbWl0KFwiZm9sZGVyOnN0cnVjdHVyZVwiLCBmb2xkZXJMaXN0KTtcbiAgfTtcbiAgIGZvbGRlckxpc3RzLmFkZEZvbGRlciA9IGZ1bmN0aW9uKGZvbGRlckxpc3Qpe1xuICAgXG4gICAgLy8gY29uc29sZS5sb2coJ3dhaXRpbmcuLi4uJyk7XG4gICAgJHJvb3RTY29wZS4kZW1pdChcImZvbGRlcjpzdHJ1Y3R1cmVcIiwgZm9sZGVyTGlzdCk7XG4gIH07XG4gIHJldHVybiBmb2xkZXJMaXN0cztcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uc2VydmljZSgnU3ViRm9sZGVyJywgWyckaHR0cCcsICckcScsICckcm9vdFNjb3BlJywgZnVuY3Rpb24oJGh0dHAsICRxLCAkcm9vdFNjb3BlKSBcblx0e1xuXG5cblx0dGhpcy5jcmVhdGVTdWJGb2xkZXIgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHZhciBwcm9taXNzID0gJHEuZGVmZXIoKTtcbiAgICAgICAgJGh0dHAucG9zdCgkcm9vdFNjb3BlLmVuZFBvaW50ICsnL2FwaS92MS9zdWJmb2xkZXInLG5hbWUpXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHByb21pc3MucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcHJvbWlzcy5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNzLnByb21pc2U7XG4gICAgfTtcbiAgICB0aGlzLmdldFN1YkZvbGRlcnMgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICB2YXIgcHJvbWlzcyA9ICRxLmRlZmVyKCk7XG4gICAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsnL2FwaS92MS9zdWJmb2xkZXIvbGlzdC8nK2lkKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2UpIFxuXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcHJvbWlzcy5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBwcm9taXNzLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc3MucHJvbWlzZTtcbiAgICB9O1xuICAgIFxuXG4gIHJldHVybiB0aGlzO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdzeW5jJylcbi5zZXJ2aWNlKCdUZXN0JyxbZnVuY3Rpb24oKXtcbiAgICB0aGlzLnRlc3RpbmdNZXRob2QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtuYW1lOidyaWNoYXJkJ307XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnc3luYycpLnNlcnZpY2UoJ1VzZXInLCBbJyRodHRwJywnJHEnLCckcm9vdFNjb3BlJyxmdW5jdGlvbiBGaWxlcyAoJGh0dHAsJHEsJHJvb3RTY29wZSkge1xuXHR0aGlzLmdldFVzZXJJZCA9IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHByb21pc2UgPSAkcS5kZWZlcigpO1xuXHRcdCRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICtcIi9hcGkvdjEvdXNlcnMvaWRcIilcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXMpe1xuXHRcdFx0cHJvbWlzZS5yZXNvbHZlKHJlcyk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oKSB7XG5cdFx0XHRwcm9taXNlLnJlamVjdCgpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBwcm9taXNlLnByb21pc2U7XG5cdH07XG5cdHRoaXMuZ2V0VXNlcm5hbWUgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBwcm9taXNlID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArXCIvYXBpL3YxL3VzZXJzL3VzZXJuYW1lXCIpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKXtcblx0XHRcdHByb21pc2UucmVzb2x2ZShyZXMpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKCkge1xuXHRcdFx0cHJvbWlzZS5yZWplY3QoKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gcHJvbWlzZS5wcm9taXNlO1xuXHR9O1xuXHR0aGlzLmdyb3VwcyA9IGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZ3JvdXBzJylcbiAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycil7XG4gICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9O1xuXG5cdHJldHVybiB0aGlzO1xufV0pO1xuIiwiLyogZ2xvYmFsIHN5bmMgKi9cbmFuZ3VsYXIubW9kdWxlKCdzeW5jJylcbi5zZXJ2aWNlKCdOb3RpZmljYXRpb24nLCBbJyRodHRwJywgJyRxJywgJyRyb290U2NvcGUnLCBmdW5jdGlvbiBOb3RpZmljYXRpb24oJGh0dHAsICRxLCAkcm9vdFNjb3BlKSB7XG4gICAgdGhpcy5nZXROb3RpZmljYXRpb24gPSBmdW5jdGlvbiAodXNlcl9pZCkge1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL25vdGlmaWNhdGlvbnMnLCB7Y2FjaGU6IGZhbHNlfSlcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdGhpcy5jcmVhdGVOb3RpZmljYXRpb24gPSBmdW5jdGlvbiAoTm90aWZpY2F0aW9uKSB7XG4gICAgICAgIHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICRodHRwLnBvc3QoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL25vdGlmaWNhdGlvbnMnLCBOb3RpZmljYXRpb24pXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHRoaXMuZGVsZXRlTm90aWZpY2F0aW9uID0gZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5kZWxldGUoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL25vdGlmaWNhdGlvbnMvJyArIG5vdGlmaWNhdGlvbilcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uY29udHJvbGxlcignbm90aWZpY2F0aW9uQ29udHJvbGxlcicsIFsnJHNjb3BlJywnTm90aWZpY2F0aW9uJywnJGxvZycsIGZ1bmN0aW9uICgkc2NvcGUsTm90aWZpY2F0aW9uLCRsb2cpIHtcbiAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5nZXROb3RpZmljYXRpb24oKTtcbiAgICB9O1xuICAgICRzY29wZS5jbGVhck5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbil7XG5cblxuICAgICAgTm90aWZpY2F0aW9uLmNsZWFyTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbilcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgLy9sb2FkIHJlbWFpbmluZyBub3RpZmljYXRpb25cbiAgICAgICAgJHNjb3BlLmdldE5vdGlmaWNhdGlvbigpO1xuICAgICAgfSxmdW5jdGlvbihlcnIpe1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuZ2V0Tm90aWZpY2F0aW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgTm90aWZpY2F0aW9uLmdldE5vdGlmaWNhdGlvbigpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAvLyAkbG9nLmluZm8ocmVzdWx0KTtcbiAgICAgICAgICAgICRzY29wZS5ub3RpZmljYXRpb25zID0gcmVzdWx0O1xuICAgICAgICAgICAgXG4gICAgICAgIH0sZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgLy8gJGxvZy5pbmZvKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuaW5pdCgpO1xufV0pO1xuYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuLmRpcmVjdGl2ZSgnbm90aWZ5JyxbZnVuY3Rpb24oKXtcbiAgZnVuY3Rpb24gbm90aWZ5QnJvd3Nlcih0aXRsZSxkZXNjLHVybClcbiAgICAgIHtcbiAgICAgICAgaWYgKCFOb3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEZXNrdG9wIG5vdGlmaWNhdGlvbnMgbm90IGF2YWlsYWJsZSBpbiB5b3VyIGJyb3dzZXIuLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uICE9PSBcImdyYW50ZWRcIil7XG4gICAgICAgICAgTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIG5vdGlmaWNhdGlvbiA9IG5ldyBOb3RpZmljYXRpb24odGl0bGUsIHtcbiAgICAgICAgICAgIGljb246J2h0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8tYUNGaUs0YmFYWDQvVmptR0pvanNRX0kvQUFBQUFBQUFOSmcvaC1zTFZYMU01ekEvczQ4LUljNDIvZWdnc21hbGwucG5nJyxcbiAgICAgICAgICAgIGJvZHk6IGRlc2MsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBSZW1vdmUgdGhlIG5vdGlmaWNhdGlvbiBmcm9tIE5vdGlmaWNhdGlvbiBDZW50ZXIgd2hlbiBjbGlja2VkLlxuICAgICAgICBub3RpZmljYXRpb24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIENhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gdGhlIG5vdGlmaWNhdGlvbiBpcyBjbG9zZWQuXG4gICAgICAgIG5vdGlmaWNhdGlvbi5vbmNsb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3RpZmljYXRpb24gY2xvc2VkJyk7XG4gICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgcmV0dXJue1xuICAgIHJlc3RyaWN0OidBRScsXG4gICAgc2NvcGU6e1xuXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWwsIGlBdHRycyl7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIHZhciB0aXRsZT0nVGhpcyB3aWxsIGJlIHRpdGxlJztcbiAgICAgICAgICAgICAgdmFyIGRlc2M9J01vc3QgcG9wdWxhciBhcnRpY2xlLic7XG4gICAgICAgICAgICAgIHZhciB1cmw9J3N5bmMuY29tOjgwMDAnO1xuICAgICAgICAgICAgICBub3RpZnlCcm93c2VyKHRpdGxlLGRlc2MsdXJsKTtcbiAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgaWYgKE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uICE9PSBcImdyYW50ZWRcIil7XG4gICAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBcbiAgICB9XG4gIH07XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uZmFjdG9yeSgndXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhtZXNzYWdlLCBcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHdhcm46IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0b2FzdHIud2FybmluZyhtZXNzYWdlLCBcIkhleVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5mbzogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRvYXN0ci5pbmZvKG1lc3NhZ2UsIFwiRllJXCIpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtZXNzYWdlLCBcIk9oIE5vXCIpO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuLmZhY3RvcnkoJ3VzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MobWVzc2FnZSwgXCJTdWNjZXNzXCIpO1xuICAgICAgICB9LFxuICAgICAgICB3YXJuOiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdG9hc3RyLndhcm5pbmcobWVzc2FnZSwgXCJIZXlcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGluZm86IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0b2FzdHIuaW5mbyhtZXNzYWdlLCBcIkZZSVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IobWVzc2FnZSwgXCJPaCBOb1wiKTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdzeW5jJylcbi5jb250cm9sbGVyKCdkaWFsb2dDb250cm9sbGVyJywgWyckc2NvcGUnLCckdWliTW9kYWwnLCckbWREaWFsb2cnLCckbWRNZWRpYScsJ3VybFNob3J0ZW5lcicsJ1NoYXJlJywnVXNlcicsIGZ1bmN0aW9uICgkc2NvcGUsJHVpYk1vZGFsLCAkbWREaWFsb2csICRtZE1lZGlhLHVybFNob3J0ZW5lcixTaGFyZSxVc2VyKSB7XG5cdC8qKiogdXBsb2FkIG1vZGFsIHRlbXBsYXRlXG5cdCAqIEB1cGxvYWQudHBsLmh0bWwgXG5cdCAqIEBubyBwYXJhbSByZXF1aXJlc1xuXHQgKiBAY2FuY2VsIGRpYWxvZ0NvbnRyb2xsZXIgZnVuY3Rpb24gdGhhdCBpcyBzaGFyZWQgYW1vbmcgYWxsIGZ1bmN0aW9uXG5cdCoqL1xuXHR2YXIgRGlhbG9nQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsICRtZERpYWxvZykge1xuXHQgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKSB7XG5cdCAgICAkbWREaWFsb2cuaGlkZSgpO1xuXHQgIH07XG5cdCAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHQgICAgJG1kRGlhbG9nLmNhbmNlbCgpO1xuXHQgIH07XG5cdCBcblx0fTtcblx0JHNjb3BlLmN1c3RvbUZ1bGxzY3JlZW4gPSAkbWRNZWRpYSgneHMnKSB8fCAkbWRNZWRpYSgnc20nKTtcblxuXHQvKipcblx0ICogZW5kIG9mIHNoYXJlZCBmdW5jdGlvblxuXHQgKi9cblxuXHQkc2NvcGUudXBsb2FkID0gZnVuY3Rpb24oZXYpIHtcblx0ICAkbWREaWFsb2cuc2hvdyh7XG5cdFx0ICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcblx0ICAgIGNvbnRyb2xsZXI6IERpYWxvZ0NvbnRyb2xsZXIsXG5cdCAgICB0ZW1wbGF0ZVVybDogJy9BcHAvc2NyaXB0cy92aWV3cy91cGxvYWQudHBsLmh0bWwnLFxuXHQgICAgY2xpY2tPdXRzaWRlVG9DbG9zZTpmYWxzZVxuXHQgIH0pLmNhdGNoKCk7XG5cdH07XG5cdFxuXG4vKiplbmQgb2YgZnVuY3Rpb25cbiAqIFxuKi9cblxuJHNjb3BlLnNoYXJlRm9sZGVyID0gZnVuY3Rpb24oZm9sZGVyX2lkKSB7XG5cdCRtZERpYWxvZy5zaG93KHtcblx0XHQgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxuXHQgICAgY29udHJvbGxlcjogRGlhbG9nQ29udHJvbGxlcixcblx0ICAgIHRlbXBsYXRlVXJsOiAnL0FwcC9zY3JpcHRzL3ZpZXdzL3NoYXJlLnRwbC5odG1sJyxcblx0ICAgIGNsaWNrT3V0c2lkZVRvQ2xvc2U6ZmFsc2Vcblx0ICB9KS5jYXRjaCgpO1xuXG5cdFxufTtcblxuXG59XSk7XG4iLCI7KGZ1bmN0aW9uKHdpbmRvdywgYW5ndWxhciwgdW5kZWZpbmVkKSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBtZmIgPSBhbmd1bGFyLm1vZHVsZSgnbmctbWZiJywgW10pO1xuXG4gIG1mYi5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCduZy1tZmItbWVudS1kZWZhdWx0LnRwbC5odG1sJyxcbiAgICAgICc8dWwgY2xhc3M9XCJtZmItY29tcG9uZW50LS17e3Bvc2l0aW9ufX0gbWZiLXt7ZWZmZWN0fX1cIicgK1xuICAgICAgJyAgICBkYXRhLW1mYi10b2dnbGU9XCJ7e3RvZ2dsaW5nTWV0aG9kfX1cIiBkYXRhLW1mYi1zdGF0ZT1cInt7bWVudVN0YXRlfX1cIj4nICtcbiAgICAgICcgIDxsaSBjbGFzcz1cIm1mYi1jb21wb25lbnRfX3dyYXBcIj4nICtcbiAgICAgICcgICAgPGEgbmctY2xpY2s9XCJjbGlja2VkKClcIiBuZy1tb3VzZWVudGVyPVwiaG92ZXJlZCgpXCIgbmctbW91c2VsZWF2ZT1cImhvdmVyZWQoKVwiJyArXG4gICAgICAnICAgICAgIG5nLWF0dHItZGF0YS1tZmItbGFiZWw9XCJ7e2xhYmVsfX1cIiBjbGFzcz1cIm1mYi1jb21wb25lbnRfX2J1dHRvbi0tbWFpblwiPicgK1xuICAgICAgJyAgICAgPGkgY2xhc3M9XCJtZmItY29tcG9uZW50X19tYWluLWljb24tLXJlc3Rpbmcge3tyZXN0aW5nfX1cIj48L2k+JyArXG4gICAgICAnICAgICA8aSBjbGFzcz1cIm1mYi1jb21wb25lbnRfX21haW4taWNvbi0tYWN0aXZlIHt7YWN0aXZlfX1cIj48L2k+JyArXG4gICAgICAnICAgIDwvYT4nICtcbiAgICAgICcgICAgPHVsIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fbGlzdFwiIG5nLXRyYW5zY2x1ZGU+JyArXG4gICAgICAnICAgIDwvdWw+JyArXG4gICAgICAnPC9saT4nICtcbiAgICAgICc8L3VsPidcbiAgICApO1xuXG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCduZy1tZmItbWVudS1tZC50cGwuaHRtbCcsXG4gICAgICAnPHVsIGNsYXNzPVwibWZiLWNvbXBvbmVudC0te3twb3NpdGlvbn19IG1mYi17e2VmZmVjdH19XCInICtcbiAgICAgICcgICAgZGF0YS1tZmItdG9nZ2xlPVwie3t0b2dnbGluZ01ldGhvZH19XCIgZGF0YS1tZmItc3RhdGU9XCJ7e21lbnVTdGF0ZX19XCI+JyArXG4gICAgICAnICA8bGkgY2xhc3M9XCJtZmItY29tcG9uZW50X193cmFwXCI+JyArXG4gICAgICAnICAgIDxhIG5nLWNsaWNrPVwiY2xpY2tlZCgpXCIgbmctbW91c2VlbnRlcj1cImhvdmVyZWQoKVwiIG5nLW1vdXNlbGVhdmU9XCJob3ZlcmVkKClcIicgK1xuICAgICAgJyAgICAgICBzdHlsZT1cImJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyBib3gtc2hhZG93OiBub25lO1wiJyArXG4gICAgICAnICAgICAgIG5nLWF0dHItZGF0YS1tZmItbGFiZWw9XCJ7e2xhYmVsfX1cIiBjbGFzcz1cIm1mYi1jb21wb25lbnRfX2J1dHRvbi0tbWFpblwiPicgK1xuICAgICAgJyAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWZhYiBtZC1hY2NlbnRcIiBhcmlhLWxhYmVsPXt7bGFiZWx9fSBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlOyBtYXJnaW46IDA7IHBhZGRpbmc6MDtcIj4nICtcbiAgICAgICcgICAgICAgPG1kLWljb24gc3R5bGU9XCJsZWZ0OiAwOyBwb3NpdGlvbjogcmVsYXRpdmU7XCIgbWQtc3ZnLWljb249XCJ7e3Jlc3Rpbmd9fVwiJyArXG4gICAgICAnICAgICAgICAgY2xhc3M9XCJtZmItY29tcG9uZW50X19tYWluLWljb24tLXJlc3RpbmdcIj48L21kLWljb24+JyArXG4gICAgICAnICAgICAgIDxtZC1pY29uIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7XCIgbWQtc3ZnLWljb249XCJ7e2FjdGl2ZX19XCInICtcbiAgICAgICcgICAgICAgICBjbGFzcz1cIm1mYi1jb21wb25lbnRfX21haW4taWNvbi0tYWN0aXZlXCI+PC9tZC1pY29uPicgK1xuICAgICAgJyAgICAgPC9tZC1idXR0b24+JyArXG4gICAgICAnICAgIDwvYT4nICtcbiAgICAgICcgICAgPHVsIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fbGlzdFwiIG5nLXRyYW5zY2x1ZGU+JyArXG4gICAgICAnICAgIDwvdWw+JyArXG4gICAgICAnPC9saT4nICtcbiAgICAgICc8L3VsPidcbiAgICApO1xuXG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCduZy1tZmItYnV0dG9uLWRlZmF1bHQudHBsLmh0bWwnLFxuICAgICAgJzxsaT4nICtcbiAgICAgICcgIDxhIGRhdGEtbWZiLWxhYmVsPVwie3tsYWJlbH19XCIgY2xhc3M9XCJtZmItY29tcG9uZW50X19idXR0b24tLWNoaWxkXCI+JyArXG4gICAgICAnICAgIDxpIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fY2hpbGQtaWNvbiB7e2ljb259fVwiPicgK1xuICAgICAgJyAgICA8L2k+JyArXG4gICAgICAnICA8L2E+JyArXG4gICAgICAnPC9saT4nXG4gICAgKTtcblxuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbmctbWZiLWJ1dHRvbi1tZC50cGwuaHRtbCcsXG4gICAgICAnPGxpPicgK1xuICAgICAgJyAgPGEgaHJlZj1cIlwiIGRhdGEtbWZiLWxhYmVsPVwie3tsYWJlbH19XCIgY2xhc3M9XCJtZmItY29tcG9uZW50X19idXR0b24tLWNoaWxkXCIgJyArXG4gICAgICAnICAgICBzdHlsZT1cImJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyBib3gtc2hhZG93OiBub25lO1wiPicgK1xuICAgICAgJyAgICAgPG1kLWJ1dHRvbiBzdHlsZT1cIm1hcmdpbjogMDtcIiBjbGFzcz1cIm1kLWZhYiBtZC1hY2NlbnRcIiBhcmlhLWxhYmVsPXt7bGFiZWx9fT4nICtcbiAgICAgICcgICAgICAgPG1kLWljb24gbWQtc3ZnLXNyYz1cImltZy9pY29ucy9hbmRyb2lkLnN2Z1wiPjwvbWQtaWNvbj4nICtcbiAgICAgICcgICAgICAgPG1kLWljb24gbWQtc3ZnLWljb249XCJ7e2ljb259fVwiPjwvbWQtaWNvbj4nICtcbiAgICAgICcgICAgIDwvbWQtYnV0dG9uPicgK1xuICAgICAgJyAgPC9hPicgK1xuICAgICAgJzwvbGk+J1xuICAgICk7XG4gIH1dKTtcblxuICBtZmIuZGlyZWN0aXZlKCdtZmJCdXR0b25DbG9zZScsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgcmVxdWlyZTogJ15tZmJNZW51JyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgbWZiTWVudUNvbnRyb2xsZXIpIHtcbiAgICAgICAgJGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBtZmJNZW51Q29udHJvbGxlci5jbG9zZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfTtcblxuICB9KTtcblxuICBtZmIuZGlyZWN0aXZlKCdtZmJNZW51JywgWyckdGltZW91dCcsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICBzY29wZToge1xuICAgICAgICBwb3NpdGlvbjogJ0AnLFxuICAgICAgICBlZmZlY3Q6ICdAJyxcbiAgICAgICAgbGFiZWw6ICdAJyxcbiAgICAgICAgcmVzdGluZzogJ0ByZXN0aW5nSWNvbicsXG4gICAgICAgIGFjdGl2ZTogJ0BhY3RpdmVJY29uJyxcbiAgICAgICAgbWFpbkFjdGlvbjogJyYnLFxuICAgICAgICBtZW51U3RhdGU6ICc9PycsXG4gICAgICAgIHRvZ2dsaW5nTWV0aG9kOiAnQCdcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24oZWxlbSwgYXR0cnMpIHtcbiAgICAgICAgcmV0dXJuIGF0dHJzLnRlbXBsYXRlVXJsIHx8ICduZy1tZmItbWVudS1kZWZhdWx0LnRwbC5odG1sJztcbiAgICAgIH0sXG4gICAgICBjb250cm9sbGVyOiBbJyRzY29wZScsICckYXR0cnMnLCBmdW5jdGlvbigkc2NvcGUsICRhdHRycykge1xuICAgICAgICB2YXIgb3BlblN0YXRlID0gJ29wZW4nLFxuICAgICAgICAgIGNsb3NlZFN0YXRlID0gJ2Nsb3NlZCc7XG5cbiAgICAgICAgLy8gQXR0YWNoZWQgdG9nZ2xlLCBvcGVuIGFuZCBjbG9zZSB0byB0aGUgY29udHJvbGxlciB0byBnaXZlIG90aGVyXG4gICAgICAgIC8vIGRpcmVjdGl2ZSBhY2Nlc3NcbiAgICAgICAgdGhpcy50b2dnbGUgPSB0b2dnbGU7XG4gICAgICAgIHRoaXMuY2xvc2UgPSBjbG9zZTtcbiAgICAgICAgdGhpcy5vcGVuID0gb3BlbjtcblxuICAgICAgICAkc2NvcGUuY2xpY2tlZCA9IGNsaWNrZWQ7XG4gICAgICAgICRzY29wZS5ob3ZlcmVkID0gaG92ZXJlZDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSBzdGF0ZSB0byB1c2VyLWRlZmluZWQgdmFsdWUuIEZhbGxiYWNrIHRvIGNsb3NlZCBpZiBub1xuICAgICAgICAgKiB2YWx1ZSBpcyBwYXNzZWQgZnJvbSB0aGUgb3V0c2lkZS5cbiAgICAgICAgICovXG4gICAgICAgIGlmICghJHNjb3BlLm1lbnVTdGF0ZSkge1xuICAgICAgICAgICRzY29wZS5tZW51U3RhdGUgPSBjbG9zZWRTdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBvbiB0b3VjaCBkZXZpY2UgQU5EICdob3ZlcicgbWV0aG9kIGlzIHNlbGVjdGVkOlxuICAgICAgICAgKiB3YWl0IGZvciB0aGUgZGlnZXN0IHRvIHBlcmZvcm0gYW5kIHRoZW4gY2hhbmdlIGhvdmVyIHRvIGNsaWNrLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKF9pc1RvdWNoRGV2aWNlKCkgJiYgX2lzSG92ZXJBY3RpdmUoKSkge1xuICAgICAgICAgICR0aW1lb3V0KHVzZUNsaWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRhdHRycy4kb2JzZXJ2ZSgnbWVudVN0YXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJHNjb3BlLmN1cnJlbnRTdGF0ZSA9ICRzY29wZS5tZW51U3RhdGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsaWNrZWQoKSB7XG4gICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBtYWluIGFjdGlvbiwgbGV0J3MgZmlyZSBpdFxuICAgICAgICAgIGlmICgkc2NvcGUubWFpbkFjdGlvbikge1xuICAgICAgICAgICAgJHNjb3BlLm1haW5BY3Rpb24oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIV9pc0hvdmVyQWN0aXZlKCkpIHtcbiAgICAgICAgICAgIHRvZ2dsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhvdmVyZWQoKSB7XG4gICAgICAgICAgaWYgKF9pc0hvdmVyQWN0aXZlKCkpIHtcbiAgICAgICAgICAgIC8vdG9nZ2xlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludmVydCB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgbWVudS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZSgpIHtcbiAgICAgICAgICBpZiAoJHNjb3BlLm1lbnVTdGF0ZSA9PT0gb3BlblN0YXRlKSB7XG4gICAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcGVuKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICAgICAgICAkc2NvcGUubWVudVN0YXRlID0gb3BlblN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICAgJHNjb3BlLm1lbnVTdGF0ZSA9IGNsb3NlZFN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIGlmIHdlJ3JlIG9uIGEgdG91Y2gtZW5hYmxlZCBkZXZpY2UuXG4gICAgICAgICAqIFJlcXVpcmVzIE1vZGVybml6ciB0byBydW4sIG90aGVyd2lzZSBzaW1wbHkgcmV0dXJucyBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2lzVG91Y2hEZXZpY2UoKSB7XG4gICAgICAgICAgcmV0dXJuIHdpbmRvdy5Nb2Rlcm5penIgJiYgTW9kZXJuaXpyLnRvdWNoO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2lzSG92ZXJBY3RpdmUoKSB7XG4gICAgICAgICAgcmV0dXJuICRzY29wZS50b2dnbGluZ01ldGhvZCA9PT0gJ2hvdmVyJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb252ZXJ0IHRoZSB0b2dnbGluZyBtZXRob2QgdG8gJ2NsaWNrJy5cbiAgICAgICAgICogVGhpcyBpcyB1c2VkIHdoZW4gJ2hvdmVyJyBpcyBzZWxlY3RlZCBieSB0aGUgdXNlclxuICAgICAgICAgKiBidXQgYSB0b3VjaCBkZXZpY2UgaXMgZW5hYmxlZC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHVzZUNsaWNrKCkge1xuICAgICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUudG9nZ2xpbmdNZXRob2QgPSAnY2xpY2snO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XVxuICAgIH07XG4gIH1dKTtcblxuICBtZmIuZGlyZWN0aXZlKCdtZmJCdXR0b24nLCBbZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcXVpcmU6ICdebWZiTWVudScsXG4gICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgaWNvbjogJ0AnLFxuICAgICAgICBsYWJlbDogJ0AnXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKGVsZW0sIGF0dHJzKSB7XG4gICAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAnbmctbWZiLWJ1dHRvbi1kZWZhdWx0LnRwbC5odG1sJztcbiAgICAgIH1cbiAgICB9O1xuICB9XSk7XG5cbn0pKHdpbmRvdywgYW5ndWxhcik7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uZGlyZWN0aXZlKCdsZWZ0TWVudScsZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBkYXRhOiAnPScsXG4gICAgICAgICAgICB1c2VyOiAnPScsXG4gICAgICAgICAgICB0eXBlOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwiL0FwcC9zY3JpcHRzL2RpcmVjdGl2ZXMvbGVmdE1lbnUuaHRtbFwiXG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuLmRpcmVjdGl2ZSgnZmVlZHMnLGZ1bmN0aW9uKCl7XG4gIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgcG9zdHM6ICc9JyxcbiAgICAgICAgICAgIHJlcGxpZXM6ICc9JyxcbiAgICAgICAgICAgIGNyZWF0ZVBvc3Q6Jz0nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcIi9BcHAvc2NyaXB0cy9kaXJlY3RpdmVzL21pZGRsZUNvbnRlbnQuaHRtbFwiXG4gICAgfTtcbn0pO1xuYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuLmRpcmVjdGl2ZSgnaGVhZGVyJyxmdW5jdGlvbigpe1xuICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0FFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIGRhdGE6ICc9JyxcbiAgICAgICAgICAgIHVzZXI6ICc9JyxcbiAgICAgICAgICAgIHR5cGU6ICc9J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCIvQXBwL3NjcmlwdHMvZGlyZWN0aXZlcy9oZWFkZXIuaHRtbFwiXG4gICAgfTtcbn0pO1xuXG5cbmFuZ3VsYXIubW9kdWxlKCdzeW5jJylcbi5kaXJlY3RpdmUoJ2tleWJpbmRpbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIGludm9rZTogJyYnXG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWwsIGF0dHIpIHtcbiAgICAgICAgICAgIE1vdXNldHJhcC5iaW5kKGF0dHIub24sIHNjb3BlLmludm9rZSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uc2VydmljZSgnUG9zdCcsIFsnJGh0dHAnLCAnJHEnLCAnJHJvb3RTY29wZScsIGZ1bmN0aW9uIFBvc3QoJGh0dHAsICRxLCAkcm9vdFNjb3BlKSB7XG4gICAgdGhpcy5nZXRQb3N0ID0gZnVuY3Rpb24gKHVzZXJfaWQpIHtcbiAgICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9wb3N0cz91c2VyX2lkJyArIHVzZXJfaWQsIHtjYWNoZTogZmFsc2V9KVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHRoaXMucGFydGljaXBhdGUgPSBmdW5jdGlvbihvYmope1xuICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICRodHRwLnB1dCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvcG9zdHMvJyxvYmopXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB0aGlzLmNyZWF0ZVBvc3QgPSBmdW5jdGlvbiAocG9zdCkge1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5wb3N0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9wb3N0cycsIHBvc3QpXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHRoaXMuZGVsZXRlUG9zdCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5kZWxldGUoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL3Bvc3RzLycgKyBpZClcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdzeW5jJylcbi5jb250cm9sbGVyKCdQb3N0aW5nQ29udHJvbGxlcicsIFtcbiAgJyRzY29wZScsXG4gICdQb3N0JyxcbiAgJyR0aW1lb3V0JyxcbiAgJ1VzZXInLFxuICAnJGludGVydmFsJyxcbiAgJ05vdGlmaWNhdGlvbicsXG4gIC8vICckaW9uaWNMaXN0RGVsZWdhdGUnLFxuICAnJGxvZycsXG4gICd1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24nLFxuICBmdW5jdGlvbiAoXG4gICRzY29wZSxcbiAgUG9zdCxcbiAgJHRpbWVvdXQsXG4gIFVzZXIsXG4gICRpbnRlcnZhbCxcbiAgTm90aWZpY2F0aW9uLFxuICAkaW9uaWNMaXN0RGVsZWdhdGUsXG4gICRsb2csXG4gIHVzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvblxuKSB7XG5cbiAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLnBvc3RMb2FkZXIoKTtcbiAgICAgICAgJHNjb3BlLmdldFVzZXIoKTtcblxuICAgIH07XG5cbiAgICAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUucG9zdExvYWRlcigpO1xuICAgIH0sIDgwMDApO1xuICAgICRzY29wZS5nZXRVc2VyID1mdW5jdGlvbigpe1xuXG4gICAgICBVc2VyLl9pZCgpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cbiAgICAgICAgJHNjb3BlLnVzZXIgPSByZXNwb25zZTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgfSxmdW5jdGlvbihlcnIpe1xuICAgICAgICAvL3F1aXQgc2xpbnRseVxuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUubG9hZE1vcmUgPSBmdW5jdGlvbigpe1xuXG4gICAgfTtcbiAgICAkc2NvcGUucGFydGljaXBhdGVJbnRvUG9zdCA9IGZ1bmN0aW9uKHBvc3QsdXNlcil7XG4gICAgICAvLyBjb25zb2xlLmxvZyh1c2VyKTtcbiAgICAgIHZhciBvYmogPXtcbiAgICAgICAgJ3Bvc3RfaWQnOnBvc3QsXG4gICAgICAgICd1c2VyX2lkJzp1c2VyXG4gICAgICB9O1xuICAgICAgUG9zdC5wYXJ0aWNpcGF0ZShvYmopXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICRzY29wZS5wb3N0TG9hZGVyKCk7XG4gICAgICB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAgIC8vcXVpdCBzbGVudGx5XG5cbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLnBvc3RMb2FkZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5kYXRhTG9hZGluZyA9IHRydWU7XG4gICAgICAgIFBvc3QuZ2V0UG9zdCgpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodHJlZSkge1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnBvc3RzID10cmVlO1xuICAgICAgICAgICAgICAgIC8vbmF2aWdhdGUgdHJvdWdoIHRyZWUgcmVzcG9uc2Ugd2hpY2ggaXMgcmVxdWlyZSBtdWNoIGF0dGVudGlvblxuICAgICAgICAgICAgICAgICRzY29wZS5mcmllbmRzPVtdO1xuICAgICAgICAgICAgICAgICRzY29wZS5yZXBsaWVzPVtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJlZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHJlZVtpXS5oYXNPd25Qcm9wZXJ0eS5mcmllbmRzICYmIHRyZWVbaV0ucmVwbGllcyAgJiYgdHJlZVtpXS5mcmllbmRzICkge1xuICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mcmllbmRzLnB1c2godHJlZVtpXS5mcmllbmRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVwbGllcy5wdXNoKHRyZWVbaV0ucmVwbGllcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHJlZVtpXS5oYXNPd25Qcm9wZXJ0eSgnZnJpZW5kcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZnJpZW5kcyA9IGZyaWVuZHMuY29uY2F0KHRyYXZlcnNlKHRyZWVbaV0uZnJpZW5kcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlcGxpZXMgPSByZXBsaWVzLmNvbmNhdCh0cmF2ZXJzZSh0cmVlW2ldLnJlcGxpZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5pbWFnZURlc2MgPSBmdW5jdGlvbihpbmRleCl7XG4gICAgICAvL3Nob3cgaW1hZ2VzIHdpdGggZGlmZmVyZW50IHBpeGVsXG4gICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICByZXR1cm4gJzYwcHgnO1xuXG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIFwiNjBweFwiO1xuXG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcmV0dXJuIFwiNjBweFwiO1xuXG4gICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmV0dXJuIFwiNjBweFwiO1xuXG4gICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmV0dXJuIFwiNjBweFwiO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBcIjYwcHhcIjtcblxuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xuICAgIH07XG4gICAgJHNjb3BlLnNoYXJlID0gZnVuY3Rpb24oaWQpe1xuICAgICAgICAkaW9uaWNMaXN0RGVsZWdhdGUuY2xvc2VPcHRpb25CdXR0b25zKCk7XG4gICAgICAgICRsb2cuaW5mbyhpZCk7XG4gICAgfTtcbiAgICAkc2NvcGUuY3JlYXRlUG9zdCA9IGZ1bmN0aW9uIChwb3N0aW5nKSB7XG4gICAgICAvL2lmIGltYWdlIGlzIHVwbG9hZGVkIHVwbG9hZGVkXG4gICAgICAgIHZhciBfdGhpcyA9IHsgbWVzc2FnZTogcG9zdGluZyB9O1xuICAgICAgICBQb3N0LmNyZWF0ZVBvc3QoX3RoaXMpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocG9zdENyZWF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gJyc7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUucG9zdHMucHVzaChwb3N0Q3JlYXRlZCk7XG4gICAgICAgICAgICAgICAgICB1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24uc3VjY2VzcyhcIk5ldyBQb3N0IGZlZWQgY3JlYXRlZCFcIik7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcblxuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5pbml0KCk7XG59XSk7XG5hbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uZGlyZWN0aXZlKCdmZWVkc1VwbG9hZGVyJyxbZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICByZXBsYWNlOiBmYWxzZSxcbiAgICB0ZW1wbGF0ZVVybDogJ0FwcC9qcy9zY3JpcHRzL3ZpZXdzL2ZlZWRBdHRhY2htZW50Lmh0bWwnLFxuICAgIHNjb3BlOiB7XG4gICAgICBhY3Rpb246ICdAJ1xuICAgIH0sXG4gICAgY29udHJvbGxlcjogWyckc2NvcGUnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICAgICAkc2NvcGUucHJvZ3Jlc3MgPSAwO1xuICAgICAgJHNjb3BlLmF2YXRhciA9ICcnO1xuICAgICAgJHNjb3BlLnNlbmRGaWxlID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyICRmb3JtID0gJChlbCkucGFyZW50cygnZm9ybScpO1xuICAgICAgICBpZiAoJChlbCkudmFsKCkgPT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgICRmb3JtLmF0dHIoJ2FjdGlvbicsICRzY29wZS5hY3Rpb24pO1xuICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzY29wZS5wcm9ncmVzcyA9IDA7XG4gICAgICAgIH0pO1xuICAgICAgICAkZm9ybS5hamF4U3VibWl0KHtcbiAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuICAgICAgICBcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ2F1dGhvcml6YXRpb24nLCAnQmVhcmVyIE9xRmlyUVM0NFJRVGpSdVduaVhqZEhaSlFYZEN1RXg0OXJxOEpZNUEnKTtcbiAgICAgICAgXHR9LFxuICAgICAgICAgIHVwbG9hZFByb2dyZXNzOiBmdW5jdGlvbihldnQsIHBvcywgdG90LCBwZXJjQ29tcGxldGUpIHtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIC8vIHVwbG9hZCB0aGUgcHJvZ3Jlc3MgYmFyIGR1cmluZyB0aGUgdXBsb2FkXG4gICAgICAgICAgICAgIC8vICRzY29wZS5wcm9ncmVzcyA9IHBlcmNlbnRDb21wbGV0ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGV2dCwgc3RhdHVzVGV4dCwgcmVzcG9uc2UsIGZvcm0pIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgYWN0aW9uIGF0dHJpYnV0ZSBmcm9tIHRoZSBmb3JtXG4gICAgICAgICAgICAkZm9ybS5yZW1vdmVBdHRyKCdhY3Rpb24nKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMsIHhociwgZm9ybSkge1xuICAgICAgICAgICAgdmFyIGFyID0gJChlbCkudmFsKCkuc3BsaXQoJ1xcXFwnKSxcbiAgICAgICAgICAgICAgZmlsZW5hbWUgPSAgYXJbYXIubGVuZ3RoLTFdO1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBhY3Rpb24gYXR0cmlidXRlIGZyb20gdGhlIGZvcm1cbiAgICAgICAgICAgICRmb3JtLnJlbW92ZUF0dHIoJ2FjdGlvbicpO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLmF2YXRhciA9IGZpbGVuYW1lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1dLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycywgY3RybCkge1xuXG4gICAgICBlbGVtLmZpbmQoJy5mYWtlLXVwbG9hZGVyJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW0uZmluZCgnaW5wdXRbdHlwZT1cImZpbGVcIl0nKS5jbGljaygpO1xuICAgICAgfSk7XG5cbiAgICB9XG4gIH07XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3luYycpLmNvbnRyb2xsZXIoJ0ZpbGVzQ29udHJvbGxlcicsWyckc2NvcGUnLCdGaWxlcycsJyRsb2cnLCckd2luZG93JywnVXNlcicsJyR1aWJNb2RhbCcsJyR0aW1lb3V0JywnJHN0YXRlUGFyYW1zJywnJHJvb3RTY29wZScsJyRleGNlcHRpb25IYW5kbGVyJywnJGNhY2hlRmFjdG9yeScsJ2NhY2hlRmFjdG9yeScsJ0RFQlVHJywgZnVuY3Rpb24gKCRzY29wZSwgRmlsZXMsJGxvZywkd2luZG93LFVzZXIsJHVpYk1vZGFsLCR0aW1lb3V0LCRzdGF0ZVBhcmFtcywkcm9vdFNjb3BlLCRleGNlcHRpb25IYW5kbGVyLCRjYWNoZUZhY3RvcnksY2FjaGVGYWN0b3J5LERFQlVHKSB7XG4gICAgJHNjb3BlLmZpbGVzID1bXTtcbiAgICB2YXIgY2FjaGUgPSBjYWNoZUZhY3RvcnkuZ2V0KCd1c2VyRGF0YScpLFxuICAgICAgICBfbG9hZEZpbGVzID0gZnVuY3Rpb24oZm9sZGVySWQpe1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFMb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIEZpbGVzLmdldEJveEZpbGVzKGZvbGRlcklkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5maWxlcyBcdD1cdHJlcztcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICB9OyBcbiAgICAkcm9vdFNjb3BlLiRvbignYXBwOm9uOmJyb3dzZXI6YmFjaycsZnVuY3Rpb24oZSxpZCl7XG5cbiAgICB9KTtcbiAgICAkcm9vdFNjb3BlLiRvbignZm9sZGVyOmlkJyxmdW5jdGlvbihyLGZvbGRlcklkKXsgXG4gICAgICAgIFxuICAgICAgICBpZih0eXBlb2YoZm9sZGVySWQpID09PSAnbnVtYmVyJyl7XG4gICAgICAgICAgICBfbG9hZEZpbGVzKCRzdGF0ZVBhcmFtcy5mb2xkZXJJZCk7IFxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0pO1xuICAgIFxuICAgICRyb290U2NvcGUuJG9uKCdmaWxlOmxpc3QnLGZ1bmN0aW9uKCl7IFxuICAgICAgIF9sb2FkRmlsZXMoJHN0YXRlUGFyYW1zLmZvbGRlcklkKTsgXG4gICAgfSk7XG4gICAgXG4gICAgJHNjb3BlLmZpbGVUeXBlICA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdmFyIGNhc2VzID0ge1xuICAgICAgICAgICAgJ3BkZic6ICdpbWcvcGRmLnBuZycsXG4gICAgICAgICAgICAncG5nJzogJ2ltZy91bml2ZXJzYWxfZm9sZGVyLnBuZycsXG4gICAgICAgICAgICAnSlBHJzogJ2ltZy9jb2RlLnBuZycsXG4gICAgICAgICAgICAnZG9jeCc6ICdpbWcvd29yZC5wbmcnLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoY2FzZXNbdHlwZV0pIHtcbiAgICAgICAgICAgcmV0dXJuIGNhc2VzW3R5cGVdO1xuICAgICAgICB9XG4gIH07XG4kc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7IFxuICAgICAgICBfbG9hZEZpbGVzKCRzdGF0ZVBhcmFtcy5mb2xkZXJJZCk7XG59O1xuXG4kc2NvcGUuaW5pdCgpO1xuXG59XSk7XG5cblxuXG4iLCJhbmd1bGFyLm1vZHVsZShcInN5bmNcIilcbi5jb250cm9sbGVyKCdGb2xkZXJDb250cm9sbGVyJyxbJyRzY29wZScsJ0ZvbGRlcicsJ1VzZXInLCdERUJVRycsJyRzdGF0ZVBhcmFtcycsJyRyb290U2NvcGUnLCdmb2xkZXJMaXN0cycsJ2NhY2hlRmFjdG9yeScsJ0ZpbGVzJywgZnVuY3Rpb24oJHNjb3BlLEZvbGRlcixVc2VyLERFQlVHLCRzdGF0ZVBhcmFtcywkcm9vdFNjb3BlLGZvbGRlckxpc3RzLGNhY2hlRmFjdG9yeSxGaWxlcyl7XG4gICAgICRzY29wZS5mb2xkZXJzID1bXTtcbiAgICAgJHNjb3BlLnR5cGUgID0gZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgY2FzZXMgPSB7XG4gICAgICAgICAgICAnZm9sZGVyJzogJ2ltZy91bml2ZXJzYWxfZm9sZGVyLnBuZydcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGNhc2VzW3R5cGVdKSB7XG4gICAgICAgICAgIHJldHVybiBjYXNlc1t0eXBlXTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0dXNlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFVzZXIuZ2V0VXNlcklkKClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgJHNjb3BlLnVzZXJfaWQ9cmVzcG9uc2U7XG4gICAgICAgIH0pLmNhdGNoKCk7XG4gICAgfTtcbiAgICBcbiAgICAkc2NvcGUuc3RydWN0dXJlID0nJztcbiAgICB2YXIgZ2V0Rm9sZGVycyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgRm9sZGVyLmdldEZvbGRlcnMoJHN0YXRlUGFyYW1zLmZvbGRlcklkKVxuICAgICAgICAudGhlbihmdW5jdGlvbihmb2xkZXJzKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJHNjb3BlLmZvbGRlcnMgPSBmb2xkZXJzO1xuICAgICAgICAgICAgXG4gICAgICAgIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgIGlmKERFQlVHID09PSB0cnVlKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLiRvbignZm9sZGVyOmxpc3QnLCBmdW5jdGlvbihldmVudCwgYXJncykge1xuICAgICAgICBnZXRGb2xkZXJzKCk7XG4gICAgfSk7XG5cbiAgICAkcm9vdFNjb3BlLiRvbignZm9sZGVyOnN0cnVjdHVyZScsZnVuY3Rpb24ocixzdHJ1Y3R1cmUpe1xuXG4gICAgICAgICAkc2NvcGUuc3RydWN0dXJlICA9IHN0cnVjdHVyZTtcblxuICAgIH0pO1xuXG4gICAgJHNjb3BlLnNob3dGaWxlc0luID0gZnVuY3Rpb24oZm9sZGVyX2lkKXtcbiAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnZm9sZGVyOmlkJyxmb2xkZXJfaWQpO1xuICAgIH07XG4gICAgJHNjb3BlLmRlbGV0ZUZvbGRlciA9IGZ1bmN0aW9uIChmb2xkZXJfaWQpe1xuXG4gICAgRm9sZGVyLmRlbGV0ZUZvbGRlcnMoZm9sZGVyX2lkKVxuXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgaWYocmVzcG9uc2UuRGVsZXRlZm9sZGVyID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgIG5vdGllLmFsZXJ0KDMsICdOb3QgRGVsZXRlZCEnLCAyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgbm90aWUuYWxlcnQoNCwgJ0ZvbGRlciBEZWxldGVkLicsIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sZnVuY3Rpb24oZXJyKXtcblxuICAgICAgICAgICAgICAgIGlmKERFQlVHID09PSB0cnVlKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbihmb2xkZXIpe1xuICAgICAgICBcbiAgICAgICAgdmFyIHBhdGhzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZm9sZGVyU3RydWN0dXJlJykpLFxuICAgICAgICAgICAgY29tYmluZWRQYXRoX3N0cnVjdHVyZSA9IHBhdGhzLmpvaW4oJycpLFxuICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgY3JlYXRpbmdGb2xkZXIgPSBmdW5jdGlvbiBuYW1lKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICBGb2xkZXIuY3JlYXRlRm9sZGVyKHBhcmFtcylcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5mb2xkZXJDcmVhdGVkID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3RpZS5hbGVydCgzLCAnRm9sZGVyICBleGlzdCEnLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RpZS5hbGVydCg0LCAnTmV3IEZvbGRlciBjcmVhdGVkLicsIDIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9LGZ1bmN0aW9uKGVycil7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoREVCVUcgPT09IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coY29tYmluZWRQYXRoX3N0cnVjdHVyZSk7XG5cbiAgICAgICAgICAgIC8vIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoIWNvbWJpbmVkUGF0aF9zdHJ1Y3R1cmUpe1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2FsU3RvcmFnZS5mb2xkZXJTdHJ1Y3R1cmUpO1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnRfZm9sZGVyXCIgOiAgICAkc3RhdGVQYXJhbXMuZm9sZGVySWQsXG4gICAgICAgICAgICAgICAgICAgIFwibmVzdGVkX25hbWVcIiAgIDogICAgZm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICBcImhpZXJhY2h5XCIgICAgICA6ICAgIGxvY2FsU3RvcmFnZS5mb2xkZXJTdHJ1Y3R1cmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyFwYXRoOicgKyBsb2NhbFN0b3JhZ2UuZm9sZGVyU3RydWN0dXJlKTtcbiAgICAgICAgICAgICAgICBjcmVhdGluZ0ZvbGRlcihwYXJhbXMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmZvbGRlclN0cnVjdHVyZSA9IGNvbWJpbmVkUGF0aF9zdHJ1Y3R1cmU7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgICAgICBcInBhcmVudF9mb2xkZXJcIiA6ICAgICRzdGF0ZVBhcmFtcy5mb2xkZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgXCJuZXN0ZWRfbmFtZVwiICAgOiAgICBmb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgIFwiaGllcmFjaHlcIiAgICAgIDogICAgY29tYmluZWRQYXRoX3N0cnVjdHVyZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhbFN0b3JhZ2UuZm9sZGVyU3RydWN0dXJlKTtcbiAgICAgICAgICAgICAgICBjcmVhdGluZ0ZvbGRlcihwYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICBcbiAgfTtcbiAgdmFyIGluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBnZXR1c2VyKCk7XG4gICAgICAgIGdldEZvbGRlcnMoKTtcbiAgICB9O1xuICBpbml0KCk7XG59XSlcbi5mYWN0b3J5KFwiY2FjaGVGYWN0b3J5XCIsIGZ1bmN0aW9uKCRjYWNoZUZhY3RvcnkpXG57XG4gICAgLy9iZSBjYXV0aW91cyB3aXRoIHRoaXMhXG4gICAgcmV0dXJuICRjYWNoZUZhY3RvcnkoXCJ1c2VyRGF0YVwiKTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuLmNvbnRyb2xsZXIoJ3ByZXZpZXdDb250cm9sbGVyJyxcbiBbXG5cdCckc2NvcGUnLCdwZGZEZWxlZ2F0ZScsJyR0aW1lb3V0JywnJHN0YXRlUGFyYW1zJywnJHJvb3RTY29wZScsJyRleGNlcHRpb25IYW5kbGVyJywnRmlsZXMnLCAnRmlsZVNhdmVyJywnQmxvYicsZnVuY3Rpb24gKFxuXHRcdCRzY29wZSxwZGZEZWxlZ2F0ZSwkdGltZW91dCwkc3RhdGVQYXJhbXMsJHJvb3RTY29wZSwkZXhjZXB0aW9uSGFuZGxlcixGaWxlcyxGaWxlU2F2ZXIsIEJsb2IpIHtcblxuICAgICAgaWYoJHN0YXRlUGFyYW1zLnByZXZpZXcgJiYgJHN0YXRlUGFyYW1zLmV4dGVuc2lvbiA9PT0gJ3BkZicpe1xuICAgICAgICAkc2NvcGUucHJldmlld2FibGUgPSB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy9hIHVzZXIgU3RyaW1VcCBpcyBpbmplY3RlZCBpbiBiZWxsb3cgdXJsIGl0IHNob3VsZCBiZSBkeW5hbWljIGluIGZ1dHVyZSFcbiAgICAgICAgICAgICRzY29wZS5wZGZVcmwgPSAkcm9vdFNjb3BlLmVuZFBvaW50KyAnL3ByZXZpZXcvJysgJHN0YXRlUGFyYW1zLnByZXZpZXcrJy9vZi8nKyRzdGF0ZVBhcmFtcy51c2VyO1xuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcGRmRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCdteS1wZGYtY29udGFpbmVyJykuem9vbUluKDAuNSk7XG4gICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgIHRocm93KCBuZXcgRXJyb3IoZSkpO1xuICAgICAgICB9XG4gICAgICB9ZWxzZSBpZigkc3RhdGVQYXJhbXMucHJldmlldyAmJiAkc3RhdGVQYXJhbXMuZXh0ZW5zaW9uID09PSAnanBnJ3x8JHN0YXRlUGFyYW1zLmV4dGVuc2lvbiA9PT0gJ3BuZycpe1xuICAgICAgICAkc2NvcGUuZmlsZV9uYW1lID0gJHN0YXRlUGFyYW1zLnByZXZpZXc7XG4gICAgICAgICRzY29wZS5wcmV2aWV3YWJsZSA9IGZhbHNlO1xuICAgICAgICAvL2FzIGJ5IG5vdyBpbWFnZXMgYXJlIG5vdCByZWFkeSB0byBiZSBwcmV2aWV3ZWQgc28gc2V0IGl0IHRvIGZhbHNlIXByb3ZpZGUgb25seSBvcHRpb24gdG8gZG93bmxvYWQgdGhlbSFcbiAgICAgICAgICAvLyAkc2NvcGUucHJldmlld2FibGUgPSBmYWxzZTtcbiAgICAgICAgICAvLyBGaWxlcy5zaW5nbGUoJHN0YXRlUGFyYW1zLnByZXZpZXcpXG4gICAgICAgICAgLy8gLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgIC8vICAgJHNjb3BlLmltYWdlUHJldmlldyA9IHJlc3BvbnNlO1xuICAgICAgICAgIC8vIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgLy8gfSk7XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIC8vc2VuZCBhIGZpbGVuYW1lIHRvIGEgZG93bmxvYWQgYnV0dG9uXG4gICAgICAgICRzY29wZS5maWxlX25hbWUgPSAkc3RhdGVQYXJhbXMucHJldmlldztcbiAgICAgICAgJHNjb3BlLnByZXZpZXdhYmxlID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc2NvcGUuaW5jcmVtZW50ID0gMTtcbiAgICAgICAgICBwZGZEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ215LXBkZi1jb250YWluZXInKS5uZXh0KCRzY29wZS5pbmNyZW1lbnQrMSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmRvbndsb2FkPVwiRG93bmxvYWRcIjtcbiAgICAgICRzY29wZS5nb1ByZXYgPSBmdW5jdGlvbihwYWdlKXtcbiAgICAgICAgICBwZGZEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ215LXBkZi1jb250YWluZXInKS5wcmV2KCRzY29wZS5pbmNyZW1lbnQtMSk7XG4gICAgICB9O1xufV0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uZGlyZWN0aXZlKCdmaWxlRG93bmxvYWQnLCBbJ1VzZXInLGZ1bmN0aW9uIChVc2VyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICBzY29wZTogeyBvYmo6ICc9JyxuYW1lOic9JyB9LFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8c3BhbiAgZGF0YS1uZy1jbGljaz1cImRvd25sb2FkKG9iailcIj57e25hbWV9fTwvc3Bhbj4nLFxuICAgICAgICAgICAgY29udHJvbGxlcjogWyckcm9vdFNjb3BlJywgJyRzY29wZScsICckZWxlbWVudCcsICckYXR0cnMnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCkge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZha2VQcm9ncmVzcygpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5wcm9ncmVzcyA8IDk1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2dyZXNzICs9ICg5NiAtICRzY29wZS5wcm9ncmVzcykgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICRyb290U2NvcGUuJGJyb2FkY2FzdCgnZGlhbG9ncy53YWl0LnByb2dyZXNzJywgeyAncHJvZ3Jlc3MnOiAkc2NvcGUucHJvZ3Jlc3MgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFrZVByb2dyZXNzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzcyA9IDA7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJlcGFyZSh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlhbG9ncy53YWl0KFwiUGxlYXNlIHdhaXRcIiwgXCJZb3VyIGRvd25sb2FkIHN0YXJ0cyBpbiBhIGZldyBzZWNvbmRzLlwiLCAkc2NvcGUucHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICAgICBmYWtlUHJvZ3Jlc3MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gc3VjY2Vzcyh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdkaWFsb2dzLndhaXQuY29tcGxldGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2UsIHVybCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBkaWFsb2dzLmVycm9yKFwiQ291bGRuJ3QgcHJvY2VzcyB5b3VyIGRvd25sb2FkIVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgVXNlci5nZXRVc2VybmFtZSgpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZG93bmxvYWQgPSBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAkLmZpbGVEb3dubG9hZCgkcm9vdFNjb3BlLmVuZFBvaW50KycvZG93bmxvYWRzL2ZpbGUvJytmaWxlKycvb2YvJyskc2NvcGUudXNlciwgeyBwcmVwYXJlQ2FsbGJhY2s6IHByZXBhcmUsIHN1Y2Nlc3NDYWxsYmFjazogc3VjY2VzcywgZmFpbENhbGxiYWNrOiBlcnJvciB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfTtcbn1dKTtcbiIsIi8qIGdsb2JhbCBzeW5jICovXG5cbmFuZ3VsYXIubW9kdWxlKCdzeW5jJylcbi5jb250cm9sbGVyKCdQZW9wbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCdQZW9wbGUnLGZ1bmN0aW9uICgkc2NvcGUsIFBlb3BsZSkge1xuXHRcdCRzY29wZS5pbml0ID0gZnVuY3Rpb24oKXtcblx0XHRcdCRzY29wZS5nZXRQZW9wbGVUb0ZvbGxvdygpO1xuXHRcdH07XG5cdFx0JHNjb3BlLmdldFBlb3BsZVRvRm9sbG93ICA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRQZW9wbGUuZ2V0KClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XG5cdFx0XHRcdCRzY29wZS5wZW9wbGUgPSByZXNwb25zZTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yKXtcblxuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHQkc2NvcGUuJG9uKCdmb2xsb3dNZW1iZXInLGZ1bmN0aW9uKGV2ZW50LHBhcmFtcyl7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0UGVvcGxlLmZvbGxvdyhwYXJhbXMpXG5cdFx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdC8vY29uc29sZS5sb2cocmVzcG9uc2UpO1xuXHRcdFx0XHQkc2NvcGUuZ2V0UGVvcGxlVG9Gb2xsb3coKTtcblx0XHRcdH0sZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHQkc2NvcGUuZm9sbG93ID0gZnVuY3Rpb24oaWQpe1xuXHRcdFx0dmFyIGZvbGxvdyA9e2lkOiBpZCwgb3B0aW9uOidhZGRQZW9wbGUnfTtcblx0XHRcdCRzY29wZS4kZW1pdChcImZvbGxvd01lbWJlclwiLCBmb2xsb3cpO1xuXHRcdH07XG5cdFx0JHNjb3BlLmluaXQoKTtcbn1dKTtcbiIsIi8qIGdsb2JhbCBGaWxlcyAqL1xuLyogZ2xvYmFsIHN5bmMgKi9cbi8qIGdsb2JhbCAkc2NvcGUgKi9cbi8qIGdsb2JhbCBhbmd1bGFyICovXG4vKkF1dGhvciBNdXJhZ2lqaW1hbmEgRm91bmRlciAmIENFTyBvZiBzeW5jIGNhbGwgaGltIG9uIFN0cmltVXBAZ21haWwuY29tKi9cblxuYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuLnNlcnZpY2UoJ0dyb3VwJywgW1xuXHQnJGh0dHAnLFxuXHQnJHJvb3RTY29wZScsXG5cdCckcScsZnVuY3Rpb24gR3JvdXAgKFxuXHRcdCRodHRwLFxuXHRcdCRyb290U2NvcGUsXG5cdFx0JHEpIHtcblx0dGhpcy5jcmVhdGUgXHRcdD1cdGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHZhciBkaWZmZXJlZCBcdD1cdCRxLmRlZmVyKCk7XG5cdFx0JGh0dHAucG9zdCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZ3JvdXBzJywgbmFtZSlcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fTtcblx0dGhpcy5kZWxldGUgXHRcdD1cdGZ1bmN0aW9uKGlkKXtcblx0XHR2YXIgZGlmZmVyZWQgXHQ9XHQkcS5kZWZlcigpO1xuXHRcdCRodHRwLmRlbGV0ZSgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZ3JvdXBzLycraWQpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG5cdH07XG5cdHRoaXMubXlHcm91cHNcdFx0PVx0ZnVuY3Rpb24oKXtcblx0XHR2YXIgZGlmZmVyZWQgXHQ9XHQkcS5kZWZlcigpO1xuXG5cdFx0JGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9ncm91cHMnKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnZGlmZmVyZWQgc2xvdzonICsgZXJyb3IpO1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fTtcblxuXHR0aGlzLmFkZFBlb3BsZSBcdD1cdGZ1bmN0aW9uKG1lbWJlcil7XG5cdFx0dmFyIGRpZmZlcmVkIFx0PVx0JHEuZGVmZXIoKTtcblx0XHQkaHR0cC5wdXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL2dyb3Vwcy8nK0pTT04uc3RyaW5naWZ5KG1lbWJlcikpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUoZXJyb3IpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuXHR0aGlzLmFkZEZpbGVUb0dyb3VwID0gZnVuY3Rpb24oZmlsZU9iail7XG5cdFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5wdXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL2dyb3Vwcy8nKyBKU09OLnN0cmluZ2lmeShmaWxlT2JqKSlcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnIpe1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycik7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG5cdH07XG5cdHRoaXMucmVtb3ZlUGVvcGxlIFx0PVx0ZnVuY3Rpb24obWVtYmVyKXtcblx0XHR2YXIgZGlmZmVyZWQgXHQ9XHQkcS5kZWZlcigpO1xuXHRcdCRodHRwLnB1dCgkcm9vdFNjb3BlLmVuZFBvaW50ICsnL2FwaS92MS9tZS9ncm91cHMvJytKU09OLnN0cmluZ2lmeShtZW1iZXIpKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuICB0aGlzLnN1Z2dlc3RQZW9wbGUgPSBmdW5jdGlvbihpZCl7XG5cbiAgICBcdHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgXHQkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL2dyb3Vwcy8nICsgaWQpXG4gICAgXHQuc3VjY2VzcyhmdW5jdGlvbihyZXMpe1xuICAgIFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlcyk7XG4gICAgXHR9KVxuICAgIFx0LmVycm9yKGZ1bmN0aW9uKGVycikge1xuICAgIFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyKTtcbiAgICBcdH0pO1xuICAgIFx0cmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfTtcblx0cmV0dXJuIHRoaXM7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdzeW5jJylcbi5jb250cm9sbGVyKCdHcm91cENvbnRyb2xsZXInLCBbXG5cdCckc2NvcGUnLFxuXHQnR3JvdXAnLFxuXHQnVXNlcicsXG5cdCdGaWxlcycsXG5cdCd1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24nLFxuXHRmdW5jdGlvbiBHcm91cENvbnRyb2xsZXIgKFxuXHRcdCRzY29wZSxcblx0XHRHcm91cCxcblx0XHRVc2VyLFxuXHRcdEZpbGVzLFxuXHRcdHVzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvblxuXHQpIHtcblx0JHNjb3BlLmluaXQgXHQ9XHRmdW5jdGlvbigpe1xuXHRcdCRzY29wZS5teUdyb3VwcygpO1xuXG5cdFx0JHNjb3BlLnN1Z2dlc3RlZFBlb3BsZVRvR3JvdXAoKTsvL29mY2F1c2UgdGhleSBhcmUgYXJsZWFkeSB5b3VyIGZyaWVuZCBidXQgbm90IHBhcnRpY2lwYW50IGluIHlvdXIgc3R1ZmYgd29yayFcblx0fTtcblx0JHNjb3BlLnVzZXJJZCBcdFx0XHRcdD1cdGZ1bmN0aW9uKCl7XG5cdFx0VXNlci5faWQoKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdCRzY29wZS51c2VySWQgXHQ9XHRyZXNwb25zZTtcblx0XHR9LCBmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0fSk7XG5cdH07XG5cdCRzY29wZS5teUdyb3VwcyBcdFx0XHQ9XHRmdW5jdGlvbigpe1xuXHRcdEdyb3VwLm15R3JvdXBzKClcblx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHQkc2NvcGUuZ3JvdXAgXHQ9IHJlc3BvbnNlO1xuXHRcdH0sIGZ1bmN0aW9uKGVycm9yKXtcblx0XHR9KTtcblx0fTtcblx0JHNjb3BlLnN1Z2dlc3RlZFBlb3BsZVRvR3JvdXAgXHQ9XHRmdW5jdGlvbihpZCl7XG5cdFx0Ly9jbGVhcmluZyBhbGwgdmlldyByZW5kZXJlZCBiZWZvcmVcblx0XHQkc2NvcGUuc2hvd0ZpbGVzPWZhbHNlO1xuXHRcdCRzY29wZS5zaG93R3JvdXA9ZmFsc2U7XG5cdFx0JHNjb3BlLnNob3dCb3g9ZmFsc2U7XG5cdFx0aWYoIWFuZ3VsYXIuaXNVbmRlZmluZWQoaWQpKXtcblx0XHRcdEdyb3VwLnN1Z2dlc3RQZW9wbGUoaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cdFx0XHRcdCRzY29wZS5mb2xsb3dlcnMgPSByZXNwb25zZTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHQkc2NvcGUuJG9uKCdyZWZyZXNoR3JvdXAnLGZ1bmN0aW9uKCl7XG4gICAgICAgJHNjb3BlLmluaXQoKTtcbiAgXHR9KTtcblx0JHNjb3BlLiRvbignZ3JvdXBEZWxldGVkJywgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkc2NvcGUubXlHcm91cHMoKTtcblx0fSk7XG5cdCRzY29wZS4kb24oJ2dyb3VwVG9iaW5kd2l0aCcsIGZ1bmN0aW9uIChldmVudCwgZ3JvdXBpZCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICRzY29wZS5lbWl0dGVkID1ncm91cGlkO1xuICAgICAgICBpZiggJHNjb3BlLnNob3dGaWxlcyA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICAkc2NvcGUuc2hvd0ZpbGVzPWZhbHNlO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5zdWdnZXN0ZWRQZW9wbGVUb0dyb3VwKGdyb3VwaWQpO1xuICAgICAgICAkc2NvcGUuYWRkUGVvcGxlPXRydWU7XG5cdH0pO1xuXHQkc2NvcGUuZ2V0R3JvdXBGaWxlcyA9IGZ1bmN0aW9uKG93bmVyKXtcbiAgICBGaWxlcy5nZXRHcm91cEZpbGVzKG93bmVyKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHRyZWUpe1xuXHRcdFx0JHNjb3BlLmZpbGVzID0gdHJlZTtcblx0XHRcdFx0Ly9uYXZpZ2F0ZSB0cm91Z2ggdHJlZSByZXNwb25zZSB3aGljaCBpcyByZXF1aXJlIG11Y2ggYXR0ZW50aW9uXG5cdFx0XHRcdCRzY29wZS5ncm91cHM9W107XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdHJlZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKHRyZWVbaV0uaGFzT3duUHJvcGVydHkuZ3JvdXBzICYmIHRyZWVbaV0uZ3JvdXBzKSB7XG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmdyb3Vwcy5wdXNoKHRyZWVbaV0uZnJpZW5kcyk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHRyZWVbaV0uaGFzT3duUHJvcGVydHkoJ2dyb3VwcycpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHQvL0ZJWE1FIGdyb3VwcyBpcyBub3QgZGVmaW5lZCBoZXJlXG5cdFx0XHRcdFx0XHRcdFx0Ly8gJHNjb3BlLmdyb3VwcyA9IGdyb3Vwcy5jb25jYXQodHJhdmVyc2UodHJlZVtpXS5ncm91cHMpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdH0sIGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHR9KTtcbiAgfTtcblx0JHNjb3BlLmdldEJveEZpbGVzID0gZnVuY3Rpb24oZ3JvdXBJZCl7XG5cdFx0JHNjb3BlLmVtaXR0ZWQgPWdyb3VwSWQ7XG4gIFx0RmlsZXMuZ2V0Qm94RmlsZXMoZ3JvdXBJZClcblx0XHQudGhlbihmdW5jdGlvbih0cmVlKXtcblx0XHRcdCRzY29wZS5maWxlcyA9IHRyZWU7XG5cdFx0XHRcdC8vbmF2aWdhdGUgdHJvdWdoIHRyZWUgcmVzcG9uc2Ugd2hpY2ggaXMgcmVxdWlyZSBtdWNoIGF0dGVudGlvblxuXHRcdFx0XHQkc2NvcGUuZ3JvdXBzPVtdO1xuXHRcdFx0XHR2YXIgZ3JvdXBzO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICh0cmVlW2ldLmhhc093blByb3BlcnR5Lmdyb3VwcyAmJiB0cmVlW2ldLmdyb3Vwcykge1xuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5ncm91cHMucHVzaCh0cmVlW2ldLmZyaWVuZHMpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0cmVlW2ldLmhhc093blByb3BlcnR5KCdncm91cHMnKSkge1xuXHRcdFx0XHQgICAgICAgICAgICAkc2NvcGUuZ3JvdXBzID0gZ3JvdXBzLmNvbmNhdCh0cmF2ZXJzZSh0cmVlW2ldLmdyb3VwcykpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0fSwgZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdH0pO1xuICB9O1xuJHNjb3BlLiRvbignc2hvd09wdGlvbnMnLGZ1bmN0aW9uKF8scGFyYW1zKXtcbiAgICAgaWYocGFyYW1zLm93bmVyID09PVwiYm94XCIpe1xuXHRcdFx0ICRzY29wZS5hZGRQZW9wbGU9ZmFsc2U7XG5cdFx0XHQgJHNjb3BlLnNob3dHcm91cD1mYWxzZTtcbiAgICAgICAkc2NvcGUuc2hvd0JveD10cnVlO1xuICAgICAgIGlmKCAkc2NvcGUuYWRkUGVvcGxlID09PSB0cnVlKXtcbiAgICAgICAgICAgJHNjb3BlLmFkZFBlb3BsZT1mYWxzZTtcbiAgICAgICB9XG5cdFx0XHQgLy9zZXQgZmlsZXMgc2NvcGUgdG8gc2hvdyBmaWxlcyBvZiBib3ggZmlsZXMgaXMgcmVwZWF0ZWQgaW4gdmlldyBkaXJlY3RpdmVcbiAgICAgICAkc2NvcGUuZ2V0Qm94RmlsZXMgKHBhcmFtcy5ncm91cF9pZCk7XG5cdFx0IH1lbHNlIGlmIChwYXJhbXMub3duZXIgPT09IFwiZ3JvdXBcIikge1xuXHRcdFx0ICRzY29wZS5zaG93Qm94PWZhbHNlO1xuXHRcdFx0ICRzY29wZS5hZGRQZW9wbGU9ZmFsc2U7XG5cdFx0XHQgJHNjb3BlLnNob3dHcm91cD10cnVlO1xuXHRcdFx0IGlmKCAkc2NvcGUuYWRkUGVvcGxlID09PSB0cnVlKXtcblx0XHRcdFx0XHQgJHNjb3BlLmFkZFBlb3BsZT1mYWxzZTtcblx0XHRcdCB9XG5cdFx0XHQgLy9jaGFuZ2UgZmlsZXMgdG8gbmV3IHNjb3BlIGZpbGVzIHRvIHNob3cgZmlsZXMgb2YgZ3JvdXBzICBpcyByZXBlYXRlZCBpbiB2aWV3IGRpcmVjdGl2ZVxuXHRcdFx0ICRzY29wZS5nZXRHcm91cEZpbGVzIChwYXJhbXMuZ3JvdXBfaWQpO1xuXHRcdCB9XG59KTtcbiRzY29wZS5pbml0KCk7XG59XSk7XG5hbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uZGlyZWN0aXZlKCdteUdyb3VwcycsIFtcblx0J0dyb3VwJyxcblx0J1JlcG9ydCcsXG5cdCd1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24nLFxuXHRmdW5jdGlvbiBteUdyb3VwcyAoXG5cdFx0R3JvdXAsXG5cdFx0UmVwb3J0LFxuXHRcdHVzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbixcblx0XHROb3RpZmljYXRpb24pIHtcblx0cmV0dXJuIHtcblx0XHRwcmlvcml0eTogMTAsXG5cdFx0dGVtcGxhdGVVcmw6ICdBcHAvc2NyaXB0cy9qcy9kaXJlY3RpdmVzL2dyb3Vwcy5odG1sJyxcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHQgIGlkOiAnPXVzZXJJZCcsXG4gICAgICAgICAgZ3JvdXBzOiAnPScsXG4gICAgICAgICAgZm9sbG93ZXJzOiAnPScsXG4gICAgICAgICAgZW1pdHRlZDonPScsXG4gICAgICAgICAgc2hvd1Blb3BsZTonPScsXG4gICAgICAgICAgc2hvd0dyb3VwICAgOiAgJz0nLFxuICAgICAgICAgIGZpbGVzICAgOiAgJz0nLFxuXHQgIFx0XHRcdHNob3dCb3g6ICAnPSdcblx0XHR9LFxuXHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuXHRcdFx0c2NvcGUuZGVsZXRlR3JvdXAgPSBmdW5jdGlvbihpZCl7XG5cdFx0XHRcdEdyb3VwLmRlbGV0ZShpZClcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24ocmVzKXtcblx0XHRcdFx0XHRcdHVzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbi5pbmZvKFwiR3JvdXAgZGVsZXRlZFwiKTtcblx0XHRcdFx0XHQgXHRzY29wZS4kZW1pdChcImdyb3VwRGVsZXRlZFwiLCAnZ3JvdXAgZGVsZXRlZCcpO1xuXHRcdFx0XHR9LCBmdW5jdGlvbihlcnIpe1xuXHRcdFx0XHRcdFJlcG9ydC5zZW5kKCdkZWxldGUgZ3JvdXAgZXJyb3I6JytlcnIpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKXt9LCBmdW5jdGlvbigpe30pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG4gICAgICBzY29wZS5jcmVhdGVHcm91cFx0PVx0ZnVuY3Rpb24obmFtZSl7XG4gICAgICAgICAgR3JvdXAuY3JlYXRlKG5hbWUpXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLnN1Y2Nlc3MoXCJDcmVhdGVkIG5ldyBHcm91cFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kZW1pdCgncmVmcmVzaEdyb3VwJyxudWxsKTtcbiAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfTtcblx0XHRcdHNjb3BlLmluaXRBZGRQZW9wbGUgPSBmdW5jdGlvbihncm91cGlkKXtcblx0XHRcdFx0c2NvcGUuJGVtaXQoXCJncm91cFRvYmluZHdpdGhcIiwgZ3JvdXBpZCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRzY29wZS5hZGRQZW9wbGUgPSBmdW5jdGlvbihwYXJhbXMpe1xuXHRcdFx0XHR2YXIgbmV3UGFyYW1zID17XG5cdFx0XHRcdFx0J29wdGlvbic6J2FkZE1lbWJlcicsXG5cdFx0XHRcdFx0J3VzZXJJZCc6cGFyYW1zLnVzZXJJZCxcblx0XHRcdFx0XHQnZ3JvdXBJZCc6cGFyYW1zLmdyb3VwSWRcblx0XHRcdFx0fTtcblx0XHRcdFx0aWYoYW5ndWxhci5pc1VuZGVmaW5lZChwYXJhbXMpKXtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0Ly93b24ndCBoYXBwZW4hb3IgaWYgdGkgaGFwcGVuIHdlIHF1aXRcblx0XHRcdFx0fWVsc2V7XG5cblx0XHRcdFx0XHRHcm91cC5hZGRQZW9wbGUobmV3UGFyYW1zKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHQvL3JlZnJlc2ggZ3JvdXAgd2l0aCBuZXcgbWVtYmVyIHN0YXR1c1xuXHRcdFx0XHRcdFx0XHR1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24uc3VjY2VzcyhcIkFkZGVkIE1lbWJlciBpbiBncm91cC5cIik7XG4gICAgICAgICAgICAgIHNjb3BlLmluaXRBZGRQZW9wbGUocGFyYW1zLmdyb3VwSWQpO1xuICAgICAgICAgICAgICBzY29wZS4kZW1pdCgncmVmcmVzaEdyb3VwJywnJyk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcblx0XHRcdFx0XHR9LCBmdW5jdGlvbiAoZXJyb3Isc3RhdHVzKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0c2NvcGUucmVtb3ZlUGVvcGxlID0gZnVuY3Rpb24ocGFyYW1zKXtcblxuXHRcdFx0XHR2YXIgbmV3UGFyYW1zID17XG5cdFx0XHRcdFx0J29wdGlvbic6J3JlbW92ZU1lbWJlcicsXG5cdFx0XHRcdFx0J3VzZXJJZCc6cGFyYW1zLnVzZXJJZCxcblx0XHRcdFx0XHQnZ3JvdXBJZCc6cGFyYW1zLmdyb3VwSWRcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZihhbmd1bGFyLmlzVW5kZWZpbmVkKHBhcmFtcykpe1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHQvL3dvbid0IGhhcHBlbiFvciBpZiB0aSBoYXBwZW4gd2UgcXVpdCB0b28gYmFkIGhpZXJhY2h5IVxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0R3JvdXAucmVtb3ZlUGVvcGxlKG5ld1BhcmFtcylcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuXHRcdFx0XHRcdFx0XHR1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24uaW5mbyhcIlJlbW92ZWQgTWVtYmVyIGluIGdyb3VwLlwiKTtcblx0ICAgICAgICAgICAgc2NvcGUuaW5pdEFkZFBlb3BsZShwYXJhbXMuZ3JvdXBJZCk7XG5cdCAgICAgICAgICAgIHNjb3BlLiRlbWl0KCdyZWZyZXNoR3JvdXAnLCcnKTtcbiAgICAgICAgICAgIFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xuXHRcdFx0XHRcdH0sIGZ1bmN0aW9uIChlcnJvcixzdGF0dXMpe1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRzY29wZS5yZW1vdmVGcm9tR3JvdXAgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygnd2UgY2FuIHJlbW92ZSBmaWxlIGluIGdyb3VwJyk7XG5cdFx0XHR9O1xuXHRcdFx0c2NvcGUuYWRkRmlsZVRvR3JvdXAgPSBmdW5jdGlvbihwYXJhbXMpe1xuXHRcdFx0XHR2YXIgZmlsZU9iaiA9e1xuXHRcdFx0XHRcdCdvcHRpb24nOidhZGRGaWxlcycsXG5cdFx0XHRcdFx0J2ZpbGVJZCc6cGFyYW1zLmZpbGVJZCxcblx0XHRcdFx0XHQnZ3JvdXBJZCc6cGFyYW1zLmdyb3VwSWRcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRHcm91cC5hZGRGaWxlVG9Hcm91cChmaWxlT2JqKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xuXHRcdFx0XHRcdC8vIHVzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbi5zdWNjZXNzKFwiQSBmaWxlIGlzIGFkZGVkIGluIGdyb3VwXCIpO1xuXHRcdFx0XHR9LGZ1bmN0aW9uKGVycil7XG5cdFx0XHRcdFx0dXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLndhcm4oXCJTb21lIGVycm9yIG9jY3VyZWQgZHVyaW5nIGFkZGluZyBmaWxlXCIpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fTtcblx0XHRcdHNjb3BlLmZpbGVzSW5Cb3ggPSBmdW5jdGlvbihncm91cGlkKXtcblx0XHRcdFx0dmFyIHBhcmFtcyA9eydncm91cF9pZCc6Z3JvdXBpZCwnb3duZXInOidib3gnfTtcblx0XHRcdFx0c2NvcGUuJGVtaXQoJ3Nob3dPcHRpb25zJyxwYXJhbXMpO1xuXG5cdFx0XHR9O1xuXHRcdFx0c2NvcGUuZmlsZXNJbkdyb3VwID0gZnVuY3Rpb24oZ3JvdXBpZCl7XG5cblx0XHRcdFx0dmFyIHBhcmFtcyA9eydncm91cF9pZCc6Z3JvdXBpZCwnb3duZXInOidncm91cCd9O1xuXHRcdFx0XHRzY29wZS4kZW1pdCgnc2hvd09wdGlvbnMnLHBhcmFtcyk7XG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuLnNlcnZpY2UoJ1JlcG9ydCcsIFtmdW5jdGlvbiBSZXBvcnQgKCRodHRwLCRxLCRyb290U2NvcGUpIHtcblx0dGhpcy5zZW5kID0gZnVuY3Rpb24oaXNzdWUpe1xuXHRcdHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0JGh0dHAucG9zdCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvaXNzdWVzJywgaXNzdWUpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnIpIHtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnIpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuXHRyZXR1cm4gdGhpcztcbn1dKTtcbiIsIi8qIGdsb2JhbCBzeW5jICovXG5hbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uc2VydmljZSgnU2V0dGluZ3MnLCBbJyRodHRwJywnJHJvb3RTY29wZScsJyRxJyxmdW5jdGlvbiAoJGh0dHAsJHJvb3RTY29wZSwkcSkge1xuXHR0aGlzLmN1cnJlbnQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL3NldHRpbmdzJylcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcCl7XG4gICAgICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3ApO1xuICAgICAgICB9KVxuICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuLmNvbnRyb2xsZXIoJ1NldHRpbmdzQ29udHJvbGxlcicsIFsnJHNjb3BlJywnU2V0dGluZ3MnLCckbG9nJywgZnVuY3Rpb24gKCRzY29wZSxTZXR0aW5ncywkbG9nKSB7XG5cdCRzY29wZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLmxvYWRDdXJyZW50U2V0dGluZ3MoKTtcbiAgICB9O1xuICAgICAkc2NvcGUubG9hZEN1cnJlbnRTZXR0aW5ncyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICBTZXR0aW5ncy5jdXJyZW50KCkudGhlbihmdW5jdGlvbihyZXNwKXtcbiAgICAgICAgICAgICAkc2NvcGUuc2V0dGluZ3MgPSByZXNwO1xuICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAkbG9nLmluZm8oJ2VycnJvciBwcmV2ZW50IHByb21pc2UgdG8gYmUgZnVsbGZpbGwnKTtcbiAgICAgICAgIH0pO1xuICAgICB9O1xuICAgICAkc2NvcGUuaW5pdCgpO1xufV0pO1xuIiwiLyogZ2xvYmFsIHN5bmMgKi9cbmFuZ3VsYXIubW9kdWxlKCdzeW5jJykuY29udHJvbGxlcignU2hhcmVDb250cm9sbGVyJywgW1xuXHQnJHNjb3BlJyxcblx0JyRyb290U2NvcGUnLFxuXHQnJHJvdXRlUGFyYW1zJyxcblx0JyRyb3V0ZScsXG5cdCckbG9nJyxcblx0JyR1aWJNb2RhbCcsXG5cdCdTaGFyZScsXG5cdCdVc2VyJyxcblx0ZnVuY3Rpb24gKFxuXHRcdCRzY29wZSxcblx0XHQkcm9vdFNjb3BlLFxuXHRcdCRyb3V0ZVBhcmFtcyxcblx0XHQkcm91dGUsXG5cdFx0JGxvZyxcblx0XHQkdWliTW9kYWwsXG5cdFx0U2hhcmUsXG5cdFx0VXNlclxuXHQpXG57XG5cblx0JHNjb3BlLnNoYXJlID0gZnVuY3Rpb24oZmlsZV9pZCl7XG5cdFx0Ly8gYWxlcnQoJ2hlcmUnKTtcblx0XHRjb25zb2xlLmxvZyhmaWxlX2lkKTtcblx0fTtcbn1cbl0pO1xuIiwiLyogZ2xvYmFsIHN5bmMgKi9cbi8qIGdsb2JhbCBhbmd1bGFyICovXG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc3luYycpXG4gICAgLmNvbnRyb2xsZXIoJ1VwbG9hZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdGaWxlVXBsb2FkZXInLCckcm9vdFNjb3BlJywnRmlsZXMnLCckc3RhdGVQYXJhbXMnLCdERUJVRycsJ2NhY2hlRmFjdG9yeScsIGZ1bmN0aW9uKCRzY29wZSwgRmlsZVVwbG9hZGVyLCRyb290U2NvcGUsRmlsZXMsJHN0YXRlUGFyYW1zLERFQlVHLGNhY2hlRmFjdG9yeSkge1xuICAgICAgICB2YXIgdXBsb2FkZXIgPSAkc2NvcGUudXBsb2FkZXIgPSBuZXcgRmlsZVVwbG9hZGVyKHtcbiAgICAgICAgICAgIHVybDogJHJvb3RTY29wZS5lbmRQb2ludCsnL2FwaS92MS91cGxvYWQnXG4gICAgICAgIH0pO1xuICAgICAgICAvL0ZJTFRFUlNcbiAgICAgICAgdXBsb2FkZXIuZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6ICdjdXN0b21GaWx0ZXInLFxuXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24oaXRlbSAvKntGaWxlfEZpbGVMaWtlT2JqZWN0fSovLCBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVldWUubGVuZ3RoIDwgMTA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgc3BsaXRlZCA9IGNhY2hlRmFjdG9yeS5nZXQoJ2ZvbGRlclN0cnVjdHVyZScpLnNwbGljZSgnJyksXG4gICAgICAgICAgICBjb21iaW5lc1BhdGhfc3RydWN0dXJlID0gc3BsaXRlZC5qb2luKCcnKTtcbiAgICAgICAgdXBsb2FkZXIuZm9ybURhdGEucHVzaCh7XG4gICAgICAgICAgICAvL2FjY2VzcyB0aGlzIGZvbGRlcklkIGluIHlvdXIgYmFja2VuZCEgd2l0aCByZXF1ZXN0IG9yIGlucHV0OjpnZXQoJ2ZvbGRlcklkJylcbiAgICAgICAgICAgICBmb2xkZXJJZDokc3RhdGVQYXJhbXMuZm9sZGVySWQsXG4gICAgICAgICAgICAgZm9sZGVyU3RydWN0dXJlOmNvbWJpbmVzUGF0aF9zdHJ1Y3R1cmVcblxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coJHN0YXRlUGFyYW1zLmZvbGRlcklkKTtcbiAgICAgICAgLy9DQUxMQkFDS1NcbiAgICAgICAgdXBsb2FkZXIub25XaGVuQWRkaW5nRmlsZUZhaWxlZCA9IGZ1bmN0aW9uKGl0ZW0gLyp7RmlsZXxGaWxlTGlrZU9iamVjdH0qLywgZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgICAgICAvLyBpZihERUJVRyA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmluZm8oJ29uV2hlbkFkZGluZ0ZpbGVGYWlsZWQnLCBpdGVtLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICB9O1xuICAgICAgICB1cGxvYWRlci5vbkFmdGVyQWRkaW5nRmlsZSA9IGZ1bmN0aW9uKGZpbGVJdGVtKSB7XG4gICAgICAgICAgICAvLyBpZihERUJVRyA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmluZm8oJ29uQWZ0ZXJBZGRpbmdGaWxlJywgZmlsZUl0ZW0pO1xuICAgICAgICB9O1xuICAgICAgICB1cGxvYWRlci5vbkFmdGVyQWRkaW5nQWxsID0gZnVuY3Rpb24oYWRkZWRGaWxlSXRlbXMpIHtcbiAgICAgICAgICAgIC8vIGlmKERFQlVHID09PSB0cnVlKVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUuaW5mbygnb25BZnRlckFkZGluZ0FsbCcsIGFkZGVkRmlsZUl0ZW1zKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25CZWZvcmVVcGxvYWRJdGVtID0gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgLy8gaWYoREVCVUcgPT09IHRydWUpXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5pbmZvKCdvbkJlZm9yZVVwbG9hZEl0ZW0nLCBpdGVtKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25Qcm9ncmVzc0l0ZW0gPSBmdW5jdGlvbihmaWxlSXRlbSwgcHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIC8vIGlmKERFQlVHID09PSB0cnVlKVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUuaW5mbygnb25Qcm9ncmVzc0l0ZW0nLCBmaWxlSXRlbSwgcHJvZ3Jlc3MpO1xuICAgICAgICB9O1xuICAgICAgICB1cGxvYWRlci5vblByb2dyZXNzQWxsID0gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIC8vIGlmKERFQlVHID09PSB0cnVlKVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUuaW5mbygnb25Qcm9ncmVzc0FsbCcsIHByb2dyZXNzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25TdWNjZXNzSXRlbSA9IGZ1bmN0aW9uKGZpbGVJdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7XG4gICAgICAgICAgICAvLyBpZihERUJVRyA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmluZm8oJ29uU3VjY2Vzc0l0ZW0nLCBmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG4gICAgICAgIH07XG4gICAgICAgIHVwbG9hZGVyLm9uRXJyb3JJdGVtID0gZnVuY3Rpb24oZmlsZUl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcbiAgICAgICAgICAgIC8vIGlmKERFQlVHID09PSB0cnVlKVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUuaW5mbygnb25FcnJvckl0ZW0nLCBmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG4gICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25DYW5jZWxJdGVtID0gZnVuY3Rpb24oZmlsZUl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcbiAgICAgICAgICAgIC8vIGlmKERFQlVHID09PSB0cnVlKVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUuaW5mbygnb25DYW5jZWxJdGVtJywgZmlsZUl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuICAgICAgICB9O1xuICAgICAgICB1cGxvYWRlci5vbkNvbXBsZXRlSXRlbSA9IGZ1bmN0aW9uKGZpbGVJdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdmaWxlOmxpc3QnKTtcbiAgICAgICAgICAgIC8vIGlmKERFQlVHID09PSB0cnVlKVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUuaW5mbygnb25Db21wbGV0ZUl0ZW0nLCBmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG4gICAgICAgIH07XG4gICAgICAgIHVwbG9hZGVyLm9uQ29tcGxldGVBbGwgPSBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICBGaWxlcy5nZXRCb3hGaWxlcygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAkc2NvcGUuZmlsZXMgXHQ9XHRyZXM7XG5cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YUxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ29uQ29tcGxldGVBbGwnKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoREVCVUcgPT09IHRydWUpXG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ3VwbG9hZGVyJywgdXBsb2FkZXIpO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuLnNlcnZpY2UoJ3VybFNob3J0ZW5lcicsW2Z1bmN0aW9uKCl7XG4gIHRoaXMubWFrZVNob3J0ID0gZnVuY3Rpb24obG9uZ1VybCl7XG4gICAgcmV0dXJuIGxvbmdVcmw7XG4gIH07XG4gIC8vIHRoaXMubWFrZVNob3J0ID0gZnVuY3Rpb24obG9uZ1VybClcbiAgLy8ge1xuICAvLyAgIC8vICB2YXIgbG9uZ1VybD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvbmd1cmxcIikudmFsdWU7XG4gIC8vICAgICB2YXIgcmVxdWVzdCA9IGdhcGkuY2xpZW50LnVybHNob3J0ZW5lci51cmwuaW5zZXJ0KHtcbiAgLy8gICAgICdyZXNvdXJjZSc6IHtcbiAgLy8gICAgICAgJ2xvbmdVcmwnOiBsb25nVXJsXG4gIC8vIFx0fVxuICAvLyAgICAgfSk7XG4gIC8vICAgICByZXF1ZXN0LmV4ZWN1dGUoZnVuY3Rpb24ocmVzcG9uc2UpXG4gIC8vIFx0e1xuICAvL1xuICAvLyBcdFx0aWYocmVzcG9uc2UuaWQgIT0gbnVsbClcbiAgLy8gXHRcdHtcbiAgLy8gXHRcdFx0c3RyID1cIjxiPkxvbmcgVVJMOjwvYj5cIitsb25nVXJsK1wiPGJyPlwiO1xuICAvLyBcdFx0XHRzdHIgKz1cIjxiPnlvdXIgRmlsZSBpczo8L2I+IDxhIGhyZWY9J1wiK3Jlc3BvbnNlLmlkK1wiJz5cIityZXNwb25zZS5pZCtcIjwvYT48YnI+XCI7XG4gIC8vIFx0XHRcdHJldHVybiBzdHI7XG4gIC8vIFx0XHR9XG4gIC8vIFx0XHRlbHNlXG4gIC8vIFx0XHR7XG4gIC8vIFx0XHRcdGNvbnNvbGUubG9nKFwiZXJyb3I6IHVuYWJsZSB0byBjcmVhdGUgc2hvcnQgdXJsXCIpO1xuICAvLyBcdFx0fVxuICAvL1xuICAvLyAgICAgfSk7XG4gIC8vICB9XG4gIC8vXG4gIC8vIHRoaXMuZ2V0U2hvcnRJbmZvID0gZnVuY3Rpb24oKVxuICAvLyAge1xuICAvLyAgICAgIHZhciBzaG9ydFVybD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3J0dXJsXCIpLnZhbHVlO1xuICAvL1xuICAvLyAgICAgIHZhciByZXF1ZXN0ID0gZ2FwaS5jbGllbnQudXJsc2hvcnRlbmVyLnVybC5nZXQoe1xuICAvLyAgICAgICAgJ3Nob3J0VXJsJzogc2hvcnRVcmwsXG4gIC8vICBcdCAgICAgJ3Byb2plY3Rpb24nOidGVUxMJ1xuICAvLyAgICAgIH0pO1xuICAvLyAgICAgIHJlcXVlc3QuZXhlY3V0ZShmdW5jdGlvbihyZXNwb25zZSlcbiAgLy8gIFx0e1xuICAvLyAgXHRcdGlmKHJlc3BvbnNlLmxvbmdVcmwhPSBudWxsKVxuICAvLyAgXHRcdHtcbiAgLy8gIFx0XHRcdHN0ciA9XCI8Yj5Mb25nIFVSTDo8L2I+XCIrcmVzcG9uc2UubG9uZ1VybCtcIjxicj5cIjtcbiAgLy8gIFx0XHRcdHN0ciArPVwiPGI+Q3JlYXRlIE9uOjwvYj5cIityZXNwb25zZS5jcmVhdGVkK1wiPGJyPlwiO1xuICAvLyAgXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdXRwdXRcIikuaW5uZXJIVE1MID0gc3RyO1xuICAvLyAgXHRcdH1cbiAgLy8gIFx0XHRlbHNlXG4gIC8vICBcdFx0e1xuICAvLyAgXHRcdFx0Y29uc29sZS5sb2coXCJlcnJvcjogdW5hYmxlIHRvIGdldCBVUkwgaW5mb3JtYXRpb25cIik7XG4gIC8vICBcdFx0fVxuICAvL1xuICAvLyAgICAgIH0pO1xuICAvL1xuICAvLyAgfVxuICAvLyAgZnVuY3Rpb24gbG9hZCgpXG4gIC8vICB7XG4gIC8vICBcdGdhcGkuY2xpZW50LnNldEFwaUtleSgnQUl6YVN5RFNuN3o3VjFmNkgzeVhyZ0FsZ1ZHdzUyZFNFbXFBTEljJyk7IC8vZ2V0IHlvdXIgb3dubiBCcm93c2VyIEFQSSBLRVlcbiAgLy8gIFx0Z2FwaS5jbGllbnQubG9hZCgndXJsc2hvcnRlbmVyJywgJ3YxJyxmdW5jdGlvbigpe30pO1xuICAvLyAgfVxuICAvLyAgd2luZG93Lm9ubG9hZCA9IGxvYWQ7XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uY29udHJvbGxlcigndXNlckNvbnRyb2xsZXInLFsnVXNlcicsJyRzY29wZScsZnVuY3Rpb24oVXNlciwkc2NvcGUpe1xuXG4gICRzY29wZS5vcHRpb25zID1be2xvZ291dDonbG9nb3V0J31dO1xuICBVc2VyLmdldFVzZXJuYW1lKClcbiAgLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuICB9KS5jYXRjaCgpO1xuICAvLyAkc2NvcGUudXNlciA9ICdTdHJpbVVwJztcblxufV0pO1xuIiwiICAvL1xuICAvLyAoZnVuY3Rpb24oaSxzLG8sZyxyLGEsbSl7aVsnR29vZ2xlQW5hbHl0aWNzT2JqZWN0J109cjtpW3JdPWlbcl18fGZ1bmN0aW9uKCl7XG4gIC8vIChpW3JdLnE9aVtyXS5xfHxbXSkucHVzaChhcmd1bWVudHMpfSxpW3JdLmw9MSpuZXcgRGF0ZSgpO2E9cy5jcmVhdGVFbGVtZW50KG8pLFxuICAvLyBtPXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07YS5hc3luYz0xO2Euc3JjPWc7bS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLG0pXG4gIC8vIH0pKHdpbmRvdyxkb2N1bWVudCwnc2NyaXB0JywnLy93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzJywnZ2EnKTtcbiAgLy9cbiAgLy8gZ2EoJ2NyZWF0ZScsICdVQS02NDk1NTg2Ni0yJywgJ2F1dG8nKTtcbiAgLy8gZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiIsIiAgICAgICAgLy90aGlzIGZ1bmN0aW9uIGNhbiByZW1vdmUgYW4gYXJyYXkgZWxlbWVudC5cbiAgICAgICAgdmFyIGVsZW1lbnQgO1xuICAgICAgICAgICAgQXJyYXkucmVtb3ZlID0gZnVuY3Rpb24oYXJyYXksIGZyb20sIHRvKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3QgPSBhcnJheS5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IGFycmF5Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgYXJyYXkubGVuZ3RoID0gZnJvbSA8IDAgPyBhcnJheS5sZW5ndGggKyBmcm9tIDogZnJvbTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXkucHVzaC5hcHBseShhcnJheSwgcmVzdCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHRvdGFsX3BvcHVwcyA9IDA7XG4gICAgICAgICAgICB2YXIgcG9wdXBzID0gW107XG4gICAgICAgICAgICBmdW5jdGlvbiBjbG9zZV9wb3B1cChpZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGlpaSA9IDA7IGlpaSA8IHBvcHVwcy5sZW5ndGg7IGlpaSsrKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoaWQgPT09IHBvcHVwc1tpaWldKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5yZW1vdmUocG9wdXBzLCBpaWkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVfcG9wdXBzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9kaXNwbGF5cyB0aGUgcG9wdXBzLiBEaXNwbGF5cyBiYXNlZCBvbiB0aGUgbWF4aW11bSBudW1iZXIgb2YgcG9wdXBzIHRoYXQgY2FuIGJlIGRpc3BsYXllZCBvbiB0aGUgY3VycmVudCB2aWV3cG9ydCB3aWR0aFxuICAgICAgICAgICAgZnVuY3Rpb24gZGlzcGxheV9wb3B1cHMoKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciByaWdodCA9IDIyMDtcblxuICAgICAgICAgICAgICAgIHZhciBpaWkgPSAwO1xuICAgICAgICAgICAgICAgIGZvcihpaWk7IGlpaSA8IHRvdGFsX3BvcHVwczsgaWlpKyspXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZihwb3B1cHNbaWlpXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHVwc1tpaWldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucmlnaHQgPSByaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gcmlnaHQgKyAzMjA7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGpqaiA9IGlpaTsgampqIDwgcG9wdXBzLmxlbmd0aDsgampqKyspXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHVwc1tqampdKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdGhpcyBzY3JpcHQgaGFzIGJlZW4gYWRkZWQgYnkgbWUgZm9yIG15IGN1c3RvbWVcblxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheFNldHVwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdYLUNTUkYtVE9LRU4nOiAkKCdtZXRhW25hbWU9XCJjc3JmLXRva2VuXCJdJykuYXR0cignY29udGVudCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAgICAgICAgICQoXCIjY2hhdFwiKS5rZXlwcmVzcyhmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGV2dC53aGljaCA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIndlIGFyZSBsaXN0bmluZyB0byBlbnRlciBldmVudFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl1c2VybmFtZSA9ICQoJyNzaG91dF91c2VybmFtZScpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1lc3NhZ2UgPSAkKCcjc2hvdXRfbWVzc2FnZScpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0X2RhdGEgPSB7J3VzZXJuYW1lJzppdXNlcm5hbWUsICdtZXNzYWdlJzppbWVzc2FnZX07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zZW5kIGRhdGEgdG8gXCJzaG91dC5waHBcIiB1c2luZyBqUXVlcnkgJC5wb3N0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5wb3N0KCdzaG91dC5waHAnLCBwb3N0X2RhdGEsIGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9hcHBlbmQgZGF0YSBpbnRvIG1lc3NhZ2Vib3ggd2l0aCBqUXVlcnkgZmFkZSBlZmZlY3QhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGRhdGEpLmhpZGUoKS5hcHBlbmRUbygnLm1lc3NhZ2VfYm94JykuZmFkZUluKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8va2VlcCBzY3JvbGxlZCB0byBib3R0b20gb2YgY2hhdCFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY3JvbGx0b2ggPSAkKCcubWVzc2FnZV9ib3gnKVswXS5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcubWVzc2FnZV9ib3gnKS5zY3JvbGxUb3Aoc2Nyb2xsdG9oKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNldCB2YWx1ZSBvZiBtZXNzYWdlIGJveFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3Nob3V0X21lc3NhZ2UnKS52YWwoJycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9hbGVydCBIVFRQIHNlcnZlciBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChlcnIuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy90b2dnbGUgaGlkZS9zaG93IHNob3V0IGJveFxuICAgICAgICAgICAgICAgICAgICAkKFwiLmNsb3NlX2J0blwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9nZXQgQ1NTIGRpc3BsYXkgc3RhdGUgb2YgLnRvZ2dsZV9jaGF0IGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2dnbGVTdGF0ZSA9ICQoJy50b2dnbGVfY2hhdCcpLmNzcygnZGlzcGxheScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RvZ2dsZSBzaG93L2hpZGUgY2hhdCBib3hcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy50b2dnbGVfY2hhdCcpLnNsaWRlVG9nZ2xlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXNlIHRvZ2dsZVN0YXRlIHZhciB0byBjaGFuZ2UgY2xvc2Uvb3BlbiBpY29uIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0b2dnbGVTdGF0ZSA9PT0gJ2Jsb2NrJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmhlYWRlciBkaXZcIikuYXR0cignY2xhc3MnLCAnb3Blbl9idG4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuaGVhZGVyIGRpdlwiKS5hdHRyKCdjbGFzcycsICdjbG9zZV9idG4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8qZG9uZSBhZGRpbmcgbXkgY3VzdG9tIHNjcmlwdHMqL1xuICAgICAgICAgICAgLy9jcmVhdGVzIG1hcmt1cCBmb3IgYSBuZXcgcG9wdXAuIEFkZHMgdGhlIGlkIHRvIHBvcHVwcyBhcnJheS5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyX3BvcHVwKGlkLCBuYW1lKVxuICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpaWkgPSAwOyBpaWkgPCBwb3B1cHMubGVuZ3RoOyBpaWkrKylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vYWxyZWFkeSByZWdpc3RlcmVkLiBCcmluZyBpdCB0byBmcm9udC5cbiAgICAgICAgICAgICAgICAgICAgaWYoaWQgPT09IHBvcHVwc1tpaWldKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5yZW1vdmUocG9wdXBzLCBpaWkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cHMudW5zaGlmdChpZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZV9wb3B1cHMoKTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudD0nPGRpdiBjbGFzcz1cInBvcHVwLWJveCBjaGF0LXBvcHVwXCIgaWQ9XCInKyBpZCArJ1wiPic7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPWVsZW1lbnQgKyAnPGRpdiBzdHlsZT1cImJhY2tncm91bmQ6I2RkZDtjb2xvcjojZmZmO1wiIGNsYXNzPVwiaGVhZGVyXCI+R3JvdXA8ZGl2IGNsYXNzPVwiY2xvc2VfYnRuXCI+Jm5ic3A7PC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9ZWxlbWVudCArICcgPGRpdiBjbGFzcz1cInRvZ2dsZV9jaGF0XCI+JztcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9ZWxlbWVudCArICc8ZGl2IGNsYXNzPVwibWVzc2FnZV9ib3hcIj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID1lbGVtZW50ICsgJzx0ZXh0YXJlYSBzdHlsZT1cImJhY2tncm91bmQ6d2hpdGU7bWFyZ2luLXRvcDoxODBweDtcIiBpZD1cImNoYXRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHJvd3M9XCIzXCIgcmVxdWlyZWQ9XCJyZXF1aXJlZFwiPjwvdGV4dGFyZWE+JztcbiAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0uaW5uZXJIVE1MID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdLmlubmVySFRNTCArIGVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBwb3B1cHMudW5zaGlmdChpZCk7XG5cbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVfcG9wdXBzKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jYWxjdWxhdGUgdGhlIHRvdGFsIG51bWJlciBvZiBwb3B1cHMgc3VpdGFibGUgYW5kIHRoZW4gcG9wdWxhdGUgdGhlIHRvYXRhbF9wb3B1cHMgdmFyaWFibGUuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVfcG9wdXBzKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgICAgICBpZih3aWR0aCA8IDU0MClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsX3BvcHVwcyA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gd2lkdGggLSAyMDA7XG4gICAgICAgICAgICAgICAgICAgIC8vMzIwIGlzIHdpZHRoIG9mIGEgc2luZ2xlIHBvcHVwIGJveFxuICAgICAgICAgICAgICAgICAgICB0b3RhbF9wb3B1cHMgPSBwYXJzZUludCh3aWR0aC8zMjApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRpc3BsYXlfcG9wdXBzKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9yZWNhbGN1bGF0ZSB3aGVuIHdpbmRvdyBpcyBsb2FkZWQgYW5kIGFsc28gd2hlbiB3aW5kb3cgaXMgcmVzaXplZC5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIGNhbGN1bGF0ZV9wb3B1cHMpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGNhbGN1bGF0ZV9wb3B1cHMpOyIsIi8vQXV0aG9yIE11cmFnaWppbWFuYSBSaWNoYXJkIHN0cmltdXBAZ21haWwuY29tIGJlYXN0YXI0NTdAZ21haWwuY29tXG5cbiAgYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuICAuY29udHJvbGxlcignTWVzc2FnZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJGh0dHAsJHNjb3BlLCRxLCRyb290U2NvcGUpIHtcbiAgICAgICAkLmFqYXhTZXR1cCh7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ1gtQ1NSRi1UT0tFTic6ICQoJ21ldGFbbmFtZT1cImNzcmYtdG9rZW5cIl0nKS5hdHRyKCdjb250ZW50JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICBcbiAgICAgICAgICRzY29wZS5uYW1lPVwiTXVyYWdpamltYW5hXCI7XG4gICAgICAgICB2YXIgcG9zdHM9JGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9wb3N0JyksXG4gICAgICAgICAgICAgaW5zdGl0dXRpb25zPSRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvcG9zdCcpO1xuXG4gICAgICAgICAgJHEuYWxsKFtwb3N0cyxpbnN0aXR1dGlvbnNdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgdmFyIHRtcCA9IFtdO1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJlc3VsdCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgdG1wLnB1c2gocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0bXA7XG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbih0bXBSZXN1bHQpIHtcbiAgICAgICAgICAgICAgLy8gcG9zdHM9dG1wUmVzdWx0O1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhbmd1bGFyLnRvSnNvbih0bXBSZXN1bHRbMF0sIHRydWUpKTtcbiAgICAgICAgICAgICRzY29wZS5wb3N0cyA9IHRtcFJlc3VsdFswXTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICQoJy5wb3N0LWluJykuYXR3aG8oe1xuICAgICAgICAgICAgYXQ6IFwiQFwiLFxuICAgICAgICAgICAgZGF0YTpbJ1BldGVyJywgJ1RvbScsICdBbm5lJ10sXG5cbiAgICAgICAgIH0pO1xuXG4gIH0pO1xuIiwiXG5hbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uY29udHJvbGxlcihcIlR1dG9yaWFsTW9kYWxcIiwgZnVuY3Rpb24oJHNjb3BlKSB7XG5cbiAgJHNjb3BlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuc2hvd01vZGFsID0gdHJ1ZTtcbiAgfTtcbiAgJHNjb3BlLm9rID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnNob3dNb2RhbCA9IGZhbHNlO1xuICB9O1xuXG4gICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuc2hvd01vZGFsID0gZmFsc2U7XG4gIH07XG5cbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnc3luYycpXG4uY29udHJvbGxlcihcIlN0cmltaW5Nb2RhbFwiLCBmdW5jdGlvbigkc2NvcGUpIHtcblxuICAkc2NvcGUub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5zaG93TW9kYWwgPSB0cnVlO1xuICB9O1xuICAkc2NvcGUub2sgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuc2hvd01vZGFsID0gZmFsc2U7XG4gIH07XG5cbiAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5zaG93TW9kYWwgPSBmYWxzZTtcbiAgfTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
