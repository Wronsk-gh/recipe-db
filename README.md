# recipe-db

Created with CodeSandbox

## Backlog :

- [ ] Do not use multi define FIREBASE \_CONFIG, and use call initialiseApp a single time and share the instance...
- [ ] Do not store the thumbnails as blobs but let the browser download such that caching works correctly ?
- [ ] Add the tag 'New' to newly added recipes
- [ ] Implement a check that the user is logged in to stop displaying the app via a modal if not logged in
- [ ] I could avoid the "Please log in" then "Loading..." messages :
  - I could be OK with display the app content before being logged in, I only need to protect the calls inside
  - I could also have the query be initialised with some data from the user (previous data stored in cache ???) (with persistQueryClient ???)
- [ ] Add the user ID in the query keys to avoid mixing up user data in case of persitent query cache
- [ ] Check how google drive web app handles the auth and keeps the token, etc
- [ ] Cache the access_token to avoid reauth
- [ ] Optimise page load time (e.g. do not wait for gapi script to be loaded before proceeding with react rendering...)
- [x] Prevent loading and api access before a user is initialised
- [ ] Implement a persistent cache for the thumbnails such that they aren't all fetched at every refresh (e.g. with persistQueryClient plugin)
- [ ] Ensure that the refresh token of a user is not visible by the client
- [x] Integrate github AI into vscode env for this project (especially to write tests !)
- [ ] When modifying a recipe, the inherited tags shouldn't show in the list of the recipe tags. Or at least they should be separated.
  - This means that the inherited tags should be stored differently in the Recipe object
- [ ] refactor DriveSyncButton.tsx to use mutations instead of inline DB calls
- [x] implement custom tags for recipes + filter
- [x] Implement "edit modals" with month/ingredient/tag selection using multi-select/combo-box
- [x] implement all modals using bootstrap
- [ ] Implement better UI for filters
  - [x] Selection from combobox must be "on-top" of other UI instead of moving everything down
- [ ] Manage tags for ingredients as well, that recipes will also all inherit as "contain ..." tags
  - [x] Includes adding a filter to the recipe table for those tags
- [x] Implement a favourite button + filter
- [ ] Implement a setting to give permission to another user to view own content and for the other user to configure another user content to visualize
- [x] refactor ingredients table using bootstrap cards, tanstack react table and filters
- [ ] Delete ingredients button
- [ ] Implement better UI fo Tags table and ingredients table
- [x] Implement a Tag management page
- [x] Implement Filter multi select with also a text bar showing selected choices and auto completion (useMultipleSelection instead of useSelect ?)
  - https://www.downshift-js.com/use-multiple-selection#usage-with-combobox
- [x] Implement powerfull filtering and sorting capabilities based on tags, names, etc
  - Probably need to use a library, but cannot find one... -> decided to use TanStack React Table and Downshift for dropdown multi select
- [x] prevent resyncing before the previous sync isn't finished (Also force a refetch of recipes after adding the ingredient -> use a mutation !!!)
- [x] implement in the database a setting of the folder in drive to fetch pictures and new recipe from
- [x] Implement a button to resync with the recipes from the folder
- [x] use browser router
- [x] see if possible to keep being logged in (see maatjes mail)
  - current idea would be to use the firebase authentication service (probably kind of acts as a proxy, thus allows for refreshable tokens ???, then use the function gapi.client.setToken({access_token:'.....'}) to authenticate the gapi as a user with authorisation)
- [x] implement a responsive design via react bootstrap
- [x] Allow a user to configure the visualisation to be based on another user content (how to give permission ?)
  - Implemented in DB (both data and access permission rules) but still need to add setting to edit it
- [x] decide if using dedicated months for ingredients having both fresh or storage properties (or declare as 2 ingredients)
  - Decided (at least for now) to use two separate ingredients
- [x] implement new filter for recipes (contains at least some fresh ingredients, contains a specific ingredient)
  - Will be covered when adding the "seasonal" tag to some ingredients and filtering on it in the recipe table
- [x] sort ingredients alphabetically
  - Will be covered by the ingredients table refactoring
- [x] Redirect to the recipes page by default
- [ ] Implement correct error management in rtdb requests and auth
- [ ] auto login without pressing Auth button
- [ ] Embbed full list of ingredients in the database with servings, allow selecting some recipes and compute shopping list based on it
- [ ] Unauthorised calls (to gapi or firebase) must trigger a re-auth automatically
- [ ] Decide if using useMemo for 'dropdownListItems' of component ComboSelect
- [ ] Make a difference in type between the ones that we receive from the DB (some fileds may be missing), and the ones to send (all fields must be present)
- [ ] Introduce a delay in DB access functions, to validate loading behavior

code matthias :

function login(email: string, password: string): Promise<UserCredential> {
return signInWithEmailAndPassword(auth, email, password);
}

    function loginGoogle(): Promise<UserCredential> {
        return signInWithPopup(auth, provider);
    }

## Bugs :

- [x] When adding new recipes (filter on pepe), the thumbnail doesn't get loaded when the recipe is displayed
  - did not occur when the recipes query key was not directly reset after addind the recipes to the database
  - seems like it occurs if the recipe is added, removed, then added again
  - Solved by invalidating the thumbnail queries of the added recipes
- [x] When modifying a recipe, the thumbnail disappears
  - Was because the googleId was wrongly set in the DB -> solved by writing correctly the DB
- [x] When filtering the recipes by name, the page hangs infinitely
  - Problem comes because a new table data object is generated at each re-render of the react-query table (thus infinite state modification, filter triggers re-render, which creates new object ref, which triggers filter, which triggers re-render, etc)
  - Solved by pushing the creation of the data object to a prop being managed one level higher
- [ ] My gapi access token is not valid, thus I am sending a request to my firebase function to retrieve a new one.
      However, what the firebase function returns is :
      Refreshing gapi access token gapiUtils.ts:70:10
      Object { error: "invalid_grant", error_description: "Token has been expired or revoked." } gapiUtils.ts:72:10
      I understand it as that the refresh token is expired in the database of the function doesn't get a new one
      I should track the refresh token duration and ask the user to reauth in case it is no longer valid
