import { DATA } from "./data-attr";
import { debounce } from "./debounce";

export {};

const DEFAULT_ACTIVE_INDEX = -1;
const DEFAULT_SEARCH_VALUE = "";

/** State from the data-state */
let suggestionsState: string[] = [];
/** Has the suggestions been fetched */
let hasFetched = false;
/** Is fetching after closing the popup  */
let isFetchingFromEsc = false;
/** Last search value fetched */
let lastFetchedValue = DEFAULT_SEARCH_VALUE;
/** Is mouse on top of the suggetions container */
let isMouseOverSuggestions = false;
/** Is search input focused */
let isSearchinputFocused = false;

// Elements
let elementClearHistoryButton: HTMLButtonElement;
let elementSearchSuggestionsContainer: HTMLDivElement;
let elementClearSearchInput: HTMLButtonElement;
let elementSearchInput: HTMLInputElement;

/** Input value state */
let searchValue = new Proxy(
  { value: DEFAULT_SEARCH_VALUE },
  {
    set(obj, _, targetSearchValue: string) {
      obj.value = targetSearchValue;
      if (elementSearchInput.value !== targetSearchValue) {
        elementSearchInput.value = targetSearchValue;
      }

      if (targetSearchValue) {
        elementClearSearchInput.removeAttribute(DATA.HIDDEN);
      } else {
        elementClearSearchInput.setAttribute(DATA.HIDDEN, "true");
      }

      return true;
    },
  }
);

/** Popup open state */
let showPopup = new Proxy(
  { value: false },
  {
    set(obj, _, targetPopup: boolean) {
      obj.value = targetPopup;
      if (targetPopup) {
        elementSearchSuggestionsContainer.removeAttribute(DATA.HIDDEN);
      } else {
        elementSearchSuggestionsContainer.setAttribute(DATA.HIDDEN, "true");
      }

      return true;
    },
  }
);

/** Active index state */
let activeIndex = new Proxy(
  { value: DEFAULT_ACTIVE_INDEX },
  {
    set(obj, _, targetIndex: number) {
      if (
        !suggestionsState ||
        targetIndex < -1 ||
        targetIndex > suggestionsState.length - 1
      ) {
        return false;
      }

      obj.value = targetIndex;
      elementSearchSuggestionsContainer
        .querySelector(`[${DATA.ACTIVE}]`)
        ?.removeAttribute(DATA.ACTIVE);

      elementSearchSuggestionsContainer
        .querySelector(`[${DATA.INDEX}="${targetIndex}"]`)
        ?.setAttribute(DATA.ACTIVE, "true");

      return true;
    },
  }
);

const debouncedFetchSearchSuggestions = debounce(fetchSearchSuggestions, 500);
async function fetchSearchSuggestions() {
  hasFetched = true;
  lastFetchedValue = searchValue.value;

  const response = await fetch(`/search/suggestions?q=${searchValue.value}`);
  if (response.status !== 200) {
    return;
  }

  elementSearchSuggestionsContainer.innerHTML = await response.text();
  extractStateFromSuggestions();
}

async function fetchClearHistory() {
  const response = await fetch(`/search/clear-history`, { method: "DELETE" });
  if (response.status !== 200) {
    return;
  }

  elementSearchSuggestionsContainer.innerHTML = "";
}

function extractStateFromSuggestions() {
  const elementWithState = elementSearchSuggestionsContainer.querySelector(
    `[${DATA.STATE}]`
  ) as HTMLDivElement;
  const state = elementWithState?.dataset.state;
  if (!state) {
    return;
  }

  try {
    suggestionsState = JSON.parse(state.replaceAll(`'`, `"`));
    elementSearchSuggestionsContainer.removeAttribute(DATA.STATE);
    activeIndex.value = DEFAULT_ACTIVE_INDEX;
  } catch (error) {
    console.error("error", error);
  }
}

async function handleBlur() {
  isSearchinputFocused = false;
  if (isMouseOverSuggestions) {
    return;
  }
  showPopup.value = false;
}

async function handleFocus() {
  isSearchinputFocused = true;
  if (!hasFetched) {
    fetchSearchSuggestions();
  }

  showPopup.value = true;
}

function handleInputChange(e: Event) {
  if (!showPopup.value) {
    showPopup.value = true;
  }

  isFetchingFromEsc = false;
  searchValue.value = (e.target as HTMLInputElement).value;
  if (!searchValue.value) {
    /** Instantly fetch to get the history */
    fetchSearchSuggestions();
    return;
  }

  debouncedFetchSearchSuggestions();
}

const keyPressToAction = new Map<
  KeyboardEvent["key"],
  (e: KeyboardEvent) => void
>([
  [
    "Escape",
    async () => {
      activeIndex.value = -1;
      showPopup.value = false;
      isFetchingFromEsc = true;
      try {
        await fetchSearchSuggestions();
      } finally {
        isFetchingFromEsc = false;
      }
    },
  ],
  [
    "ArrowDown",
    () => {
      if (activeIndex.value === -1 && !showPopup.value) {
        showPopup.value = true;
        return;
      }

      if (isFetchingFromEsc) {
        return;
      }

      activeIndex.value++;
      searchInputValueSelectedIndex();
    },
  ],
  [
    "ArrowUp",
    () => {
      if (!showPopup.value) {
        return;
      }

      activeIndex.value--;
      if (activeIndex.value === -1) {
        // Returns the value to the last fetched value
        searchValue.value = lastFetchedValue;
        return;
      }

      searchInputValueSelectedIndex();
    },
  ],
]);

async function handlekeyDown(e: KeyboardEvent) {
  const action = keyPressToAction.get(e.key);
  if (!action) {
    return;
  }

  e.preventDefault();
  action(e);
}

async function handlekeyClearHistoryClick(e: MouseEvent) {
  if (
    (e.target as HTMLDivElement).id !== window.home.Ids.Searcher.ClearHistory
  ) {
    return;
  }

  fetchClearHistory();
}

function handleClearSearchInputClick() {
  searchValue.value = DEFAULT_SEARCH_VALUE;
  fetchSearchSuggestions();
}

async function handleMouseEnterSuggestions(e: MouseEvent) {
  isMouseOverSuggestions = true;

  const targetIndex = suggestionElementIndex(e);
  if (targetIndex === -1) {
    return;
  }

  activeIndex.value = targetIndex;
}

async function handleMouseLeaveSuggestions(e: MouseEvent) {
  isMouseOverSuggestions = false;
  if (isSearchinputFocused) {
    return;
  }

  showPopup.value = false;
}

function suggestionElementIndex(e: MouseEvent) {
  const notFoundIndex = -1;
  const target = e.target as HTMLLIElement;
  if (target.tagName !== "A") {
    return notFoundIndex;
  }

  const attrIndex = target.getAttribute(DATA.INDEX);
  const targetIndex = Number(attrIndex);
  if (isNaN(targetIndex)) {
    return notFoundIndex;
  }

  return targetIndex;
}

function searchInputValueSelectedIndex() {
  const selectedValue = suggestionsState[activeIndex.value];
  if (!selectedValue) {
    return;
  }

  searchValue.value = selectedValue;
}

function setDefaultSearchValue() {
  searchValue.value = elementSearchInput.value;

  // Prefetch suggestions
  if (searchValue.value) {
    fetchSearchSuggestions();
  }
}

function queryElements() {
  elementSearchInput = document.getElementById(
    window.home.Ids.Searcher.Input
  ) as HTMLInputElement;
  elementSearchSuggestionsContainer = document.getElementById(
    window.home.Ids.Searcher.Suggestions
  ) as HTMLDivElement;
  elementClearHistoryButton = document.getElementById(
    window.home.Ids.Searcher.ClearHistory
  ) as HTMLButtonElement;
  elementClearSearchInput = document.getElementById(
    window.home.Ids.Searcher.ClearInput
  ) as HTMLButtonElement;
}

function addEventListeners() {
  elementClearSearchInput.addEventListener(
    "click",
    handleClearSearchInputClick
  );
  elementSearchInput.addEventListener("input", handleInputChange);
  elementSearchInput.addEventListener("blur", handleBlur);
  elementSearchInput.addEventListener("focus", handleFocus);
  elementSearchInput.addEventListener("keydown", handlekeyDown);
  elementSearchSuggestionsContainer.addEventListener(
    "mouseover",
    handleMouseEnterSuggestions
  );
  elementSearchSuggestionsContainer.addEventListener(
    "mouseleave",
    handleMouseLeaveSuggestions
  );
  elementSearchSuggestionsContainer.addEventListener(
    "click",
    handlekeyClearHistoryClick
  );
}

function initSearcher() {
  queryElements();
  addEventListeners();
  setDefaultSearchValue();
}

window.addEventListener("load", initSearcher);
