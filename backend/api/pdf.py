# from flask_restx import Namespace, Resource

# api = Namespace('pdf', description='PDF related operations')


# @api.route('/')
# class Pdf(Resource):
#     def get(self):
#         return {"message": "Hello, World!"}

#     def post(self):
#         return {"message": "Hello, World!"}
from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "Hello World!"
