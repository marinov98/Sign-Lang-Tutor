# Flask Backend API for SLT
Contains the flask code used in setting up the database and making the routes for slt

## Contributing

### Python

This backend uses python's Flask framework and uses conda for package, environment, and dependency management
- To create the appropriate python environment run `conda env create -f environment.yml`
	- To activate the environment run `conda activate slt`
	- To update the environment run `conda env export --no-builds > environment.yml`
		- The `--no-builds` flag is there because sometimes build numbers don't match across platforms but are not necessary if that is not a problem on your own OS.
- Create Flask environment file `cat .flaskenv.example > .env` and fill in appropriate fields

### Database

This backend uses [MongoDB](https://docs.mongodb.com/manual/installation/) as its DBMS, for making 
a local database use the `mongodb://127.0.0.1:27017/mydbname` as a connect string

## Running the backend
- Assuming you have your environment setup, then use the command `flask run` to start the server
