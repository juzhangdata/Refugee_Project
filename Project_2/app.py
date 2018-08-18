#--------------------------------------------------------------------------------
# Import dependencies
import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker
import json

#--------------------------------------------------------------------------------
# Setup database:
engine = create_engine('sqlite:///countries.db')
Base = declarative_base()
Base.metadata.create_all(engine)

file_name = "https://raw.githubusercontent.com/juzhangdata/test_project_2/master/DataSets/sankey_data.csv"
df = pd.read_csv(file_name)
df.to_sql(name="countries", con=engine, if_exists='replace')

#--------------------------------------------------------------------------------
# app config
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///countries.db'
db = SQLAlchemy(app)

#--------------------------------------------------------------------------------
# ORM setup:
Base = declarative_base()

class Countries(Base):
    __tablename__ = 'countries'
    year = Column(Integer, primary_key=True)
    target = Column(String(50))
    origin = Column(String(50))
    refugees = Column(Integer)

    def __repr__(self):
        return "<Country(year='%s', target='%s', origin='%s', pop='%s')>" % (
                            self.year, self.target, self.origin, self.refugees)

    def serialize(self):
    #return as a json object so we can use it in RESTful API
        return {'year': self.year, 
            'target': self.target, 
            'origin': self.origin, 
            'refugees': self.refugees
            }

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
Session.configure(bind=engine) 
session = Session()

#--------------------------------------------------------------------------------
# Home route
db = SQLAlchemy(app)
@app.route('/')
def home():
    return render_template("index.html")

#--------------------------------------------------------------------------------
@app.route('/data')
def data_page():
    
    stmt = db.session.query(Countries).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    return json.dumps(json.loads(df.to_json(orient='records')))

#--------------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
