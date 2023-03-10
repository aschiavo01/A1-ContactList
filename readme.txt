##To configure it for your own web application, follow these steps:

1) Fork this repository.

2) After creating your repository (via fork), clone the created repository locally.

3) Insert the folder containing your web application project inside the "insert-here-your-web-app" directory.

3a) To make the action executable after changing the name of the repository, you must modify the following paths:

	- In the file "Tesi-injector/plugin/src/main/java/com/mypackage/Application.java", change each path that refers to "Tesi-StrumentoGenerale" with the name of the new repository.
	- In this case, for example, "/home/runner/work/Tesi-StrumentoGenerale/Tesi-StrumentoGenerale/test-hooks/test-guard" becomes "/home/runner/work/A1-ContactList/test-hooks/test-guard".

3b) The same modifications must be made in the "main.yml" workflow, where every reference to "Tesi-StrumentoGenerale" must be changed to the new name of the repository.
	- For example, "cd /home/runner/work/Tesi-StrumentoGenerale/Tesi-StrumentoGenerale" becomes "cd /home/runner/work/A1-ContactList".

4) Create the virtual environment "envForGithubActions".

5) Insert the following 6 environment variables, customizing the example values shown here based on your use case:

	EMAIL_ACCOUNT_GITHUB: t*********@gmail.com
	NOME_ACCOUNT_GITHUB: g*********
	PASSWORD_ACCOUNT_GITHUB: *********
	FE_EXTENSION_TYPE: .html
	GRAMMAR_TYPE: angularjs
	DIR_FILE_FE: /home/runner/work/your-repo-name/insert-here-your-web-app/root-frontend-web-app
	
	Note: The allowed GRAMMAR_TYPE values are: ['angularjs', 'html', 'php', 'smarty', 'twig', 'freemarker']

6) Customize the startBackEnd.sh and startFrontEnd.sh files based on your use case. Here are some examples:

	startBackEnd.sh:
	echo "Start preconditions installation commands"
	sudo apt update
	sudo apt install openjdk-11-jdk openjdk-11-jre
	echo "Installed Java version number"
	java -version
	
	echo "Start Backend execution commands"
	cd /home/runner/work/your-repo-name/insert-here-your-web-app/root/backend
	mvn clean install
	cd /home/runner/work/your-repo-name/insert-here-your-web-app/root/backend/target
	echo "See which jar files are in the target folder"
	ls -a
	java -jar backend-0.0.1-SNAPSHOT.jar &
	
	startFrontEnd.sh:
	echo "Start preconditions installation commands"
	cd /home/runner/work/your-repo-name
	curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
	cat nodesource_setup.sh
	sudo bash nodesource_setup.sh
	sudo apt install nodejs
	echo "Installed Node version"
	node -v
	echo "Install npm"
	sudo apt install npm
	echo "Finished installing Node"
	
	echo "Start Frontend execution commands"
	cd /home/runner/work/your-repo-name/insert-here-your-web-app/root/frontend
	echo "We are in the FE directory, let's try to run it"
	npm install
	echo "npm installation completed, next command: npm start"
	npm start &

7) Go to the "Actions" tab and activate the "Workflows" by clicking the "I understand my workflows, go ahead and enable them" button.

8) Make a modification to a txt file and push it (e.g. add a character to readme.txt) to trigger the execution of the mainOnPush.yml file.

9) Wait for the mainOnPush.yml file to finish executing, which is responsible for hook injection within the FE files.

10) Pull locally to also have the FE files with injected locators on your own machine.

11) Run the web application locally.

12) Open Katalon Recorder and add the "attributeHooksLocators.js" file, which can be found in the current repository, to the "Extension script" section.

13) Record test cases with Katalon Recorder and export them in JUnit + WebDriver mode.

14) A zip file will be obtained, extract the contents of the file and push only the extracted test files (with .java extension) inside the ./project-test-headless/src/test/java/com/example/TesiIntegrazioneProgettoEsterno/ directory.

15) The push will trigger the execution of the mainOnPush.yml file, which will correct the format of the pushed test files (in order to make them executable within a container). Wait for its execution to finish.

16) Create a new release, triggering the execution of the main.yml file.

17) At the end of the execution of the main.yml file, all auto-generated reports related to the executed regression tests will be found within the ./TestSuite/nomeTagCreato directory of the created tag.

Note: Do not insert special characters in the tag name, such as the period ".". Use tags like "v1_0-Hooks" instead of tags like "v1.0-Hooks".

Subsequent iterations in the web application development cycle:

	1) Pull to always have the local project aligned with the remote.
	
	2) Write new web app code.
	
	3) Push the changes made.
	
	4) Wait for the mainOnPush file to finish executing (it takes care of re-injecting the hooks downstream of the changes).
	
	5) Perform the pull (to also have the FE files with updated hooks locally).
	
	6) Re-run the web application locally.
	
	7) Record new test cases with Katalon Recorder.
	
	8) Export the new test cases (in Katalon in WebDriver + JUnit format) and push the resulting files (.java) in the ./project-test-headless/src/test/java/com/example/TesiIntegrazioneProgettoEsterno/ folder.
	
	9) Wait for the mainOnPush.yml file to finish executing (it makes the new test files executable in headless mode).
	
	10) Create a new release.
	
	11) Wait for the execution of the main.yml file (which executes and auto-generates the regression test reports).
	
	12) All auto-generated reports related to the executed regression tests will be found in the ./TestSuite/nomeTagCreato directory. Analyze the report in ".xls" format and go to fix and/or delete any broken tests.
	
	13) Return to step 1 if the web application development cycle is not yet finished.
