# Flask API Project

## Running the Python API Locally
- Create a virtual environment: `python3 -m venv ./venv`
- To enter/activate the virtual environment run: `source venv/bin/activate` (and run `deactivate` to exit).
    - __Optional:__ Check the `pip` and/or `Python` versions to ensure you're using the project's binary and not your global version: `which pip` and/or `which python`. You should see a filepath ending with: `LearnLink/learn-link-python/venv/bin/pip` or `LearnLink/learn-link-python/venv/bin/python`
- Install Python dependencies in the virtual environment, as explained below.
    - __Optional:__ Run `pip list` to check the Python dependencies were installed in the virtual environment correctly.
- Run the following command from the root of the `learn-link-python` directory to start the Flask API: `python app.py`. The app is set to run on port `3005`.

## Installing Python Dependencies
**Option 1 (Preferred Method):** Using the `requirements.txt` file:
1) If a `venv` directory is not already included at the root of the `learn-link-python` directory, create a virtual environment using the following command: `python3 -m venv ./venv`

2) To enter/activate the virtual environment run: `source venv/bin/activate`
    - Note: To exit the virtual environment run: `deactivate`

3) Install Python dependencies from the `requirements.txt` file using the command: `pip install --no-cache-dir -r requirements.txt`

4) You can run `pip list` to show the dependencies in the virtual environment to ensure they are all installed.

**Option 2:** Installing individual dependencies manually:
The project uses the following main dependencies: Flask; numpy; pandas; matplotlib; plotly. Installing these 5 libraries manually will ensure that all the transient dependencies are also installed.
    - `pip install flask`
    - `pip install numpy`
    - `pip install pandas`
    - `pip install matplotlib`
    - `pip install plotly`