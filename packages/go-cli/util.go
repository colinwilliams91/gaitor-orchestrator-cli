package main

import (
	"fmt"
	"regexp"

	"github.com/charmbracelet/huh"
)

func validateProjectName(input string) error {
	matched, err := regexp.MatchString(projectNameRegex, input)
	if err != nil {
		return err
	}
	if !matched {
		return fmt.Errorf(projectNameValidationMsg)
	}
	return nil
}

func buildForm(config *scaffoldConfig) *huh.Form {
	form := huh.NewForm(
		huh.NewGroup(
			huh.NewNote().
				Title("Scaffold your AI-Driven Development Project in seconds 🤖🐊...").
				Description(ASCIIArt).
				Next(true).
				NextLabel("Press any key to start..."),
		),
		huh.NewGroup( // step 0: project name input
			huh.NewInput().
				Title(projectNamePrompt).
				Value(&config.projectName).
				Validate(validateProjectName),
		),
		huh.NewGroup(
			huh.NewMultiSelect[string]().
				Options(
					huh.NewOption("copilot", "copilot"),
					huh.NewOption("claude", "claude"),
					huh.NewOption("codex", "codex"),
					huh.NewOption("cursor", "cursor"),
				).
				Key("Harnesses").
				Title("Select AI Harnesses").
				Value(&config.harnessSelections),
		),
		huh.NewGroup(
			huh.NewConfirm().
				Title("Scaffold your project?").
				Affirmative("Yes!").
				Negative("No.").
				Value(&config.confirm),
		),
	)
	return form
}
