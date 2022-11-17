Hello, this is a summary of the progress we made as Team 1 part of the IBM project.

###### Unit Testing Progress

We have created unit tests for all of the provided components. There has been extensive unit testing done for the following components: measure-soil-component, my-crops and seed-date. Each component includes a test checking ngOnInit and if certain text loads. The components in which Team 1 primarily focused on revolved around router and navigation services. These tests were selected to be done due to a careful analysis of the current codebase and realized that a majority of the functionality comes from being able to navigate through the web app. The initial code base heavily focused on a user's ability to navigate through the application with ease. While the current scope of the application is small and certain testing can be done manually, automating this will ensure future iterations will not have to worry about previous code failing. Testing was attempted in mocking both Bluetooth and USB device information, however, without knowing the proper hardware information being sent and collected, issues arose in creating unit tests here. Thus, the team has decided to focus on the navigation and router services as they are the most important to the application's functionality.

###### Current Working and Failing Tests (as of 11/16/2022)

| Component | Working Tests | Failing Tests |
| :--- | :--- | :--- |
| measure-soil-component | 2 | 0 |
| my-crops | 2 | 3 |
| seed-date | 0 | 3 |
| bluetooth | 0 | 1 |
| usb | 0 | 1 |
| connecting-dialogue | 0 | 1 |
| welcome | 0 | 3 |
| select-crop | 1 | 2 |
| advice | 0 | 3 |

From the above it's seen that measure-soil-component and my-crops have the most working tests. This was a direct result of a majority of the team's time in ensuring thorough testing was done in certain components viewed with more importance. The components with failing test cases faced several NullInjectorErrors and other errors that were not able to be resolved in the time frame of the project. Limited online resources and knowledge of the Angular framework were the main reasons for the team's inability to resolve these issues. The bluetooth and USB issues remained unresolved due to the team not yet figuring out how to properly mock the hardware information being sent and collected. To provide some details, mocking routing and ActivatedRoute issues were the main source of difficulty. The team tried various online resources to properly mock router and navigation. Since it was understood router and navigation techniques were the most used within the app, much of the time was spent figuring out how to resolve these issues. With the current state of the unit tests written, it is hoped that future iterations of the project will be able to resolve these issues and have a more robust testing suite.