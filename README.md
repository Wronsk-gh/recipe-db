# recipe-db
Created with CodeSandbox

Backlog :
---------
- [ ] prevent resyncing before the previous sync isn't finished (Also force a refetch of recipes after adding the ingredient -> use a mutation !!!)
- [ ] Allow a user to configure the visualisation to be based on another user content (how to give permission ?)
- [ ] implement in the database a setting of the folder in drive to fetch pictures and new recipe from
- [X] Implement a button to resync with the recipes from the folder
- [X] use browser router
- [X] see if possible to keep being logged in (see maatjes mail)
    - current idea would be to use the firebase authentication service (probably kind of acts as a proxy, thus allows for refreshable tokens ???, then use the function gapi.client.setToken({access_token:'.....'}) to authenticate the gapi as a user with authorisation)
- [X] implement a responsive design via react bootstrap
- [ ] use type : lol = 'pwet' | 'fart'
- [ ] decide if using dedicated months for ingredients having both fresh or storage properties (or declare as 2 ingredients)
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
