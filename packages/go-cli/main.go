package main

import (
	"embed"
	"fmt"
	"os"
)

//go:embed all:templates
var templateFS embed.FS

func main() {
	fmt.Fprintln(os.Stdout, "Initiate GAITOR creator... 🤖🐊")
	config := scaffoldConfig{}
	form := buildForm(&config)

	err := form.Run()
	if err != nil {
		fmt.Println("Uh oh:", err)
		os.Exit(1)
	}

	if !config.confirm {
		return
	}

	if err := scaffoldProject(config); err != nil {
		fmt.Println("Uh oh:", err)
		os.Exit(1)
	}
}

type scaffoldConfig struct {
	projectName       string
	harnessSelections []string
	confirm           bool
}

func scaffoldProject(config scaffoldConfig) error {
	fmt.Println(config)
	return nil
}
