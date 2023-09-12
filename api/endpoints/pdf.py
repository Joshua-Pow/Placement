from flask_restx import Namespace, Resource

api = Namespace("pdf", description="PDF related operations")


@api.route("/")
class Pdf(Resource):
    def get(self):
        return {"message": "Hello, World!"}

    def post(self):
        return {"message": "Hello, World!"}
