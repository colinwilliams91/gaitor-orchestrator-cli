package main

import (
	"embed"
	"fmt"
	// "log"
	"os"

	_ "github.com/charmbracelet/bubbletea" // TODO: rename _ => tea when migrating to Tea model methods program
	"github.com/charmbracelet/huh"
)

//go:embed all:templates
var templateFS embed.FS

func main() {
	fmt.Fprintln(os.Stdout, "Initiate GAITOR creator... 🤖🐊")
	m := initialModel()
	form := buildForm(m)

	// TODO: put spinner somewhere before form.Run() ?

	err := form.Run()
	if err != nil {
		fmt.Println("Uh oh:", err)
		os.Exit(1)
	}

	// DEBUG LOGS
	fmt.Println(&m)
}

// TODO: migrate to Tea methods program: (place at EOF)
// use => https://github.com/charmbracelet/huh/blob/main/examples/bubbletea/main.go
// OR maybe don't need BubbleTea at all and only Huh forms?
// func main() {
// 	_, err := tea.NewProgram(NewModel()).Run()
// 	if err != nil {
// 		fmt.Println("Oh no:", err)
// 		os.Exit(1)
// 	}
// }

// --===========================
// -- region types/interfaces
// --===========================

type model struct {
	step              int // 0=name, 1=harnesses, 2=features, 3=scaffolding, 4=done
	projectName       string
	harnessChoices    []string         // harness choices: copilot, claude, codex, cursor
	harnessSelections map[int]struct{} // harnesses selected indices: 0, 1, 2, 3
	featureChoices    []string         // feature choices: agents, instructions, prompts, etc.
	featureSelections map[int]struct{} // features selected indices: 0, 1, 2, 3...
	form              *huh.Form        // currently active Huh form
	confirm           bool             // confirm scaffolding choices and run
	error             error
}

// --===========================
// -- region helper methods
// --===========================

func initialModel() model {
	return model{
		step:              0,
		projectName:       "",
		harnessChoices:    []string{"copilot", "claude", "codex", "cursor"},
		harnessSelections: make(map[int]struct{}),
		featureChoices:    []string{"agents", "hooks", "ido", "instructions", "mcp", "prompts", "skills", "tools", "aspire"},
		featureSelections: make(map[int]struct{}),
		form:              nil,
		error:             nil,
		confirm:           false,
	}
}

// --===========================
// -- region model methods
// --===========================

// TODO: uncomment when migrating to Tea model methods program
// func (m model) Init() tea.Cmd {
// 	return nil
// }

// func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
// 	switch m.step {
// 	case 0:
// 		// TODO: refactor this step 0 to use Huh form: huh.NewInput() for project name input and add regex validation ^[a-zA-Z0-9_-]+$

// 		switch msg := msg.(type) {
// 		case tea.KeyMsg:
// 			if msg.Type == tea.KeyEnter {
// 				m.step++
// 			} else if msg.Type == tea.KeyCtrlC {
// 				return m, tea.Quit
// 			} else if msg.Type == tea.KeyRunes {
// 				m.projectName += string(msg.Runes)
// 			}
// 		}
// 	}
// 	return m, nil
// }

// func (m model) View() string {
// 	switch m.step {
// 	case 0:
// 		return "Enter project name: " + m.projectName
// 	default:
// 		return ""
// 	}
// }
