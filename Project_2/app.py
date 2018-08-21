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

# Country code dictionary:
code_dict = [
{
    "Name": "Afghanistan",
    "Code": "AF"
},
{
    "Name": "ÔøΩland Islands",
    "Code": "AX"
},
{
    "Name": "Albania",
    "Code": "AL"
},
{
    "Name": "Algeria",
    "Code": "DZ"
},
{
    "Name": "American Samoa",
    "Code": "AS"
},
{
    "Name": "Andorra",
    "Code": "AD"
},
{
    "Name": "Angola",
    "Code": "AO"
},
{
    "Name": "Anguilla",
    "Code": "AI"
},
{
    "Name": "Antarctica",
    "Code": "AQ"
},
{
    "Name": "Antigua and Barbuda",
    "Code": "AG"
},
{
    "Name": "Argentina",
    "Code": "AR"
},
{
    "Name": "Armenia",
    "Code": "AM"
},
{
    "Name": "Aruba",
    "Code": "AW"
},
{
    "Name": "Australia",
    "Code": "AU"
},
{
    "Name": "Austria",
    "Code": "AT"
},
{
    "Name": "Azerbaijan",
    "Code": "AZ"
},
{
    "Name": "Bahamas",
    "Code": "BS"
},
{
    "Name": "Bahrain",
    "Code": "BH"
},
{
    "Name": "Bangladesh",
    "Code": "BD"
},
{
    "Name": "Barbados",
    "Code": "BB"
},
{
    "Name": "Belarus",
    "Code": "BY"
},
{
    "Name": "Belgium",
    "Code": "BE"
},
{
    "Name": "Belize",
    "Code": "BZ"
},
{
    "Name": "Benin",
    "Code": "BJ"
},
{
    "Name": "Bermuda",
    "Code": "BM"
},
{
    "Name": "Bhutan",
    "Code": "BT"
},
{
    "Name": "Bolivia, Plurinational State of",
    "Code": "BO"
},
{
    "Name": "Bonaire, Sint Eustatius and Saba",
    "Code": "BQ"
},
{
    "Name": "Bosnia and Herzegovina",
    "Code": "BA"
},
{
    "Name": "Botswana",
    "Code": "BW"
},
{
    "Name": "Bouvet Island",
    "Code": "BV"
},
{
    "Name": "Brazil",
    "Code": "BR"
},
{
    "Name": "British Indian Ocean Territory",
    "Code": "IO"
},
{
    "Name": "Brunei Darussalam",
    "Code": "BN"
},
{
    "Name": "Bulgaria",
    "Code": "BG"
},
{
    "Name": "Burkina Faso",
    "Code": "BF"
},
{
    "Name": "Burundi",
    "Code": "BI"
},
{
    "Name": "Cambodia",
    "Code": "KH"
},
{
    "Name": "Cameroon",
    "Code": "CM"
},
{
    "Name": "Canada",
    "Code": "CA"
},
{
    "Name": "Cape Verde",
    "Code": "CV"
},
{
    "Name": "Cayman Islands",
    "Code": "KY"
},
{
    "Name": "Central African Rep.",
    "Code": "CF"
},
{
    "Name": "Chad",
    "Code": "TD"
},
{
    "Name": "Chile",
    "Code": "CL"
},
{
    "Name": "China",
    "Code": "CN"
},
{
    "Name": "Christmas Island",
    "Code": "CX"
},
{
    "Name": "Cocos (Keeling) Islands",
    "Code": "CC"
},
{
    "Name": "Colombia",
    "Code": "CO"
},
{
    "Name": "Comoros",
    "Code": "KM"
},
{
    "Name": "Dem. Rep. of the Congo",
    "Code": "CG"
},
{
    "Name": "Congo",
    "Code": "CD"
},
{
    "Name": "Cook Islands",
    "Code": "CK"
},
{
    "Name": "Costa Rica",
    "Code": "CR"
},
{
    "Name": "CÔøΩte d'Ivoire",
    "Code": "CI"
},
{
    "Name": "Croatia",
    "Code": "HR"
},
{
    "Name": "Cuba",
    "Code": "CU"
},
{
    "Name": "CuraÔøΩao",
    "Code": "CW"
},
{
    "Name": "Cyprus",
    "Code": "CY"
},
{
    "Name": "Czech Republic",
    "Code": "CZ"
},
{
    "Name": "Denmark",
    "Code": "DK"
},
{
    "Name": "Djibouti",
    "Code": "DJ"
},
{
    "Name": "Dominica",
    "Code": "DM"
},
{
    "Name": "Dominican Republic",
    "Code": "DO"
},
{
    "Name": "Ecuador",
    "Code": "EC"
},
{
    "Name": "Egypt",
    "Code": "EG"
},
{
    "Name": "El Salvador",
    "Code": "SV"
},
{
    "Name": "Equatorial Guinea",
    "Code": "GQ"
},
{
    "Name": "Eritrea",
    "Code": "ER"
},
{
    "Name": "Estonia",
    "Code": "EE"
},
{
    "Name": "Ethiopia",
    "Code": "ET"
},
{
    "Name": "Falkland Islands (Malvinas)",
    "Code": "FK"
},
{
    "Name": "Faroe Islands",
    "Code": "FO"
},
{
    "Name": "Fiji",
    "Code": "FJ"
},
{
    "Name": "Finland",
    "Code": "FI"
},
{
    "Name": "France",
    "Code": "FR"
},
{
    "Name": "French Guiana",
    "Code": "GF"
},
{
    "Name": "French Polynesia",
    "Code": "PF"
},
{
    "Name": "French Southern Territories",
    "Code": "TF"
},
{
    "Name": "Gabon",
    "Code": "GA"
},
{
    "Name": "Gambia",
    "Code": "GM"
},
{
    "Name": "Georgia",
    "Code": "GE"
},
{
    "Name": "Germany",
    "Code": "DE"
},
{
    "Name": "Ghana",
    "Code": "GH"
},
{
    "Name": "Gibraltar",
    "Code": "GI"
},
{
    "Name": "Greece",
    "Code": "GR"
},
{
    "Name": "Greenland",
    "Code": "GL"
},
{
    "Name": "Grenada",
    "Code": "GD"
},
{
    "Name": "Guadeloupe",
    "Code": "GP"
},
{
    "Name": "Guam",
    "Code": "GU"
},
{
    "Name": "Guatemala",
    "Code": "GT"
},
{
    "Name": "Guernsey",
    "Code": "GG"
},
{
    "Name": "Guinea",
    "Code": "GN"
},
{
    "Name": "Guinea-Bissau",
    "Code": "GW"
},
{
    "Name": "Guyana",
    "Code": "GY"
},
{
    "Name": "Haiti",
    "Code": "HT"
},
{
    "Name": "Heard Island and McDonald Islands",
    "Code": "HM"
},
{
    "Name": "Holy See (Vatican City State)",
    "Code": "VA"
},
{
    "Name": "Honduras",
    "Code": "HN"
},
{
    "Name": "Hong Kong",
    "Code": "HK"
},
{
    "Name": "Hungary",
    "Code": "HU"
},
{
    "Name": "Iceland",
    "Code": "IS"
},
{
    "Name": "India",
    "Code": "IN"
},
{
    "Name": "Indonesia",
    "Code": "ID"
},
{
    "Name": "Islamic Rep. of Iran",
    "Code": "IR"
},
{
    "Name": "Iraq",
    "Code": "IQ"
},
{
    "Name": "Ireland",
    "Code": "IE"
},
{
    "Name": "Isle of Man",
    "Code": "IM"
},
{
    "Name": "Israel",
    "Code": "IL"
},
{
    "Name": "Italy",
    "Code": "IT"
},
{
    "Name": "Jamaica",
    "Code": "JM"
},
{
    "Name": "Japan",
    "Code": "JP"
},
{
    "Name": "Jersey",
    "Code": "JE"
},
{
    "Name": "Jordan",
    "Code": "JO"
},
{
    "Name": "Kazakhstan",
    "Code": "KZ"
},
{
    "Name": "Kenya",
    "Code": "KE"
},
{
    "Name": "Kiribati",
    "Code": "KI"
},
{
    "Name": "Korea, Democratic People's Republic of",
    "Code": "KP"
},
{
    "Name": "Korea, Republic of",
    "Code": "KR"
},
{
    "Name": "Kuwait",
    "Code": "KW"
},
{
    "Name": "Kyrgyzstan",
    "Code": "KG"
},
{
    "Name": "Lao People's Democratic Republic",
    "Code": "LA"
},
{
    "Name": "Latvia",
    "Code": "LV"
},
{
    "Name": "Lebanon",
    "Code": "LB"
},
{
    "Name": "Lesotho",
    "Code": "LS"
},
{
    "Name": "Liberia",
    "Code": "LR"
},
{
    "Name": "Libya",
    "Code": "LY"
},
{
    "Name": "Liechtenstein",
    "Code": "LI"
},
{
    "Name": "Lithuania",
    "Code": "LT"
},
{
    "Name": "Luxembourg",
    "Code": "LU"
},
{
    "Name": "Macao",
    "Code": "MO"
},
{
    "Name": "Macedonia, the Former Yugoslav Republic of",
    "Code": "MK"
},
{
    "Name": "Madagascar",
    "Code": "MG"
},
{
    "Name": "Malawi",
    "Code": "MW"
},
{
    "Name": "Malaysia",
    "Code": "MY"
},
{
    "Name": "Maldives",
    "Code": "MV"
},
{
    "Name": "Mali",
    "Code": "ML"
},
{
    "Name": "Malta",
    "Code": "MT"
},
{
    "Name": "Marshall Islands",
    "Code": "MH"
},
{
    "Name": "Martinique",
    "Code": "MQ"
},
{
    "Name": "Mauritania",
    "Code": "MR"
},
{
    "Name": "Mauritius",
    "Code": "MU"
},
{
    "Name": "Mayotte",
    "Code": "YT"
},
{
    "Name": "Mexico",
    "Code": "MX"
},
{
    "Name": "Micronesia, Federated States of",
    "Code": "FM"
},
{
    "Name": "Moldova, Republic of",
    "Code": "MD"
},
{
    "Name": "Monaco",
    "Code": "MC"
},
{
    "Name": "Mongolia",
    "Code": "MN"
},
{
    "Name": "Montenegro",
    "Code": "ME"
},
{
    "Name": "Montserrat",
    "Code": "MS"
},
{
    "Name": "Morocco",
    "Code": "MA"
},
{
    "Name": "Mozambique",
    "Code": "MZ"
},
{
    "Name": "Myanmar",
    "Code": "MM"
},
{
    "Name": "Namibia",
    "Code": "NA"
},
{
    "Name": "Nauru",
    "Code": "NR"
},
{
    "Name": "Nepal",
    "Code": "NP"
},
{
    "Name": "Netherlands",
    "Code": "NL"
},
{
    "Name": "New Caledonia",
    "Code": "NC"
},
{
    "Name": "New Zealand",
    "Code": "NZ"
},
{
    "Name": "Nicaragua",
    "Code": "NI"
},
{
    "Name": "Niger",
    "Code": "NE"
},
{
    "Name": "Nigeria",
    "Code": "NG"
},
{
    "Name": "Niue",
    "Code": "NU"
},
{
    "Name": "Norfolk Island",
    "Code": "NF"
},
{
    "Name": "Northern Mariana Islands",
    "Code": "MP"
},
{
    "Name": "Norway",
    "Code": "NO"
},
{
    "Name": "Oman",
    "Code": "OM"
},
{
    "Name": "Pakistan",
    "Code": "PK"
},
{
    "Name": "Palau",
    "Code": "PW"
},
{
    "Name": "State of Palestine",
    "Code": "PS"
},
{
    "Name": "Panama",
    "Code": "PA"
},
{
    "Name": "Papua New Guinea",
    "Code": "PG"
},
{
    "Name": "Paraguay",
    "Code": "PY"
},
{
    "Name": "Peru",
    "Code": "PE"
},
{
    "Name": "Philippines",
    "Code": "PH"
},
{
    "Name": "Pitcairn",
    "Code": "PN"
},
{
    "Name": "Poland",
    "Code": "PL"
},
{
    "Name": "Portugal",
    "Code": "PT"
},
{
    "Name": "Puerto Rico",
    "Code": "PR"
},
{
    "Name": "Qatar",
    "Code": "QA"
},
{
    "Name": "RÔøΩunion",
    "Code": "RE"
},
{
    "Name": "Romania",
    "Code": "RO"
},
{
    "Name": "Russian Federation",
    "Code": "RU"
},
{
    "Name": "Rwanda",
    "Code": "RW"
},
{
    "Name": "Saint BarthÔøΩlemy",
    "Code": "BL"
},
{
    "Name": "Saint Helena, Ascension and Tristan da Cunha",
    "Code": "SH"
},
{
    "Name": "Saint Kitts and Nevis",
    "Code": "KN"
},
{
    "Name": "Saint Lucia",
    "Code": "LC"
},
{
    "Name": "Saint Martin (French part)",
    "Code": "MF"
},
{
    "Name": "Saint Pierre and Miquelon",
    "Code": "PM"
},
{
    "Name": "Saint Vincent and the Grenadines",
    "Code": "VC"
},
{
    "Name": "Samoa",
    "Code": "WS"
},
{
    "Name": "San Marino",
    "Code": "SM"
},
{
    "Name": "Sao Tome and Principe",
    "Code": "ST"
},
{
    "Name": "Saudi Arabia",
    "Code": "SA"
},
{
    "Name": "Senegal",
    "Code": "SN"
},
{
    "Name": "Serbia (and Kosovo: S/RES/1244 (1999))",
    "Code": "RS"
},
{
    "Name": "Seychelles",
    "Code": "SC"
},
{
    "Name": "Sierra Leone",
    "Code": "SL"
},
{
    "Name": "Singapore",
    "Code": "SG"
},
{
    "Name": "Sint Maarten (Dutch part)",
    "Code": "SX"
},
{
    "Name": "Slovakia",
    "Code": "SK"
},
{
    "Name": "Slovenia",
    "Code": "SI"
},
{
    "Name": "Solomon Islands",
    "Code": "SB"
},
{
    "Name": "Somalia",
    "Code": "SO"
},
{
    "Name": "South Africa",
    "Code": "ZA"
},
{
    "Name": "South Georgia and the South Sandwich Islands",
    "Code": "GS"
},
{
    "Name": "South Sudan",
    "Code": "SS"
},
{
    "Name": "Spain",
    "Code": "ES"
},
{
    "Name": "Sri Lanka",
    "Code": "LK"
},
{
    "Name": "Sudan",
    "Code": "SD"
},
{
    "Name": "Suriname",
    "Code": "SR"
},
{
    "Name": "Svalbard and Jan Mayen",
    "Code": "SJ"
},
{
    "Name": "Swaziland",
    "Code": "SZ"
},
{
    "Name": "Sweden",
    "Code": "SE"
},
{
    "Name": "Switzerland",
    "Code": "CH"
},
{
    "Name": "Syrian Arab Rep.",
    "Code": "SY"
},
{
    "Name": "Taiwan, Province of China",
    "Code": "TW"
},
{
    "Name": "Tajikistan",
    "Code": "TJ"
},
{
    "Name": "United Rep. of Tanzania",
    "Code": "TZ"
},
{
    "Name": "Thailand",
    "Code": "TH"
},
{
    "Name": "Timor-Leste",
    "Code": "TL"
},
{
    "Name": "Togo",
    "Code": "TG"
},
{
    "Name": "Tokelau",
    "Code": "TK"
},
{
    "Name": "Tonga",
    "Code": "TO"
},
{
    "Name": "Trinidad and Tobago",
    "Code": "TT"
},
{
    "Name": "Tunisia",
    "Code": "TN"
},
{
    "Name": "Turkey",
    "Code": "TR"
},
{
    "Name": "Turkmenistan",
    "Code": "TM"
},
{
    "Name": "Turks and Caicos Islands",
    "Code": "TC"
},
{
    "Name": "Tuvalu",
    "Code": "TV"
},
{
    "Name": "Uganda",
    "Code": "UG"
},
{
    "Name": "Ukraine",
    "Code": "UA"
},
{
    "Name": "United Arab Emirates",
    "Code": "AE"
},
{
    "Name": "United Kingdom",
    "Code": "GB"
},
{
    "Name": "United States",
    "Code": "US"
},
{
    "Name": "United States Minor Outlying Islands",
    "Code": "UM"
},
{
    "Name": "Uruguay",
    "Code": "UY"
},
{
    "Name": "Uzbekistan",
    "Code": "UZ"
},
{
    "Name": "Vanuatu",
    "Code": "VU"
},
{
    "Name": "Venezuela (Bolivarian Republic of)",
    "Code": "VE"
},
{
    "Name": "Viet Nam",
    "Code": "VN"
},
{
    "Name": "Virgin Islands, British",
    "Code": "VG"
},
{
    "Name": "Virgin Islands, U.S.",
    "Code": "VI"
},
{
    "Name": "Wallis and Futuna",
    "Code": "WF"
},
{
    "Name": "Western Sahara",
    "Code": "EH"
},
{
    "Name": "Yemen",
    "Code": "YE"
},
{
    "Name": "Zambia",
    "Code": "ZM"
},
{
    "Name": "Zimbabwe",
    "Code": "ZW"
}
]

code_df = pd.DataFrame(code_dict)
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
@app.route("/origin/<year>")
def origin_year(year):
    stmt = db.session.query(Countries).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    year_df = df[df["year"]== int(year)][["origin", "refugees"]]
    year_df = year_df.groupby(["origin"]).sum().reset_index()
    year_df = pd.merge(year_df, code_df, how='inner', left_on=['origin'], right_on=['Name'])
    year_df = year_df.sort_values(by=["refugees"], ascending=False)

    data = {
        "origin": year_df.origin.values.tolist(),
        "code": year_df.Code.values.tolist(),
        "refugees": year_df.refugees.values.tolist()
    }
    
    return jsonify(data)

#--------------------------------------------------------------------------------
@app.route("/target/<year>")
def target_year(year):
    stmt = db.session.query(Countries).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    year_df = df[df["year"]== int(year)][["target", "refugees"]]
    year_df = year_df.groupby(["target"]).sum().reset_index()
    year_df = pd.merge(year_df, code_df, how='inner', left_on=['target'], right_on=['Name'])
    year_df = year_df.sort_values(by=["refugees"], ascending=False)

    data = {
        "target": year_df.target.values.tolist(),
        "code": year_df.Code.values.tolist(),
        "refugees": year_df.refugees.values.tolist()
    }
    return jsonify(data)

#--------------------------------------------------------------------------------
@app.route("/origin_target/<year>")
def api_year(year):
    stmt = db.session.query(Countries).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    year_df = df[df["year"]== int(year)][["origin", "target", "refugees"]]
    year_df = year_df.sort_values(by=["refugees"], ascending=False)

    # return json.dumps(json.loads(year_df.to_json(orient='records')))

    data = {
        "origin": year_df.origin.values.tolist(),
        "target": year_df.target.values.tolist(),
        "refugees": year_df.refugees.values.tolist()
    }
    return jsonify(data)

#--------------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5012)
    
#--------------------------------------------------------------------------------