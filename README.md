# recipe-db
Created with CodeSandbox

Backlog :
---------
- [ ] Implement "edit modals" with month/ingredient/tag selection using multi-select/combo-box
- [ ] implement all modals using bootstrap
- [ ] Implement better UI for filters
    * selection from combobox must be "on-top" of other UI instead of moving everything down
- [ ] Manage tags for ingredients as well, that recipes will also all inherit as "contain ..." tags
    * Includes adding a filter to the recipe table for those tags
- [ ] Implement a favourite button + filter
- [ ] Implement a setting to give permission to another user to view own content and for the other user to configure another user content to visualize
- [ ] refactor ingredients table using bootstrap cards, tanstack react table and filters
- [ ] implement custom tags for recipes + filter
- [ ] Delete ingredients button
- [ ] Implement a Tag management page
- [X] Implement Filter multi select with also a text bar showing selected choices and auto completion (useMultipleSelection instead of useSelect ?)
    * https://www.downshift-js.com/use-multiple-selection#usage-with-combobox
- [X] Implement powerfull filtering and sorting capabilities based on tags, names, etc
    * Probably need to use a library, but cannot find one... -> decided to use TanStack React Table and Downshift for dropdown multi select
- [X] prevent resyncing before the previous sync isn't finished (Also force a refetch of recipes after adding the ingredient -> use a mutation !!!)
- [X] implement in the database a setting of the folder in drive to fetch pictures and new recipe from
- [X] Implement a button to resync with the recipes from the folder
- [X] use browser router
- [X] see if possible to keep being logged in (see maatjes mail)
    * current idea would be to use the firebase authentication service (probably kind of acts as a proxy, thus allows for refreshable tokens ???, then use the function gapi.client.setToken({access_token:'.....'}) to authenticate the gapi as a user with authorisation)
- [X] implement a responsive design via react bootstrap
- [X] Allow a user to configure the visualisation to be based on another user content (how to give permission ?)
    * Implemented in DB (both data and access permission rules) but still need to add setting to edit it
- [X] decide if using dedicated months for ingredients having both fresh or storage properties (or declare as 2 ingredients)
    * Decided (at least for now) to use two separate ingredients
- [X] implement new filter for recipes (contains at least some fresh ingredients, contains a specific ingredient)
    * Will be covered when adding the "seasonal" tag to some ingredients and filtering on it in the recipe table
- [X] sort ingredients alphabetically
    * Will be covered by the ingredients table refactoring
- [X] Redirect to the recipes page by default
- [ ] use type : lol = 'pwet' | 'fart'
- [ ] Implement correct error management in rtdb requests and auth
- [ ] auto login without pressing Auth button
- [ ] Embbed full list of ingredients in the database with servings, allow selecting some recipes and compute shopping list based on it
- [ ] Unauthorised calls (to gapi or firebase) must trigger a re-auth automatically
- [ ] Decide if using useMemo for 'dropdownListItems' of component ComboSelect

Bugs :
------
- [X] When adding new recipes (filter on pepe), the thumbnail doesn't get loaded when the recipe is displayed
    * did not occur when the recipes query key was not directly reset after addind the recipes to the database
    * seems like it occurs if the recipe is added, removed, then added again
    * Solved by invalidating the thumbnail queries of the added recipes
- [X] When modifying a recipe, the thumbnail disappears
    * Was because the googleId was wrongly set in the DB -> solved by writing correctly the DB
- [X] When filtering the recipes by name, the page hangs infinitely
    * Problem comes because a new table data object is generated at each re-render of the react-query table (thus infinite state modification, filter triggers re-render, which creates new object ref, which triggers filter, which triggers re-render, etc)
    * Solved by pushing the creation of the data object to a prop being managed one level higher
