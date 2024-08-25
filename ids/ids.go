package ids

type Ids struct {
	Searcher Searcher

	PageLoader             string
	IdsData                string
	Carousel               string
	CarouselPagination     string
	CarouselPaginationPage string
	CarouselArrowLeft      string
	CarouselArrowRight     string
}

var GlobalIds = Ids{
	IdsData:                "__DATA__",
	PageLoader:             "page-loader",
	Carousel:               "carousel",
	CarouselPagination:     "carousel-pagination",
	CarouselPaginationPage: "carousel-pagination-page",
	CarouselArrowLeft:      "carousel-arrow-left",
	CarouselArrowRight:     "carousel-arrow-right",
	Searcher:               SearchIds,
}
