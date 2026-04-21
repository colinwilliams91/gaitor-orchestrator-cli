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

	// TODO: _ = spinner.New().Title("Preparing your burger...").WithAccessible(accessible).Action(prepareBurger).Run()
	// SPINNER takes .Action() func arg that runs the long running processing task (inside main scope or buildForm scope?)

	if err := scaffoldProject(config); err != nil {
		fmt.Println("Uh oh:", err)
		os.Exit(1)
	}
}

type scaffoldConfig struct {
	projectName       string
	harnessSelections []string
	featureSelections []string
	yes               bool
	confirm           bool
}

func scaffoldProject(config scaffoldConfig) error {
	fmt.Println(config)
	return nil
}
