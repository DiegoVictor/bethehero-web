# [Web] Be The Hero
[![AppVeyor](https://img.shields.io/appveyor/build/diegovictor/bethehero-web?logo=appveyor&style=flat-square)](https://ci.appveyor.com/project/DiegoVictor/bethehero-web)
[![react](https://img.shields.io/badge/reactjs-19.1.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![styled-components](https://img.shields.io/badge/styled_components-6.1.16-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![eslint](https://img.shields.io/badge/eslint-8.44.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/bethehero-web?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/bethehero-web)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/bethehero-web/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
This web version allow NGOs to register yourself and manage its incidents. All the resources used by this application comes from its [`API`](https://github.com/DiegoVictor/bethehero-api).

## Table of Contents
* [Screenshots](#screenshots)
* [Installing](#installing)
  * [Configuring](#configuring)
    * [.env](#env)
    * [API](#api)
* [Usage](#usage)
  * [Register & Login](#register--login)
  * [localStorage](#localstorage)
* [Running the tests](#running-the-tests)
  * [Coverage Report](#coverage-report)

# Screenshots
Click to expand.<br>
<img src="https://raw.githubusercontent.com/DiegoVictor/bethehero-web/main/screenshots/register.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/bethehero-web/main/screenshots/logon.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/bethehero-web/main/screenshots/incidents.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/bethehero-web/main/screenshots/create.png" width="49%"/>

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
Configure your environment variables and remember to start the [API](https://github.com/DiegoVictor/bethehero-api) before to start this app.

### .env
In this file you may configure the API's url. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

key|description|default
---|---|---
REACT_APP_API_URL|API's url with version (v1)|`http://localhost:3333/v1`

### API
Start the [API](https://github.com/DiegoVictor/bethehero-api) (see its README for more information). In case of any change in the API's `port` or `host` remember to update the [`.env`](#env) too.


# Usage
To start the app run:
```
$ yarn start
```
Or:
```
npm run start
```

## Register & Login
When registering a new NGO notice that after send the form data a success toast message will appers at the right top corner of the screen with the NGO's ID, memorize or note it. At login page just paste the ID in the input and press `ENTER` or click on the button below to login.

## localStorage
The project saves NGO's data into a [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) key: `bethehero`. Before use this data you need parse the data to a JavaScript object with [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) function. Below you can see fictitious data:
```json
{
  "id": "98a111d1",
  "name": "NGO Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibWVzc2FnZSI6IkVhZSwgdHVkbyBibHo_IiwiaWF0IjoxNTE2MjM5MDIyfQ.MgLoxvRXoXeEHv36H4KuUQ3kfVl66uSOzJYll2IsZHE"
}
```

# Running the tests
[Jest](https://jestjs.io) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
