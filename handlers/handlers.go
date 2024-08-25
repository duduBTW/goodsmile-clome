package handlers

import (
	"os"
	"text/template"
)

func UiTemplates() (*template.Template, error) {
	htmlFiles, err := os.ReadDir("./ui")
	if err != nil {
		return nil, err
	}

	var htmlFileNames = []string{}
	for _, file := range htmlFiles {
		htmlFileNames = append(htmlFileNames, "ui/"+file.Name())
	}

	templateClient := template.Must(template.ParseFiles(
		htmlFileNames...,
	))
	return templateClient, nil
}

const GoodSmileBaseUrl = "https://www.goodsmile.com"
