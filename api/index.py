from flask import Flask, request
from flask_cors import CORS
from flask_restx import Api, Resource
from api.util import calculate
import os
from werkzeug.utils import secure_filename

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
        path = os.getcwd() + "/api/pdf"
        print("Current Directory", path)
        file = request.files['file']
        file.save(os.path.join(path, secure_filename(file.filename)))
        file_content = file.read()

        #print("content", file_content)
        return {"message": file.filename}


if __name__ == "__main__":
    app.run(debug=True)
