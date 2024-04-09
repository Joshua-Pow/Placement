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
from api.slice_nesting import slice_nesting
from flask import make_response

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

resolution_manager = Resolution(
    pdf_width=0, pdf_height=0, fabric_width=0, fabric_unit="cm", num_pages=1
)

DISPLAY_X_WIDTH = 800

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

        # GRACE-TODO: Process fabric width information in request
        resolution_manager.fabric_width = int(request.form["width"])
        resolution_manager.fabric_unit = request.form["unit"]

        # Process the uploaded file
        file = request.files["file"]
        # print(
        #     f"Fabric Length: {resolution_manager.fabric_width} {resolution_manager.fabric_unit}"
        # )
        if file and file.filename:
            # Secure the filename and save the file
            secureName = secure_filename(file.filename)
            savePath = os.path.join(path, secureName)
            file.save(savePath)

            # TODO: better file path naming
            image_paths = convert_pdf_to_png(savePath)
            svg_output_path = extract_from_image(image_paths, resolution_manager)
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
        print(f"svgs is {len(svgs)}") 

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
            if svg["placeOnFold"]:
                print("Place on fold")
                print(svg["foldLocation"])
                polygons[-1].centre_fold_manip(svg["foldLocation"])
 
            if svg["quantity"] > 1:
                print(f"Duplicate {svg['quantity']} times")
                duplicate_polygon(polygons, svg["id"], svg["quantity"], len(svgs))

        # Create a json object to hold all polygons
        json_polygons = {}
        for polygon in polygons:
            json_polygons[polygon.pid] = polygon.toJSON()

        with open(f"api/polygons/{next_id}.json", "w") as file:
            json.dump(json_polygons, file, indent=4)
            #print(json.dumps(json_polygons, indent=4))

        return {"id": next_id} 
 

@api.route("/poll")
class Poll(Resource):
    def get(self):
        """
        Endpoint Description:
        - Purpose: Polls the server for the status of the algorithm.
        - Request Format:
            {
                "id": <id>,
                "iteration": <iteration>
            }
        - Response Format:
            {
                "svg": "<svg>...</svg>",
                "yardage": "<yardage> <unit>"
            }
        """

        # Check if the id exists in the polygons folder
        # If it does, load the polygons from the file
        # Run the rectangle packing algorithm
        # Return the svg string to the user
        id = request.args.get("id")
        iterationNumber = request.args.get("iteration") or 1
        polygons = []

        if not os.path.exists("api/polygons"):
            return {"message": "No polygons folder exists"}, 404

        if not os.path.exists(f"api/polygons/{id}.json"):
            return {"message": "No polygons file exists for that id"}, 404

        with open(f"api/polygons/{id}.json", "r") as file:
            polygons = json.load(file)
            #print(json.dumps(polygons, indent=4))

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

        container_max_x = resolution_manager._get_bounding_box_width_limit()
        # rectangle_packing(polygonArray, int(container_max_x), int(container_max_y))
        slice_nesting(
            polygonArray,
            int(container_max_x),
            int(iterationNumber),
        )

        final_yardage = resolution_manager.get_final_yardage(
            polygonArray, resolution_manager.fabric_unit
        )
        container_max_y = resolution_manager._get_bounding_box_length(polygonArray)
        translate_polygons_to_SVG(
            polygonArray,
            DISPLAY_X_WIDTH,
            int(container_max_y)+15,
            f"api/svg/pattern_page_{id}.svg",
        )
        if (resolution_manager.fabric_unit[0] == "i"):
            output_unit = "yards"
            output_value = final_yardage / 36
        else:
            output_unit = "metres"
            output_value = final_yardage / 100
        response = make_response(
            send_from_directory("./svg/", f"pattern_page_{id}.svg", as_attachment=True)
        )

        response.headers["yardage"] = (
            f"{output_value:.2f} {output_unit}"

        )
        return response


if __name__ == "__main__":
    app.run(debug=True)
