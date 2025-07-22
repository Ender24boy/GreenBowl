# idrk how to make the can't find flask warning go away but we ball
from flask import Flask, render_template, jsonify # type: ignore
import sqlite3

# Connect to flask server and name static folder
app = Flask(__name__, static_folder='')

def fetchClue():
# Connect to database
    DATABASE = 'jeopardy.db'

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    # Pick a random row
    cursor.execute("SELECT * FROM clues ORDER BY RANDOM()")
    question = cursor.fetchone()

    # Extract relevant info from row and assign to clue n answer
    data = {'clue' : question[3], 'answer' : question[4]}

    return data

@app.route("/")

# Code for index page
def index():

    return render_template("index.html", data=fetchClue())

@app.route("/new-question")
# Code for fetching new questions
def newQuestion():
    return jsonify(fetchClue())

if __name__ == '__main__':
    app.run(debug=True)