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
			huh.NewConfirm().
				Affirmative("Yes!").
				Negative("No.").
				Title("Before we begin, would you like to bypass configuration and scaffold all features?").
				Value(&config.yes),
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
				Title("Select one or more AI Harnesses to support").
				Value(&config.harnessSelections),
		).WithHideFunc(func() bool {
			return config.yes
		}),
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
				Value(&config.featureSelections),
		).WithHideFunc(func() bool {
			return config.yes
		}),
		huh.NewGroup(
			huh.NewConfirm().
				TitleFunc(func() string {
					// Manually add all to model for --yes flag
					if config.yes {
						config.harnessSelections = []string{
							"copilot",
							"claude",
							"codex",
							"cursor",
						}
						config.featureSelections = []string{
							"agents",
							"instructions",
							"hooks",
							"ido",
							"tools",
							"skills",
							"mcp",
							"aspire",
						}
					}
					return "Scaffold your project?"
				}, &config).
				Affirmative("Yes!").
				Negative("No.").
				Value(&config.confirm),
		),
	)
	return form
}
