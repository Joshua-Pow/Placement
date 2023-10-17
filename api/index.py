from flask import Flask
from flask_cors import CORS
from flask_restx import Api, Resource
from api.util import calculate

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

api = Api(
    title="Placement API",
    version="1.0",
    description="A simple API to upload PDFs and get their shapes",
    prefix="/api",
    default="PDF",
    default_label="PDF related operations",
    app=app,
)


@api.route("/pdf")
class Pdf(Resource):
    def get(self):
        string = f"Hello, World! {calculate(1, 2)}"
        print(string)
        return {"message": string}

    def post(self):
        return {"message": "Hello, World!"}


if __name__ == "__main__":
    app.run(debug=True)
