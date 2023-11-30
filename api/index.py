from flask import Flask, request, send_from_directory
from flask_cors import CORS
from flask_restx import Api, Resource
import os
import json
from werkzeug.utils import secure_filename
from api.extraction import convert_pdf_to_jpg, extract_from_image
from api.parse_svg_input_constaints import parse_svg, translate_polygons_to_SVG
from api.polygon import Polygon
from api.rectangle_nesting import rectangle_packing
from PyPDF2 import PdfFileReader

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
        string = f"Hello, World! {1+2}"
        print(string)
        return {"message": string}

    def post(self):
        # Define the path for the 'pdf' folder
        path = os.path.join(os.getcwd(), "api", "pdf")

        # Create the 'pdf' folder if it does not exist
        os.makedirs(path, exist_ok=True)

        # Process the uploaded file
        file = request.files["file"]
        if file and file.filename:
            # Secure the filename and save the file
            secureName = secure_filename(file.filename)
            savePath = os.path.join(path, secureName)
            file.save(savePath)

            # TODO: convert the uploaded file to jpg and then extract
            # convert_pdf_to_jpg(savePath)
            extract_from_image("./api/pattern_images/simple_shapes.jpg")

            # Send the processed file as a response
            return send_from_directory("./", "simple_shapes.svg", as_attachment=True)
        else:
            print("Error processing file")
            return {"message": "Error processing file"}

    def put(self):  # Used for sending new user confirmed svg string to run algorithm on
        # Take the svg string from the request and parse it to polygons
        svg = request.get_json()["svg"]
        print(f"svg_string: {svg}")

        # Generate an unique id and store the polygons in a /polygons/<id>.json file
        # Check if theres an id of 1, if not, create it
        # If there is an id of 1, increment the id by 1 and create the new id
        # Store the polygons in the file
        # Return the id to the user
        os.makedirs("api/polygons", exist_ok=True)
        next_id = 1
        while os.path.exists(f"api/polygons/{next_id}.json"):
            next_id += 1

        # Save the polygon data
        polygons = parse_svg(svg)
        # Create a json object to hold all polygons
        json_polygons = {}
        for polygon in polygons:
            json_polygons[polygon.pid] = polygon.toJSON()

        with open(f"api/polygons/{next_id}.json", "w") as file:
            json.dump(json_polygons, file)

        return {"id": next_id}


@api.route("/poll")
class Poll(Resource):
    def get(self):
        # Check if the id exists in the polygons folder
        # If it does, load the polygons from the file
        # Run the rectangle packing algorithm
        # Return the svg string to the user
        id = request.args.get("id")
        polygons = []

        if not os.path.exists("api/polygons"):
            return {"message": "No polygons folder exists"}

        if not os.path.exists(f"api/polygons/{id}.json"):
            return {"message": "No polygons file exists for that id"}

        with open(f"api/polygons/{id}.json", "r") as file:
            polygons = json.load(file)
            print(json.dumps(polygons, indent=4))

        # Convert json to list of Polygon objects
        polygonArray = []
        for p in polygons:
            data = json.loads(polygons[p])
            polygonArray.append(
                Polygon(
                    data["contour"],
                    data["x"],
                    data["y"],
                    data["width"],
                    data["height"],
                    bonding_box_margin=data["bonding_box_margin"],
                    pid=data["pid"],
                )
            )

        # TODO: change x to be the width of the fabric
        container_max_x = 10000
        container_max_y = 40000
        rectangle_packing(polygonArray, container_max_x, container_max_y)

        translate_polygons_to_SVG(
            polygonArray,
            3000,
            2000,
            f"api/svg/pattern_page_{id}.svg",
        )
        return send_from_directory(
            "./svg/", f"pattern_page_{id}.svg", as_attachment=True
        )


if __name__ == "__main__":
    app.run(debug=True)
