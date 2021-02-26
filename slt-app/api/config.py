"""
environment file where the dotenv can be configured
and editted before being used in the flask app

"""
from dotenv import load_dotenv

def activate_env():
    from dotenv import load_dotenv
    load_dotenv()


if __name__ == "__main__":
    activate_env()
