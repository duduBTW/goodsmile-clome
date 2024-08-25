import { Checkbox, SearchPageData } from "./backend-model";
import { decodeBase64, encodeBase64 } from "./base64";
import { DATA } from "./data-attr";
import { queryAllByAttr, queryByAttr } from "./query-selector";

type CheckboxFilterElements = {
  trigger: HTMLButtonElement;
  popup: HTMLDivElement;
};
type FilterPopupOpen = string | null;

const DEFAULT_FILTER_POPUP_OPEN: FilterPopupOpen = null;
const CHECKBOX_FILTERS_QUERY_PARAM = "checkbox-filter";
const DEFAULT_SEARCH_VALUE = "";
const DEFAULT_ACTIVE_INDEX = 0;
const DEFAULT_SELECTED_CHECKBOXES = {};

let filteredCheckboxesData: {
  title: SearchPageData["Titles"]["Checkboxes"];
  manufacters: SearchPageData["Manufacters"]["Checkboxes"];
  status: SearchPageData["Status"]["Checkboxes"];
  criteria: SearchPageData["Criteria"]["Checkboxes"];
};

let canUseMouseEvents = false;

// Elements
let manufactersSearchInput: HTMLInputElement;
let titlesSearchInput: HTMLInputElement;
let filterTriggerElements: HTMLButtonElement[];
let popupElements: HTMLDivElement[];
let filtersElement: HTMLDivElement;
let searchResultContainerElement: HTMLDivElement;
let clearAllButton: HTMLDivElement;

/** Input value state */
let popupOpen = new Proxy<{ value: FilterPopupOpen }>(
  { value: DEFAULT_FILTER_POPUP_OPEN },
  {
    set(obj, _, targetPopupIdentifier: FilterPopupOpen) {
      document
        .querySelectorAll(`[${DATA.POPUP_FOR}]`)
        .forEach((targetPopup) =>
          targetPopup.setAttribute(DATA.HIDDEN, "true")
        );

      // Popup that will be opened
      const targetPopup = queryByAttr(
        document,
        DATA.POPUP_FOR,
        targetPopupIdentifier
      );
      targetPopup?.removeAttribute(DATA.HIDDEN);

      obj.value = targetPopupIdentifier;
      return true;
    },
  }
);

/** Active index state */
let activeIndex = new Proxy(
  { value: DEFAULT_ACTIVE_INDEX },
  {
    set(obj, _, targetIndex: number) {
      obj.value = targetIndex;

      // Popup that will be opened
      const targetPopup = queryByAttr(
        document,
        DATA.POPUP_FOR,
        popupOpen.value
      );

      const currentPopupData = getOpenPopupData();
      if (currentPopupData) {
        const allCheckboxes = queryByAttr(targetPopup, DATA.ACTIVE);
        const targetCheckboxId = currentPopupData[targetIndex].Id;
        const targetCheckbox = queryByAttr(
          targetPopup,
          DATA.ID,
          targetCheckboxId
        );

        allCheckboxes?.removeAttribute(DATA.ACTIVE);
        targetCheckbox?.setAttribute(DATA.ACTIVE, "true");
      }

      return true;
    },
  }
);

let titleSearchValue = new Proxy(
  { value: DEFAULT_SEARCH_VALUE },
  {
    set(obj, _, targetValue: string) {
      obj.value = targetValue;

      const filteredTitleChecboxes = rerenderPopupSearchList(targetValue);
      if (filteredTitleChecboxes) {
        filteredCheckboxesData.title = filteredTitleChecboxes;
      }

      return true;
    },
  }
);

let manufactersSearchValue = new Proxy(
  { value: DEFAULT_SEARCH_VALUE },
  {
    set(obj, _, targetValue: string) {
      obj.value = targetValue;

      const filteredManufacterChecboxes = rerenderPopupSearchList(targetValue);
      if (filteredManufacterChecboxes) {
        filteredCheckboxesData.manufacters = filteredManufacterChecboxes;
      }

      return true;
    },
  }
);

/** Active index state */
let selectedTitles = new Proxy<{ value: Record<string, Checkbox[]> }>(
  { value: DEFAULT_SELECTED_CHECKBOXES },
  {
    set(obj, _, targetSelectedCheckboxes: Record<string, Checkbox[]>) {
      obj.value = targetSelectedCheckboxes;
      setCheckoboxListQueryParams(targetSelectedCheckboxes);
      rerenderCheckboxList(targetSelectedCheckboxes);
      return true;
    },
  }
);

/** Serch results is loading */
let isLoading = new Proxy(
  { value: false },
  {
    set(obj, _, targetLoading: boolean) {
      obj.value = targetLoading;

      if (targetLoading) {
        searchResultContainerElement.setAttribute(DATA.LOADING, "true");
      } else {
        searchResultContainerElement.removeAttribute(DATA.LOADING);
      }

      return true;
    },
  }
);

function rerenderCheckboxList(
  targetSelectedCheckboxes: Record<string, Checkbox[]>
) {
  const targetPopup = getOpenPopupElement();
  const allSelectedCheckboxes = queryAllByAttr(targetPopup, DATA.SELECTED);
  allSelectedCheckboxes?.forEach((option) =>
    option.removeAttribute(DATA.SELECTED)
  );

  Object.entries(targetSelectedCheckboxes).forEach(([type, checkboxes]) => {
    const popupElement = queryByAttr(document, DATA.POPUP_FOR, type);
    // CHECKBOX LIST
    checkboxes.forEach((option) => {
      const optionElement = queryByAttr(popupElement, DATA.ID, option.Id);
      console.log("optionElement", optionElement);
      optionElement?.setAttribute(DATA.SELECTED, "true");
    });

    // TRIGGER LABEL
    console.log("trigger");
    const triggerElement = queryByAttr(document, DATA.TRIGGER_FOR, type);
    if (!triggerElement) {
      return;
    }
    const triggerTextElement = triggerElement.querySelector("span");
    if (!triggerTextElement) {
      return;
    }
    let label = "";
    if (checkboxes.length === 0) {
      label = triggerElement?.getAttribute(DATA.DEFAULT_LABEL) ?? "";
      triggerElement?.removeAttribute(DATA.CHANGED);
    } else {
      label = `${checkboxes[0].Label}`;
      if (checkboxes.length > 1) label += ` (+${checkboxes.length - 1})`;

      triggerElement?.setAttribute(DATA.CHANGED, "true");
    }
    triggerTextElement.innerText = label;
  });

  const allCheckboxes = Object.values(targetSelectedCheckboxes).flatMap(
    (checkboxes) => checkboxes
  );

  // SELECTED ONLY ELEMENTS
  if (allCheckboxes.length === 0) {
    clearAllButton.setAttribute(DATA.HIDDEN, "true");
  } else {
    clearAllButton.removeAttribute(DATA.HIDDEN);
  }
}

function setCheckoboxListQueryParams(
  targetSelectedCheckboxes: Record<string, Checkbox[]>
) {
  const url = new URL(window.location.href);
  url.searchParams.set(
    CHECKBOX_FILTERS_QUERY_PARAM,
    encodeBase64(JSON.stringify(targetSelectedCheckboxes))
  );
  window.history.pushState({}, "", url);
}

function getOpenPopupElement() {
  return queryByAttr<HTMLDivElement>(document, DATA.POPUP_FOR, popupOpen.value);
}

function getOpenPopupData(type: "original" | "filtered" = "filtered") {
  switch (popupOpen.value) {
    case window.search.Ids.Searcher.FilterManufacters: {
      if (type === "original") {
        return window.search.Manufacters.Checkboxes;
      }

      return filteredCheckboxesData.manufacters;
    }
    case window.search.Ids.Searcher.FilterTitles:
      if (type === "original") {
        return window.search.Titles.Checkboxes;
      }

      return filteredCheckboxesData.title;
    case window.search.Ids.Searcher.FilterStatus:
      if (type === "original") {
        return window.search.Status.Checkboxes;
      }

      return filteredCheckboxesData.status;
    case window.search.Ids.Searcher.FilterCriteria:
      if (type === "original") {
        return window.search.Criteria.Checkboxes;
      }

      return filteredCheckboxesData.criteria;
    default:
      return;
  }
}

function searchOnCheckboxList(searchKey: string, list: Checkbox[]) {
  const sanitize = (value: string) =>
    value
      .toLowerCase()
      // removes accentuation
      .normalize("NFD")
      .replaceAll(/[\u0300-\u036f]/g, "");

  return list.filter((checkbox) =>
    sanitize(checkbox.Label).includes(sanitize(searchKey))
  );
}

async function fetchSearchSuggestions() {
  isLoading.value = true;

  try {
    const currentUrlSearchParams = new URLSearchParams(window.location.search);
    const response = await fetch(
      `/search/result?${currentUrlSearchParams.toString()}`
    );
    console.log("response", response);
    if (response.status !== 200) {
      return;
    }

    searchResultContainerElement.innerHTML = await response.text();
  } finally {
    isLoading.value = false;
  }
}

function rerenderPopupSearchList(targetValue: string) {
  const targetPopup = getOpenPopupElement();
  const allSelectedCheckboxes = queryAllByAttr(targetPopup, DATA.INDEX);
  allSelectedCheckboxes?.forEach((option) =>
    option.setAttribute(DATA.HIDDEN, "true")
  );

  const data = getOpenPopupData("original");
  if (!data) {
    return;
  }

  const filteredCheckboxes = searchOnCheckboxList(targetValue, data);
  filteredCheckboxes.forEach((option) => {
    const checkboxElement = queryByAttr(targetPopup, DATA.ID, option.Id);
    checkboxElement?.removeAttribute(DATA.HIDDEN);
  });
  return filteredCheckboxes;
}

const keyPressToAction = new Map<
  KeyboardEvent["key"],
  (e: KeyboardEvent) => void
>([
  [
    "ArrowDown",
    (e: KeyboardEvent) => {
      e.preventDefault();

      const currentPopupDta = getOpenPopupData();
      console.log("currentPopupDta", currentPopupDta, activeIndex.value);

      if (
        !currentPopupDta ||
        currentPopupDta.length - 1 === activeIndex.value
      ) {
        return;
      }

      activeIndex.value++;
      getOpenPopupElement()
        ?.querySelector(`[${DATA.ACTIVE}]`)
        ?.scrollIntoView({ block: "nearest", inline: "nearest" });
    },
  ],
  [
    "ArrowUp",
    (e: KeyboardEvent) => {
      e.preventDefault();

      if (activeIndex.value === 0) {
        return;
      }

      activeIndex.value--;
      getOpenPopupElement()
        ?.querySelector(`[${DATA.ACTIVE}]`)
        ?.scrollIntoView({ block: "nearest", inline: "nearest" });
    },
  ],
  ["Enter", () => selectOption(activeIndex.value)],
  ["Escape", closePopup],
  ["Tab", closePopup],
]);

async function selectOption(index: number) {
  if (!popupOpen.value) {
    return;
  }

  const openPopupData = getOpenPopupData();
  if (!openPopupData) {
    return;
  }

  const openOptionData = getOpenPopupData()?.[index];
  if (!openOptionData) {
    return;
  }

  const selectedCheckboxes = selectedTitles.value[popupOpen.value];
  if (selectedCheckboxes?.some((option) => option.Id === openOptionData.Id)) {
    selectedTitles.value = {
      ...selectedTitles.value,
      [popupOpen.value]: selectedCheckboxes.filter(
        (option) => option.Id !== openOptionData.Id
      ),
    };
  } else {
    selectedTitles.value = {
      ...selectedTitles.value,
      [popupOpen.value]: (selectedTitles.value[popupOpen.value] ?? []).concat(
        openOptionData
      ),
    };
  }

  fetchSearchSuggestions();
}

function handleMouseOverPopup(e: MouseEvent) {
  if (!canUseMouseEvents) {
    return;
  }

  const target = e.target as HTMLDivElement;
  const hoveringElementIndex = Number(target.getAttribute(DATA.INDEX));
  if (isNaN(hoveringElementIndex)) {
    return;
  }

  activeIndex.value = hoveringElementIndex;
}

function handlePopupClick(e: MouseEvent) {
  const target = e.target as HTMLDivElement;

  if (target.nodeName === "INPUT") {
    return;
  }

  const hoveringElementIndex = Number(target.getAttribute(DATA.INDEX));
  if (isNaN(hoveringElementIndex)) {
    return;
  }

  selectOption(hoveringElementIndex);
}

function handleFilterButtonClick(e: MouseEvent) {
  const targetId = (e.currentTarget as HTMLButtonElement).getAttribute(
    DATA.TRIGGER_FOR
  );
  if (!targetId) {
    return;
  }

  window.addEventListener("keydown", handlekeyDown);
  popupOpen.value = targetId;
  activeIndex.value = DEFAULT_ACTIVE_INDEX;

  const currentPopup = getOpenPopupElement();
  if (!currentPopup) {
    return;
  }

  currentPopup.querySelector("input")?.focus();
}

function closePopupOnOutsideClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const isTargetTrigger = filterTriggerElements.some(
    (trigger) =>
      trigger.getAttribute(DATA.TRIGGER_FOR) ===
      target.getAttribute(DATA.TRIGGER_FOR)
  );

  if (isTargetTrigger) {
    return;
  }

  if (!popupOpen.value || popupOpen.value === target.id) {
    return;
  }

  const popupElement = getOpenPopupElement();
  if (!popupElement) {
    return;
  }

  if (popupElement.contains(target)) {
    return;
  }

  closePopup();
}

function closePopup() {
  popupOpen.value = DEFAULT_FILTER_POPUP_OPEN;
  activeIndex.value = DEFAULT_ACTIVE_INDEX;
  window.removeEventListener("keydown", handlekeyDown);
}

async function handleClearAllButtonCLick() {
  selectedTitles.value = Object.keys(selectedTitles.value).reduce<
    Record<string, Checkbox[]>
  >((acc, key) => {
    acc[key] = [];
    return acc;
  }, DEFAULT_SELECTED_CHECKBOXES);
  fetchSearchSuggestions();
}

async function handlekeyDown(e: KeyboardEvent) {
  const action = keyPressToAction.get(e.key);
  if (!action) {
    return;
  }

  if (e.key !== "Tab") {
  }

  canUseMouseEvents = false;
  action(e);
}

function handleInputChangeFactory(type: "title" | "manufacters") {
  return (e: Event) => {
    const searchValue = (e.target as HTMLInputElement).value;

    switch (type) {
      case "manufacters":
        manufactersSearchValue.value = searchValue;
        break;
      case "title":
        titleSearchValue.value = searchValue;
        break;

      default:
        break;
    }

    activeIndex.value = DEFAULT_ACTIVE_INDEX;
  };
}

function initialTitlesValue() {
  const url = new URL(window.location.href);
  const rawParam = url.searchParams.get(CHECKBOX_FILTERS_QUERY_PARAM);
  if (!rawParam) {
    return;
  }

  try {
    console.log(JSON.parse(decodeBase64(rawParam)));
    selectedTitles.value = JSON.parse(decodeBase64(rawParam));
  } catch (error) {
    console.log("error", error);
  }
}

function showFilters() {
  filtersElement.removeAttribute(DATA.HIDDEN);
}

function queryElements() {
  filterTriggerElements = [
    ...document.querySelectorAll<HTMLButtonElement>(
      `#${window.search.Ids.Searcher.FilterTrigger}`
    ),
  ];
  popupElements = [
    ...document.querySelectorAll<HTMLDivElement>(
      `#${window.search.Ids.Searcher.FilterPopup}`
    ),
  ];
  titlesSearchInput = queryByAttr<HTMLInputElement>(
    document,
    "name",
    window.search.Ids.Searcher.FilterTitles
  )!;
  filtersElement = document.getElementById(
    window.search.Ids.Searcher.Filters
  ) as HTMLDivElement;
  manufactersSearchInput = queryByAttr<HTMLInputElement>(
    document,
    "name",
    window.search.Ids.Searcher.FilterManufacters
  )!;
  searchResultContainerElement = document.getElementById(
    window.search.Ids.Searcher.ResultsContainer
  ) as HTMLDivElement;
  clearAllButton = document.getElementById(
    window.search.Ids.Searcher.FiltersClearAll
  ) as HTMLDivElement;
}

function addEventListeners() {
  clearAllButton.addEventListener("click", handleClearAllButtonCLick);
  manufactersSearchInput.addEventListener(
    "input",
    handleInputChangeFactory("manufacters")
  );
  titlesSearchInput.addEventListener(
    "input",
    handleInputChangeFactory("title")
  );
  filterTriggerElements.forEach((triggerElement) =>
    triggerElement.addEventListener("click", handleFilterButtonClick)
  );
  popupElements.forEach((popupElement) => {
    popupElement.addEventListener("mouseover", handleMouseOverPopup);
    popupElement.addEventListener("click", handlePopupClick);
    popupElement.addEventListener(
      "mouseover",
      () => (canUseMouseEvents = true)
    );
  });
  window.document.addEventListener("click", closePopupOnOutsideClick);
}

window.addEventListener("load", () => {
  queryElements();
  addEventListeners();
  initialTitlesValue();
  showFilters();

  filteredCheckboxesData = {
    title: window.search.Titles.Checkboxes,
    manufacters: window.search.Manufacters.Checkboxes,
    status: window.search.Status.Checkboxes,
    criteria: window.search.Criteria.Checkboxes,
  };
});
