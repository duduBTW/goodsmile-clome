package handlers

import (
	"dudubtw/project-bored/ids"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/gocolly/colly/v2"
)

type CarouselArrow struct {
	Id   string
	Icon string
}

type SectionTitle struct {
	Icon  string
	Title string
}

type Product struct {
	Id       int
	IamgeSrc string
	Marker   string
	Title    string
	Price    string
	Labels   []string
}

type Brand struct {
	Image string
	Name  string
}

type CarouselSlide struct {
	Id    int
	Image string
}

type HomePageData struct {
	SharedPageData
	Alert                   []string
	Carousel                []CarouselSlide
	Brand                   []Brand
	Preorder                []Product
	Exclusives              []Product
	PreorderSectionTitle    SectionTitle
	ExclusivesSectionTitle  SectionTitle
	LeftCarouselArrow       CarouselArrow
	RightCarouselArrow      CarouselArrow
	SearchInputDefaultValue string
}

func HomePage(response http.ResponseWriter, request *http.Request) {
	c := colly.NewCollector()

	preorderProducts := []Product{}
	c.OnHTML(".c-top-product-list__item-pre-order", ScrapeProduct(&preorderProducts))

	exclusiveProducts := []Product{}
	c.OnHTML(".c-top-product-list__item-limited", ScrapeProduct(&exclusiveProducts))

	carouselSlides := []CarouselSlide{}
	c.OnHTML(".carousel-image", ScrapeSlides(&carouselSlides))

	brands := []Brand{}
	c.OnHTML(".c-top-search-by-brand__item", ScrapeBrands(&brands))

	c.Visit(GoodSmileBaseUrl + "/en")

	pageData := HomePageData{
		SharedPageData: SharedPageData{Title: "Good smile"},
		Carousel:       carouselSlides,
		Alert:          []string{"Good Smile Company Online Store Scheduled Maintenance", "Other"},
		Brand:          brands,
		Preorder:       preorderProducts,
		Exclusives:     exclusiveProducts,
		PreorderSectionTitle: SectionTitle{
			Title: "Preorders Open Now",
			Icon:  "fa-regular fa-calendar",
		},
		ExclusivesSectionTitle: SectionTitle{
			Title: "Exclusives",
			Icon:  "fa-regular fa-star",
		},
		LeftCarouselArrow: CarouselArrow{
			Icon: "fa-solid fa-chevron-left",
			Id:   ids.GlobalIds.CarouselArrowLeft,
		},
		RightCarouselArrow: CarouselArrow{
			Icon: "fa-solid fa-chevron-right",
			Id:   ids.GlobalIds.CarouselArrowRight,
		},
	}

	if err := pageData.InjectSharedData().InjectJson(pageData); err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	tmpl, err := UiTemplates()
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	err = tmpl.ExecuteTemplate(response, "page.html", pageData)
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}
}

func ScrapeProduct(products *[]Product) func(e *colly.HTMLElement) {
	return func(e *colly.HTMLElement) {
		id, _ := ExtractIdFromProductUrl(e.Attr("href"))

		product := Product{
			Id:       id,
			IamgeSrc: GoodSmileBaseUrl + e.ChildAttr("img", "src"),
			Marker:   e.ChildText(".c-product-item__maker"),
			Title:    e.ChildText(".c-product-item__title"),
			Price:    e.ChildText(".c-product-item__price"),
			Labels:   e.ChildTexts(".c-label"),
		}

		*products = append(*products, product)
	}
}

func ScrapeBrands(brands *[]Brand) func(e *colly.HTMLElement) {
	return func(e *colly.HTMLElement) {
		brand := Brand{
			Image: e.ChildAttr("img", "srcset"),
			Name:  e.ChildText(".c-top-search-by-brand__item-name"),
		}

		*brands = append(*brands, brand)
	}
}

func ScrapeSlides(slides *[]CarouselSlide) func(e *colly.HTMLElement) {
	return func(e *colly.HTMLElement) {
		id, _ := ExtractIdFromProductUrl(e.Attr("href"))

		slide := CarouselSlide{
			Id:    id,
			Image: GoodSmileBaseUrl + e.ChildAttrs("source", "srcset")[1],
		}

		*slides = append(*slides, slide)
	}
}

func ExtractIdFromProductUrl(url string) (int, error) {
	urlParts := strings.Split(url, "/")

	for _, part := range urlParts {
		id, err := strconv.Atoi(part)
		if err == nil {
			return id, nil
		}

	}

	return 0, errors.New("no id found on url")
}
