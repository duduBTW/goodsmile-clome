import { DATA } from "./data-attr";

/** Navigation controller to avoid race conditions */
let currentNavigationController: AbortController | null = null;

/** Elements */
let pageLoader: HTMLDivElement;

/** Is page changing */
let isLoading = new Proxy(
  { value: false },
  {
    set(obj, _, newValue: boolean) {
      obj.value = newValue;

      if (newValue) {
        pageLoader.removeAttribute(DATA.HIDDEN);
      } else {
        pageLoader.setAttribute(DATA.HIDDEN, "true");
      }

      return true;
    },
  }
);

// Function to handle the custom logic before navigation
async function handleCustomLogicAndNavigate(href: string) {
  console.log("Executing custom logic before navigation...", href);

  // Cancel the previous request if it exists
  if (currentNavigationController) {
    currentNavigationController.abort();
  }

  // Create a new AbortController for the current navigation
  currentNavigationController = new AbortController();
  const { signal } = currentNavigationController;

  try {
    isLoading.value = true;

    const response = await fetch(href, { signal });
    if (response.status !== 200) {
      return;
    }

    const html = await response.text();

    // Replace the entire document with the fetched HTML
    document.open();
    document.write(html);
    document.close();

    // Optionally, update the browser's history
    history.pushState(null, "", href);

    isLoading.value = false;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }
    isLoading.value = false;
  }
}

// Function to handle navigation events
function handleNavigation(event: MouseEvent | KeyboardEvent): void {
  let target: HTMLElement | null = null;

  if (event instanceof MouseEvent) {
    target = (event.target as HTMLElement).closest("a"); // Use closest to handle nested elements
  } else if (event instanceof KeyboardEvent && event.key === "Enter") {
    target = event.target as HTMLElement;
  }

  if (target && target.tagName === "A") {
    const anchor = target as HTMLAnchorElement;
    if (anchor.href.startsWith(window.location.origin)) {
      event.preventDefault(); // Prevent the default navigation
      console.log("User triggered navigation to another page.");

      // Call the custom logic function before navigating
      handleCustomLogicAndNavigate(anchor.href);
    }
  }
}

// Function to handle popstate events (back/forward navigation)
function handlePopState(): void {
  handleCustomLogicAndNavigate(window.location.href); // Call the function with popstate flag
}

window.addEventListener("load", () => {
  pageLoader = document.getElementById(
    window.search.Ids.PageLoader
  ) as HTMLDivElement;

  // Event listener for link clicks
  document.addEventListener("click", handleNavigation);

  // Event listener for keyboard navigation (Enter key)
  document.addEventListener("keydown", handleNavigation);

  window.addEventListener("popstate", handlePopState);
});
