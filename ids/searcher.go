package ids

const prefix = "search-"

type Searcher struct {
	Suggestions               string
	Input                     string
	ClearHistory              string
	ClearInput                string
	Filters                   string
	FilterPopup               string
	FilterTrigger             string
	FilterTitles              string
	FilterStatus              string
	FilterCriteria            string
	FilterManufacters         string
	ResultsContainer          string
	FilterPopupSelectedHeader string
	FiltersClearAll           string
}

var SearchIds = Searcher{
	Suggestions:               s("suggestions"),
	Input:                     s("input"),
	ClearHistory:              s("clear-history-button"),
	ClearInput:                s("clear-input-button"),
	ResultsContainer:          s("results-container"),
	Filters:                   s("filters"),
	FilterTitles:              s("filter-title"),
	FilterStatus:              s("filter-status"),
	FilterCriteria:            s("filter-criteria"),
	FilterManufacters:         s("filter-manufacters"),
	FilterTrigger:             s("filter-trigger"),
	FilterPopup:               s("filter-popup"),
	FilterPopupSelectedHeader: s("filter-popup-selected-header"),
	FiltersClearAll:           s("filter-popup-clear-all"),
}

func s(value string) string {
	return prefix + value
}
