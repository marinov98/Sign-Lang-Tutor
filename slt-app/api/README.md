# Flask Backend API for SLT
Contains the flask code used in setting up the database and making the routes for slt

## Contributing
This backend uses python's Flask framework and uses conda for package, environment, and dependency management
- To create the appropriate python environment run `conda env create -f environment.yml`
	- To activate the environment run `conda activate slt`
	- To update the environment run `conda env export > environment.yml`
- Create Flask environment file `cat .flaskenv.example > .env` and fill in appropriate fields
