package main

const ASCIIArt string = `
      ::::::::      :::     ::::::::::: ::::::::::: ::::::::  :::::::::
    :+:    :+:   :+: :+:       :+:         :+:    :+:    :+: :+:    :+:
   +:+         +:+   +:+      +:+         +:+    +:+    +:+ +:+    +:+
  :#:        +#++:++#++:     +#+         +#+    +#+    +:+ +#++:++#:
 +#+  +:#+# +#+     +#+     +#+         +#+    +#+    +#+ +#+    +#+
#+#    #+# #+#     #+#     #+#         #+#    #+#    #+# #+#    #+#
########  ###     ### ###########     ###     ########  ###    ###
`

var projectName string = ""

const (
	projectNameRegex         string = "^[a-zA-Z0-9_-]+$"
	projectNameValidationMsg string = "Project name must only contain letters, numbers, underscores, or hyphens."
	projectNamePrompt        string = "Please name your project: "
)
