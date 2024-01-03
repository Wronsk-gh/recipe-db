# recipe-db
Created with CodeSandbox

Backlog :
---------
- [ ] Implement Filter multi select with also a text bar showing selected choices and auto completion (useMultipleSelection instead of useSelect ?)
    * https://www.downshift-js.com/use-multiple-selection#usage-with-combobox
- [ ] Implement better UI for filters
- [X] Implement powerfull filtering and sorting capabilities based on tags, names, etc
    * Probably need to use a library, but cannot find one... -> decided to use TanStack React Table and Downshift for dropdown multi select
- [X] prevent resyncing before the previous sync isn't finished (Also force a refetch of recipes after adding the ingredient -> use a mutation !!!)
- [X] implement in the database a setting of the folder in drive to fetch pictures and new recipe from
- [X] Implement a button to resync with the recipes from the folder
- [X] use browser router
- [X] see if possible to keep being logged in (see maatjes mail)
    * current idea would be to use the firebase authentication service (probably kind of acts as a proxy, thus allows for refreshable tokens ???, then use the function gapi.client.setToken({access_token:'.....'}) to authenticate the gapi as a user with authorisation)
- [X] implement a responsive design via react bootstrap
- [ ] Allow a user to configure the visualisation to be based on another user content (how to give permission ?)
    * Implemented in DB (both data and access permission rules) but still need to add setting to edit it
- [ ] use type : lol = 'pwet' | 'fart'
- [X] decide if using dedicated months for ingredients having both fresh or storage properties (or declare as 2 ingredients)
    * Decided (at least for now) to use two separate ingredients
- [ ] implement custom tags for recipes
- [ ] implement new filter for recipes (contains at least some fresh ingredients, contains a specific ingredient)
- [ ] sort ingredients alphabetically
- [ ] implement all modals using bootstrap
- [ ] Delete ingredients button
- [ ] Implement correct error management in rtdb requests and auth
- [ ] auto login without pressing Auth button
- [ ] Manage tags for ingredients as well that recipes will also all inherit as "contain ..." tags
- [ ] Redirect to the recipes page by default
- [ ] Implement a favourite button + filter
- [ ] Embbed full list of ingredients in the database with servings, allow selecting some recipes and compute shopping list based on it
- [ ] Unauthorised calls (to gapi or firebase) must trigger a re-auth automatically

Bugs :
------
- [X] When adding new recipes (filter on pepe), the thumbnail doesn't get loaded when the recipe is displayed
    * did not occur when the recipes query key was not directly reset after addind the recipes to the database
    * seems like it occurs if the recipe is added, removed, then added again
    * Solved by invalidating the thumbnail queries of the added recipes
