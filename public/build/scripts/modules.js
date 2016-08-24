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


//remove dependecies
//,"infinite-scroll", ngfolderLists 'ng-mfb' ngContextMenu ngDialog
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
angular.module("sync", ["ngRoute","angularFileUpload","ui.bootstrap","ui.router",'ngMaterial', 'material.svgAssetsCache',"pascalprecht.translate","ui.select","ngSanitize"])
.constant('DEBUG',true)



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
            templateUrl:  "/views/files.html",
            controller: 'FilesController'
          });
          
          $urlRouterProvider.otherwise('/Files');
}])
//application components
.directive('files', [function () {
  return {
    restrict: 'E',
    templateUrl: '/views/components/files.html',
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
    templateUrl: '/views/components/folders.html',
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

angular.module('sync')
.controller('dialogController',[function() {
    
}]);
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

angular.module('sync')
    .controller('FilesController', ["$scope", function ($scope) {
        $scope.files = [
            {
                "id": 1,
                "name": "logo6.JPG",
                "type": "JPG",
                "group_id": null,
                "user_id": 2,
                "folder_id": 2,
                "dropbox_name": "phpG67640XKpDugtNGsT.JPG",
                "file_size": 25445,
                "mime": "image/jpeg",
                "created_at": "2016-08-20 21:07:01",
                "updated_at": "2016-08-20 21:07:01",
                "deleted_at": null,
                "groups": [],
                "user": {
                    "id": 2,
                    "email": "beastar457@gmail.com",
                    "username": "beastar457",
                    "first_name": null,
                    "avatar": "/img/you.png",
                    "provider": "streamupbox.com",
                    "provider_id": null,
                    "online": 0,
                    "last_name": null,
                    "gender": null,
                    "phone": "+250722267513",
                    "country_id": 1,
                    "verified": 1,
                    "dropbox_token": null,
                    "deleted_at": null,
                    "created_at": "2016-08-20 21:06:21",
                    "updated_at": "2016-08-21 15:10:01",
                    "stripe_active": 0,
                    "stripe_id": null,
                    "stripe_subscription": null,
                    "stripe_plan": null,
                    "trial_ends_at": null,
                    "subscription_ends_at": null
                }
            },
            {
                "id": 3,
                "name": "Get Started with Dropbox.pdf",
                "type": "pdf",
                "group_id": null,
                "user_id": 2,
                "folder_id": 2,
                "dropbox_name": "phpjd0oDw2JvXnhesCQq.pdf",
                "file_size": 692088,
                "mime": "application/pdf",
                "created_at": "2016-08-22 11:02:19",
                "updated_at": "2016-08-22 11:02:19",
                "deleted_at": null,
                "groups": [],
                "user": {
                    "id": 2,
                    "email": "beastar457@gmail.com",
                    "username": "beastar457",
                    "first_name": null,
                    "avatar": "/img/you.png",
                    "provider": "streamupbox.com",
                    "provider_id": null,
                    "online": 0,
                    "last_name": null,
                    "gender": null,
                    "phone": "+250722267513",
                    "country_id": 1,
                    "verified": 1,
                    "dropbox_token": null,
                    "deleted_at": null,
                    "created_at": "2016-08-20 21:06:21",
                    "updated_at": "2016-08-21 15:10:01",
                    "stripe_active": 0,
                    "stripe_id": null,
                    "stripe_subscription": null,
                    "stripe_plan": null,
                    "trial_ends_at": null,
                    "subscription_ends_at": null
                }
            }
        ];
    }]);
angular.module("sync")
    .controller('FolderController', ['$scope', 'DEBUG', '$stateParams', '$rootScope', 'cacheFactory', function ($scope, DEBUG, $stateParams, $rootScope, cacheFactory) {
        $scope.foldes = [
            {
                "id": 21,
                "encrypted_id": "$2y$10$U/.7I7rVaqqk4cbQxWHve.HQgb0Z4P27ZzmVh/tb/bRx1r90923bO",
                "name": "VC",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 0,
                "copy_count": 0,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 15:23:03",
                "updated_at": "2016-08-21 15:23:03"
            },
            {
                "id": 22,
                "encrypted_id": "$2y$10$kaX.Mfh37tKiiL2mdAhM8eRw2h2aUMDodqgrjnM0.lAFE2Pq1jbUi",
                "name": "VC",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 1,
                "copy_count": 1,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 15:24:07",
                "updated_at": "2016-08-21 15:24:07"
            },
            {
                "id": 24,
                "encrypted_id": "$2y$10$HjC2OPaSh5ZQPytwVI4Fk.HLRZvrpUQIyhnKdZaBgyEZl4yAIKoO2",
                "name": "bbf",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 0,
                "copy_count": 0,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 15:26:32",
                "updated_at": "2016-08-21 15:26:32"
            },
            {
                "id": 25,
                "encrypted_id": "$2y$10$HlsFh4L6LATORvCN.FNeA.Km.tSLA0Ynh853/ARIh8Sa6kQ/WGMfm",
                "name": "bbfb",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 0,
                "copy_count": 0,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 15:26:38",
                "updated_at": "2016-08-21 15:26:38"
            },
            {
                "id": 27,
                "encrypted_id": "$2y$10$.E12vRjlzjSPIAHitwElJOc5qCiKQmbHDTlMsxyU75Xerb4Fip42m",
                "name": "01",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 0,
                "copy_count": 0,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 16:19:07",
                "updated_at": "2016-08-21 16:19:08"
            },
            {
                "id": 29,
                "encrypted_id": "$2y$10$LyZbDHjJZhEtDT7p7UYTSeB9E56nDJ4E0R4h/eJ5t368XzXGMb9BG",
                "name": "xc",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 1,
                "copy_count": 2,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 16:24:17",
                "updated_at": "2016-08-21 16:24:18"
            }
        ];
    }])
    .factory("cacheFactory", ["$cacheFactory", function ($cacheFactory) {
        //be cautious with this!
        return $cacheFactory("userData");
    }]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXItdXBsb2FkLmpzIiwiYXBwQ29uZmlnLmpzIiwiZGlhbG9ncy5qcyIsImxvZ2luQ29udHJvbGxlci5qcyIsInJlZ2lzdGVyQ29udHJvbGxlci5qcyIsImZpbGVzL2ZpbGVzLmpzIiwiZmlsZXMvZm9sZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUFLQSxDQUFDLFNBQVMsaUNBQWlDLE1BQU0sU0FBUztDQUN6RCxHQUFHLE9BQU8sWUFBWSxZQUFZLE9BQU8sV0FBVztFQUNuRCxPQUFPLFVBQVU7TUFDYixHQUFHLE9BQU8sV0FBVyxjQUFjLE9BQU87RUFDOUMsT0FBTyxJQUFJO01BQ1AsR0FBRyxPQUFPLFlBQVk7RUFDMUIsUUFBUSx5QkFBeUI7O0VBRWpDLEtBQUsseUJBQXlCO0dBQzdCLE1BQU0sV0FBVztBQUNwQixRQUFRLENBQUMsU0FBUyxTQUFTOztFQUV6QixJQUFJLG1CQUFtQjs7O0VBR3ZCLFNBQVMsb0JBQW9CLFVBQVU7OztHQUd0QyxHQUFHLGlCQUFpQjtJQUNuQixPQUFPLGlCQUFpQixVQUFVOzs7R0FHbkMsSUFBSSxTQUFTLGlCQUFpQixZQUFZO0lBQ3pDLFNBQVM7SUFDVCxJQUFJO0lBQ0osUUFBUTs7OztHQUlULFFBQVEsVUFBVSxLQUFLLE9BQU8sU0FBUyxRQUFRLE9BQU8sU0FBUzs7O0dBRy9ELE9BQU8sU0FBUzs7O0dBR2hCLE9BQU8sT0FBTzs7Ozs7RUFLZixvQkFBb0IsSUFBSTs7O0VBR3hCLG9CQUFvQixJQUFJOzs7RUFHeEIsb0JBQW9CLElBQUk7OztFQUd4QixPQUFPLG9CQUFvQjs7O0VBRzNCOztNQUVJLFNBQVMsUUFBUSxTQUFTLHFCQUFxQjs7Q0FFcEQ7O0NBRUEsSUFBSSxrQkFBa0IsVUFBVSxLQUFLLEVBQUUsT0FBTyxPQUFPLElBQUksYUFBYSxJQUFJLGFBQWE7O0NBRXZGLElBQUksU0FBUyxnQkFBZ0Isb0JBQW9COztDQUVqRCxJQUFJLFVBQVUsZ0JBQWdCLG9CQUFvQjs7Q0FF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QVc7Z0JBQ1gsaUJBQWlCO2dCQUNqQixrQkFBa0I7Z0JBQ2xCLGNBQWM7Z0JBQ2QsY0FBYzs7WUFFbEI7Z0JBQ0ksTUFBTTtnQkFDTixnQkFBZ0I7Z0JBQ2hCLFFBQVE7Z0JBQ1IsUUFBUTtnQkFDUixRQUFRO2dCQUNSLGlCQUFpQjtnQkFDakIsWUFBWTtnQkFDWixjQUFjO2dCQUNkLFdBQVc7Z0JBQ1gsaUJBQWlCO2dCQUNqQixrQkFBa0I7Z0JBQ2xCLGNBQWM7Z0JBQ2QsY0FBYzs7OztLQUl6QixRQUFRLGtDQUFnQixVQUFVLGVBQWU7O1FBRTlDLE9BQU8sY0FBYzs7QUFFN0IiLCJmaWxlIjoibW9kdWxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gYW5ndWxhci1maWxlLXVwbG9hZCB2Mi4yLjBcbiBodHRwczovL2dpdGh1Yi5jb20vbmVydmdoL2FuZ3VsYXItZmlsZS11cGxvYWRcbiovXG5cbihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImFuZ3VsYXItZmlsZS11cGxvYWRcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiYW5ndWxhci1maWxlLXVwbG9hZFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuICAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbiB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHR2YXIgb3B0aW9ucyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDIpKTtcblxuXHR2YXIgc2VydmljZUZpbGVVcGxvYWRlciA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKTtcblxuXHR2YXIgc2VydmljZUZpbGVMaWtlT2JqZWN0ID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oNCkpO1xuXG5cdHZhciBzZXJ2aWNlRmlsZUl0ZW0gPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXyg1KSk7XG5cblx0dmFyIHNlcnZpY2VGaWxlRGlyZWN0aXZlID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oNikpO1xuXG5cdHZhciBzZXJ2aWNlRmlsZVNlbGVjdCA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDcpKTtcblxuXHR2YXIgc2VydmljZUZpbGVEcm9wID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oOCkpO1xuXG5cdHZhciBzZXJ2aWNlRmlsZU92ZXIgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXyg5KSk7XG5cblx0dmFyIGRpcmVjdGl2ZUZpbGVTZWxlY3QgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxMCkpO1xuXG5cdHZhciBkaXJlY3RpdmVGaWxlRHJvcCA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDExKSk7XG5cblx0dmFyIGRpcmVjdGl2ZUZpbGVPdmVyID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMTIpKTtcblxuXHRhbmd1bGFyLm1vZHVsZShDT05GSUcubmFtZSwgW10pLnZhbHVlKFwiZmlsZVVwbG9hZGVyT3B0aW9uc1wiLCBvcHRpb25zKS5mYWN0b3J5KFwiRmlsZVVwbG9hZGVyXCIsIHNlcnZpY2VGaWxlVXBsb2FkZXIpLmZhY3RvcnkoXCJGaWxlTGlrZU9iamVjdFwiLCBzZXJ2aWNlRmlsZUxpa2VPYmplY3QpLmZhY3RvcnkoXCJGaWxlSXRlbVwiLCBzZXJ2aWNlRmlsZUl0ZW0pLmZhY3RvcnkoXCJGaWxlRGlyZWN0aXZlXCIsIHNlcnZpY2VGaWxlRGlyZWN0aXZlKS5mYWN0b3J5KFwiRmlsZVNlbGVjdFwiLCBzZXJ2aWNlRmlsZVNlbGVjdCkuZmFjdG9yeShcIkZpbGVEcm9wXCIsIHNlcnZpY2VGaWxlRHJvcCkuZmFjdG9yeShcIkZpbGVPdmVyXCIsIHNlcnZpY2VGaWxlT3ZlcikuZGlyZWN0aXZlKFwibnZGaWxlU2VsZWN0XCIsIGRpcmVjdGl2ZUZpbGVTZWxlY3QpLmRpcmVjdGl2ZShcIm52RmlsZURyb3BcIiwgZGlyZWN0aXZlRmlsZURyb3ApLmRpcmVjdGl2ZShcIm52RmlsZU92ZXJcIiwgZGlyZWN0aXZlRmlsZU92ZXIpLnJ1bihbXCJGaWxlVXBsb2FkZXJcIiwgXCJGaWxlTGlrZU9iamVjdFwiLCBcIkZpbGVJdGVtXCIsIFwiRmlsZURpcmVjdGl2ZVwiLCBcIkZpbGVTZWxlY3RcIiwgXCJGaWxlRHJvcFwiLCBcIkZpbGVPdmVyXCIsIGZ1bmN0aW9uIChGaWxlVXBsb2FkZXIsIEZpbGVMaWtlT2JqZWN0LCBGaWxlSXRlbSwgRmlsZURpcmVjdGl2ZSwgRmlsZVNlbGVjdCwgRmlsZURyb3AsIEZpbGVPdmVyKSB7XG5cdCAgICAvLyBvbmx5IGZvciBjb21wYXRpYmlsaXR5XG5cdCAgICBGaWxlVXBsb2FkZXIuRmlsZUxpa2VPYmplY3QgPSBGaWxlTGlrZU9iamVjdDtcblx0ICAgIEZpbGVVcGxvYWRlci5GaWxlSXRlbSA9IEZpbGVJdGVtO1xuXHQgICAgRmlsZVVwbG9hZGVyLkZpbGVEaXJlY3RpdmUgPSBGaWxlRGlyZWN0aXZlO1xuXHQgICAgRmlsZVVwbG9hZGVyLkZpbGVTZWxlY3QgPSBGaWxlU2VsZWN0O1xuXHQgICAgRmlsZVVwbG9hZGVyLkZpbGVEcm9wID0gRmlsZURyb3A7XG5cdCAgICBGaWxlVXBsb2FkZXIuRmlsZU92ZXIgPSBGaWxlT3Zlcjtcblx0fV0pO1xuXG4vKioqLyB9LFxuXG4vKiAxICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0XHRcIm5hbWVcIjogXCJhbmd1bGFyRmlsZVVwbG9hZFwiXG5cdH07XG5cbi8qKiovIH0sXG4vKiAyICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0ICAgIHVybDogXCIvXCIsXG5cdCAgICBhbGlhczogXCJmaWxlXCIsXG5cdCAgICBoZWFkZXJzOiB7J2F1dGhvcml6YXRpb24nOiAnQmVhcmVyIDhFdXFjTU5rRjJ5UDUwRGljcHY5aExSUnA3V09TYWJQbEN1MjJsaVknfSxcblxuXHQgICAgcXVldWU6IFtdLFxuXHQgICAgcHJvZ3Jlc3M6IDAsXG5cdCAgICBhdXRvVXBsb2FkOiBmYWxzZSxcblx0ICAgIHJlbW92ZUFmdGVyVXBsb2FkOiBmYWxzZSxcblx0ICAgIG1ldGhvZDogXCJQT1NUXCIsXG5cdCAgICBmaWx0ZXJzOiBbXSxcblx0ICAgIGZvcm1EYXRhOiBbXSxcblx0ICAgIHF1ZXVlTGltaXQ6IE51bWJlci5NQVhfVkFMVUUsXG5cdCAgICB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlXG5cdH07XG5cbi8qKiovIH0sXG4vKiAzICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajsgfTtcblxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGtleSBpbiBwcm9wcykgeyB2YXIgcHJvcCA9IHByb3BzW2tleV07IHByb3AuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKHByb3AudmFsdWUpIHByb3Aud3JpdGFibGUgPSB0cnVlOyB9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpOyB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cblx0dmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIGNvcHkgPSBhbmd1bGFyLmNvcHk7XG5cdHZhciBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZDtcblx0dmFyIGZvckVhY2ggPSBhbmd1bGFyLmZvckVhY2g7XG5cdHZhciBpc09iamVjdCA9IGFuZ3VsYXIuaXNPYmplY3Q7XG5cdHZhciBpc051bWJlciA9IGFuZ3VsYXIuaXNOdW1iZXI7XG5cdHZhciBpc0RlZmluZWQgPSBhbmd1bGFyLmlzRGVmaW5lZDtcblx0dmFyIGlzQXJyYXkgPSBhbmd1bGFyLmlzQXJyYXk7XG5cdHZhciBlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZpbGVVcGxvYWRlck9wdGlvbnMsICRyb290U2NvcGUsICRodHRwLCAkd2luZG93LCBGaWxlTGlrZU9iamVjdCwgRmlsZUl0ZW0pIHtcblx0ICAgIHZhciBGaWxlID0gJHdpbmRvdy5GaWxlO1xuXHQgICAgdmFyIEZvcm1EYXRhID0gJHdpbmRvdy5Gb3JtRGF0YTtcblxuXHQgICAgdmFyIEZpbGVVcGxvYWRlciA9IChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcblx0ICAgICAgICAgKiBQVUJMSUNcblx0ICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEZpbGVVcGxvYWRlclxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cblx0ICAgICAgICAgKiBAY29uc3RydWN0b3Jcblx0ICAgICAgICAgKi9cblxuXHQgICAgICAgIGZ1bmN0aW9uIEZpbGVVcGxvYWRlcihvcHRpb25zKSB7XG5cdCAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGaWxlVXBsb2FkZXIpO1xuXG5cdCAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9IGNvcHkoZmlsZVVwbG9hZGVyT3B0aW9ucyk7XG5cblx0ICAgICAgICAgICAgZXh0ZW5kKHRoaXMsIHNldHRpbmdzLCBvcHRpb25zLCB7XG5cdCAgICAgICAgICAgICAgICBpc1VwbG9hZGluZzogZmFsc2UsXG5cdCAgICAgICAgICAgICAgICBfbmV4dEluZGV4OiAwLFxuXHQgICAgICAgICAgICAgICAgX2ZhaWxGaWx0ZXJJbmRleDogLTEsXG5cdCAgICAgICAgICAgICAgICBfZGlyZWN0aXZlczogeyBzZWxlY3Q6IFtdLCBkcm9wOiBbXSwgb3ZlcjogW10gfVxuXHQgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICAvLyBhZGQgZGVmYXVsdCBmaWx0ZXJzXG5cdCAgICAgICAgICAgIHRoaXMuZmlsdGVycy51bnNoaWZ0KHsgbmFtZTogXCJxdWV1ZUxpbWl0XCIsIGZuOiB0aGlzLl9xdWV1ZUxpbWl0RmlsdGVyIH0pO1xuXHQgICAgICAgICAgICB0aGlzLmZpbHRlcnMudW5zaGlmdCh7IG5hbWU6IFwiZm9sZGVyXCIsIGZuOiB0aGlzLl9mb2xkZXJGaWx0ZXIgfSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2NyZWF0ZUNsYXNzKEZpbGVVcGxvYWRlciwge1xuXHQgICAgICAgICAgICBhZGRUb1F1ZXVlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEFkZHMgaXRlbXMgdG8gdGhlIHF1ZXVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8SFRNTElucHV0RWxlbWVudHxPYmplY3R8RmlsZUxpc3R8QXJyYXk8T2JqZWN0Pn0gZmlsZXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXk8RnVuY3Rpb24+fFN0cmluZ30gZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRUb1F1ZXVlKGZpbGVzLCBvcHRpb25zLCBmaWx0ZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gdGhpcy5pc0FycmF5TGlrZU9iamVjdChmaWxlcykgPyBmaWxlcyA6IFtmaWxlc107XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGFycmF5T2ZGaWx0ZXJzID0gdGhpcy5fZ2V0RmlsdGVycyhmaWx0ZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgY291bnQgPSB0aGlzLnF1ZXVlLmxlbmd0aDtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgYWRkZWRGaWxlSXRlbXMgPSBbXTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2gobGlzdCwgZnVuY3Rpb24gKHNvbWUgLyp7RmlsZXxIVE1MSW5wdXRFbGVtZW50fE9iamVjdH0qLykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IG5ldyBGaWxlTGlrZU9iamVjdChzb21lKTtcblxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuX2lzVmFsaWRGaWxlKHRlbXAsIGFycmF5T2ZGaWx0ZXJzLCBvcHRpb25zKSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVJdGVtID0gbmV3IEZpbGVJdGVtKF90aGlzLCBzb21lLCBvcHRpb25zKTtcblxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWRGaWxlSXRlbXMucHVzaChmaWxlSXRlbSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5xdWV1ZS5wdXNoKGZpbGVJdGVtKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vbkFmdGVyQWRkaW5nRmlsZShmaWxlSXRlbSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsdGVyID0gYXJyYXlPZkZpbHRlcnNbX3RoaXMuX2ZhaWxGaWx0ZXJJbmRleF07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25XaGVuQWRkaW5nRmlsZUZhaWxlZCh0ZW1wLCBmaWx0ZXIsIG9wdGlvbnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggIT09IGNvdW50KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQWZ0ZXJBZGRpbmdBbGwoYWRkZWRGaWxlSXRlbXMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gdGhpcy5fZ2V0VG90YWxQcm9ncmVzcygpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmF1dG9VcGxvYWQpIHRoaXMudXBsb2FkQWxsKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHJlbW92ZUZyb21RdWV1ZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZW1vdmUgaXRlbXMgZnJvbSB0aGUgcXVldWUuIFJlbW92ZSBsYXN0OiBpbmRleCA9IC0xXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfE51bWJlcn0gdmFsdWVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRnJvbVF1ZXVlKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleE9mSXRlbSh2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLnF1ZXVlW2luZGV4XTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pc1VwbG9hZGluZykgaXRlbS5jYW5jZWwoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlLnNwbGljZShpbmRleCwgMSk7XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fZGVzdHJveSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSB0aGlzLl9nZXRUb3RhbFByb2dyZXNzKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGNsZWFyUXVldWU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2xlYXJzIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhclF1ZXVlKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLnF1ZXVlLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlWzBdLnJlbW92ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gMDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgdXBsb2FkSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBVcGxvYWRzIGEgaXRlbSBmcm9tIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbXxOdW1iZXJ9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwbG9hZEl0ZW0odmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4T2ZJdGVtKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVldWVbaW5kZXhdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc3BvcnQgPSB0aGlzLmlzSFRNTDUgPyBcIl94aHJUcmFuc3BvcnRcIiA6IFwiX2lmcmFtZVRyYW5zcG9ydFwiO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fcHJlcGFyZVRvVXBsb2FkaW5nKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNVcGxvYWRpbmcpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgICAgICAgICAgICAgIH10aGlzLmlzVXBsb2FkaW5nID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzW3RyYW5zcG9ydF0oaXRlbSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGNhbmNlbEl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FuY2VscyB1cGxvYWRpbmcgb2YgaXRlbSBmcm9tIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbXxOdW1iZXJ9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNhbmNlbEl0ZW0odmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4T2ZJdGVtKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVldWVbaW5kZXhdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5pc0hUTUw1ID8gXCJfeGhyXCIgOiBcIl9mb3JtXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5pc1VwbG9hZGluZykgaXRlbVtwcm9wXS5hYm9ydCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICB1cGxvYWRBbGw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogVXBsb2FkcyBhbGwgbm90IHVwbG9hZGVkIGl0ZW1zIG9mIHF1ZXVlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwbG9hZEFsbCgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmdldE5vdFVwbG9hZGVkSXRlbXMoKS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFpdGVtLmlzVXBsb2FkaW5nO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICAgICAgICAgICAgICB9Zm9yRWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uX3ByZXBhcmVUb1VwbG9hZGluZygpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW1zWzBdLnVwbG9hZCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBjYW5jZWxBbGw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FuY2VscyBhbGwgdXBsb2Fkc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5nZXROb3RVcGxvYWRlZEl0ZW1zKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY2FuY2VsKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGlzRmlsZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIHZhbHVlIGFuIGluc3RhbmNlIG9mIEZpbGVcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaXNGaWxlKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuaXNGaWxlKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNGaWxlTGlrZU9iamVjdDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIHZhbHVlIGFuIGluc3RhbmNlIG9mIEZpbGVMaWtlT2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRmlsZUxpa2VPYmplY3QodmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5pc0ZpbGVMaWtlT2JqZWN0KHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNBcnJheUxpa2VPYmplY3Q6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBpcyBhcnJheSBsaWtlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuaXNBcnJheUxpa2VPYmplY3QodmFsdWUpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBnZXRJbmRleE9mSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIGEgaW5kZXggb2YgaXRlbSBmcm9tIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtJdGVtfE51bWJlcn0gdmFsdWVcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEluZGV4T2ZJdGVtKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSA/IHZhbHVlIDogdGhpcy5xdWV1ZS5pbmRleE9mKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgZ2V0Tm90VXBsb2FkZWRJdGVtczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG5vdCB1cGxvYWRlZCBpdGVtc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0FycmF5fVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXROb3RVcGxvYWRlZEl0ZW1zKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnF1ZXVlLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWl0ZW0uaXNVcGxvYWRlZDtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgZ2V0UmVhZHlJdGVtczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIGl0ZW1zIHJlYWR5IGZvciB1cGxvYWRcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtBcnJheX1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UmVhZHlJdGVtcygpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5xdWV1ZS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXNSZWFkeSAmJiAhaXRlbS5pc1VwbG9hZGluZztcblx0ICAgICAgICAgICAgICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uIChpdGVtMSwgaXRlbTIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0xLmluZGV4IC0gaXRlbTIuaW5kZXg7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGRlc3Ryb3k6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRGVzdHJveXMgaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2godGhpcy5fZGlyZWN0aXZlcywgZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKF90aGlzLl9kaXJlY3RpdmVzW2tleV0sIGZ1bmN0aW9uIChvYmplY3QpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5kZXN0cm95KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkFmdGVyQWRkaW5nQWxsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBmaWxlSXRlbXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25BZnRlckFkZGluZ0FsbChmaWxlSXRlbXMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQWZ0ZXJBZGRpbmdGaWxlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBmaWxlSXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkFmdGVyQWRkaW5nRmlsZShmaWxlSXRlbSkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25XaGVuQWRkaW5nRmlsZUZhaWxlZDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlfE9iamVjdH0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZpbHRlclxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25XaGVuQWRkaW5nRmlsZUZhaWxlZChpdGVtLCBmaWx0ZXIsIG9wdGlvbnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQmVmb3JlVXBsb2FkSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gZmlsZUl0ZW1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25CZWZvcmVVcGxvYWRJdGVtKGZpbGVJdGVtKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvblByb2dyZXNzSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gZmlsZUl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblByb2dyZXNzSXRlbShmaWxlSXRlbSwgcHJvZ3Jlc3MpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uUHJvZ3Jlc3NBbGw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblByb2dyZXNzQWxsKHByb2dyZXNzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvblN1Y2Nlc3NJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uRXJyb3JJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkVycm9ySXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkNhbmNlbEl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ2FuY2VsSXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkNvbXBsZXRlSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25Db21wbGV0ZUFsbDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNvbXBsZXRlQWxsKCkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2dldFRvdGFsUHJvZ3Jlc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG5cdCAgICAgICAgICAgICAgICAgKiBQUklWQVRFXG5cdCAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyB0aGUgdG90YWwgcHJvZ3Jlc3Ncblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdmFsdWVdXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFRvdGFsUHJvZ3Jlc3ModmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW1vdmVBZnRlclVwbG9hZCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgfHwgMDtcblx0ICAgICAgICAgICAgICAgICAgICB9dmFyIG5vdFVwbG9hZGVkID0gdGhpcy5nZXROb3RVcGxvYWRlZEl0ZW1zKCkubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB1cGxvYWRlZCA9IG5vdFVwbG9hZGVkID8gdGhpcy5xdWV1ZS5sZW5ndGggLSBub3RVcGxvYWRlZCA6IHRoaXMucXVldWUubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciByYXRpbyA9IDEwMCAvIHRoaXMucXVldWUubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gKHZhbHVlIHx8IDApICogcmF0aW8gLyAxMDA7XG5cblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh1cGxvYWRlZCAqIHJhdGlvICsgY3VycmVudCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9nZXRGaWx0ZXJzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgYXJyYXkgb2YgZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheTxGdW5jdGlvbj58U3RyaW5nfSBmaWx0ZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXk8RnVuY3Rpb24+fVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldEZpbHRlcnMoZmlsdGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICghZmlsdGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJzO1xuXHQgICAgICAgICAgICAgICAgICAgIH1pZiAoaXNBcnJheShmaWx0ZXJzKSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVycztcblx0ICAgICAgICAgICAgICAgICAgICB9dmFyIG5hbWVzID0gZmlsdGVycy5tYXRjaCgvW15cXHMsXSsvZyk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVycy5maWx0ZXIoZnVuY3Rpb24gKGZpbHRlcikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZXMuaW5kZXhPZihmaWx0ZXIubmFtZSkgIT09IC0xO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfcmVuZGVyOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFVwZGF0ZXMgaHRtbFxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3JlbmRlcigpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoISRyb290U2NvcGUuJCRwaGFzZSkgJHJvb3RTY29wZS4kYXBwbHkoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2ZvbGRlckZpbHRlcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIGl0ZW0gaXMgYSBmaWxlIChub3QgZm9sZGVyKVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlfEZpbGVMaWtlT2JqZWN0fSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9mb2xkZXJGaWx0ZXIoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIShpdGVtLnNpemUgfHwgaXRlbS50eXBlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3F1ZXVlTGltaXRGaWx0ZXI6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB0aGUgbGltaXQgaGFzIG5vdCBiZWVuIHJlYWNoZWRcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3F1ZXVlTGltaXRGaWx0ZXIoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVldWUubGVuZ3RoIDwgdGhpcy5xdWV1ZUxpbWl0O1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfaXNWYWxpZEZpbGU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiBmaWxlIHBhc3MgYWxsIGZpbHRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZXxPYmplY3R9IGZpbGVcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXk8RnVuY3Rpb24+fSBmaWx0ZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaXNWYWxpZEZpbGUoZmlsZSwgZmlsdGVycywgb3B0aW9ucykge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWlsRmlsdGVySW5kZXggPSAtMTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWZpbHRlcnMubGVuZ3RoID8gdHJ1ZSA6IGZpbHRlcnMuZXZlcnkoZnVuY3Rpb24gKGZpbHRlcikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZmFpbEZpbHRlckluZGV4Kys7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuZm4uY2FsbChfdGhpcywgZmlsZSwgb3B0aW9ucyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9pc1N1Y2Nlc3NDb2RlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENoZWNrcyB3aGV0aGVyIHVwbG9hZCBzdWNjZXNzZnVsXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9pc1N1Y2Nlc3NDb2RlKHN0YXR1cykge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCB8fCBzdGF0dXMgPT09IDMwNDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3RyYW5zZm9ybVJlc3BvbnNlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFRyYW5zZm9ybXMgdGhlIHNlcnZlciByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHsqfVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3RyYW5zZm9ybVJlc3BvbnNlKHJlc3BvbnNlLCBoZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnNHZXR0ZXIgPSB0aGlzLl9oZWFkZXJzR2V0dGVyKGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2goJGh0dHAuZGVmYXVsdHMudHJhbnNmb3JtUmVzcG9uc2UsIGZ1bmN0aW9uICh0cmFuc2Zvcm1Gbikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IHRyYW5zZm9ybUZuKHJlc3BvbnNlLCBoZWFkZXJzR2V0dGVyKTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9wYXJzZUhlYWRlcnM6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUGFyc2VkIHJlc3BvbnNlIGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuXHQgICAgICAgICAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvbWFzdGVyL3NyYy9uZy9odHRwLmpzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgcGFyc2VkID0ge30sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGtleSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFsLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCFoZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWQ7XG5cdCAgICAgICAgICAgICAgICAgICAgfWZvckVhY2goaGVhZGVycy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24gKGxpbmUpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGxpbmUuaW5kZXhPZihcIjpcIik7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGxpbmUuc2xpY2UoMCwgaSkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IGxpbmUuc2xpY2UoaSArIDEpLnRyaW0oKTtcblxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyBcIiwgXCIgKyB2YWwgOiB2YWw7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWQ7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9oZWFkZXJzR2V0dGVyOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJzZWRIZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaGVhZGVyc0dldHRlcihwYXJzZWRIZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkSGVhZGVyc1tuYW1lLnRvTG93ZXJDYXNlKCldIHx8IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZEhlYWRlcnM7XG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3hoclRyYW5zcG9ydDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBUaGUgWE1MSHR0cFJlcXVlc3QgdHJhbnNwb3J0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfeGhyVHJhbnNwb3J0KGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHhociA9IGl0ZW0uX3hociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkJlZm9yZVVwbG9hZEl0ZW0oaXRlbSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKGl0ZW0uZm9ybURhdGEsIGZ1bmN0aW9uIChvYmopIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChvYmosIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZChrZXksIHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0uX2ZpbGUuc2l6ZSAhPSBcIm51bWJlclwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGUgZmlsZSBzcGVjaWZpZWQgaXMgbm8gbG9uZ2VyIHZhbGlkXCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kKGl0ZW0uYWxpYXMsIGl0ZW0uX2ZpbGUsIGl0ZW0uZmlsZS5uYW1lKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKGV2ZW50Lmxlbmd0aENvbXB1dGFibGUgPyBldmVudC5sb2FkZWQgKiAxMDAgLyBldmVudC50b3RhbCA6IDApO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25Qcm9ncmVzc0l0ZW0oaXRlbSwgcHJvZ3Jlc3MpO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGVhZGVycyA9IF90aGlzLl9wYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gX3RoaXMuX3RyYW5zZm9ybVJlc3BvbnNlKHhoci5yZXNwb25zZSwgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBnaXN0ID0gX3RoaXMuX2lzU3VjY2Vzc0NvZGUoeGhyLnN0YXR1cykgPyBcIlN1Y2Nlc3NcIiA6IFwiRXJyb3JcIjtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1ldGhvZCA9IFwiX29uXCIgKyBnaXN0ICsgXCJJdGVtXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzW21ldGhvZF0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSBfdGhpcy5fcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF90aGlzLl90cmFuc2Zvcm1SZXNwb25zZSh4aHIucmVzcG9uc2UsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25FcnJvckl0ZW0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSBfdGhpcy5fcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF90aGlzLl90cmFuc2Zvcm1SZXNwb25zZSh4aHIucmVzcG9uc2UsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25DYW5jZWxJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ29tcGxldGVJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgeGhyLm9wZW4oaXRlbS5tZXRob2QsIGl0ZW0udXJsLCB0cnVlKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBpdGVtLndpdGhDcmVkZW50aWFscztcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2goaXRlbS5oZWFkZXJzLCBmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQoZm9ybSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9pZnJhbWVUcmFuc3BvcnQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogVGhlIElGcmFtZSB0cmFuc3BvcnRcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9pZnJhbWVUcmFuc3BvcnQoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybSA9IGVsZW1lbnQoXCI8Zm9ybSBzdHlsZT1cXFwiZGlzcGxheTogbm9uZTtcXFwiIC8+XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpZnJhbWUgPSBlbGVtZW50KFwiPGlmcmFtZSBuYW1lPVxcXCJpZnJhbWVUcmFuc3BvcnRcIiArIERhdGUubm93KCkgKyBcIlxcXCI+XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IGl0ZW0uX2lucHV0O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uX2Zvcm0pIGl0ZW0uX2Zvcm0ucmVwbGFjZVdpdGgoaW5wdXQpOyAvLyByZW1vdmUgb2xkIGZvcm1cblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9mb3JtID0gZm9ybTsgLy8gc2F2ZSBsaW5rIHRvIG5ldyBmb3JtXG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkJlZm9yZVVwbG9hZEl0ZW0oaXRlbSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpbnB1dC5wcm9wKFwibmFtZVwiLCBpdGVtLmFsaWFzKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2goaXRlbS5mb3JtRGF0YSwgZnVuY3Rpb24gKG9iaikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50XyA9IGVsZW1lbnQoXCI8aW5wdXQgdHlwZT1cXFwiaGlkZGVuXFxcIiBuYW1lPVxcXCJcIiArIGtleSArIFwiXFxcIiAvPlwiKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRfLnZhbCh2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZChlbGVtZW50Xyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgZm9ybS5wcm9wKHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBpdGVtLnVybCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBpZnJhbWUucHJvcChcIm5hbWVcIiksXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGVuY3R5cGU6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGluZzogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgLy8gb2xkIElFXG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpZnJhbWUuYmluZChcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0dXMgPSAyMDA7XG5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpeCBmb3IgbGVnYWN5IElFIGJyb3dzZXJzIHRoYXQgbG9hZHMgaW50ZXJuYWwgZXJyb3IgcGFnZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiBmYWlsZWQgV1MgcmVzcG9uc2UgcmVjZWl2ZWQuIEluIGNvbnNlcXVlbmNlIGlmcmFtZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGVudCBhY2Nlc3MgZGVuaWVkIGVycm9yIGlzIHRocm93biBiZWNvdXNlIHRyeWluZyB0b1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWNjZXNzIGNyb3NzIGRvbWFpbiBwYWdlLiBXaGVuIHN1Y2ggdGhpbmcgb2NjdXJzIG5vdGlmeWluZ1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2l0aCBlbXB0eSByZXNwb25zZSBvYmplY3QuIFNlZSBtb3JlIGluZm8gYXQ6XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE1MTM2Mi9hY2Nlc3MtaXMtZGVuaWVkLWVycm9yLW9uLWFjY2Vzc2luZy1pZnJhbWUtZG9jdW1lbnQtb2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3RlIHRoYXQgaWYgbm9uIHN0YW5kYXJkIDR4eCBvciA1eHggZXJyb3IgY29kZSByZXR1cm5lZFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnJvbSBXUyB0aGVuIHJlc3BvbnNlIGNvbnRlbnQgY2FuIGJlIGFjY2Vzc2VkIHdpdGhvdXQgZXJyb3Jcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCAnWEhSJyBzdGF0dXMgYmVjb21lcyAyMDAuIEluIG9yZGVyIHRvIGF2b2lkIGNvbmZ1c2lvblxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuaW5nIHJlc3BvbnNlIHZpYSBzYW1lICdzdWNjZXNzJyBldmVudCBoYW5kbGVyLlxuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXhlZCBhbmd1bGFyLmNvbnRlbnRzKCkgZm9yIGlmcmFtZXNcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgPSBpZnJhbWVbMF0uY29udGVudERvY3VtZW50LmJvZHkuaW5uZXJIVE1MO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiBjYXNlIHdlIHJ1biBpbnRvIHRoZSBhY2Nlc3MtaXMtZGVuaWVkIGVycm9yIG9yIHdlIGhhdmUgYW5vdGhlciBlcnJvciBvbiB0aGUgc2VydmVyIHNpZGVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIChpbnRlbnRpb25hbCA1MDAsNDAuLi4gZXJyb3JzKSwgd2UgYXQgbGVhc3Qgc2F5ICdzb21ldGhpbmcgd2VudCB3cm9uZycgLT4gNTAwXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMgPSA1MDA7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgeGhyID0geyByZXNwb25zZTogaHRtbCwgc3RhdHVzOiBzdGF0dXMsIGR1bW15OiB0cnVlIH07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoZWFkZXJzID0ge307XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF90aGlzLl90cmFuc2Zvcm1SZXNwb25zZSh4aHIucmVzcG9uc2UsIGhlYWRlcnMpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ29tcGxldGVJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvcm0uYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4aHIgPSB7IHN0YXR1czogMCwgZHVtbXk6IHRydWUgfTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSB7fTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmcmFtZS51bmJpbmQoXCJsb2FkXCIpLnByb3AoXCJzcmNcIiwgXCJqYXZhc2NyaXB0OmZhbHNlO1wiKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXBsYWNlV2l0aChpbnB1dCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ2FuY2VsSXRlbShpdGVtLCByZXNwb25zZSwgeGhyLnN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vbkNvbXBsZXRlSXRlbShpdGVtLCByZXNwb25zZSwgeGhyLnN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGlucHV0LmFmdGVyKGZvcm0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kKGlucHV0KS5hcHBlbmQoaWZyYW1lKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvcm1bMF0uc3VibWl0KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbldoZW5BZGRpbmdGaWxlRmFpbGVkOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8T2JqZWN0fSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZmlsdGVyXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uV2hlbkFkZGluZ0ZpbGVGYWlsZWQoaXRlbSwgZmlsdGVyLCBvcHRpb25zKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbldoZW5BZGRpbmdGaWxlRmFpbGVkKGl0ZW0sIGZpbHRlciwgb3B0aW9ucyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkFmdGVyQWRkaW5nRmlsZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25BZnRlckFkZGluZ0ZpbGUoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25BZnRlckFkZGluZ0ZpbGUoaXRlbSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkFmdGVyQWRkaW5nQWxsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5PEZpbGVJdGVtPn0gaXRlbXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQWZ0ZXJBZGRpbmdBbGwoaXRlbXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQWZ0ZXJBZGRpbmdBbGwoaXRlbXMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25CZWZvcmVVcGxvYWRJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqICBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQmVmb3JlVXBsb2FkSXRlbShpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fb25CZWZvcmVVcGxvYWQoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQmVmb3JlVXBsb2FkSXRlbShpdGVtKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX29uUHJvZ3Jlc3NJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3Ncblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vblByb2dyZXNzSXRlbShpdGVtLCBwcm9ncmVzcykge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbCA9IHRoaXMuX2dldFRvdGFsUHJvZ3Jlc3MocHJvZ3Jlc3MpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSB0b3RhbDtcblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9vblByb2dyZXNzKHByb2dyZXNzKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUHJvZ3Jlc3NJdGVtKGl0ZW0sIHByb2dyZXNzKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUHJvZ3Jlc3NBbGwodG90YWwpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25TdWNjZXNzSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9vblN1Y2Nlc3MocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25FcnJvckl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25FcnJvckl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX29uRXJyb3IocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9ySXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX29uQ2FuY2VsSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vbkNhbmNlbEl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX29uQ2FuY2VsKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25DYW5jZWxJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25Db21wbGV0ZUl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX29uQ29tcGxldGUocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlSXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0SXRlbSA9IHRoaXMuZ2V0UmVhZHlJdGVtcygpWzBdO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGlmIChpc0RlZmluZWQobmV4dEl0ZW0pKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLnVwbG9hZCgpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlQWxsKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHRoaXMuX2dldFRvdGFsUHJvZ3Jlc3MoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXIoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sIHtcblx0ICAgICAgICAgICAgaXNGaWxlOiB7XG5cdCAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICAgICAgICAgICAgICogU1RBVElDXG5cdCAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBhbiBpbnN0YW5jZSBvZiBGaWxlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRmlsZSh2YWx1ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBGaWxlICYmIHZhbHVlIGluc3RhbmNlb2YgRmlsZTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNGaWxlTGlrZU9iamVjdDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIHZhbHVlIGFuIGluc3RhbmNlIG9mIEZpbGVMaWtlT2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRmlsZUxpa2VPYmplY3QodmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBGaWxlTGlrZU9iamVjdDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNBcnJheUxpa2VPYmplY3Q6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBpcyBhcnJheSBsaWtlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBcImxlbmd0aFwiIGluIHZhbHVlO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBpbmhlcml0OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEluaGVyaXRzIGEgdGFyZ2V0IChDbGFzc18xKSBieSBhIHNvdXJjZSAoQ2xhc3NfMilcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHRhcmdldFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc291cmNlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGluaGVyaXQodGFyZ2V0LCBzb3VyY2UpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0YXJnZXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzb3VyY2UucHJvdG90eXBlKTtcblx0ICAgICAgICAgICAgICAgICAgICB0YXJnZXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gdGFyZ2V0O1xuXHQgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdXBlcl8gPSBzb3VyY2U7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlVXBsb2FkZXI7XG5cdCAgICB9KSgpO1xuXG5cdCAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICogUFVCTElDXG5cdCAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgIC8qKlxuXHQgICAgICogQ2hlY2tzIGEgc3VwcG9ydCB0aGUgaHRtbDUgdXBsb2FkZXJcblx0ICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICogQHJlYWRvbmx5XG5cdCAgICAgKi9cblx0ICAgIEZpbGVVcGxvYWRlci5wcm90b3R5cGUuaXNIVE1MNSA9ICEhKEZpbGUgJiYgRm9ybURhdGEpO1xuXHQgICAgLyoqKioqKioqKioqKioqKioqKioqKipcblx0ICAgICAqIFNUQVRJQ1xuXHQgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cdCAgICAvKipcblx0ICAgICAqIEBib3Jyb3dzIEZpbGVVcGxvYWRlci5wcm90b3R5cGUuaXNIVE1MNVxuXHQgICAgICovXG5cdCAgICBGaWxlVXBsb2FkZXIuaXNIVE1MNSA9IEZpbGVVcGxvYWRlci5wcm90b3R5cGUuaXNIVE1MNTtcblxuXHQgICAgcmV0dXJuIEZpbGVVcGxvYWRlcjtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiZmlsZVVwbG9hZGVyT3B0aW9uc1wiLCBcIiRyb290U2NvcGVcIiwgXCIkaHR0cFwiLCBcIiR3aW5kb3dcIiwgXCJGaWxlTGlrZU9iamVjdFwiLCBcIkZpbGVJdGVtXCJdO1xuXG4vKioqLyB9LFxuLyogNCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHsgdmFyIHByb3AgPSBwcm9wc1trZXldOyBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTsgfSBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTsgfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5cdHZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdHZhciBjb3B5ID0gYW5ndWxhci5jb3B5O1xuXHR2YXIgaXNFbGVtZW50ID0gYW5ndWxhci5pc0VsZW1lbnQ7XG5cdHZhciBpc1N0cmluZyA9IGFuZ3VsYXIuaXNTdHJpbmc7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgRmlsZUxpa2VPYmplY3QgPSAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgRmlsZUxpa2VPYmplY3Rcblx0ICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8SFRNTElucHV0RWxlbWVudHxPYmplY3R9IGZpbGVPcklucHV0XG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlTGlrZU9iamVjdChmaWxlT3JJbnB1dCkge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZUxpa2VPYmplY3QpO1xuXG5cdCAgICAgICAgICAgIHZhciBpc0lucHV0ID0gaXNFbGVtZW50KGZpbGVPcklucHV0KTtcblx0ICAgICAgICAgICAgdmFyIGZha2VQYXRoT3JPYmplY3QgPSBpc0lucHV0ID8gZmlsZU9ySW5wdXQudmFsdWUgOiBmaWxlT3JJbnB1dDtcblx0ICAgICAgICAgICAgdmFyIHBvc3RmaXggPSBpc1N0cmluZyhmYWtlUGF0aE9yT2JqZWN0KSA/IFwiRmFrZVBhdGhcIiA6IFwiT2JqZWN0XCI7XG5cdCAgICAgICAgICAgIHZhciBtZXRob2QgPSBcIl9jcmVhdGVGcm9tXCIgKyBwb3N0Zml4O1xuXHQgICAgICAgICAgICB0aGlzW21ldGhvZF0oZmFrZVBhdGhPck9iamVjdCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2NyZWF0ZUNsYXNzKEZpbGVMaWtlT2JqZWN0LCB7XG5cdCAgICAgICAgICAgIF9jcmVhdGVGcm9tRmFrZVBhdGg6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ3JlYXRlcyBmaWxlIGxpa2Ugb2JqZWN0IGZyb20gZmFrZSBwYXRoIHN0cmluZ1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9jcmVhdGVGcm9tRmFrZVBhdGgocGF0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vZGlmaWVkRGF0ZSA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5zaXplID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSBcImxpa2UvXCIgKyBwYXRoLnNsaWNlKHBhdGgubGFzdEluZGV4T2YoXCIuXCIpICsgMSkudG9Mb3dlckNhc2UoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm5hbWUgPSBwYXRoLnNsaWNlKHBhdGgubGFzdEluZGV4T2YoXCIvXCIpICsgcGF0aC5sYXN0SW5kZXhPZihcIlxcXFxcIikgKyAyKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2NyZWF0ZUZyb21PYmplY3Q6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ3JlYXRlcyBmaWxlIGxpa2Ugb2JqZWN0IGZyb20gb2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8RmlsZUxpa2VPYmplY3R9IG9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2NyZWF0ZUZyb21PYmplY3Qob2JqZWN0KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0TW9kaWZpZWREYXRlID0gY29weShvYmplY3QubGFzdE1vZGlmaWVkRGF0ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5zaXplID0gb2JqZWN0LnNpemU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gb2JqZWN0LnR5cGU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gb2JqZWN0Lm5hbWU7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlTGlrZU9iamVjdDtcblx0ICAgIH0pKCk7XG5cblx0ICAgIHJldHVybiBGaWxlTGlrZU9iamVjdDtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW107XG5cbi8qKiovIH0sXG4vKiA1ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajsgfTtcblxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGtleSBpbiBwcm9wcykgeyB2YXIgcHJvcCA9IHByb3BzW2tleV07IHByb3AuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKHByb3AudmFsdWUpIHByb3Aud3JpdGFibGUgPSB0cnVlOyB9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpOyB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cblx0dmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIGNvcHkgPSBhbmd1bGFyLmNvcHk7XG5cdHZhciBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZDtcblx0dmFyIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQ7XG5cdHZhciBpc0VsZW1lbnQgPSBhbmd1bGFyLmlzRWxlbWVudDtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkY29tcGlsZSwgRmlsZUxpa2VPYmplY3QpIHtcblx0ICAgIHZhciBGaWxlSXRlbSA9IChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBGaWxlSXRlbVxuXHQgICAgICAgICAqIEBwYXJhbSB7RmlsZVVwbG9hZGVyfSB1cGxvYWRlclxuXHQgICAgICAgICAqIEBwYXJhbSB7RmlsZXxIVE1MSW5wdXRFbGVtZW50fE9iamVjdH0gc29tZVxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlSXRlbSh1cGxvYWRlciwgc29tZSwgb3B0aW9ucykge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZUl0ZW0pO1xuXG5cdCAgICAgICAgICAgIHZhciBpc0lucHV0ID0gaXNFbGVtZW50KHNvbWUpO1xuXHQgICAgICAgICAgICB2YXIgaW5wdXQgPSBpc0lucHV0ID8gZWxlbWVudChzb21lKSA6IG51bGw7XG5cdCAgICAgICAgICAgIHZhciBmaWxlID0gIWlzSW5wdXQgPyBzb21lIDogbnVsbDtcblxuXHQgICAgICAgICAgICBleHRlbmQodGhpcywge1xuXHQgICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRlci51cmwsXG5cdCAgICAgICAgICAgICAgICBhbGlhczogdXBsb2FkZXIuYWxpYXMsXG5cdCAgICAgICAgICAgICAgICBoZWFkZXJzOiBjb3B5KHVwbG9hZGVyLmhlYWRlcnMpLFxuXHQgICAgICAgICAgICAgICAgZm9ybURhdGE6IGNvcHkodXBsb2FkZXIuZm9ybURhdGEpLFxuXHQgICAgICAgICAgICAgICAgcmVtb3ZlQWZ0ZXJVcGxvYWQ6IHVwbG9hZGVyLnJlbW92ZUFmdGVyVXBsb2FkLFxuXHQgICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB1cGxvYWRlci53aXRoQ3JlZGVudGlhbHMsXG5cdCAgICAgICAgICAgICAgICBtZXRob2Q6IHVwbG9hZGVyLm1ldGhvZFxuXHQgICAgICAgICAgICB9LCBvcHRpb25zLCB7XG5cdCAgICAgICAgICAgICAgICB1cGxvYWRlcjogdXBsb2FkZXIsXG5cdCAgICAgICAgICAgICAgICBmaWxlOiBuZXcgRmlsZUxpa2VPYmplY3Qoc29tZSksXG5cdCAgICAgICAgICAgICAgICBpc1JlYWR5OiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzVXBsb2FkaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzVXBsb2FkZWQ6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgaXNTdWNjZXNzOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzQ2FuY2VsOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzRXJyb3I6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXG5cdCAgICAgICAgICAgICAgICBpbmRleDogbnVsbCxcblx0ICAgICAgICAgICAgICAgIF9maWxlOiBmaWxlLFxuXHQgICAgICAgICAgICAgICAgX2lucHV0OiBpbnB1dFxuXHQgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICBpZiAoaW5wdXQpIHRoaXMuX3JlcGxhY2VOb2RlKGlucHV0KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZUl0ZW0sIHtcblx0ICAgICAgICAgICAgdXBsb2FkOiB7XG5cdCAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICAgICAgICAgICAgICogUFVCTElDXG5cdCAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogVXBsb2FkcyBhIEZpbGVJdGVtXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwbG9hZCgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLnVwbG9hZEl0ZW0odGhpcyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLl9vbkNvbXBsZXRlSXRlbSh0aGlzLCBcIlwiLCAwLCBbXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkZXIuX29uRXJyb3JJdGVtKHRoaXMsIFwiXCIsIDAsIFtdKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGNhbmNlbDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYW5jZWxzIHVwbG9hZGluZyBvZiBGaWxlSXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5jZWwoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlci5jYW5jZWxJdGVtKHRoaXMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICByZW1vdmU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmVtb3ZlcyBhIEZpbGVJdGVtXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLnJlbW92ZUZyb21RdWV1ZSh0aGlzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25CZWZvcmVVcGxvYWQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQmVmb3JlVXBsb2FkKCkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25Qcm9ncmVzczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblByb2dyZXNzKHByb2dyZXNzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvblN1Y2Nlc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uU3VjY2VzcyhyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkVycm9yOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkVycm9yKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQ2FuY2VsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNhbmNlbChyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkNvbXBsZXRlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNvbXBsZXRlKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkJlZm9yZVVwbG9hZDoge1xuXHQgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcblx0ICAgICAgICAgICAgICAgICAqIFBSSVZBVEVcblx0ICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25CZWZvcmVVcGxvYWQoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1JlYWR5ID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkZWQgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDYW5jZWwgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRXJyb3IgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gMDtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQmVmb3JlVXBsb2FkKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vblByb2dyZXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3Ncblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vblByb2dyZXNzKHByb2dyZXNzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHByb2dyZXNzO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25Qcm9ncmVzcyhwcm9ncmVzcyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vblN1Y2Nlc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25TdWNjZXNzKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUmVhZHkgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGVkID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NhbmNlbCA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSAxMDA7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN1Y2Nlc3MocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkVycm9yOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uRXJyb3IocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkZWQgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTdWNjZXNzID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NhbmNlbCA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFcnJvciA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25DYW5jZWw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25DYW5jZWwocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkZWQgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDYW5jZWwgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25DYW5jZWwocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkNvbXBsZXRlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQ29tcGxldGUocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZShyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW1vdmVBZnRlclVwbG9hZCkgdGhpcy5yZW1vdmUoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2Rlc3Ryb3k6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRGVzdHJveXMgYSBGaWxlSXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZGVzdHJveSgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faW5wdXQpIHRoaXMuX2lucHV0LnJlbW92ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mb3JtKSB0aGlzLl9mb3JtLnJlbW92ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9mb3JtO1xuXHQgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9pbnB1dDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3ByZXBhcmVUb1VwbG9hZGluZzoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBQcmVwYXJlcyB0byB1cGxvYWRpbmdcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9wcmVwYXJlVG9VcGxvYWRpbmcoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuaW5kZXggfHwgKyt0aGlzLnVwbG9hZGVyLl9uZXh0SW5kZXg7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1JlYWR5ID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3JlcGxhY2VOb2RlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJlcGxhY2VzIGlucHV0IGVsZW1lbnQgb24gaGlzIGNsb25lXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0pRTGl0ZXxqUXVlcnl9IGlucHV0XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcmVwbGFjZU5vZGUoaW5wdXQpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmUgPSAkY29tcGlsZShpbnB1dC5jbG9uZSgpKShpbnB1dC5zY29wZSgpKTtcblx0ICAgICAgICAgICAgICAgICAgICBjbG9uZS5wcm9wKFwidmFsdWVcIiwgbnVsbCk7IC8vIEZGIGZpeFxuXHQgICAgICAgICAgICAgICAgICAgIGlucHV0LmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlucHV0LmFmdGVyKGNsb25lKTsgLy8gcmVtb3ZlIGpxdWVyeSBkZXBlbmRlbmN5XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlSXRlbTtcblx0ICAgIH0pKCk7XG5cblx0ICAgIHJldHVybiBGaWxlSXRlbTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJGNvbXBpbGVcIiwgXCJGaWxlTGlrZU9iamVjdFwiXTtcblxuLyoqKi8gfSxcbi8qIDYgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIga2V5IGluIHByb3BzKSB7IHZhciBwcm9wID0gcHJvcHNba2V5XTsgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7IH0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuXHR2YXIgX2NsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHR2YXIgZXh0ZW5kID0gYW5ndWxhci5leHRlbmQ7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgRmlsZURpcmVjdGl2ZSA9IChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBpbnN0YW5jZSBvZiB7RmlsZURpcmVjdGl2ZX0gb2JqZWN0XG5cdCAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcblx0ICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy51cGxvYWRlclxuXHQgICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG9wdGlvbnMuZWxlbWVudFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLmV2ZW50c1xuXHQgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnByb3Bcblx0ICAgICAgICAgKiBAY29uc3RydWN0b3Jcblx0ICAgICAgICAgKi9cblxuXHQgICAgICAgIGZ1bmN0aW9uIEZpbGVEaXJlY3RpdmUob3B0aW9ucykge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgICAgICAgICAgZXh0ZW5kKHRoaXMsIG9wdGlvbnMpO1xuXHQgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzW3RoaXMucHJvcF0ucHVzaCh0aGlzKTtcblx0ICAgICAgICAgICAgdGhpcy5fc2F2ZUxpbmtzKCk7XG5cdCAgICAgICAgICAgIHRoaXMuYmluZCgpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIF9jcmVhdGVDbGFzcyhGaWxlRGlyZWN0aXZlLCB7XG5cdCAgICAgICAgICAgIGJpbmQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQmluZHMgZXZlbnRzIGhhbmRsZXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYmluZCgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5ldmVudHMpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmV2ZW50c1trZXldO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYmluZChrZXksIHRoaXNbcHJvcF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgdW5iaW5kOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFVuYmluZHMgZXZlbnRzIGhhbmRsZXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdW5iaW5kKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmV2ZW50cykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudW5iaW5kKGtleSwgdGhpcy5ldmVudHNba2V5XSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBkZXN0cm95OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIERlc3Ryb3lzIGRpcmVjdGl2ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMudXBsb2FkZXIuX2RpcmVjdGl2ZXNbdGhpcy5wcm9wXS5pbmRleE9mKHRoaXMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkZXIuX2RpcmVjdGl2ZXNbdGhpcy5wcm9wXS5zcGxpY2UoaW5kZXgsIDEpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5lbGVtZW50ID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3NhdmVMaW5rczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBTYXZlcyBsaW5rcyB0byBmdW5jdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zYXZlTGlua3MoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuZXZlbnRzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5ldmVudHNba2V5XTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wXSA9IHRoaXNbcHJvcF0uYmluZCh0aGlzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlRGlyZWN0aXZlO1xuXHQgICAgfSkoKTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBNYXAgb2YgZXZlbnRzXG5cdCAgICAgKiBAdHlwZSB7T2JqZWN0fVxuXHQgICAgICovXG5cdCAgICBGaWxlRGlyZWN0aXZlLnByb3RvdHlwZS5ldmVudHMgPSB7fTtcblxuXHQgICAgcmV0dXJuIEZpbGVEaXJlY3RpdmU7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtdO1xuXG4vKioqLyB9LFxuLyogNyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHsgdmFyIHByb3AgPSBwcm9wc1trZXldOyBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTsgfSBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTsgfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5cdHZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7IH0gfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYyAmJiBkZXNjLndyaXRhYmxlKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfTtcblxuXHR2YXIgX2luaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH07XG5cblx0dmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIGV4dGVuZCA9IGFuZ3VsYXIuZXh0ZW5kO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEZpbGVEaXJlY3RpdmUpIHtcblx0ICAgIHZhciBGaWxlU2VsZWN0ID0gKGZ1bmN0aW9uIChfRmlsZURpcmVjdGl2ZSkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgaW5zdGFuY2Ugb2Yge0ZpbGVTZWxlY3R9IG9iamVjdFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlU2VsZWN0KG9wdGlvbnMpIHtcblx0ICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZpbGVTZWxlY3QpO1xuXG5cdCAgICAgICAgICAgIHZhciBleHRlbmRlZE9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge1xuXHQgICAgICAgICAgICAgICAgLy8gTWFwIG9mIGV2ZW50c1xuXHQgICAgICAgICAgICAgICAgZXZlbnRzOiB7XG5cdCAgICAgICAgICAgICAgICAgICAgJGRlc3Ryb3k6IFwiZGVzdHJveVwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogXCJvbkNoYW5nZVwiXG5cdCAgICAgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICAgICAgLy8gTmFtZSBvZiBwcm9wZXJ0eSBpbnNpZGUgdXBsb2FkZXIuX2RpcmVjdGl2ZSBvYmplY3Rcblx0ICAgICAgICAgICAgICAgIHByb3A6IFwic2VsZWN0XCJcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoRmlsZVNlbGVjdC5wcm90b3R5cGUpLCBcImNvbnN0cnVjdG9yXCIsIHRoaXMpLmNhbGwodGhpcywgZXh0ZW5kZWRPcHRpb25zKTtcblxuXHQgICAgICAgICAgICBpZiAoIXRoaXMudXBsb2FkZXIuaXNIVE1MNSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHIoXCJtdWx0aXBsZVwiKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB0aGlzLmVsZW1lbnQucHJvcChcInZhbHVlXCIsIG51bGwpOyAvLyBGRiBmaXhcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBfaW5oZXJpdHMoRmlsZVNlbGVjdCwgX0ZpbGVEaXJlY3RpdmUpO1xuXG5cdCAgICAgICAgX2NyZWF0ZUNsYXNzKEZpbGVTZWxlY3QsIHtcblx0ICAgICAgICAgICAgZ2V0T3B0aW9uczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG9wdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBnZXRGaWx0ZXJzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXk8RnVuY3Rpb24+fFN0cmluZ3x1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEZpbHRlcnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBpc0VtcHR5QWZ0ZXJTZWxlY3Rpb246IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSWYgcmV0dXJucyBcInRydWVcIiB0aGVuIEhUTUxJbnB1dEVsZW1lbnQgd2lsbCBiZSBjbGVhcmVkXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaXNFbXB0eUFmdGVyU2VsZWN0aW9uKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXRoaXMuZWxlbWVudC5hdHRyKFwibXVsdGlwbGVcIik7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQ2hhbmdlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEV2ZW50IGhhbmRsZXJcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25DaGFuZ2UoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVzID0gdGhpcy51cGxvYWRlci5pc0hUTUw1ID8gdGhpcy5lbGVtZW50WzBdLmZpbGVzIDogdGhpcy5lbGVtZW50WzBdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGZpbHRlcnMgPSB0aGlzLmdldEZpbHRlcnMoKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy51cGxvYWRlci5pc0hUTUw1KSB0aGlzLmRlc3Ryb3koKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLmFkZFRvUXVldWUoZmlsZXMsIG9wdGlvbnMsIGZpbHRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHlBZnRlclNlbGVjdGlvbigpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5wcm9wKFwidmFsdWVcIiwgbnVsbCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZXBsYWNlV2l0aCh0aGlzLmVsZW1lbnQgPSB0aGlzLmVsZW1lbnQuY2xvbmUodHJ1ZSkpOyAvLyBJRSBmaXhcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlU2VsZWN0O1xuXHQgICAgfSkoRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgIHJldHVybiBGaWxlU2VsZWN0O1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSBbXCJGaWxlRGlyZWN0aXZlXCJdO1xuXG4vKioqLyB9LFxuLyogOCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHsgdmFyIHByb3AgPSBwcm9wc1trZXldOyBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTsgfSBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTsgfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5cdHZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7IH0gfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYyAmJiBkZXNjLndyaXRhYmxlKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfTtcblxuXHR2YXIgX2luaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH07XG5cblx0dmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIGV4dGVuZCA9IGFuZ3VsYXIuZXh0ZW5kO1xuXHR2YXIgZm9yRWFjaCA9IGFuZ3VsYXIuZm9yRWFjaDtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChGaWxlRGlyZWN0aXZlKSB7XG5cdCAgICB2YXIgRmlsZURyb3AgPSAoZnVuY3Rpb24gKF9GaWxlRGlyZWN0aXZlKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBpbnN0YW5jZSBvZiB7RmlsZURyb3B9IG9iamVjdFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlRHJvcChvcHRpb25zKSB7XG5cdCAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGaWxlRHJvcCk7XG5cblx0ICAgICAgICAgICAgdmFyIGV4dGVuZGVkT3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7XG5cdCAgICAgICAgICAgICAgICAvLyBNYXAgb2YgZXZlbnRzXG5cdCAgICAgICAgICAgICAgICBldmVudHM6IHtcblx0ICAgICAgICAgICAgICAgICAgICAkZGVzdHJveTogXCJkZXN0cm95XCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZHJvcDogXCJvbkRyb3BcIixcblx0ICAgICAgICAgICAgICAgICAgICBkcmFnb3ZlcjogXCJvbkRyYWdPdmVyXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZHJhZ2xlYXZlOiBcIm9uRHJhZ0xlYXZlXCJcblx0ICAgICAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgICAgICAvLyBOYW1lIG9mIHByb3BlcnR5IGluc2lkZSB1cGxvYWRlci5fZGlyZWN0aXZlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgcHJvcDogXCJkcm9wXCJcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoRmlsZURyb3AucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGV4dGVuZGVkT3B0aW9ucyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2luaGVyaXRzKEZpbGVEcm9wLCBfRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZURyb3AsIHtcblx0ICAgICAgICAgICAgZ2V0T3B0aW9uczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG9wdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBnZXRGaWx0ZXJzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXk8RnVuY3Rpb24+fFN0cmluZ3x1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEZpbHRlcnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkRyb3A6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRXZlbnQgaGFuZGxlclxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkRyb3AoZXZlbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmZXIgPSB0aGlzLl9nZXRUcmFuc2ZlcihldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCF0cmFuc2Zlcikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgICAgICAgICAgICAgfXZhciBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGZpbHRlcnMgPSB0aGlzLmdldEZpbHRlcnMoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmV2ZW50QW5kU3RvcChldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaCh0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzLm92ZXIsIHRoaXMuX3JlbW92ZU92ZXJDbGFzcywgdGhpcyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlci5hZGRUb1F1ZXVlKHRyYW5zZmVyLmZpbGVzLCBvcHRpb25zLCBmaWx0ZXJzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25EcmFnT3Zlcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBFdmVudCBoYW5kbGVyXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uRHJhZ092ZXIoZXZlbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmZXIgPSB0aGlzLl9nZXRUcmFuc2ZlcihldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oYXZlRmlsZXModHJhbnNmZXIudHlwZXMpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICAgICAgICAgICAgICB9dHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZlbnRBbmRTdG9wKGV2ZW50KTtcblx0ICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKHRoaXMudXBsb2FkZXIuX2RpcmVjdGl2ZXMub3ZlciwgdGhpcy5fYWRkT3ZlckNsYXNzLCB0aGlzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25EcmFnTGVhdmU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRXZlbnQgaGFuZGxlclxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkRyYWdMZWF2ZShldmVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0ID09PSB0aGlzLmVsZW1lbnRbMF0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgICAgICAgICAgICAgIH10aGlzLl9wcmV2ZW50QW5kU3RvcChldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaCh0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzLm92ZXIsIHRoaXMuX3JlbW92ZU92ZXJDbGFzcywgdGhpcyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9nZXRUcmFuc2Zlcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBIZWxwZXJcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFRyYW5zZmVyKGV2ZW50KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmRhdGFUcmFuc2ZlciA/IGV2ZW50LmRhdGFUcmFuc2ZlciA6IGV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyOyAvLyBqUXVlcnkgZml4O1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfcHJldmVudEFuZFN0b3A6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSGVscGVyXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9wcmV2ZW50QW5kU3RvcChldmVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9oYXZlRmlsZXM6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB0eXBlcyBjb250YWlucyBmaWxlc1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHR5cGVzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9oYXZlRmlsZXModHlwZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXR5cGVzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB9aWYgKHR5cGVzLmluZGV4T2YpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVzLmluZGV4T2YoXCJGaWxlc1wiKSAhPT0gLTE7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlcy5jb250YWlucykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZXMuY29udGFpbnMoXCJGaWxlc1wiKTtcblx0ICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfYWRkT3ZlckNsYXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9hZGRPdmVyQ2xhc3MoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uYWRkT3ZlckNsYXNzKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9yZW1vdmVPdmVyQ2xhc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3JlbW92ZU92ZXJDbGFzcyhpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5yZW1vdmVPdmVyQ2xhc3MoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXG5cdCAgICAgICAgcmV0dXJuIEZpbGVEcm9wO1xuXHQgICAgfSkoRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgIHJldHVybiBGaWxlRHJvcDtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiRmlsZURpcmVjdGl2ZVwiXTtcblxuLyoqKi8gfSxcbi8qIDkgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIga2V5IGluIHByb3BzKSB7IHZhciBwcm9wID0gcHJvcHNba2V5XTsgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7IH0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuXHR2YXIgX2dldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikgeyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpOyB9IH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MgJiYgZGVzYy53cml0YWJsZSkgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH07XG5cblx0dmFyIF9pbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9O1xuXG5cdHZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdHZhciBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZDtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChGaWxlRGlyZWN0aXZlKSB7XG5cdCAgICB2YXIgRmlsZU92ZXIgPSAoZnVuY3Rpb24gKF9GaWxlRGlyZWN0aXZlKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBpbnN0YW5jZSBvZiB7RmlsZURyb3B9IG9iamVjdFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlT3ZlcihvcHRpb25zKSB7XG5cdCAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGaWxlT3Zlcik7XG5cblx0ICAgICAgICAgICAgdmFyIGV4dGVuZGVkT3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7XG5cdCAgICAgICAgICAgICAgICAvLyBNYXAgb2YgZXZlbnRzXG5cdCAgICAgICAgICAgICAgICBldmVudHM6IHtcblx0ICAgICAgICAgICAgICAgICAgICAkZGVzdHJveTogXCJkZXN0cm95XCJcblx0ICAgICAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgICAgICAvLyBOYW1lIG9mIHByb3BlcnR5IGluc2lkZSB1cGxvYWRlci5fZGlyZWN0aXZlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgcHJvcDogXCJvdmVyXCIsXG5cdCAgICAgICAgICAgICAgICAvLyBPdmVyIGNsYXNzXG5cdCAgICAgICAgICAgICAgICBvdmVyQ2xhc3M6IFwibnYtZmlsZS1vdmVyXCJcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoRmlsZU92ZXIucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGV4dGVuZGVkT3B0aW9ucyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2luaGVyaXRzKEZpbGVPdmVyLCBfRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZU92ZXIsIHtcblx0ICAgICAgICAgICAgYWRkT3ZlckNsYXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEFkZHMgb3ZlciBjbGFzc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRPdmVyQ2xhc3MoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKHRoaXMuZ2V0T3ZlckNsYXNzKCkpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICByZW1vdmVPdmVyQ2xhc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmVtb3ZlcyBvdmVyIGNsYXNzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZU92ZXJDbGFzcygpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3ModGhpcy5nZXRPdmVyQ2xhc3MoKSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGdldE92ZXJDbGFzczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG92ZXIgY2xhc3Ncblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE92ZXJDbGFzcygpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vdmVyQ2xhc3M7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlT3Zlcjtcblx0ICAgIH0pKEZpbGVEaXJlY3RpdmUpO1xuXG5cdCAgICByZXR1cm4gRmlsZU92ZXI7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtcIkZpbGVEaXJlY3RpdmVcIl07XG5cbi8qKiovIH0sXG4vKiAxMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkcGFyc2UsIEZpbGVVcGxvYWRlciwgRmlsZVNlbGVjdCkge1xuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuXHQgICAgICAgICAgICB2YXIgdXBsb2FkZXIgPSBzY29wZS4kZXZhbChhdHRyaWJ1dGVzLnVwbG9hZGVyKTtcblxuXHQgICAgICAgICAgICBpZiAoISh1cGxvYWRlciBpbnN0YW5jZW9mIEZpbGVVcGxvYWRlcikpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJcXFwiVXBsb2FkZXJcXFwiIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXCIpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBGaWxlU2VsZWN0KHtcblx0ICAgICAgICAgICAgICAgIHVwbG9hZGVyOiB1cGxvYWRlcixcblx0ICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnRcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgb2JqZWN0LmdldE9wdGlvbnMgPSAkcGFyc2UoYXR0cmlidXRlcy5vcHRpb25zKS5iaW5kKG9iamVjdCwgc2NvcGUpO1xuXHQgICAgICAgICAgICBvYmplY3QuZ2V0RmlsdGVycyA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzLmZpbHRlcnM7XG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHBhcnNlXCIsIFwiRmlsZVVwbG9hZGVyXCIsIFwiRmlsZVNlbGVjdFwiXTtcblxuLyoqKi8gfSxcbi8qIDExICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajsgfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRwYXJzZSwgRmlsZVVwbG9hZGVyLCBGaWxlRHJvcCkge1xuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuXHQgICAgICAgICAgICB2YXIgdXBsb2FkZXIgPSBzY29wZS4kZXZhbChhdHRyaWJ1dGVzLnVwbG9hZGVyKTtcblxuXHQgICAgICAgICAgICBpZiAoISh1cGxvYWRlciBpbnN0YW5jZW9mIEZpbGVVcGxvYWRlcikpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJcXFwiVXBsb2FkZXJcXFwiIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXCIpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgaWYgKCF1cGxvYWRlci5pc0hUTUw1KSByZXR1cm47XG5cblx0ICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBGaWxlRHJvcCh7XG5cdCAgICAgICAgICAgICAgICB1cGxvYWRlcjogdXBsb2FkZXIsXG5cdCAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIG9iamVjdC5nZXRPcHRpb25zID0gJHBhcnNlKGF0dHJpYnV0ZXMub3B0aW9ucykuYmluZChvYmplY3QsIHNjb3BlKTtcblx0ICAgICAgICAgICAgb2JqZWN0LmdldEZpbHRlcnMgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlcy5maWx0ZXJzO1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtcIiRwYXJzZVwiLCBcIkZpbGVVcGxvYWRlclwiLCBcIkZpbGVEcm9wXCJdO1xuXG4vKioqLyB9LFxuLyogMTIgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoRmlsZVVwbG9hZGVyLCBGaWxlT3Zlcikge1xuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuXHQgICAgICAgICAgICB2YXIgdXBsb2FkZXIgPSBzY29wZS4kZXZhbChhdHRyaWJ1dGVzLnVwbG9hZGVyKTtcblxuXHQgICAgICAgICAgICBpZiAoISh1cGxvYWRlciBpbnN0YW5jZW9mIEZpbGVVcGxvYWRlcikpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJcXFwiVXBsb2FkZXJcXFwiIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXCIpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBGaWxlT3Zlcih7XG5cdCAgICAgICAgICAgICAgICB1cGxvYWRlcjogdXBsb2FkZXIsXG5cdCAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIG9iamVjdC5nZXRPdmVyQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlcy5vdmVyQ2xhc3MgfHwgb2JqZWN0Lm92ZXJDbGFzcztcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSBbXCJGaWxlVXBsb2FkZXJcIiwgXCJGaWxlT3ZlclwiXTtcblxuLyoqKi8gfVxuIF0pXG59KTtcbjtcblxuIiwiLy8gLS1BdXRob3IgTXVyYWdpamltYW5hIFJpY2hhcmQgPGJlYXN0YXI0NTdAZ21haWwuY29tPlxuLy8gdmFyIHN5bmMgPSBhbmd1bGFyLm1vZHVsZShcInN5bmNcIiwgW1wibmdSb3V0ZVwiLFwiYW5ndWxhckZpbGVVcGxvYWRcIixcImlvbmljXCIsXCJuZ1Jlc291cmNlXCIsXCJ1aS5ib290c3RyYXBcIixcImluZmluaXRlLXNjcm9sbFwiXSk7XG5cblxuLy9yZW1vdmUgZGVwZW5kZWNpZXNcbi8vLFwiaW5maW5pdGUtc2Nyb2xsXCIsIG5nZm9sZGVyTGlzdHMgJ25nLW1mYicgbmdDb250ZXh0TWVudSBuZ0RpYWxvZ1xudmFyIExvZ2dlcj1hbmd1bGFyLm1vZHVsZShcIkxvZ2dlclwiLFtdKTtcbkxvZ2dlci5ydW4oWyckcm9vdFNjb3BlJyxmdW5jdGlvbigkcm9vdFNjb3BlKXtcbiAgICAgIC8vICRyb290U2NvcGUuZW5kUG9pbnQ9J2h0dHBzOi8vc3RyZWFtdXBib3guY29tJztcbiAgICAgICRyb290U2NvcGUuZW5kUG9pbnQ9J2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMCc7XG59XSlcbi5jb25zdGFudCgnREVCVUcnLHRydWUpO1xuTG9nZ2VyLmRpcmVjdGl2ZSgnc2lnbnVwJywgW2Z1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZVVybDonQXBwL3NjcmlwdHMvdmlld3Mvc2lnbnVwLmh0bWwnXG4gIH07XG59XSlcbi5kaXJlY3RpdmUoJ2xvZ2luJywgW2Z1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZVVybDonQXBwL3NjcmlwdHMvdmlld3MvbG9naW4uaHRtbCdcbiAgfTtcbn1dKVxuLmRpcmVjdGl2ZSgnc2hvcnRjdXQnLCBbZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlVXJsOidBcHAvc2NyaXB0cy92aWV3cy9zaG9ydGN1dC5odG1sJ1xuICB9O1xufV0pO1xuYW5ndWxhci5tb2R1bGUoXCJzeW5jXCIsIFtcIm5nUm91dGVcIixcImFuZ3VsYXJGaWxlVXBsb2FkXCIsXCJ1aS5ib290c3RyYXBcIixcInVpLnJvdXRlclwiLCduZ01hdGVyaWFsJywgJ21hdGVyaWFsLnN2Z0Fzc2V0c0NhY2hlJyxcInBhc2NhbHByZWNodC50cmFuc2xhdGVcIixcInVpLnNlbGVjdFwiLFwibmdTYW5pdGl6ZVwiXSlcbi5jb25zdGFudCgnREVCVUcnLHRydWUpXG5cblxuXG4uY29uZmlnKFsnJHNjZVByb3ZpZGVyJywnJGh0dHBQcm92aWRlcicsJyRtZFRoZW1pbmdQcm92aWRlcicsZnVuY3Rpb24oJHNjZVByb3ZpZGVyLCRodHRwUHJvdmlkZXIsJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG4gICAgZGVsZXRlICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtUmVxdWVzdGVkLVdpdGgnXTtcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucG9zdC5BY2NlcHQgPSAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0JztcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMucG9zdC5BY2NlcHQgPSAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0JztcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uLmF1dGhvcml6YXRpb24gPSAnQmVhcmVyIDhFdXFjTU5rRjJ5UDUwRGljcHY5aExSUnA3V09TYWJQbEN1MjJsaVknO1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMudXNlWERvbWFpbiA9IHRydWU7XG4gICAgJHNjZVByb3ZpZGVyLmVuYWJsZWQoZmFsc2UpO1xuXG4gICAgXG59XSlcbi5jb25maWcoWyckc3RhdGVQcm92aWRlcicsJyR1cmxSb3V0ZXJQcm92aWRlcicsZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwkc2NvcGUpe1xuICAgICAgICAgIFxuICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgLnN0YXRlKCdIb21lJywge1xuXG4gICAgICAgICAgICB1cmw6IFwiL0ZpbGVzXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogIFwiL3ZpZXdzL2ZpbGVzLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdGaWxlc0NvbnRyb2xsZXInXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL0ZpbGVzJyk7XG59XSlcbi8vYXBwbGljYXRpb24gY29tcG9uZW50c1xuLmRpcmVjdGl2ZSgnZmlsZXMnLCBbZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvY29tcG9uZW50cy9maWxlcy5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsLCBhdHRyKSB7XG4gICAgICAvL2ltcGxlbWVudHMgaG92ZXIgb24gZmlsZXNcbiAgICAgIC8vIGVsLmhvdmVyKGZ1bmN0aW9uKCkge1xuICAgICAgIFxuICAgICAgLy8gICAkKFwiLnNoYXJlXCIpLmNzcyh7XG4gICAgICAvLyAgICAgZGlzcGxheTogJ2lubGluZScsXG4gICAgICAgICAgXG4gICAgICAvLyAgIH0pLmFkZENsYXNzKCdidG4gYnRuLXN1Y2Nlc3MnKTtcbiAgICAgIC8vIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgIC8vICAgJChcIi5zaGFyZVwiKS5oaWRlKCdzbG93JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgXG4gICAgICAvLyAgIH0pO1xuICAgICAgLy8gfSk7XG4gICAgfVxuICB9O1xufV0pXG4uZGlyZWN0aXZlKCdmb2xkZXJzJywgW2Z1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2NvbXBvbmVudHMvZm9sZGVycy5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsLCBpQXR0cnMpIHtcbiAgICAgIC8vIGVsLmhvdmVyKGZ1bmN0aW9uKCkge1xuICAgICAgLy8gICAvKiBTdHVmZiB0byBkbyB3aGVuIHRoZSBtb3VzZSBlbnRlcnMgdGhlIGVsZW1lbnQgKi9cbiAgICAgIC8vICAgJChcIi5zaGFyZVwiKS5jc3Moe1xuICAgICAgLy8gICAgIGRpc3BsYXk6ICdpbmxpbmUnLFxuICAgICAgICAgIFxuICAgICAgLy8gICB9KS5hZGRDbGFzcygnYnRuIGJ0bi1zdWNjZXNzJyk7XG4gICAgICAvLyB9LCBmdW5jdGlvbigpIHtcbiAgICAgIC8vICAgJChcIi5zaGFyZVwiKS5oaWRlKCdzbG93JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgXG4gICAgICAvLyAgIH0pO1xuICAgICAgLy8gfSk7XG4gICAgfVxuICB9O1xufV0pO1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWRvbmUgd2l0aCBNdXJhZ2lqaW1hbmEgUmljaGFyZCA8YmVhc3RhcjQ1N0BnbWFpbC5jb20+LS0tLS0tLS0tLS0tLS0tLy9cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1kZWFsIHdpdGggdXNlcidzIGFjdGlvbnMgYW5kIGludGVyYWN0aW9uIHdpdGggb3RoZXIgdXNlcnMtLS0tLS0tLS0tLS0tLS0vL1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N5bmMnKVxuLmNvbnRyb2xsZXIoJ2RpYWxvZ0NvbnRyb2xsZXInLFtmdW5jdGlvbigpIHtcbiAgICBcbn1dKTsiLCIvKiBnbG9iYWwgJHdpbmRvdyAqL1xuLyogZ2xvYmFsIExvZ2dlciAqL1xuXG5Mb2dnZXIuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJyxbJyRzY29wZScsJyRodHRwJywnJHJvb3RTY29wZScsJyR3aW5kb3cnLCBmdW5jdGlvbiAoJHNjb3BlLCRodHRwLCRyb290U2NvcGUsJHdpbmRvdykge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAnY3JlZGVkZW50aWFsLW5vdC1mb3VuZCcgICAgICAgOiAnQ3JlZGVudGlhbHMgbm90IGZvdW5kIScsXG4gICAgICAgICdzdWNjZXNzJyAgICAgICAgICAgICAgICAgICAgICA6ICdsb2dnaW5nIGluLi4uJ1xuICAgIH07XG4gICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uIChpbmZvKVxuICB7XG4gICAgZnVuY3Rpb24gbm90VmVyaWZpZWQoKXtcbiAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvbm90VmVyaWZpZWQnO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZWRpcmVjdGluZygpe1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL0hvbWUnO1xuICAgIH1cbiAgICAvL2JlZm9yZSBub3RpZnkgdGhhdCB3ZSBhcmUgbG9nZ2luZ2luXG4gICAgJCgnLmxvZ2luLWZvcm0tbWFpbi1tZXNzYWdlJykuYWRkQ2xhc3MoJ3Nob3cgc3VjY2VzcycpLmh0bWwob3B0aW9ucy5zdWNjZXNzKTtcbiAgICAkaHR0cC5wb3N0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2xvZ2luJyxpbmZvKVxuICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgXG4gICAgICAgIGlmKHJlc3BvbnNlID09PVwiMVwiKXtcbiAgICAgICAgICAgIHJlZGlyZWN0aW5nKCk7XG5cbiAgICAgICAgfWVsc2UgaWYocmVzcG9uc2UgPT09IFwiMFwiKXtcbiAgICAgICAgICAgICAkKCcubG9naW4tZm9ybS1tYWluLW1lc3NhZ2UnKS5hZGRDbGFzcygnc2hvdyBlcnJvcicpLmh0bWwob3B0aW9uc1snY3JlZGVkZW50aWFsLW5vdC1mb3VuZCddKTtcbiAgICAgICAgfWVsc2UgaWYocmVzcG9uc2UgPT09IFwibm90VmVyaWZpZWRcIil7XG4gICAgICAgICAgICBub3RWZXJpZmllZCgpO1xuICAgICAgICB9XG4gICAgfSlcbiAgICAuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOicrIGVycm9yKTtcbiAgICB9KTtcbiAgICBcbiAgfTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKFwiTG9nZ2VyXCIpXG4uY29udHJvbGxlcignUmVnaXN0ZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCckcm9vdFNjb3BlJywnJGh0dHAnLCdERUJVRycsZnVuY3Rpb24gKCRzY29wZSwkcm9vdFNjb3BlLCRodHRwLERFQlVHKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICdwYXNzd29yZC1ub3RNYXRjaCc6ICdwYXNzd29yZCBkbyBub3QgbWF0Y2gnLFxuICAgICAgICAnU2lnblVwSW5Qcm9ncmVzcycgOiAnV2FpdCB3ZSBhcmUgc2V0dGluZyB1cCB5b3VyIGFjY291bnQuJ1xuICAgIH07XG4gICAgZnVuY3Rpb24gbWVzc2FnZVJlbW92ZSgpe1xuICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykucmVtb3ZlQ2xhc3MoJ3Nob3cgZXJyb3InKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVkaXJlY3RpbmcoKXtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvY2hlY2tFbWFpbCc7XG4gICAgfVxuICAgICRzY29wZS5yZWdpc3Rlcj1mdW5jdGlvbih1c2VyKXtcbiAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLmFkZENsYXNzKCdzaG93IHN1Y2Nlc3MnKS5odG1sKG9wdGlvbnMuU2lnblVwSW5Qcm9ncmVzcyk7XG4gICAgICAgIGlmKCQoJyNwYXNzd29yZCcpLnZhbCgpICE9PSAkKCcjcGFzc3dvcmQtY29uZmlybScpLnZhbCgpKXtcbiAgICAgICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5hZGRDbGFzcygnc2hvdyBlcnJvcicpLmh0bWwob3B0aW9uc1sncGFzc3dvcmQtbm90TWF0Y2gnXSk7XG4gICAgICAgICAgc2V0VGltZW91dChtZXNzYWdlUmVtb3ZlLCAyMDAwKTtcbiAgICAgICAgICBcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVzZXJuYW1lPSQoJyN1c2VybmFtZScpLnZhbCgpO1xuICAgICAgICB2YXIgZW1haWw9JCgnI2VtYWlsJykudmFsKCk7XG5cblxuICAgICAgICBqUXVlcnkucG9zdCgnL3JlZ2lzdGVyJywge3VzZXJuYW1lOiB1c2VybmFtZSwgcGFzc3dvcmQ6dXNlci5wYXNzd29yZCwgZW1haWw6ZW1haWwsIG9wdGlvbjp1c2VyLm9wdGlvbiwgcGhvbmU6dXNlci5waG9uZX0sIGZ1bmN0aW9uKGRhdGEsIHRleHRTdGF0dXMsIHhocikge1xuICAgICAgICAgICAgaWYoZGF0YS5zdGF0dXMgPT09IDIwMCl7XG4gICAgICAgICAgICAgICAgIHJlZGlyZWN0aW5nKCk7XG4gICAgICAgICAgICB9ZWxzZSBpZihkYXRhICE9PTIwMCl7XG4gICAgICAgICAgICAgICAgaWYoREVCVUcgPT09IHRydWUpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FuIG5vdCBzaWduIHVwIXdoYXQ/XCIpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd3ZSBhcmUgZmlyZWQgdGhpcyBjYW4gbm90IGhhcHBlbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgaWYoREVCVUcgPT09IHRydWUpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfTtcbn1dKTtcbmFuZ3VsYXIubW9kdWxlKFwiTG9nZ2VyXCIpXG4uZGlyZWN0aXZlKCd1bmlxdWVVc2VybmFtZScsIFsnaXNVc2VybmFtZUF2YWlsYWJsZScsZnVuY3Rpb24oaXNVc2VybmFtZUF2YWlsYWJsZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XG4gICAgICAgICAgICBuZ01vZGVsLiRhc3luY1ZhbGlkYXRvcnMudW5pcXVlVXNlcm5hbWUgPSBpc1VzZXJuYW1lQXZhaWxhYmxlO1xuICAgICAgICB9XG4gICAgfTtcbn1dKTtcbmFuZ3VsYXIubW9kdWxlKFwiTG9nZ2VyXCIpXG4uZmFjdG9yeSgnaXNVc2VybmFtZUF2YWlsYWJsZScsIFsnJHEnLCckaHR0cCcsJyRyb290U2NvcGUnLGZ1bmN0aW9uKCRxLCAkaHR0cCwkcm9vdFNjb3BlKSB7XG4gICAgIGZ1bmN0aW9uIG1lc3NhZ2VSZW1vdmUoKXtcbiAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLnJlbW92ZUNsYXNzKCdzaG93IHN1Y2Nlc3MnKTtcbiAgICAgfVxuICAgICAgZnVuY3Rpb24gdXNlcm5hbWVUYWtlbigpe1xuICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykucmVtb3ZlQ2xhc3MoJ3Nob3cgZXJyb3InKTtcbiAgICAgICAgfVxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAnYnRuLWxvYWRpbmcnOiAnPGkgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXB1bHNlXCI+PC9pPicsXG4gICAgICAgICdidG4tc3VjY2Vzcyc6ICc8aSBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9pPicsXG4gICAgICAgICdidG4tZXJyb3InOiAnPGkgY2xhc3M9XCJmYSBmYS1yZW1vdmVcIj48L2k+JyxcbiAgICAgICAgJ21zZy1zdWNjZXNzJzogJ0FsbCBHb29kISByZWRpcmVjdGluZy4uLicsXG4gICAgICAgICdtc2ctdXNlcm5hbWUtYXZhaWxhYmxlJzogJ2dvb2QgdXNlcm5hbWUgYXZhaWxhYmxlIScsXG4gICAgICAgICdtc2ctdXNlcm5hbWUtdGFrZW4nICAgIDogJ29vcHMgdXNlcm5hbWUgdGFrZW4nLFxuICAgICAgICAnbXNnLWVtYWlsLXRha2VuJyAgICAgICA6ICdlbWFpbCB0YWtlbicsXG4gICAgICAgICdtc2cteW91ci1waG9uZS1zdWNrJyAgIDogJ3lvdXIgcGhvbmUgaXMgbm90IHZhbGlkJyxcbiAgICAgICAgJ3VzZUFKQVgnOiB0cnVlLFxuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHVzZXJuYW1lKSB7XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL3VzZXJzP3VzZXJuYW1lPScgKyB1c2VybmFtZSArICcmYWNjZXNzX3Rva2VuPThFdXFjTU5rRjJ5UDUwRGljcHY5aExSUnA3V09TYWJQbEN1MjJsaVknKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYoZGF0YSAgPT09ICdhdmFpbGFibGUnKXtcbiAgICAgICAgICAgICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5hZGRDbGFzcygnc2hvdyBzdWNjZXNzJykuaHRtbChvcHRpb25zWydtc2ctdXNlcm5hbWUtYXZhaWxhYmxlJ10pO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQobWVzc2FnZVJlbW92ZSwgMjAwMCk7XG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1lbHNlIGlmKGRhdGEgPT09ICd0YWtlbicpe1xuICAgICAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLmFkZENsYXNzKCdzaG93IGVycm9yJykuaHRtbChvcHRpb25zWydtc2ctdXNlcm5hbWUtdGFrZW4nXSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCh1c2VybmFtZVRha2VuLCAyMDAwKTtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufV0pO1xuYW5ndWxhci5tb2R1bGUoXCJMb2dnZXJcIilcbi5kaXJlY3RpdmUoJ3VuaXF1ZUVtYWlsJywgWydpc0VtYWlsQXZhaWxhYmxlJyxmdW5jdGlvbihpc0VtYWlsQXZhaWxhYmxlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcbiAgICAgICAgICAgIG5nTW9kZWwuJGFzeW5jVmFsaWRhdG9ycy51bmlxdWVFbWFpbCA9IGlzRW1haWxBdmFpbGFibGU7XG4gICAgICAgIH1cbiAgICB9O1xufV0pO1xuYW5ndWxhci5tb2R1bGUoXCJMb2dnZXJcIilcbi5mYWN0b3J5KCdpc0VtYWlsQXZhaWxhYmxlJywgWyckcScsJyRodHRwJywnJHJvb3RTY29wZScsZnVuY3Rpb24gKCRxLCAkaHR0cCwgJHJvb3RTY29wZSkge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAnYnRuLWxvYWRpbmcnOiAnPGkgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXB1bHNlXCI+PC9pPicsXG4gICAgICAgICdidG4tc3VjY2Vzcyc6ICc8aSBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9pPicsXG4gICAgICAgICdidG4tZXJyb3InOiAnPGkgY2xhc3M9XCJmYSBmYS1yZW1vdmVcIj48L2k+JyxcbiAgICAgICAgJ21zZy1zdWNjZXNzJzogJ0FsbCBHb29kISByZWRpcmVjdGluZy4uLicsXG4gICAgICAgICdtc2ctdXNlcm5hbWUtYXZhaWxhYmxlJzogJ2dvb2QgdXNlcm5hbWUgYXZhaWxhYmxlIScsXG4gICAgICAgICdtc2ctdXNlcm5hbWUtdGFrZW4nICAgIDogJ29vcHMgdXNlcm5hbWUgdGFrZW4nLFxuICAgICAgICAnbXNnLWVtYWlsLXRha2VuJyAgICAgICA6ICdlbWFpbCB0YWtlbicsXG4gICAgICAgICdtc2ctZW1haWwtYXZhaWxhYmxlJyAgIDogJ2VtYWlsIGF2YWlsYWJsZScsXG4gICAgICAgICdtc2cteW91ci1waG9uZS1zdWNrJyAgIDogJ3lvdXIgcGhvbmUgaXMgbm90IHZhbGlkJyxcbiAgICAgICAgJ3VzZUFKQVgnOiB0cnVlLFxuICAgIH07XG4gICAgZnVuY3Rpb24gbWVzc2FnZUVtYWlsVGFrZW4oKXtcbiAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykucmVtb3ZlQ2xhc3MoJ3Nob3cgZXJyb3InKTtcbiAgICB9XG4gICAgIGZ1bmN0aW9uIG1lc3NhZ2VSZW1vdmUoKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykucmVtb3ZlQ2xhc3MoJ3Nob3cgc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS91c2Vycz9lbWFpbD0nICsgZW1haWwgKyAnJmFjY2Vzc190b2tlbj04RXVxY01Oa0YyeVA1MERpY3B2OWhMUlJwN1dPU2FiUGxDdTIybGlZJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcblxuICAgICAgICAgICAgaWYoZGF0YSA9PT0gJ2VtYWlsLWF2YWlsYWJsZScpe1xuICAgICAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLmFkZENsYXNzKCdzaG93IHN1Y2Nlc3MnKS5odG1sKG9wdGlvbnNbJ21zZy1lbWFpbC1hdmFpbGFibGUnXSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChtZXNzYWdlUmVtb3ZlLCAyMDAwKTtcbiAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB9ZWxzZSBpZihkYXRhID09PSAnZW1haWwtdGFrZW4nKXtcbiAgICAgICAgICAgICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5hZGRDbGFzcygnc2hvdyBlcnJvcicpLmh0bWwob3B0aW9uc1snbXNnLWVtYWlsLXRha2VuJ10pO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQobWVzc2FnZUVtYWlsVGFrZW4sIDIwMDApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgpO1xuICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICB9KTtcbiAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3luYycpXG4gICAgLmNvbnRyb2xsZXIoJ0ZpbGVzQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLmZpbGVzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogMSxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJsb2dvNi5KUEdcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJKUEdcIixcbiAgICAgICAgICAgICAgICBcImdyb3VwX2lkXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJ1c2VyX2lkXCI6IDIsXG4gICAgICAgICAgICAgICAgXCJmb2xkZXJfaWRcIjogMixcbiAgICAgICAgICAgICAgICBcImRyb3Bib3hfbmFtZVwiOiBcInBocEc2NzY0MFhLcER1Z3ROR3NULkpQR1wiLFxuICAgICAgICAgICAgICAgIFwiZmlsZV9zaXplXCI6IDI1NDQ1LFxuICAgICAgICAgICAgICAgIFwibWltZVwiOiBcImltYWdlL2pwZWdcIixcbiAgICAgICAgICAgICAgICBcImNyZWF0ZWRfYXRcIjogXCIyMDE2LTA4LTIwIDIxOjA3OjAxXCIsXG4gICAgICAgICAgICAgICAgXCJ1cGRhdGVkX2F0XCI6IFwiMjAxNi0wOC0yMCAyMTowNzowMVwiLFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlZF9hdFwiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiZ3JvdXBzXCI6IFtdLFxuICAgICAgICAgICAgICAgIFwidXNlclwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogMixcbiAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiBcImJlYXN0YXI0NTdAZ21haWwuY29tXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidXNlcm5hbWVcIjogXCJiZWFzdGFyNDU3XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImF2YXRhclwiOiBcIi9pbWcveW91LnBuZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInByb3ZpZGVyXCI6IFwic3RyZWFtdXBib3guY29tXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicHJvdmlkZXJfaWRcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJvbmxpbmVcIjogMCxcbiAgICAgICAgICAgICAgICAgICAgXCJsYXN0X25hbWVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJnZW5kZXJcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJwaG9uZVwiOiBcIisyNTA3MjIyNjc1MTNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5X2lkXCI6IDEsXG4gICAgICAgICAgICAgICAgICAgIFwidmVyaWZpZWRcIjogMSxcbiAgICAgICAgICAgICAgICAgICAgXCJkcm9wYm94X3Rva2VuXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVsZXRlZF9hdFwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNyZWF0ZWRfYXRcIjogXCIyMDE2LTA4LTIwIDIxOjA2OjIxXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidXBkYXRlZF9hdFwiOiBcIjIwMTYtMDgtMjEgMTU6MTA6MDFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdHJpcGVfYWN0aXZlXCI6IDAsXG4gICAgICAgICAgICAgICAgICAgIFwic3RyaXBlX2lkXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwic3RyaXBlX3N1YnNjcmlwdGlvblwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInN0cmlwZV9wbGFuXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwidHJpYWxfZW5kc19hdFwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInN1YnNjcmlwdGlvbl9lbmRzX2F0XCI6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogMyxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJHZXQgU3RhcnRlZCB3aXRoIERyb3Bib3gucGRmXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGRmXCIsXG4gICAgICAgICAgICAgICAgXCJncm91cF9pZFwiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwidXNlcl9pZFwiOiAyLFxuICAgICAgICAgICAgICAgIFwiZm9sZGVyX2lkXCI6IDIsXG4gICAgICAgICAgICAgICAgXCJkcm9wYm94X25hbWVcIjogXCJwaHBqZDBvRHcySnZYbmhlc0NRcS5wZGZcIixcbiAgICAgICAgICAgICAgICBcImZpbGVfc2l6ZVwiOiA2OTIwODgsXG4gICAgICAgICAgICAgICAgXCJtaW1lXCI6IFwiYXBwbGljYXRpb24vcGRmXCIsXG4gICAgICAgICAgICAgICAgXCJjcmVhdGVkX2F0XCI6IFwiMjAxNi0wOC0yMiAxMTowMjoxOVwiLFxuICAgICAgICAgICAgICAgIFwidXBkYXRlZF9hdFwiOiBcIjIwMTYtMDgtMjIgMTE6MDI6MTlcIixcbiAgICAgICAgICAgICAgICBcImRlbGV0ZWRfYXRcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImdyb3Vwc1wiOiBbXSxcbiAgICAgICAgICAgICAgICBcInVzZXJcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IDIsXG4gICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogXCJiZWFzdGFyNDU3QGdtYWlsLmNvbVwiLFxuICAgICAgICAgICAgICAgICAgICBcInVzZXJuYW1lXCI6IFwiYmVhc3RhcjQ1N1wiLFxuICAgICAgICAgICAgICAgICAgICBcImZpcnN0X25hbWVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhdmF0YXJcIjogXCIvaW1nL3lvdS5wbmdcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwcm92aWRlclwiOiBcInN0cmVhbXVwYm94LmNvbVwiLFxuICAgICAgICAgICAgICAgICAgICBcInByb3ZpZGVyX2lkXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwib25saW5lXCI6IDAsXG4gICAgICAgICAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiZ2VuZGVyXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwicGhvbmVcIjogXCIrMjUwNzIyMjY3NTEzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY291bnRyeV9pZFwiOiAxLFxuICAgICAgICAgICAgICAgICAgICBcInZlcmlmaWVkXCI6IDEsXG4gICAgICAgICAgICAgICAgICAgIFwiZHJvcGJveF90b2tlblwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImRlbGV0ZWRfYXRcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjcmVhdGVkX2F0XCI6IFwiMjAxNi0wOC0yMCAyMTowNjoyMVwiLFxuICAgICAgICAgICAgICAgICAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE2LTA4LTIxIDE1OjEwOjAxXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RyaXBlX2FjdGl2ZVwiOiAwLFxuICAgICAgICAgICAgICAgICAgICBcInN0cmlwZV9pZFwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInN0cmlwZV9zdWJzY3JpcHRpb25cIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJzdHJpcGVfcGxhblwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInRyaWFsX2VuZHNfYXRcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJzdWJzY3JpcHRpb25fZW5kc19hdFwiOiBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKFwic3luY1wiKVxuICAgIC5jb250cm9sbGVyKCdGb2xkZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnREVCVUcnLCAnJHN0YXRlUGFyYW1zJywgJyRyb290U2NvcGUnLCAnY2FjaGVGYWN0b3J5JywgZnVuY3Rpb24gKCRzY29wZSwgREVCVUcsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSwgY2FjaGVGYWN0b3J5KSB7XG4gICAgICAgICRzY29wZS5mb2xkZXMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiAyMSxcbiAgICAgICAgICAgICAgICBcImVuY3J5cHRlZF9pZFwiOiBcIiQyeSQxMCRVLy43STdyVmFxcWs0Y2JReFdIdmUuSFFnYjBaNFAyN1p6bVZoL3RiL2JSeDFyOTA5MjNiT1wiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIlZDXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiRm9sZGVyXCIsXG4gICAgICAgICAgICAgICAgXCJzaXplXCI6IDAsXG4gICAgICAgICAgICAgICAgXCJuZXN0ZWRfZm9sZGVyXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJoYXNfY29weVwiOiAwLFxuICAgICAgICAgICAgICAgIFwiY29weV9jb3VudFwiOiAwLFxuICAgICAgICAgICAgICAgIFwidXNlcl9pZFwiOiAyLFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlX3N0YXR1c1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICBcImZvcmRlcl9wcml2YWN5XCI6IFwiUHJpdmF0ZVwiLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTYtMDgtMjEgMTU6MjM6MDNcIixcbiAgICAgICAgICAgICAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE2LTA4LTIxIDE1OjIzOjAzXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiAyMixcbiAgICAgICAgICAgICAgICBcImVuY3J5cHRlZF9pZFwiOiBcIiQyeSQxMCRrYVguTWZoMzd0S2lpTDJtZEFoTThlUncyaDJhVU1Eb2RxZ3Jqbk0wLmxBRkUyUHExamJVaVwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIlZDXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiRm9sZGVyXCIsXG4gICAgICAgICAgICAgICAgXCJzaXplXCI6IDAsXG4gICAgICAgICAgICAgICAgXCJuZXN0ZWRfZm9sZGVyXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJoYXNfY29weVwiOiAxLFxuICAgICAgICAgICAgICAgIFwiY29weV9jb3VudFwiOiAxLFxuICAgICAgICAgICAgICAgIFwidXNlcl9pZFwiOiAyLFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlX3N0YXR1c1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICBcImZvcmRlcl9wcml2YWN5XCI6IFwiUHJpdmF0ZVwiLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTYtMDgtMjEgMTU6MjQ6MDdcIixcbiAgICAgICAgICAgICAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE2LTA4LTIxIDE1OjI0OjA3XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiAyNCxcbiAgICAgICAgICAgICAgICBcImVuY3J5cHRlZF9pZFwiOiBcIiQyeSQxMCRIakMyT1BhU2g1WlFQeXR3Vkk0RmsuSExSWnZycFVRSXlobktkWmFCZ3lFWmw0eUFJS29PMlwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImJiZlwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIkZvbGRlclwiLFxuICAgICAgICAgICAgICAgIFwic2l6ZVwiOiAwLFxuICAgICAgICAgICAgICAgIFwibmVzdGVkX2ZvbGRlclwiOiAxLFxuICAgICAgICAgICAgICAgIFwiaGFzX2NvcHlcIjogMCxcbiAgICAgICAgICAgICAgICBcImNvcHlfY291bnRcIjogMCxcbiAgICAgICAgICAgICAgICBcInVzZXJfaWRcIjogMixcbiAgICAgICAgICAgICAgICBcImRlbGV0ZV9zdGF0dXNcIjogXCIwXCIsXG4gICAgICAgICAgICAgICAgXCJmb3JkZXJfcHJpdmFjeVwiOiBcIlByaXZhdGVcIixcbiAgICAgICAgICAgICAgICBcImNyZWF0ZWRfYXRcIjogXCIyMDE2LTA4LTIxIDE1OjI2OjMyXCIsXG4gICAgICAgICAgICAgICAgXCJ1cGRhdGVkX2F0XCI6IFwiMjAxNi0wOC0yMSAxNToyNjozMlwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogMjUsXG4gICAgICAgICAgICAgICAgXCJlbmNyeXB0ZWRfaWRcIjogXCIkMnkkMTAkSGxzRmg0TDZMQVRPUnZDTi5GTmVBLkttLnRTTEEwWW5oODUzL0FSSWg4U2E2a1EvV0dNZm1cIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJiYmZiXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiRm9sZGVyXCIsXG4gICAgICAgICAgICAgICAgXCJzaXplXCI6IDAsXG4gICAgICAgICAgICAgICAgXCJuZXN0ZWRfZm9sZGVyXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJoYXNfY29weVwiOiAwLFxuICAgICAgICAgICAgICAgIFwiY29weV9jb3VudFwiOiAwLFxuICAgICAgICAgICAgICAgIFwidXNlcl9pZFwiOiAyLFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlX3N0YXR1c1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICBcImZvcmRlcl9wcml2YWN5XCI6IFwiUHJpdmF0ZVwiLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTYtMDgtMjEgMTU6MjY6MzhcIixcbiAgICAgICAgICAgICAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE2LTA4LTIxIDE1OjI2OjM4XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiAyNyxcbiAgICAgICAgICAgICAgICBcImVuY3J5cHRlZF9pZFwiOiBcIiQyeSQxMCQuRTEydlJqbHpqU1BJQUhpdHdFbEpPYzVxQ2lLUW1iSERUbE1zeHlVNzVYZXJiNEZpcDQybVwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIjAxXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiRm9sZGVyXCIsXG4gICAgICAgICAgICAgICAgXCJzaXplXCI6IDAsXG4gICAgICAgICAgICAgICAgXCJuZXN0ZWRfZm9sZGVyXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJoYXNfY29weVwiOiAwLFxuICAgICAgICAgICAgICAgIFwiY29weV9jb3VudFwiOiAwLFxuICAgICAgICAgICAgICAgIFwidXNlcl9pZFwiOiAyLFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlX3N0YXR1c1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICBcImZvcmRlcl9wcml2YWN5XCI6IFwiUHJpdmF0ZVwiLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTYtMDgtMjEgMTY6MTk6MDdcIixcbiAgICAgICAgICAgICAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE2LTA4LTIxIDE2OjE5OjA4XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiAyOSxcbiAgICAgICAgICAgICAgICBcImVuY3J5cHRlZF9pZFwiOiBcIiQyeSQxMCRMeVpiREhqSlpoRXREVDdwN1VZVFNlQjlFNTZuREo0RTBSNGgvZUo1dDM2OFh6WEdNYjlCR1wiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInhjXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiRm9sZGVyXCIsXG4gICAgICAgICAgICAgICAgXCJzaXplXCI6IDAsXG4gICAgICAgICAgICAgICAgXCJuZXN0ZWRfZm9sZGVyXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJoYXNfY29weVwiOiAxLFxuICAgICAgICAgICAgICAgIFwiY29weV9jb3VudFwiOiAyLFxuICAgICAgICAgICAgICAgIFwidXNlcl9pZFwiOiAyLFxuICAgICAgICAgICAgICAgIFwiZGVsZXRlX3N0YXR1c1wiOiBcIjBcIixcbiAgICAgICAgICAgICAgICBcImZvcmRlcl9wcml2YWN5XCI6IFwiUHJpdmF0ZVwiLFxuICAgICAgICAgICAgICAgIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTYtMDgtMjEgMTY6MjQ6MTdcIixcbiAgICAgICAgICAgICAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE2LTA4LTIxIDE2OjI0OjE4XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICB9XSlcbiAgICAuZmFjdG9yeShcImNhY2hlRmFjdG9yeVwiLCBmdW5jdGlvbiAoJGNhY2hlRmFjdG9yeSkge1xuICAgICAgICAvL2JlIGNhdXRpb3VzIHdpdGggdGhpcyFcbiAgICAgICAgcmV0dXJuICRjYWNoZUZhY3RvcnkoXCJ1c2VyRGF0YVwiKTtcbiAgICB9KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
