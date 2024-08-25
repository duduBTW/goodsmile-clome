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

/***/ "./client/carousel.ts":
/*!****************************!*\
  !*** ./client/carousel.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nlet carousel;\nlet carouselPagination;\nlet carouselPaginationPages;\nlet carouselArrowLeft;\nlet carouselArrowRight;\nconst INTIIAL_PAGE = 1;\nlet currentPage = new Proxy({ value: INTIIAL_PAGE }, {\n    set(obj, _, targetPage) {\n        if (targetPage <= 0) {\n            return false;\n        }\n        if (targetPage > window.home.Carousel.length) {\n            return false;\n        }\n        obj.value = targetPage;\n        scrollCarouselSlideIntoView(targetPage - 1);\n        toggleControlArrows(targetPage);\n        activateCurrentPaginationPage(targetPage - 1);\n        return true;\n    },\n});\nfunction scrollCarouselSlideIntoView(index) {\n    carousel.querySelector(`[data-index=\"${index}\"]`)?.scrollIntoView({\n        behavior: \"smooth\",\n        block: \"nearest\",\n        inline: \"center\",\n    });\n}\nfunction queryElements() {\n    carouselArrowLeft = document.getElementById(window.home.Ids.CarouselArrowLeft);\n    carouselArrowRight = document.getElementById(window.home.Ids.CarouselArrowRight);\n    carousel = document.getElementById(window.home.Ids.Carousel);\n    carouselPagination = document.getElementById(window.home.Ids.CarouselPagination);\n    carouselPaginationPages = document.querySelectorAll(`#${window.home.Ids.CarouselPaginationPage}`);\n}\nfunction activateCurrentPaginationPage(index) {\n    const activePage = carouselPagination.querySelector(`[data-active='true']`);\n    const targetPage = carouselPagination.querySelector(`[data-index=\"${index}\"]`);\n    activePage?.removeAttribute(\"data-active\");\n    activePage?.removeAttribute(\"tabindex\");\n    targetPage?.setAttribute(\"data-active\", \"true\");\n    targetPage?.setAttribute(\"tabindex\", \"0\");\n}\nfunction toggleControlArrows(page) {\n    if (page === 1) {\n        carouselArrowLeft.setAttribute(\"disabled\", \"true\");\n    }\n    else {\n        carouselArrowLeft.removeAttribute(\"disabled\");\n    }\n    if (page + 1 > window.home.Carousel.length) {\n        carouselArrowRight.setAttribute(\"disabled\", \"true\");\n    }\n    else {\n        carouselArrowRight.removeAttribute(\"disabled\");\n    }\n}\nfunction slideNext() {\n    currentPage.value++;\n}\nfunction slidePrevious() {\n    currentPage.value--;\n}\nfunction slideToPage(e) {\n    const pageElement = e.target;\n    const pageIndex = Number(pageElement.dataset.index);\n    if (isNaN(pageIndex)) {\n        return;\n    }\n    currentPage.value = pageIndex + 1;\n    requestAnimationFrame(() => {\n        focusActivePage();\n    });\n}\nfunction focusActivePage() {\n    const activePage = carouselPagination.querySelector(`[data-active='true']`);\n    if (!(activePage &&\n        \"focus\" in activePage &&\n        typeof activePage?.focus === \"function\")) {\n        return;\n    }\n    activePage.focus();\n}\nfunction pageKeyDownHandler(e) {\n    if (e.key === \"ArrowLeft\") {\n        slidePrevious();\n    }\n    if (e.key === \"ArrowRight\") {\n        slideNext();\n    }\n    requestAnimationFrame(() => {\n        focusActivePage();\n    });\n}\nfunction addEventListeners() {\n    let observer = new IntersectionObserver(() => {\n        //\n    }, {\n        root: carousel,\n        rootMargin: \"0px\",\n        threshold: 1.0,\n    });\n    carouselArrowRight.addEventListener(\"click\", slideNext);\n    carouselArrowLeft.addEventListener(\"click\", slidePrevious);\n    carouselPaginationPages.forEach((page) => {\n        page.addEventListener(\"click\", slideToPage);\n        page.addEventListener(\"keydown\", pageKeyDownHandler);\n    });\n}\nfunction initCarousel() {\n    console.log(\"carousel\");\n    queryElements();\n    toggleControlArrows(INTIIAL_PAGE);\n    activateCurrentPaginationPage(INTIIAL_PAGE - 1);\n    addEventListeners();\n}\nwindow.addEventListener(\"load\", initCarousel);\n\n\n//# sourceURL=webpack://project-bored/./client/carousel.ts?");

/***/ }),

/***/ "./client/data-attr.ts":
/*!*****************************!*\
  !*** ./client/data-attr.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DATA = void 0;\nexports.DATA = {\n    CHANGED: \"data-changed\",\n    DEFAULT_LABEL: \"data-default-label\",\n    ID: \"data-id\",\n    SELECTED: \"data-selected\",\n    POPUP_FOR: \"data-popup-for\",\n    TRIGGER_FOR: \"data-trigger-for\",\n    STATE: \"data-state\",\n    ACTIVE: \"data-active\",\n    INDEX: \"data-index\",\n    HIDDEN: \"data-hidden\",\n    LOADING: \"data-loading\",\n};\n\n\n//# sourceURL=webpack://project-bored/./client/data-attr.ts?");

/***/ }),

/***/ "./client/debounce.ts":
/*!****************************!*\
  !*** ./client/debounce.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.debounce = debounce;\nfunction debounce(callback, ms) {\n    let timeout;\n    return () => {\n        clearTimeout(timeout);\n        timeout = setTimeout(() => {\n            callback();\n        }, ms);\n    };\n}\n\n\n//# sourceURL=webpack://project-bored/./client/debounce.ts?");

/***/ }),

/***/ "./client/global-data.ts":
/*!*******************************!*\
  !*** ./client/global-data.ts ***!
  \*******************************/
/***/ (() => {

eval("\nfunction setupGlobalData() {\n    // Step 1: Select the <script> element\n    const scriptElement = document.querySelector(\"script#__DATA__\");\n    if (!scriptElement) {\n        throw new Error(\"ids script not found\");\n    }\n    // Step 2: Get the JSON string from the script content\n    const jsonString = scriptElement.textContent;\n    if (!jsonString) {\n        throw new Error(\"ids script has no content\");\n    }\n    window.home = JSON.parse(jsonString);\n    window.search = JSON.parse(jsonString);\n}\nsetupGlobalData();\n\n\n//# sourceURL=webpack://project-bored/./client/global-data.ts?");

/***/ }),

/***/ "./client/link.ts":
/*!************************!*\
  !*** ./client/link.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst data_attr_1 = __webpack_require__(/*! ./data-attr */ \"./client/data-attr.ts\");\n/** Navigation controller to avoid race conditions */\nlet currentNavigationController = null;\n/** Elements */\nlet pageLoader;\n/** Is page changing */\nlet isLoading = new Proxy({ value: false }, {\n    set(obj, _, newValue) {\n        obj.value = newValue;\n        if (newValue) {\n            pageLoader.removeAttribute(data_attr_1.DATA.HIDDEN);\n        }\n        else {\n            pageLoader.setAttribute(data_attr_1.DATA.HIDDEN, \"true\");\n        }\n        return true;\n    },\n});\n// Function to handle the custom logic before navigation\nasync function handleCustomLogicAndNavigate(href) {\n    console.log(\"Executing custom logic before navigation...\", href);\n    // Cancel the previous request if it exists\n    if (currentNavigationController) {\n        currentNavigationController.abort();\n    }\n    // Create a new AbortController for the current navigation\n    currentNavigationController = new AbortController();\n    const { signal } = currentNavigationController;\n    try {\n        isLoading.value = true;\n        const response = await fetch(href, { signal });\n        if (response.status !== 200) {\n            return;\n        }\n        const html = await response.text();\n        // Replace the entire document with the fetched HTML\n        document.open();\n        document.write(html);\n        document.close();\n        // Optionally, update the browser's history\n        history.pushState(null, \"\", href);\n        isLoading.value = false;\n    }\n    catch (error) {\n        if (error instanceof Error && error.name === \"AbortError\") {\n            return;\n        }\n        isLoading.value = false;\n    }\n}\n// Function to handle navigation events\nfunction handleNavigation(event) {\n    let target = null;\n    if (event instanceof MouseEvent) {\n        target = event.target.closest(\"a\"); // Use closest to handle nested elements\n    }\n    else if (event instanceof KeyboardEvent && event.key === \"Enter\") {\n        target = event.target;\n    }\n    if (target && target.tagName === \"A\") {\n        const anchor = target;\n        if (anchor.href.startsWith(window.location.origin)) {\n            event.preventDefault(); // Prevent the default navigation\n            console.log(\"User triggered navigation to another page.\");\n            // Call the custom logic function before navigating\n            handleCustomLogicAndNavigate(anchor.href);\n        }\n    }\n}\n// Function to handle popstate events (back/forward navigation)\nfunction handlePopState() {\n    handleCustomLogicAndNavigate(window.location.href); // Call the function with popstate flag\n}\nwindow.addEventListener(\"load\", () => {\n    pageLoader = document.getElementById(window.search.Ids.PageLoader);\n    // Event listener for link clicks\n    document.addEventListener(\"click\", handleNavigation);\n    // Event listener for keyboard navigation (Enter key)\n    document.addEventListener(\"keydown\", handleNavigation);\n    window.addEventListener(\"popstate\", handlePopState);\n});\n\n\n//# sourceURL=webpack://project-bored/./client/link.ts?");

/***/ }),

/***/ "./client/pages/home.ts":
/*!******************************!*\
  !*** ./client/pages/home.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n__webpack_require__(/*! ../carousel */ \"./client/carousel.ts\");\n__webpack_require__(/*! ../searcher */ \"./client/searcher.ts\");\n__webpack_require__(/*! ../global-data */ \"./client/global-data.ts\");\n__webpack_require__(/*! ../link */ \"./client/link.ts\");\n\n\n//# sourceURL=webpack://project-bored/./client/pages/home.ts?");

/***/ }),

/***/ "./client/searcher.ts":
/*!****************************!*\
  !*** ./client/searcher.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst data_attr_1 = __webpack_require__(/*! ./data-attr */ \"./client/data-attr.ts\");\nconst debounce_1 = __webpack_require__(/*! ./debounce */ \"./client/debounce.ts\");\nconst DEFAULT_ACTIVE_INDEX = -1;\nconst DEFAULT_SEARCH_VALUE = \"\";\n/** State from the data-state */\nlet suggestionsState = [];\n/** Has the suggestions been fetched */\nlet hasFetched = false;\n/** Is fetching after closing the popup  */\nlet isFetchingFromEsc = false;\n/** Last search value fetched */\nlet lastFetchedValue = DEFAULT_SEARCH_VALUE;\n/** Is mouse on top of the suggetions container */\nlet isMouseOverSuggestions = false;\n/** Is search input focused */\nlet isSearchinputFocused = false;\n// Elements\nlet elementClearHistoryButton;\nlet elementSearchSuggestionsContainer;\nlet elementClearSearchInput;\nlet elementSearchInput;\n/** Input value state */\nlet searchValue = new Proxy({ value: DEFAULT_SEARCH_VALUE }, {\n    set(obj, _, targetSearchValue) {\n        obj.value = targetSearchValue;\n        if (elementSearchInput.value !== targetSearchValue) {\n            elementSearchInput.value = targetSearchValue;\n        }\n        if (targetSearchValue) {\n            elementClearSearchInput.removeAttribute(data_attr_1.DATA.HIDDEN);\n        }\n        else {\n            elementClearSearchInput.setAttribute(data_attr_1.DATA.HIDDEN, \"true\");\n        }\n        return true;\n    },\n});\n/** Popup open state */\nlet showPopup = new Proxy({ value: false }, {\n    set(obj, _, targetPopup) {\n        obj.value = targetPopup;\n        if (targetPopup) {\n            elementSearchSuggestionsContainer.removeAttribute(data_attr_1.DATA.HIDDEN);\n        }\n        else {\n            elementSearchSuggestionsContainer.setAttribute(data_attr_1.DATA.HIDDEN, \"true\");\n        }\n        return true;\n    },\n});\n/** Active index state */\nlet activeIndex = new Proxy({ value: DEFAULT_ACTIVE_INDEX }, {\n    set(obj, _, targetIndex) {\n        if (!suggestionsState ||\n            targetIndex < -1 ||\n            targetIndex > suggestionsState.length - 1) {\n            return false;\n        }\n        obj.value = targetIndex;\n        elementSearchSuggestionsContainer\n            .querySelector(`[${data_attr_1.DATA.ACTIVE}]`)\n            ?.removeAttribute(data_attr_1.DATA.ACTIVE);\n        elementSearchSuggestionsContainer\n            .querySelector(`[${data_attr_1.DATA.INDEX}=\"${targetIndex}\"]`)\n            ?.setAttribute(data_attr_1.DATA.ACTIVE, \"true\");\n        return true;\n    },\n});\nconst debouncedFetchSearchSuggestions = (0, debounce_1.debounce)(fetchSearchSuggestions, 500);\nasync function fetchSearchSuggestions() {\n    hasFetched = true;\n    lastFetchedValue = searchValue.value;\n    const response = await fetch(`/search/suggestions?q=${searchValue.value}`);\n    if (response.status !== 200) {\n        return;\n    }\n    elementSearchSuggestionsContainer.innerHTML = await response.text();\n    extractStateFromSuggestions();\n}\nasync function fetchClearHistory() {\n    const response = await fetch(`/search/clear-history`, { method: \"DELETE\" });\n    if (response.status !== 200) {\n        return;\n    }\n    elementSearchSuggestionsContainer.innerHTML = \"\";\n}\nfunction extractStateFromSuggestions() {\n    const elementWithState = elementSearchSuggestionsContainer.querySelector(`[${data_attr_1.DATA.STATE}]`);\n    const state = elementWithState?.dataset.state;\n    if (!state) {\n        return;\n    }\n    try {\n        suggestionsState = JSON.parse(state.replaceAll(`'`, `\"`));\n        elementSearchSuggestionsContainer.removeAttribute(data_attr_1.DATA.STATE);\n        activeIndex.value = DEFAULT_ACTIVE_INDEX;\n    }\n    catch (error) {\n        console.error(\"error\", error);\n    }\n}\nasync function handleBlur() {\n    isSearchinputFocused = false;\n    if (isMouseOverSuggestions) {\n        return;\n    }\n    showPopup.value = false;\n}\nasync function handleFocus() {\n    isSearchinputFocused = true;\n    if (!hasFetched) {\n        fetchSearchSuggestions();\n    }\n    showPopup.value = true;\n}\nfunction handleInputChange(e) {\n    if (!showPopup.value) {\n        showPopup.value = true;\n    }\n    isFetchingFromEsc = false;\n    searchValue.value = e.target.value;\n    if (!searchValue.value) {\n        /** Instantly fetch to get the history */\n        fetchSearchSuggestions();\n        return;\n    }\n    debouncedFetchSearchSuggestions();\n}\nconst keyPressToAction = new Map([\n    [\n        \"Escape\",\n        async () => {\n            activeIndex.value = -1;\n            showPopup.value = false;\n            isFetchingFromEsc = true;\n            try {\n                await fetchSearchSuggestions();\n            }\n            finally {\n                isFetchingFromEsc = false;\n            }\n        },\n    ],\n    [\n        \"ArrowDown\",\n        () => {\n            if (activeIndex.value === -1 && !showPopup.value) {\n                showPopup.value = true;\n                return;\n            }\n            if (isFetchingFromEsc) {\n                return;\n            }\n            activeIndex.value++;\n            searchInputValueSelectedIndex();\n        },\n    ],\n    [\n        \"ArrowUp\",\n        () => {\n            if (!showPopup.value) {\n                return;\n            }\n            activeIndex.value--;\n            if (activeIndex.value === -1) {\n                // Returns the value to the last fetched value\n                searchValue.value = lastFetchedValue;\n                return;\n            }\n            searchInputValueSelectedIndex();\n        },\n    ],\n]);\nasync function handlekeyDown(e) {\n    const action = keyPressToAction.get(e.key);\n    if (!action) {\n        return;\n    }\n    e.preventDefault();\n    action(e);\n}\nasync function handlekeyClearHistoryClick(e) {\n    if (e.target.id !== window.home.Ids.Searcher.ClearHistory) {\n        return;\n    }\n    fetchClearHistory();\n}\nfunction handleClearSearchInputClick() {\n    searchValue.value = DEFAULT_SEARCH_VALUE;\n    fetchSearchSuggestions();\n}\nasync function handleMouseEnterSuggestions(e) {\n    isMouseOverSuggestions = true;\n    const targetIndex = suggestionElementIndex(e);\n    if (targetIndex === -1) {\n        return;\n    }\n    activeIndex.value = targetIndex;\n}\nasync function handleMouseLeaveSuggestions(e) {\n    isMouseOverSuggestions = false;\n    if (isSearchinputFocused) {\n        return;\n    }\n    showPopup.value = false;\n}\nfunction suggestionElementIndex(e) {\n    const notFoundIndex = -1;\n    const target = e.target;\n    if (target.tagName !== \"A\") {\n        return notFoundIndex;\n    }\n    const attrIndex = target.getAttribute(data_attr_1.DATA.INDEX);\n    const targetIndex = Number(attrIndex);\n    if (isNaN(targetIndex)) {\n        return notFoundIndex;\n    }\n    return targetIndex;\n}\nfunction searchInputValueSelectedIndex() {\n    const selectedValue = suggestionsState[activeIndex.value];\n    if (!selectedValue) {\n        return;\n    }\n    searchValue.value = selectedValue;\n}\nfunction setDefaultSearchValue() {\n    searchValue.value = elementSearchInput.value;\n    // Prefetch suggestions\n    if (searchValue.value) {\n        fetchSearchSuggestions();\n    }\n}\nfunction queryElements() {\n    elementSearchInput = document.getElementById(window.home.Ids.Searcher.Input);\n    elementSearchSuggestionsContainer = document.getElementById(window.home.Ids.Searcher.Suggestions);\n    elementClearHistoryButton = document.getElementById(window.home.Ids.Searcher.ClearHistory);\n    elementClearSearchInput = document.getElementById(window.home.Ids.Searcher.ClearInput);\n}\nfunction addEventListeners() {\n    elementClearSearchInput.addEventListener(\"click\", handleClearSearchInputClick);\n    elementSearchInput.addEventListener(\"input\", handleInputChange);\n    elementSearchInput.addEventListener(\"blur\", handleBlur);\n    elementSearchInput.addEventListener(\"focus\", handleFocus);\n    elementSearchInput.addEventListener(\"keydown\", handlekeyDown);\n    elementSearchSuggestionsContainer.addEventListener(\"mouseover\", handleMouseEnterSuggestions);\n    elementSearchSuggestionsContainer.addEventListener(\"mouseleave\", handleMouseLeaveSuggestions);\n    elementSearchSuggestionsContainer.addEventListener(\"click\", handlekeyClearHistoryClick);\n}\nfunction initSearcher() {\n    queryElements();\n    addEventListeners();\n    setDefaultSearchValue();\n}\nwindow.addEventListener(\"load\", initSearcher);\n\n\n//# sourceURL=webpack://project-bored/./client/searcher.ts?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./client/pages/home.ts");
/******/ 	
/******/ })()
;