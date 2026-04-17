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

func buildForm(m model) *huh.Form {
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
				Value(&m.harnessChoices),
		),
		huh.NewGroup(
			huh.NewMultiSelect[string]().
				Options(
					huh.NewOption("agents", "agents"),
					huh.NewOption("instructions", "instructions"),
					huh.NewOption("hooks", "hooks"),
					huh.NewOption("ido", "ido"),
					huh.NewOption("tools", "tools"),
					huh.NewOption("skills", "skills"),
					huh.NewOption("mcp", "mcp"),
					huh.NewOption("aspire", "aspire"),
				).
				Key("Features").
				Title("Select AI-Driven Development Features").
				Value(&m.featureChoices),
		),
		huh.NewGroup(
			huh.NewConfirm().
				Title("Scaffold your project?").
				Affirmative("Yes!").
				Negative("No.").
				Value(&m.confirm),
		),
	)
	return form
}
