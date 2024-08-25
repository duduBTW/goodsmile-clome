package main

import (
	"dudubtw/project-bored/handlers"
	"fmt"
	"net/http"

	"github.com/tkrajina/typescriptify-golang-structs/typescriptify"
)

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	tsConverter := typescriptify.New().
		Add(handlers.HomePageData{}).Add(handlers.SearchPageData{}).WithInterface(true)

	err := tsConverter.ConvertToFile("client/backend-model.ts")
	if err != nil {
		fmt.Println(err)
	}

	http.HandleFunc("/", handlers.HomePage)
	http.HandleFunc("/product/", handlers.ProductPage)
	http.HandleFunc("/search", handlers.Search)
	http.HandleFunc("/search/result", handlers.SearchList)
	http.HandleFunc("/search/suggestions", handlers.SearchSuggetions)
	http.HandleFunc("DELETE /search/clear-history", handlers.ClearHistory)
	http.ListenAndServe(":5001", nil)
}
