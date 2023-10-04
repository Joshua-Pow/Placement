from flask import Flask
from endpoints import api
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
api.init_app(app)

if __name__ == "__main__":
    app.run(debug=True)
