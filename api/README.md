# Flask Backend API for SLT
Contains the flask code used in setting up the database and making the routes for slt

## Contributing

### Python

This backend uses python's Flask framework and uses conda for package, environment, and dependency management
- *NOTE* commands might be different based on OS (specifically Windows)
- To create the appropriate python environment run `conda create -n slt-pip python=3.7`
	- To activate the environment run `conda activate slt-pip`
		- Install all necessary packages with pip: `python -m pip install -r requirements.txt`
	- To update the environment run `python -m pip freeze > requirements.txt`
- Create Flask environment file `cat .flaskenv.example > .env` and fill in appropriate fields
- To delete Python environment run `conda remove env --name slt-pip --all`

### Database

This backend uses [MongoDB](https://docs.mongodb.com/manual/installation/) as its DBMS, for making 
a local database use the `mongodb://127.0.0.1:27017/mydbname` as a connect string

### PyTorch

This application uses pytorch please install it on your specific OS following the instructions on the [official website](https://pytorch.org/)

## Running the backend
- Assuming you have your environment setup, then use the command `flask run` to start the server
### Running tests
- To initiate unit testing, run `python test.py`
