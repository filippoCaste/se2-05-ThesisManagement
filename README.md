## React Client Application Routes

- Route `/`:
- Route `/login`: Login page. Perform authentication using username and password. Params passed throught props: handleLogin function.

## API Server

In the `index.js` file there are the following endpoints. The logic is separated in three main folders. The `routes` folder contains the routes related to certain entity, the `controller` folder has the logic for the route and the `services` folder contains the database queries that can be reused by different controllers and provide a higher level of abstraction.

`/api/session`:

- POST `/login`
  - request body content: creadentials with username and password
  - response: 201 Created (success) with user object or 401 Unauthorized (failure) with error message
- GET `/current`
  - request body content: none
  - response: 200 OK (success) with user object or 401 Unauthorized (failure) with error message
- DELETE `/current`
  - request body content: none
  - response: 200 OK (success)
- GET `/register`
  - request body content: json object with username, email and password
  - response: 201 Created (success) with user object or 401 Unauthorized (failure) with error message

`/api/proposals`:

- POST `/`
  - request body content: all the fields for the proposal:
    - `title, type, description, level, expiration_date, notes, [cod_degree], supervisor_id, cod_group`
  - response: 200 OK (success) or error message
- GET `/`
  - request body content: none
  - response: 200 OK (success) with user object or 401 Unauthorized (failure) with error message

`/api/degrees`:

- GET `/`
  - request body content: none
  - response: 200 OK (success) with degree object or error message

## Database Tables

### Tables

### to be changed to our database


- `Users`
  - "email" INTEGER NOT NULL,
  - "id" INTEGER NOT NULL UNIQUE,
  - "password" TEXT NOT NULL,
  - "username" TEXT NOT NULL,
  - "salt" TEXT NOT NULL,
  - "role" TEXT NOT NULL DEFAULT 'user',
  - PRIMARY KEY("id" AUTOINCREMENT)

## Main React Components

`Pages`:

- `MainPage` (in `MainPage.jsx`): It is the main page and index of the application.
- `LoginPage` (in `LoginPage.jsx`): shows the Login page where user can perform authentication. Can be reached by clicking the Login button in the AppBar.
- `SignUpPage` (in `SignupPage.jsx`): shows the Signup page where user can create a new account. Can be reached by clicking the Signup button in the LoginPage.

- `NotFoundPage` (in `NotFoundPage.jsx`): shows the 404 page not found page. Can be reached by typing any other route in the browser.

`Components`:

- `AppBar` (in `AppBar.jsx`): shows the AppBar with the application name (with link to "/" by clicking on it), the name of user logged in, the login/logout button. Params passed: app title, user object, handleLogout, function for the admin to change the app title.
- `CustomSnackbar` (in `CustomSnackbar.jsx`): shows the snackbar with a message on the bottom left corner. Present in all pages. Passed param: message.

## Users Credentials
### to be changed to our database
- username: John, password: 12345