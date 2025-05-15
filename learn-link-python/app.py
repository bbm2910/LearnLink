from flask import Flask, jsonify, request
import matplotlib
matplotlib.use('agg') # Corrects matplotlib main thread error
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objs as go
import io
import base64

app = Flask(__name__)

@app.get("/")
def index():
    return "Welcome to LearnLink's Python data visualisation API!"


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3005)