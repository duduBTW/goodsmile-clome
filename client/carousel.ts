export {};

let carousel: HTMLDivElement;
let carouselPagination: HTMLDivElement;
let carouselPaginationPages: NodeListOf<HTMLDivElement>;
let carouselArrowLeft: HTMLButtonElement;
let carouselArrowRight: HTMLButtonElement;

const INTIIAL_PAGE = 1;

let currentPage = new Proxy(
  { value: INTIIAL_PAGE },
  {
    set(obj, _, targetPage: number) {
      if (targetPage <= 0) {
        return false;
      }

      if (targetPage > window.home.Carousel.length) {
        return false;
      }

      obj.value = targetPage;
      scrollCarouselSlideIntoView(targetPage - 1);
      toggleControlArrows(targetPage);
      activateCurrentPaginationPage(targetPage - 1);
      return true;
    },
  }
);

function scrollCarouselSlideIntoView(index: number) {
  carousel.querySelector(`[data-index="${index}"]`)?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}

function queryElements() {
  carouselArrowLeft = document.getElementById(
    window.home.Ids.CarouselArrowLeft
  ) as HTMLButtonElement;
  carouselArrowRight = document.getElementById(
    window.home.Ids.CarouselArrowRight
  ) as HTMLButtonElement;
  carousel = document.getElementById(
    window.home.Ids.Carousel
  ) as HTMLDivElement;
  carouselPagination = document.getElementById(
    window.home.Ids.CarouselPagination
  ) as HTMLDivElement;
  carouselPaginationPages = document.querySelectorAll(
    `#${window.home.Ids.CarouselPaginationPage}`
  );
}

function activateCurrentPaginationPage(index: number) {
  const activePage = carouselPagination.querySelector(`[data-active='true']`);
  const targetPage = carouselPagination.querySelector(
    `[data-index="${index}"]`
  );

  activePage?.removeAttribute("data-active");
  activePage?.removeAttribute("tabindex");

  targetPage?.setAttribute("data-active", "true");
  targetPage?.setAttribute("tabindex", "0");
}

function toggleControlArrows(page: number) {
  if (page === 1) {
    carouselArrowLeft.setAttribute("disabled", "true");
  } else {
    carouselArrowLeft.removeAttribute("disabled");
  }

  if (page + 1 > window.home.Carousel.length) {
    carouselArrowRight.setAttribute("disabled", "true");
  } else {
    carouselArrowRight.removeAttribute("disabled");
  }
}

function slideNext() {
  currentPage.value++;
}

function slidePrevious() {
  currentPage.value--;
}

function slideToPage(e: MouseEvent) {
  const pageElement = e.target as HTMLDivElement;
  const pageIndex = Number(pageElement.dataset.index);
  if (isNaN(pageIndex)) {
    return;
  }

  currentPage.value = pageIndex + 1;
  requestAnimationFrame(() => {
    focusActivePage();
  });
}

function focusActivePage() {
  const activePage = carouselPagination.querySelector(`[data-active='true']`);
  if (
    !(
      activePage &&
      "focus" in activePage &&
      typeof activePage?.focus === "function"
    )
  ) {
    return;
  }

  activePage.focus();
}

function pageKeyDownHandler(e: KeyboardEvent) {
  if (e.key === "ArrowLeft") {
    slidePrevious();
  }

  if (e.key === "ArrowRight") {
    slideNext();
  }

  requestAnimationFrame(() => {
    focusActivePage();
  });
}

function addEventListeners() {
  let observer = new IntersectionObserver(
    () => {
      //
    },
    {
      root: carousel,
      rootMargin: "0px",
      threshold: 1.0,
    }
  );

  carouselArrowRight.addEventListener("click", slideNext);
  carouselArrowLeft.addEventListener("click", slidePrevious);
  carouselPaginationPages.forEach((page) => {
    page.addEventListener("click", slideToPage);
    page.addEventListener("keydown", pageKeyDownHandler);
  });
}

function initCarousel() {
  console.log("carousel");

  queryElements();
  toggleControlArrows(INTIIAL_PAGE);
  activateCurrentPaginationPage(INTIIAL_PAGE - 1);
  addEventListeners();
}

window.addEventListener("load", initCarousel);
