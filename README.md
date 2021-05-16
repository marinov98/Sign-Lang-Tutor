# Sign-Lang-Tutor
A web app aimed at teaching sign language. Test it for yourself by clicking [here](https://sign-lang-tutor.herokuapp.com/)

## Getting Started with SLT

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn/npm run app:install`

Installs packages for both the frontend and backend and goes into appropriate conda environment

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `yarn/npm run server:install`

Installs the python environment from the enviroment file located in the `api` folder and then returns the user to the original directory

### `yarn/npm run server:start`

Starts the flask back-end server

### `yarn/npm run server:test`

Runs unit tests for the backend

### `yarn/npm run dev`

Runs front-end and back-end concurrently

### `yarn/npm run format`

Formats the everything inside the `src` folder that has the extension .ts and .tsx using the `.prettierrc` configuration file

### Environment
Create React environment file `cat .env.sample > .env` , fields are already filled in due to the fact that they are all meant for dev work

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Flask Backend API for SLT
Contains the flask code used in setting up the database and making the routes for slt

### Contributing

#### Python

This backend uses python's Flask framework and uses [conda](https://docs.conda.io/en/latest/miniconda.html) for package, environment, and dependency management
- *NOTE* commands might be different based on OS 
- To create the appropriate python environment run `conda create -n slt-pip python=3.7`
	- To activate the environment run `conda activate slt-pip`
		- Install all necessary packages with pip: `python -m pip install -r requirements.txt`
	- To update the environment run `python -m pip freeze > requirements.txt`
- Create Flask environment file `cat .env.example > .env` and fill in appropriate fields
- To delete Python environment run `conda remove env --name slt-pip --all`

#### Database

Our backend uses [MongoDB](https://docs.mongodb.com/manual/installation/) as its DBMS, for making 
a local database use the `mongodb://127.0.0.1:27017/mydbname` as a connect string

### Running the backend
- Assuming you have your environment setup, then use the command `flask run` to start the server
#### Running tests
- To initiate unit testing, run `python test.py` inside the `api` folder


## Contributors
- [marinov98](https://github.com/marinov98)
- [Ajani Stewart](https://github.com/AjaniStewart)
- [hecris](https://github.com/hecris)
- [abidh0601](https://github.com/abidh0601)
