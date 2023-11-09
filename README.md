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
  - response: 200 OK (success) or error message
```json
{
    "title": "Thesis proposal IV",
    "type":"Innovation that inspires",
    "description": "This is an innovative proposal.",
    "level": 4,
    "expiration_date": "2024-02-30",
    "notes": "No additional notes",
    "required_knowledge": "Student must know the principle of design of mobile applications.",
    "cod_degree": ["2"],
    "cod_group": "1",
    "supervisors_obj": {
        "supervisor_id": 10000,
        "co_supervisor_id": 10001
    },
    "keywords": [
        "AI", "Machine Learning"
    ]
}
```

- GET `/`
  - request body content: none
  - response: 200 OK (success) with user object or 401 Unauthorized (failure) with error message
```json
[
    {
    "id": 1,
    "title": "Sw eng proposal",
    "type": "something innovative",
    "description": "This is an innovative proposal.",
    "level": 5,
    "expiration_date": "2024-08-30T00:00:00+02:00",
    "notes": "No additional notes",
    "cod_degree": "0",
    "cod_group": 1,
    "required_knowledge": null,
    "status": "posted"
  }, ]
```

`/api/degrees`:

- GET `/`
  - request body content: none
  - response: 200 OK (success) with degree object or error message
```json
[ {
    "cod_degree": 1,
    "title_degree": "AUTOMOTIVE ENGINEERING (INGEGNERIA DELL'AUTOVEICOLO)"
  }, ]
```

`/api/groups`:

- GET `/`
  - request body content: none
  - response: 200 OK (success) with object or error message
```json
  [ {
    "cod_group": 0,
    "cod_department": "ICM",
    "title_group": "Softeng"
  }, ]
```

`/api/teachers`:
- GET `/`
  - request body content: none
  - response: 200 OK (success) with teachers or error message
```json
  [   {
    "teacher_id": 10000,
    "name": "Marco",
    "surname": "Torchiano",
    "email": "torchiano@polito.it",
    "cod_group": 7,
    "cod_department": "DAUIN"
  }, ]
```
- GET `/:id`
  - request body content: none
  - response: 
    - 200 OK (success) with the *teacher* with the corresponding `id` or error message
    - 404 if the user is not found
```json
{
  "teacher_id": 10000,
  "teacher_cod_group": 7,
  "group_name": "Softeng",
  "cod_department": "ICM"
}
```

`/api/students`:

- GET `/:id`
  - request body content: none
  - response: 
    - 200 OK (success) with the *student* with the corresponding `id` or error message
    - 404 if the user is not found
```json
{
  "student_id": 400000,
  "name": "Mario",
  "surname": "Rossi",
  "gender": "M",
  "nationality": "italian",
  "email": "mario.rossi@studenti.polito.it",
  "cod_degree": 5,
  "enrollment_year": 2022
}
```

`/api/keywords`:

- GET `/`
  - request body content: none
  - response: 200 OK (success) with teachers or error message
```json
  [ {
    "id": 1,
    "name": "AI"
  }, ]
```

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