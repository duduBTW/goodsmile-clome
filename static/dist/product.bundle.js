/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/data-attr.ts":
/*!*****************************!*\
  !*** ./client/data-attr.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DATA = void 0;\nexports.DATA = {\n    CHANGED: \"data-changed\",\n    DEFAULT_LABEL: \"data-default-label\",\n    ID: \"data-id\",\n    SELECTED: \"data-selected\",\n    POPUP_FOR: \"data-popup-for\",\n    TRIGGER_FOR: \"data-trigger-for\",\n    STATE: \"data-state\",\n    ACTIVE: \"data-active\",\n    INDEX: \"data-index\",\n    HIDDEN: \"data-hidden\",\n    LOADING: \"data-loading\",\n};\n\n\n//# sourceURL=webpack://project-bored/./client/data-attr.ts?");

/***/ }),

/***/ "./client/link.ts":
/*!************************!*\
  !*** ./client/link.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst data_attr_1 = __webpack_require__(/*! ./data-attr */ \"./client/data-attr.ts\");\n/** Navigation controller to avoid race conditions */\nlet currentNavigationController = null;\n/** Elements */\nlet pageLoader;\n/** Is page changing */\nlet isLoading = new Proxy({ value: false }, {\n    set(obj, _, newValue) {\n        obj.value = newValue;\n        if (newValue) {\n            pageLoader.removeAttribute(data_attr_1.DATA.HIDDEN);\n        }\n        else {\n            pageLoader.setAttribute(data_attr_1.DATA.HIDDEN, \"true\");\n        }\n        return true;\n    },\n});\n// Function to handle the custom logic before navigation\nasync function handleCustomLogicAndNavigate(href) {\n    console.log(\"Executing custom logic before navigation...\", href);\n    // Cancel the previous request if it exists\n    if (currentNavigationController) {\n        currentNavigationController.abort();\n    }\n    // Create a new AbortController for the current navigation\n    currentNavigationController = new AbortController();\n    const { signal } = currentNavigationController;\n    try {\n        isLoading.value = true;\n        const response = await fetch(href, { signal });\n        if (response.status !== 200) {\n            return;\n        }\n        const html = await response.text();\n        // Replace the entire document with the fetched HTML\n        document.open();\n        document.write(html);\n        document.close();\n        // Optionally, update the browser's history\n        history.pushState(null, \"\", href);\n        isLoading.value = false;\n    }\n    catch (error) {\n        if (error instanceof Error && error.name === \"AbortError\") {\n            return;\n        }\n        isLoading.value = false;\n    }\n}\n// Function to handle navigation events\nfunction handleNavigation(event) {\n    let target = null;\n    if (event instanceof MouseEvent) {\n        target = event.target.closest(\"a\"); // Use closest to handle nested elements\n    }\n    else if (event instanceof KeyboardEvent && event.key === \"Enter\") {\n        target = event.target;\n    }\n    if (target && target.tagName === \"A\") {\n        const anchor = target;\n        if (anchor.href.startsWith(window.location.origin)) {\n            event.preventDefault(); // Prevent the default navigation\n            console.log(\"User triggered navigation to another page.\");\n            // Call the custom logic function before navigating\n            handleCustomLogicAndNavigate(anchor.href);\n        }\n    }\n}\n// Function to handle popstate events (back/forward navigation)\nfunction handlePopState() {\n    handleCustomLogicAndNavigate(window.location.href); // Call the function with popstate flag\n}\nwindow.addEventListener(\"load\", () => {\n    pageLoader = document.getElementById(window.search.Ids.PageLoader);\n    // Event listener for link clicks\n    document.addEventListener(\"click\", handleNavigation);\n    // Event listener for keyboard navigation (Enter key)\n    document.addEventListener(\"keydown\", handleNavigation);\n    window.addEventListener(\"popstate\", handlePopState);\n});\n\n\n//# sourceURL=webpack://project-bored/./client/link.ts?");

/***/ }),

/***/ "./client/pages/product.ts":
/*!*********************************!*\
  !*** ./client/pages/product.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n__webpack_require__(/*! ../link */ \"./client/link.ts\");\n\n\n//# sourceURL=webpack://project-bored/./client/pages/product.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client/pages/product.ts");
/******/ 	
/******/ })()
;