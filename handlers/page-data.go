package handlers

import (
	"dudubtw/project-bored/ids"
	"encoding/json"
)

type SharedPageData struct {
	Title           string
	NavigationItems []string
	Ids             ids.Ids
	Json            string
}

// Add the shared data to your page.
func (pageData *SharedPageData) InjectSharedData() *SharedPageData {
	pageData.NavigationItems = []string{"News/shipping info", "User guide", "Inquiries"}
	pageData.Ids = ids.GlobalIds
	return pageData
}

func (pageData *SharedPageData) InjectJson(v interface{}) error {
	pageJson, err := json.Marshal(v) // Serialize the full page data
	if err != nil {
		return err
	}
	pageData.Json = string(pageJson)
	return nil
}
