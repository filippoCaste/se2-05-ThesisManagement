# Thesis Management 

- [Thesis Management](#thesis-management)
  - [Login credentials](#login-credentials)
  - [API Server](#api-server)
    - [`/api/proposals`:](#apiproposals)
    - [`/api/degrees`:](#apidegrees)
    - [`/api/groups`:](#apigroups)
    - [`/api/teachers`:](#apiteachers)
    - [`/api/students`:](#apistudents)
    - [`/api/keywords`:](#apikeywords)
    - [`/api/applications`:](#apiapplications)
    - [`/api/levels`:](#apilevels)
    - [Others](#others)
      - [Keywords](#keywords)
  - [Database Tables](#database-tables)
    - [Tables](#tables)
      - [`ProposalKeywords`](#proposalkeywords)
      - [`Keywords`](#keywords-1)
      - [`Courses`](#courses)
      - [`Departments`](#departments)
      - [`Degrees`](#degrees)
      - [`Groups`](#groups)
      - [`Users`](#users)
      - [`Teachers`](#teachers)
      - [`Careers`](#careers)
      - [`Students`](#students)
      - [`Supervisors`](#supervisors)
      - [`Proposals`](#proposals)
      - [`Applications`](#applications)
  - [Main React Components](#main-react-components)

## Login credentials
|username|password|
|---|---|
|d10000@polito.it | 10000 |
|d10001@polito.it | 10001 |
|s308692@studenti.polito.it | 308692 |
|s318082@studenti.polito.it | 318082 |

## API Server

### `/api/proposals`:

- POST `/`
  - request body content: all the fields for the proposal:
  - response: 
    - 200 OK (success)
    - 500 Internal Server Error: Indicates an error during processing.
```json
{
    "title": "DevOps proposal",
    "type":"Innovation that inspires",
    "description": "This is a DevOps proposal.",
    "level": "MSc",
    "expiration_date": "2023-12-22",
    "notes": "No additional notes",
    "required_knowledge": "Student must know the principle of software development.",
    "cod_degree": ["2", 3],
    "cod_group": "1",
    "supervisors_obj": {
        "supervisor_id": 10000,
        "co_supervisors": [
            10001,
            10002
            ],
        "external":[{
          "name":"Franco",
          "surname":"Solo",
          "email":"franco.solo@devops.com"
        },]
    },
    "keywords": [
        "Javascript"
    ]
}
```

- DELETE `/:id`
  - request body content: none
  - response: 
    - 200 OK (success)
    - 500 Internal Server Error: Indicates an error during processing.

- GET `/`
  - Description: Retrieve a list of proposals based on specified filters.
  - Query Parameters:
    - `cod_degree (required):` The code of the degree associated with the proposals.
    - `start_date (optional)`: The start date for filtering proposals (format: YYYY-MM-dd).
    - `end_date (optional)`: The end date for filtering proposals (format: YYYY-MM-dd).
    - `supervisor_id (optional)`: The ID of the supervisor for additional filtering.
    - `keyword_ids (optional)`: An array of keyword IDs for further filtering.
    - `level_ids (optional)`: An array of level IDs for additional filtering.
  - Response:
    - 200 OK: Successfully retrieves and returns a list of proposals.
    - 400 Bad Request: Indicates missing or invalid parameters.
    - 500 Internal Server Error: Indicates an error during processing.
    ```json
    // the response
    [
      {
        "id": 27,
        "title": "Computer vision techniques for mobile testing",
        "description": "Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.",
        "expiration_date": "2024-07-31",
        "cod_degree": "2",
        "title_degree": "COMMUNICATIONS ENGINEERING",
        "level": "MSc",
        "supervisor_id": 10000,
        "notes": "http://grains.polito.it/work.php",
        "cod_group": 1,
        "title_group": "Elite",
        "required_knowledge": "programming skills (Python, deep learning frameworks);\r\nexperience in training deep neural networks;\r\nfundamentals of mobile development (Android GUI, the Android Studio development environment);",
        "keyword_names": "AI, Mobile Application",
        "supervisorsInfo": [
          {
            "id": 10000,
            "name": "Mario",
            "surname": "Rossi",
            "email": "d10000@polito.it",
            "cod_group": 1
          },
          {
            "id": 10001,
            "name": "Giuseppe",
            "surname": "Verdi",
            "email": "d10001@polito.it",
            "cod_group": 1
          }
        ]
      }, 
    ]
    ```

- GET `/teachers/:id`
  - request body content: none
  - response: 
    - 200 OK (success) with array of thesis proposals object 
    - 400 Bad Request if the id is of unknown teachers
    - 401 Unauthorized (failure) with error message
    - 500 Internal Server Error: Indicates an error during processing.
```json
[
  {
    "id": 15,
    "title": "Thesis proposal IV",
    "description": "This is an innovative proposal.",
    "type": "Innovation that inspires",
    "level": "MSc",
    "expiration_date": "2024-03-01T00:00:00+01:00",
    "notes": "No additional notes",
    "cod_degree": 2,
    "cod_group": 1,
    "required_knowledge": "Student must know the principle of design of mobile applications.",
    "status": "posted",
    "title_degree": "COMMUNICATIONS ENGINEERING",
    "title_group": "Elite"
  },
]
```

- PUT `/:proposalId`
  - Description: Update the status of an application
  - request body content: 
    - see below
  - response:
    - 204 No Content: Successfully updated.
    - 400 Bad Request: Indicates missing or invalid parameters.
    - 401 Unauthorized: Indicates that the user is not logged in.
    - 403 Forbidden: User cannot access to this resource.
    - 404 Not Found: The proposal doesn't exist.
    - 500 Internal Server Error: Indicates an error during processing.
  ```json
  {
    "title": "Some proposal",
    "type":"A proposal that inspires",
    "description": "This is a fake proposal.",
    "level": "MSc",
    "expiration_date": "2023-12-22",
    "notes": "additional notes",
    "required_knowledge": "Student must know the principle of software development.",
    "cod_degree": ["5"],
    "cod_group": "1",
    "supervisors_obj": {
        "supervisor_id": 10000,
        "co_supervisors": [
            10001,
            10002
            ]
    },
    "keywords": [
        "AI", "Java", "Web development"
    ]
  }
  ```

- GET `/:proposalId`
  - request body: none
  - response:
    - 200 OK (success) with array of thesis proposals object 
    - 401 Unauthorized (failure) with error message
    - 403 Forbidden
    - 404 If the proposal is not found
    - 500 Internal Server Error: Indicates an error during processing.
```json
{
  "id": 27,
  "title": "Computer vision techniques for mobile testing",
  "description": "Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.",
  "type": "Tesi esterna in azienda",
  "level": "MSc",
  "expiration_date": "2024-07-31",
  "notes": "http://grains.polito.it/work.php",
  "cod_degree": 2,
  "required_knowledge": "programming skills (Python, deep learning frameworks);\r\nexperience in training deep neural networks;\r\nfundamentals of mobile development (Android GUI, the Android Studio development environment);",
  "status": "assigned",
  "title_degree": "COMMUNICATIONS ENGINEERING",
  "groups": [
    {
      "cod_group": 2,
      "title_group": "Automatica"
    },
    {
      "cod_group": 3,
      "title_group": "EMC Group"
    },
    {
      "cod_group": 1,
      "title_group": "Elite"
    }
  ],
  "keywords": [
    "AI"
  ],
  "coSupervisors": [
    {
      "id": 10001,
      "name": "Giuseppe",
      "surname": "Verdi",
      "email": "d10001@polito.it"
    },
    {
      "id": 10004,
      "name": "Franco",
      "surname": "Francini",
      "email": "d10004@polito.it"
    }
  ]
}
```

### `/api/degrees`:

- GET `/`
  - request body content: none
  - response: 
    - 200 OK (success) with degree object or error message
    - 500 Internal Server Error: Indicates an error during processing.
```json
[ {
    "cod_degree": 1,
    "title_degree": "AUTOMOTIVE ENGINEERING (INGEGNERIA DELL'AUTOVEICOLO)",
    "level_degree": "MSc"
  }, ]
```

### `/api/groups`:

- GET `/`
  - request body content: none
  - response: 
    - 200 OK (success) with object or error message
    - 500 Internal Server Error: Indicates an error during processing.
```json
  [ {
    "cod_group": 0,
    "cod_department": "ICM",
    "title_group": "Softeng"
  }, ]
```

### `/api/teachers`:
- GET `/`
  - request body content: none
  - response: 
    - 200 OK (success) with teachers or error message
    - 500 Internal Server Error: Indicates an error during processing.
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
    - 500 Internal Server Error: Indicates an error during processing.
```json
{
  "id": 10000,
  "surname": "Torchiano",
  "name": "Marco",
  "email": "torchiano@polito.it",
  "cod_group": 7,
  "cod_department": "ICM",
  "group_name": "Softeng"
}
```

### `/api/students`:

- GET `/:id`
  - request body content: none
  - response: 
    - 200 OK (success) with the *student* with the corresponding `id` or error message
    - 404 if the user is not found
    - 500 Internal Server Error: Indicates an error during processing.
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

### `/api/keywords`:

- GET `/`
  - request body content: none
  - response: 
    - 200 OK (success) with teachers or error message
    - 500 Internal Server Error: Indicates an error during processing.
```json
  [ {
    "id": 1,
    "name": "AI"
  }, ]
```

### `/api/applications`:

- GET `/proposal/:id`
  - request body content: none
  - response: 
    - 200 OK (success) with the list of applications or error message
    - 500 Internal Server Error: Indicates an error during processing.
  ```json
  [
    {
      "student_id": 400000,
      "submission_date": "2023-10-12",
      "student_name": "Mario",
      "student_surname": "Rossi",
      "student_email": "mario.rossi@studenti.polito.it",
      "student_nationality": "italian",
      "student_enrollment_year": 2022,
      "student_title_degree": "COMPUTER ENGINEERING"
    },
  ]
  ```
  - GET `/proposal/`
  - request body content: none
  - response: 
    - 200 OK (success) with the list of applications of that student or error message
    - 500 Internal Server Error: Indicates an error during processing.
  ```json
  [
    {
      "id": 4,
      "title": "thesis",
      "description": "description55",
      "expiration_date": "2023-11-19T00:00:00+01:00",
      "cod_degree": "5",
      "title_degree": "COMPUTER ENGINEERING",
      "level": "MSc",
      "supervisor_id": 10000,
      "notes": "notes",
      "cod_group": 1,
      "title_group": "Elite",
      "required_knowledge": "softeng2 exam",
      "keyword_names": "Javascript",
      "keyword_types": "KEYWORD",
      "status": "submitted",
      "supervisorsInfo": [
        {
          "id": 10000,
          "name": "Mario",
          "surname": "Rossi",
          "email": "d10000@polito.it",
          "cod_group": 1
        },
        {
          "id": 10001,
          "name": "Giuseppe",
          "surname": "Verdi",
          "email": "d10001@polito.it",
          "cod_group": 1
        }
      ]
    }
  ]
  ```
- POST `/`
  - Description: Create a new application for a proposal.
  - Request Body:
      - `proposal_id`
      - `student_id`
      - `submission_date`
  - Response:
    - 200 OK: Application successfully created.
    - 400 Bad Request: Indicates missing or invalid parameters.
    - 500 Internal Server Error: Indicates an error during processing.
  ```json
  {
    "application_id": 123,
    "proposal_id": 1,
    "student_id": 1001,
    "submission_date": "2023-11-18"
  }
  ```

- PUT `/:applicationId`
  - Description: accept or reject an application made by a student
  - Request Body:
    - `status`
  - Response:
    - 204 No Content: successfully updated.
    - 400 Bad Request: Indicates missing or invalid parameters.
    - 401 Unauthorized: Indicates that the user is not logged in.
    - 403 Forbidden: User cannot access to this resource.
    - 404 Not Found: The application doesn't exist.
    - 500 Internal Server Error: Indicates an error during processing.
  ```json
  {
    "status":"accepted"
  }
  // or
  {
    "status":"rejected"
  }
  ```

### `/api/levels`:

- GET `/`
  - request body content: none
  - response: 
    - 200 OK (success) with degree object or error message
    - 500 Internal Server Error: Indicates an error during processing.
```json
[
  {
    "id": "MSc",
    "name": "MSc"
  },
] 
```


### Others
#### Keywords
- `postKeyword(keywordName)`: post a new keyword in the database (path: `services/keyword.services.js`)
- `getKeywordByName(keywordName)`: if exists, it returns a keyword with the specified name (path: `services/keyword.services.js`)

## Database Tables

### Tables
#### `ProposalKeywords`
- proposal_id: INTEGER (NOT NULL)
- keyword_id: INTEGER (NOT NULL)
  
#### `Keywords`
- id: INTEGER
- name: TEXT (NOT NULL, UNIQUE)
- type: TEXT (NOT NULL)

#### `Courses`
- cod_course: TEXT
- title_course: INTEGER

#### `Departments`
- cod_department: TEXT (NOT NULL)
- title_department: TEXT (NOT NULL)

#### `Degrees`
- cod_degree: INTEGER
- title_degree: TEXT

#### `Groups`
- cod_group: INTEGER (NOT NULL)
- cod_department: TEXT (NOT NULL)
- title_group: TEXT (NOT NULL)

#### `Users`
- id: INTEGER (NOT NULL, UNIQUE)
- email: INTEGER (NOT NULL)
- name: TEXT (NOT NULL)
- surname: TEXT (NOT NULL)
- role: TEXT (NOT NULL)

#### `Teachers`
- id: INTEGER
- name: TEXT
- surname: TEXT
- email: TEXT
- cod_group: INTEGER
- cod_department: TEXT
  
#### `Careers`
- id: INTEGER (NOT NULL)
- cod_course: TEXT
- title_course: TEXT
- cfu: INTEGER
- grade: INTEGER
- date: TEXT

#### `Students`
- id: INTEGER
- name: TEXT
- surname: TEXT
- gender: TEXT
- nationality: TEXT
- email: TEXT
- cod_degree: INTEGER
- enrollment_year: INTEGER

#### `Supervisors`
- proposal_id: INTEGER
- supervisor_id: INTEGER
- co_supervisor_id: INTEGER
- external_supervisor: INTEGER
  
#### `Proposals`
- id: INTEGER
- title: TEXT
- type: TEXT
- description: TEXT
- level: TEXT (one between "MSc" and "BSc")
- expiration_date: TEXT
- notes: TEXT
- cod_degree: TEXT (NOT NULL)
- cod_group: INTEGER
- required_knowledge: TEXT
- status: TEXT (DEFAULT 'posted')
  - other values:
    - `assigned`: if a student application has been accepted
    - `archived`: if the proposal has been archived or has expired

#### `Applications`
- application_id: INTEGER (AI)
- proposal_id: INTEGER (NOT NULL)
- student_id: INTEGER (NOT NULL)
- status: TEXT (DEFAULT 'submitted', OTHERS 'accepted', 'refused')
- submission_date: TEXT

## Main React Components

`Pages`:
<!-- 
- `MainPage` (in `MainPage.jsx`): It is the main page and index of the application.
- `LoginPage` (in `LoginPage.jsx`): shows the Login page where user can perform authentication. Can be reached by clicking the Login button in the AppBar.
- `SignUpPage` (in `SignupPage.jsx`): shows the Signup page where user can create a new account. Can be reached by clicking the Signup button in the LoginPage.

- `NotFoundPage` (in `NotFoundPage.jsx`): shows the 404 page not found page. Can be reached by typing any other route in the browser.

`Components`:

- `AppBar` (in `AppBar.jsx`): shows the AppBar with the application name (with link to "/" by clicking on it), the name of user logged in, the login/logout button. Params passed: app title, user object, handleLogout, function for the admin to change the app title.
- `CustomSnackbar` (in `CustomSnackbar.jsx`): shows the snackbar with a message on the bottom left corner. Present in all pages. Passed param: message. 
- `AlertDialog`: displays detailed proposal information and handles application submission based on user interaction.
- `ApplicationDialog`: shows a student's application details and enables status changes, facilitating acceptance or rejection of the submission.
- `CheckboxesTags`: shows a selectable array interface with checkboxes, enabling users to pick from a list of options and manage selected values dynamically. Passed params: array,selectedArray and setSelectedArray
- `ChipsArray`: shows a set of chips that allow selection and deselection of items. Passed params: array,selectedArray and setSelectedArray
- `ClockCustomized`: shows a customized clock picker. Props are currentDateAndTime and setCurrentDateAndTime
- `CollapsibleTable`: renders a table listing proposals with collapsible rows to display proposal details, student applications, and action buttons. Props are  listProposals including the proposals , onClick that select the proposal and shows a dialog with infos ,deleteProposal, archiveProposal,onClickApplication that shows the selected application , fetchProposals 
- `CustomSnackBar`: a snackbar component that displays alert messages with options to close. Props include message which has property text and type
- `EditProposalTeacher`: is a form that allows to modify a proposal only possible by teacher.
- `FilterComponent`: sidebar to filter the proposals. Filter by title, expirationDate, startExpirationDate (min currentDataAndTime), Keywords, supervisor and 
- `MainDashboard`: student table to show the list of visible proposals
- `ResponsiveDrawer`: groups reset all option for the FilterComponent
- `SupervisorMenu`: component menu listing the supervisors available. Props are the supervisors, the id of the supervisor clicked.
- `TableComponent`: table showing the list the proposals with the related applications for that teacher.
-->
