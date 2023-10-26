from flask import Flask, request, send_from_directory
from flask_cors import CORS
from flask_restx import Api, Resource
from api.util import calculate
import os
from werkzeug.utils import secure_filename
from api.extraction import convert_pdf_to_jpg, extract_from_image

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
        file = request.files["file"]
        if file and file.filename:
            secureName = secure_filename(file.filename)
            savePath = os.path.join(path, secureName)
            file.save(savePath)
            # convert_pdf_to_jpg(savePath) #TODO: convert whatever file uploaded to jpg and then extract
            extract_from_image("./api/pattern_images/simple_shapes.jpg")
            return send_from_directory("./", "simple_shapes.svg", as_attachment=True)
        else:
            print("Error processing file")
            return {"message": "Error processing file"}


if __name__ == "__main__":
    app.run(debug=True)
