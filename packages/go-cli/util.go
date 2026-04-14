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
		huh.NewGroup( // step 0: project name input
			huh.NewInput().
				Title(projectNamePrompt).
				Validate(validateProjectName),
		),
	)
	return form
}
