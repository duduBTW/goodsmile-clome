package handlers

import (
	"dudubtw/project-bored/ids"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"slices"
	"strconv"
	"strings"
	"text/template"
	"time"

	"github.com/gocolly/colly/v2"
)

type History struct {
	Items []string
	Json  string
	Ids   ids.Ids
}

type Checkbox struct {
	Id    int
	Label string
}

type Checkboxes struct {
	DefaultLabel string
	Checkboxes   []Checkbox
	Type         string
	Ids          ids.Ids
}

type GoodSmileSearchSuggestionApiResponse struct {
	Lang            string   `json:"lang"`
	SuggestItems    []string `json:"suggestItems"`
	Keyword         string   `json:"keyword"`
	JsonSuggestions string
}

type SearchFilteredCheckboxesSearchParams struct {
	Titles      []Checkbox `json:"-"`
	Manufacters []Checkbox `json:"-"`
	Status      []Checkbox `json:"-"`
	Criteria    []Checkbox `json:"-"`
}

type SearchFilteredCheckboxes struct {
	Titles      []int
	Manufacters []int
	Status      []int
}

type SearchListNyaaParams struct {
	SearchKeyword   string   `json:"search_keyword"`
	SearchOver18    bool     `json:"search_over18"`
	SearchCategory  []int    `json:"search_category"`
	SearchMaker     []int    `json:"search_maker"`
	SearchTitle     []int    `json:"search_title"`
	SearchStatus    string   `json:"search_status"`
	ReleaseDateFrom string   `json:"release_date_from"`
	ReleaseDateTo   string   `json:"release_date_to"`
	SearchBonus     bool     `json:"search_bonus"`
	SearchExclusive bool     `json:"search_exclusive"`
	SearchSale      bool     `json:"search_sale"`
	Tag             []string `json:"tag"`
}

type SearchPageData struct {
	SharedPageData
	Titles                  Checkboxes
	Manufacters             Checkboxes
	Status                  Checkboxes
	Criteria                Checkboxes
	SearchResults           []Product
	SearchInputDefaultValue string
}

func Search(response http.ResponseWriter, request *http.Request) {
	searchKeyword := request.URL.Query().Get("q")
	if searchKeyword != "" {
		setCookieHandler(response, request, searchKeyword)
	}

	filteredCheckboxes := SearchFilteredCheckboxesFromParams(request)

	tmpl, err := UiTemplates()
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	collyCollector := colly.NewCollector()
	searchResults, err := SracrapSearchList(searchKeyword, filteredCheckboxes, collyCollector)
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	titleCheckboxes, manufactorCheckboxes, err := SracrapSearchFilters(searchKeyword, collyCollector)
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	pageData := SearchPageData{
		SharedPageData:          SharedPageData{Title: "Search"},
		SearchResults:           searchResults,
		SearchInputDefaultValue: searchKeyword,
		Titles: Checkboxes{
			DefaultLabel: "Title",
			Checkboxes:   titleCheckboxes,
			Type:         ids.SearchIds.FilterTitles,
			Ids:          ids.GlobalIds,
		},
		Manufacters: Checkboxes{
			DefaultLabel: "Manufactor",
			Checkboxes:   manufactorCheckboxes,
			Ids:          ids.GlobalIds,
			Type:         ids.SearchIds.FilterManufacters,
		},
		Status: Checkboxes{
			DefaultLabel: "Status",
			Ids:          ids.GlobalIds,
			Type:         ids.SearchIds.FilterStatus,
			Checkboxes: []Checkbox{
				{
					Id:    0,
					Label: "All",
				},
				{
					Id:    1,
					Label: "Preorder",
				},
				{
					Id:    2,
					Label: "In-Stock Sales",
				},
				{
					Id:    3,
					Label: "Preorders opening",
				},
			},
		},
		Criteria: Checkboxes{
			DefaultLabel: "Desired criteria",
			Type:         ids.SearchIds.FilterCriteria,
			Ids:          ids.GlobalIds,
			Checkboxes: []Checkbox{
				{
					Id:    0,
					Label: "Bonus included",
				},
				{
					Id:    1,
					Label: "Official site limited",
				},
				{
					Id:    2,
					Label: "On sale",
				},
			},
		},
	}

	if err := pageData.InjectSharedData().InjectJson(pageData); err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	err = tmpl.ExecuteTemplate(response, "search-page.html", pageData)
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}
}

func SearchFilteredCheckboxesFromParams(request *http.Request) SearchFilteredCheckboxes {
	checkboxFilterBase64Param := request.URL.Query().Get("checkbox-filter")
	if checkboxFilterBase64Param == "" {
		return SearchFilteredCheckboxes{}
	}

	// the query params comes as base64, decodes it
	checkboxFilterRawJsonParam, err := base64.StdEncoding.DecodeString(checkboxFilterBase64Param)
	if err != nil {
		return SearchFilteredCheckboxes{}
	}

	// from json to string
	var checkboxFilterParam map[string][]Checkbox
	err = json.Unmarshal(checkboxFilterRawJsonParam, &checkboxFilterParam)
	if err != nil {
		return SearchFilteredCheckboxes{}
	}

	titles := checkboxFilterParam[ids.GlobalIds.Searcher.FilterTitles]
	manufacters := checkboxFilterParam[ids.GlobalIds.Searcher.FilterManufacters]
	status := checkboxFilterParam[ids.GlobalIds.Searcher.FilterStatus]

	// extract the ids
	return SearchFilteredCheckboxes{
		Titles:      ExtractIdsFromCheckboxes(titles),
		Manufacters: ExtractIdsFromCheckboxes(manufacters),
		Status:      ExtractIdsFromCheckboxes(status),
	}
}

func ExtractIdsFromCheckboxes(checkboxes []Checkbox) []int {
	var ids = make([]int, len(checkboxes))
	for _, checkbox := range checkboxes {
		ids = append(ids, checkbox.Id)
	}
	return ids
}

func SearchList(response http.ResponseWriter, request *http.Request) {
	searchKeyword := request.URL.Query().Get("q")
	filteredCheckboxes := SearchFilteredCheckboxesFromParams(request)
	collyCollector := colly.NewCollector()

	searchResults, err := SracrapSearchList(searchKeyword, filteredCheckboxes, collyCollector)
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	pageData := SearchPageData{
		SearchResults: searchResults,
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

	err = tmpl.ExecuteTemplate(response, "search-results-standalone.html", pageData)
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}
}

func SearchSuggetions(response http.ResponseWriter, request *http.Request) {
	tmpl, err := UiTemplates()
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	searchKeyword := request.URL.Query().Get("q")
	if searchKeyword == "" {
		SearchHistory(response, request, tmpl)
		return
	}

	uri, err := url.Parse(GoodSmileBaseUrl + "/en/search/suggest")
	if err != nil {
		SearchHistory(response, request, tmpl)
		return
	}

	params := url.Values{}
	params.Add("search_keyword", searchKeyword)
	uri.RawQuery = params.Encode()

	goodSmileResponse, err := http.Get(uri.String())
	if err != nil {
		SearchHistory(response, request, tmpl)
		return
	}

	defer goodSmileResponse.Body.Close()

	// Read the response body
	body, err := io.ReadAll(goodSmileResponse.Body)
	if err != nil {
		SearchHistory(response, request, tmpl)
		return
	}

	// Unmarshal the JSON into the struct
	var parsedGoodSmileResponse GoodSmileSearchSuggestionApiResponse
	err = json.Unmarshal(body, &parsedGoodSmileResponse)
	if err != nil {
		SearchHistory(response, request, tmpl)
		return
	}

	if len(parsedGoodSmileResponse.SuggestItems) == 0 {
		SearchHistory(response, request, tmpl)
		return
	}

	jsonSuggestions, err := json.Marshal(parsedGoodSmileResponse.SuggestItems)
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(parsedGoodSmileResponse.SuggestItems) == 0 {
		http.Error(response, "No items found for this search", http.StatusNotFound)
		return
	}

	parsedGoodSmileResponse.JsonSuggestions = parseJsonForHtmlAttr(string(jsonSuggestions))
	err = tmpl.ExecuteTemplate(response, "searcher-suggestions.html", parsedGoodSmileResponse)
	if err == nil {
		return
	}

	http.Error(response, err.Error(), http.StatusInternalServerError)
}

func SearchHistory(response http.ResponseWriter, request *http.Request, tmpl *template.Template) {
	historyItems, err := getCookieHandler(request)
	if err != nil {
		http.Error(response, "No items on the history", http.StatusNotFound)
		return
	}

	history := History{
		Items: historyItems,
		Ids:   ids.GlobalIds,
	}

	jsonHistoryItems, err := json.Marshal(history.Items)
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}

	history.Json = parseJsonForHtmlAttr(string(jsonHistoryItems))

	err = tmpl.ExecuteTemplate(response, "searcher-hhistory.html", history)
	if err == nil {
		return
	}

	http.Error(response, err.Error(), http.StatusInternalServerError)
}

func ClearHistory(response http.ResponseWriter, request *http.Request) {
	removeCookieHandler(response)
	fmt.Fprintf(response, "History cleared!")
}

func setCookieHandler(response http.ResponseWriter, request *http.Request, value string) error {
	jsonArray := []string{}

	// sets cookie value as default
	cookieSearchHistory, err := getCookieHandler(request)
	if err == nil {
		jsonArray = cookieSearchHistory
	}

	// Doesn't insert duplicated entries
	if slices.Contains(cookieSearchHistory, value) {
		return errors.New("value already on the cookies")
	}

	// append new search
	jsonArray = append(jsonArray, value)

	// convert to json
	jsonData, err := json.Marshal(jsonArray)
	if err != nil {
		return err
	}

	// Create a new cookie
	encodedValue := base64.StdEncoding.EncodeToString(jsonData)

	cookie := &http.Cookie{
		Name:  "myJsonArray",
		Value: encodedValue,
		Path:  "/",
	}

	// Set the cookie
	http.SetCookie(response, cookie)
	return nil
}

func getCookieHandler(request *http.Request) ([]string, error) {
	// Get the cookie from the request
	cookie, err := request.Cookie("myJsonArray")
	if err != nil {
		return []string{}, err
	}

	decodedData, err := base64.StdEncoding.DecodeString(cookie.Value)
	if err != nil {
		return []string{}, err
	}

	// Unmarshal the JSON string back to a Go slice
	var jsonArray []string
	err = json.Unmarshal(decodedData, &jsonArray)
	if err != nil {
		return []string{}, err
	}

	return jsonArray, nil
}

func parseJsonForHtmlAttr(value string) string {
	return strings.ReplaceAll(value, `"`, `'`)
}

func removeCookieHandler(response http.ResponseWriter) {
	// Create a new cookie with the same name, setting the expiration to a past date
	cookie := &http.Cookie{
		Name:    "myJsonArray",
		Value:   "",
		Path:    "/",
		Expires: time.Unix(0, 0), // Set the expiration date to the past
		MaxAge:  -1,              // MaxAge<0 means delete the cookie now
	}

	// Set the cookie to remove it
	http.SetCookie(response, cookie)
}

// Searchs on the /en/search for the fiflters
func SracrapSearchFilters(searchKeyword string, collyClient *colly.Collector) ([]Checkbox, []Checkbox, error) {
	titleCheckboxes := []Checkbox{}
	manufactorCheckboxes := []Checkbox{}
	collyClient.OnHTML(".c-modal", ScrapeModalCheckboxes(&titleCheckboxes, &manufactorCheckboxes))

	uri, err := url.Parse(GoodSmileBaseUrl + "/en/search")
	if err != nil {
		return nil, nil, err
	}

	params := url.Values{}
	params.Add("search_keyword", searchKeyword)
	uri.RawQuery = params.Encode()
	collyClient.Visit(uri.String())
	return titleCheckboxes, manufactorCheckboxes, nil
}

// Searchs on the /en/search/list for the list of products
func SracrapSearchList(
	searchKeyword string,
	filteredCheckboxes SearchFilteredCheckboxes,
	collyClient *colly.Collector,
) ([]Product, error) {
	// search products collector
	searchResults := []Product{}
	collyClient.OnHTML(".p-product-list__link", ScrapeSearchProduct(&searchResults))

	uri, err := url.Parse(GoodSmileBaseUrl + "/en/search/list")
	if err != nil {
		return nil, err
	}

	// filter params
	searchListNyaaParams := SearchListNyaaParams{
		SearchKeyword: searchKeyword,
		SearchTitle:   filteredCheckboxes.Titles,
		SearchMaker:   filteredCheckboxes.Manufacters,
	}

	// filter params to json
	searchListNyaaParamsStringified, err := json.Marshal(searchListNyaaParams)
	if err != nil {
		return nil, err
	}

	// add params to uri
	params := url.Values{}
	params.Add("filter", string(searchListNyaaParamsStringified))
	params.Add("orderBy", "0")
	params.Add("limit", "12")
	params.Add("offset", "0")
	params.Add("couponId", "null")
	uri.RawQuery = params.Encode()

	// fetch and return
	collyClient.Visit(uri.String())
	return searchResults, nil
}

func ScrapeSearchProduct(products *[]Product) func(e *colly.HTMLElement) {
	return func(e *colly.HTMLElement) {
		id, _ := ExtractIdFromProductUrl(e.Attr("href"))
		product := Product{
			Id:       id,
			IamgeSrc: GoodSmileBaseUrl + e.ChildAttr("img", "src"),
			Marker:   e.ChildText(".c-maker"),
			Title:    e.ChildText(".c-title"),
			Price:    e.ChildText(".c-price"),
			Labels:   e.ChildTexts(".c-label"),
		}

		*products = append(*products, product)
	}
}

func ScrapeModalCheckboxes(titleCheckboxes *[]Checkbox, manufactorCheckboxes *[]Checkbox) func(e *colly.HTMLElement) {
	return func(e *colly.HTMLElement) {
		modalTarget := e.Attr("data-modal-target")
		switch modalTarget {
		case "search-of-title":
			SracrapLinearCheckboxesFromModal("title", e, titleCheckboxes)
		case "search-of-maker":
			SracrapLinearCheckboxesFromModal("maker", e, manufactorCheckboxes)
		}
	}
}

func SracrapLinearCheckboxesFromModal(idPredix string, e *colly.HTMLElement, checkboxes *[]Checkbox) {
	ids := e.ChildAttrs(".c-checkbox__input", "id")
	texts := e.ChildTexts(".c-checkbox__label")

	for index, attrId := range ids {
		id, err := strconv.Atoi(strings.Replace(attrId, idPredix, "", 1))
		if err != nil {
			return
		}

		checkbox := Checkbox{
			Id:    id,
			Label: strings.TrimSpace(texts[index]),
		}

		*checkboxes = append(*checkboxes, checkbox)
	}
}
