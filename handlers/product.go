package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gocolly/colly/v2"
)

type ProductPageData struct {
	SharedPageData
	Images []string
	Catch  string
	Price  string
}

func ProductPage(response http.ResponseWriter, request *http.Request) {
	// Trim the prefix to get the ID as a string
	idStr := strings.TrimPrefix(request.URL.Path, "/product/")

	// Convert the ID to an integer
	_, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(response, "Invalid product ID", http.StatusBadRequest)
		return
	}

	pageData := ProductPageData{
		SharedPageData: SharedPageData{
			Title: "Product",
		},
	}

	collyCollector := colly.NewCollector()
	collyCollector.OnHTML(".b-product-info", ScrapProductInfo(&pageData))
	collyCollector.OnHTML(".c-photo-variable-grid__item", ScrapProductImages(&pageData.Images))
	collyCollector.Visit(GoodSmileBaseUrl + "/en/product/" + idStr)

	if err := pageData.InjectSharedData().InjectJson(pageData); err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	tmpl, err := UiTemplates()
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	err = tmpl.ExecuteTemplate(response, "product-page.html", pageData)
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
	}
}

func ScrapProductImages(images *[]string) func(e *colly.HTMLElement) {
	return func(e *colly.HTMLElement) {
		imageUrl := e.ChildAttr("img", "src")
		*images = append(*images, GoodSmileBaseUrl+imageUrl)
	}
}

func ScrapProductInfo(pageData *ProductPageData) func(e *colly.HTMLElement) {
	return func(e *colly.HTMLElement) {
		pageData.Catch = e.ChildText(".b-product-info__catch-copy")
		pageData.Title = e.ChildText(".b-product-info__title")
		pageData.Price = e.ChildText(".b-product-info__unit .c-price__main")
	}
}
