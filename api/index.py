from flask import Flask
from flask_cors import CORS
from flask_restx import Api, Namespace, Resource

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

api = Api(
    title="Placement API",
    version="1.0",
    description="A simple API to upload PDFs and get their shapes",
    prefix="/api",
)

api.init_app(app)

pdf_namespace = Namespace("pdf", description="PDF related operations")
api.add_namespace(pdf_namespace)


@api.route("/")
class Pdf(Resource):
    def get(self):
        return {"message": "Hello, World!"}

    def post(self):
        return {"message": "Hello, World!"}


if __name__ == "__main__":
    app.run(debug=True)
