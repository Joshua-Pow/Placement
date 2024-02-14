from flask import Flask, request, send_from_directory
from flask_cors import CORS
from flask_restx import Api, Resource
import os
import json
from werkzeug.utils import secure_filename
from api.extraction import convert_pdf_to_png, extract_from_image
from api.parse_svg_input_constaints import (
    parse_svg,
    translate_polygons_to_SVG,
    duplicate_polygon,
)
from api.polygon import Polygon
from api.resolution import Resolution
from api.rectangle_nesting import rectangle_packing

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
        """
        Endpoint Description:
        - Purpose: Receives a PDF file and processes it to extract the shapes.
        - Request Format:
            {
                "file": <PDF file>,
                "length": <fabric length>,
                "unit": <fabric unit>
            }
        """
        # Define the path for the 'pdf' folder
        path = os.path.join(os.getcwd(), "api", "pdf")

        # Create the 'pdf' folder if it does not exist
        os.makedirs(path, exist_ok=True)

        # TODO: Process fabric width information in request

        # Process the uploaded file
        file = request.files["file"]
        fabricLength = request.form["length"]
        fabricUnit = request.form["unit"]
        print(f"Fabric Length: {fabricLength} {fabricUnit}")
        if file and file.filename:
            # Secure the filename and save the file
            secureName = secure_filename(file.filename)
            savePath = os.path.join(path, secureName)
            file.save(savePath)

            # TODO: better file path naming
            image_paths = convert_pdf_to_png(savePath)
            svg_output_path = extract_from_image(image_paths)
            # Send the processed file as a response
            return send_from_directory("./", "simple_shapes.svg", as_attachment=True)
        else:
            print("Error processing file")
            return {"message": "Error processing file"}

    def put(self):
        """
        Endpoint Description:
        - Purpose: Receives a user-confirmed SVG string to run the algorithm on.
        - Request Format:
            {
                "svg": [
                    {
                        "id": 1,
                        "quantity": 1,
                        "canRotate": false,
                        "placeOnFold": false,
                        "foldLocation"?: "top",
                        "svgString": "<path id='a' ... />"
                    }
                ]
            }
        """

        svgs = request.get_json()["svg"]

        # Generate an unique id and store the polygons in a /polygons/<id>.json file
        # Check if theres an id of 1, if not, create it
        # If there is an id of 1, increment the id by 1 and create the new id
        # Store the polygons in the file
        # Return the id to the user
        os.makedirs("api/polygons", exist_ok=True)
        next_id = 1
        while os.path.exists(f"api/polygons/{next_id}.json"):
            next_id += 1

        # TODO: rework this workflow to do all duplicate and other property changes in the parse_svg function
        # Save the polygon data
        polygons: list[Polygon] = []
        # Go through each svg and parse it into a Polygon object then add it to the polygons list
        for svg in svgs:
            polygons.extend(parse_svg(svg["svgString"]))

            if svg["quantity"] > 1:
                print(f"Duplicate {svg['quantity']} times")
                duplicate_polygon(polygons, svg["id"], svg["quantity"], len(svgs))

            # TODO: handle fold location
            if svg["placeOnFold"]:
                print("Place on fold")
                print(svg["foldLocation"])

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
                    contour=data["contour"],
                    x=data["x"],
                    y=data["y"],
                    width=data["width"],
                    height=data["height"],
                    bonding_box_margin=data["bonding_box_margin"],
                    pid=data["pid"],
                )
            )

        # TODO: change x to be the width of the fabric
        container_max_x = 2000
        container_max_y = 2000
        rectangle_packing(polygonArray, container_max_x, container_max_y)

        # TODO: read resolution.svg to get width, height of input.
        # resolution = Resolution(width, height, path)
        # resolution.get_final_yardage(polygonArray)

        translate_polygons_to_SVG(
            polygonArray,
            2000,
            2000,
            f"api/svg/pattern_page_{id}.svg",
        )

        # TODO: add final yardage info to ouput
        return send_from_directory(
            "./svg/", f"pattern_page_{id}.svg", as_attachment=True
        )


if __name__ == "__main__":
    app.run(debug=True)
