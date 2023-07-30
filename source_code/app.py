import ssl

import numpy as np
import werkzeug
from shutil import copyfile
from flask import Flask, request, redirect
from flask_restful import Resource, Api, abort, reqparse
import pandas as pd
import os
import easyocr
import json

from rev_autofill.run_text_role_classifier import auto_fill_type
from utils import *
import shutil
import base64
from PIL import Image

import requests

SAMPLES_DIRECTORY = 'chartchecker_sample_charts/'


class AnalyzeAuto(Resource):
    def __init__(self, global_cache):
        self.cache = global_cache

    def post(self):
        """
        takes a post request: filename, data, and specs are already loaded
        then does the analysis
        req: base_filename
        """
        req = request.get_json()

        base_filename = (req['base_filename'])

        remove_files = False
        # these files are created by the manual mode, so we can use them if they exist
        if os.path.isfile('c-pred1-texts.csv') and os.path.isfile('CompleteAnalysis_data.csv'):
            remove_files = True
            box_filename = 'c-pred1-texts.csv'
            data_filename = 'CompleteAnalysis_data.csv'
        else:
            # this currently points to the data available in the samples folder, should be adjusted after the tool is extended to automatically extract graph data 
            box_filename = SAMPLES_DIRECTORY + base_filename + '-pred1-texts.csv'
            data_filename = SAMPLES_DIRECTORY + base_filename + '_data.csv'

        try:
            fn_d = data_filename
            fn_b = box_filename

            #-------------------Start of detection algorithms-------------------

            # detect if there are multiple x or y axis in the chart
            detected_axis, fn_b = detect_multiple_axis(fn_b)    #adjusted fn_b to point to a temporary file containing the data with adjusted axis types

            # detect if there are any important labels missing
            missing_labels = detect_missing_labels(fn_b)

            # detect if any axis have inconsistencies (function can handle multiple x or y axis)
            nonLinearX, nonLinearY, inconsistentX, inconsistentY = detect_inconsistent_axis_scales(fn_b)

            # detect if the graph has a misleading aspect ratio 
            # TODO: needs to be adjusted when the tool gets extended to handle charts with multiple graphs
            misleadingAR = detect_misleading_aspect_ratio(fn_d, fn_b)

            # detections that need to be executed for each y-axis:
            inverted = []
            truncated = []

            # extract all y-axis to run axis-specific detection algorithms
            all_y_axis = ['y-axis']
            for axis in detected_axis[1:]:
                if bool(re.search('y\d+-axis', axis)):
                    all_y_axis.append(axis)
            for axis in all_y_axis:

                # detection of inverted axis
                is_axis_inverted = detect_inverted_axis(fn_b, axis)  
                inverted.append(is_axis_inverted)

                # detection of truncated axis
                truncated.append(detect_truncation(fn_b, axis, is_axis_inverted))

            #-------------------End of detection algorithms-------------------



            #-------------------Start of chart data extraction-------------------

            ar = calculate_aspect(fn_b)
            chart_title = get_chart_title(fn_b)

            # format graph data
            data = pd.read_csv(fn_d)
            # data extracted from csv file in in x:[] and y:[] format, need to process into {x: ~, y: ~} format
            formatted_graph_data = []
            for i in data.values:
                o = {}
                o['x'] = i[0]
                o['y'] = i[1]
                formatted_graph_data.append(o)


            #format data of all axis
            formatted_axis_data = {}
            all_axis = detected_axis[1:]
            for axis in all_axis:
                formatted_axis_data[axis] = extract_axis_data(fn_b, axis)

            #-------------------End of chart data extraction-------------------

            # as the graph data in the csv file assumes a linear scale, we need to adjust the data if an axis is not linear
            # TODO: tool can currently only handle one graph, needs to be adjusted to alter the graph that belongs to the non-linear axis
            if nonLinearX[0]:
                formatted_graph_data = fix_non_linear_scales(formatted_graph_data, formatted_axis_data['x-axis']['ticks'], 'x')
            if nonLinearY[0]:
                formatted_graph_data = fix_non_linear_scales(formatted_graph_data, formatted_axis_data['y-axis']['ticks'], 'y')

        except:
            # clean up files
            # os.remove(fn_d)
            # os.remove(fn_b)
            raise Exception("Something went wrong while detecting misleading features."
                            "Make sure that there are bounding boxes and data.")
        

        send_to_frontend = {
            'axisData': formatted_axis_data,            #dictionary with key being axis name and value being a dictionary with title and tick markers
            'graphData': formatted_graph_data,          # list of points to draw the graph
            'aspectRatio': ar,                          #aspect ratio of the chart
            'chartTitle': chart_title,                  #title of the chart
            'detectedFeatures': {   
                "truncatedY": truncated,                #list of booleans describing which detected y axis are truncated (in the order of the axis)
                "invertedY": inverted,                  #list of booleans describing which detected y axis are inverted (in the order of the axis)
                "misleadingAR": misleadingAR,           #first entry is true if the AR is misleading, second is an improved AR
                "missingLabels": missing_labels,        #first entry is true if there are missing labels, after is a list of which are missing
                "multipleAxis": detected_axis,          #first entry is true if there are multiple axis, after are the names of the detected axis 
                "nonLinearX": nonLinearX,               #list of booleans describing which detected x axis are non linear (in the order of the axis)
                "nonLinearY": nonLinearY,               #list of booleans describing which detected y axis are non linear (in the order of the axis)
                "inconsistentTicksX": inconsistentX,    #list of booleans describing which detected x axis have inconsistent tick placements (in the order of the axis)
                "inconsistentTicksY": inconsistentY     #list of booleans describing which detected y axis have inconsistent tick placements (in the order of the axis)
            }
        }

        # after completion, remove files that were generated by the manual mode
        if remove_files:
            os.remove('c-pred1-texts.csv')
            os.remove('CompleteAnalysis_data.csv')

        return send_to_frontend


class CompleteAnalysis(Resource):
    def __init__(self, global_cache):
        self.cache = global_cache

    def post(self):
        """
        takes a post request: gets height,width of image and data and boxes
        returns: an array of (x,y): array of messages of the same length
        The array is a suggestion message to the user

        """
        req = request.get_json()
        origHeight = int(req['origHeight'])
        req.pop('origHeight')
        origWidth = int(req['origWidth'])
        req.pop('origWidth')
        data = req['d']  # list of dicts with keys x and y
        boxes = req['box']  # list of dicts
        data = json.dumps(data)
        boxes = json.dumps(boxes)

        try:
            fn_d = 'CompleteAnalysis_data.csv'
            df_d = pd.read_json(data)
            df_d.drop(df_d.tail(1).index, inplace=True)  # drop last one
            df_d.to_csv(fn_d, index=False)                  # creates the csv data which seems to be in the wrong data format (comma as decimal separator and numbers as strings)

            fn_b = 'c-pred1-texts.csv'
            df_b = pd.read_json(boxes)
            df_b = df_b.drop(columns=['Q'])
            df_b.to_csv(fn_b, index=False)

        except:
            raise Exception("Something went wrong while saving the text and chart data."
                            "Make sure that there are bounding boxes and data.")

        return 'successfully saved data'


class AutofillType(Resource):
    def __init__(self, global_cache):
        self.cache = global_cache

    def post(self):
        base_filename = 'autofill'
        texts_filename = base_filename + '-texts.csv'
        preds_filename = base_filename + '-pred1-texts.csv'

        try:
            req = request.get_json()
            DUMMY_TEXTS = 'autofill-texts.csv'
            origHeight = int(req['origHeight'])
            req.pop('origHeight')
            origWidth = int(req['origWidth'])
            req.pop('origWidth')

            filedata = req['filedata']
            filedata = filedata.split('base64')[-1]  # processed base64 string
            filedata = base64.b64decode(filedata)  # now decoded

            req.pop('filedata')
            with open(base_filename + '.png', 'wb') as f:  # save as png file
                f.write(filedata)

            req = json.dumps(req)
            df = pd.read_json(req)
            df.to_csv(DUMMY_TEXTS, index=False)
            results = auto_fill_type(base_filename + '.png')  # makes the autofill-preds1-texts.csv file
            df2 = pd.read_csv(preds_filename)

            cols = ['id', 'x', 'y', 'width', 'height', 'text', 'type']
            idx = []
            x = []
            y = []
            width = []
            height = []
            text = []
            typeX = []

            idx.append(df2[cols[0]].tolist())
            x.append(df2[cols[1]].tolist())
            y.append(df2[cols[2]].tolist())
            width.append(df2[cols[3]].tolist())
            height.append(df2[cols[4]].tolist())
            text.append(df2[cols[5]].tolist())
            typeX.append(df2[cols[6]].tolist())

            idx = idx[0]
            x = x[0]
            y = y[0]
            width = width[0]
            height = height[0]
            text = text[0]
            typeX = typeX[0]
        except:
            # need to DELETE autofill pred 1 texts every time, or else we run into errors
            # os.remove(texts_filename)
            # os.remove(preds_filename)
            raise Exception("Something went wrong. Try again")

        # need to DELETE autofill pred 1 texts every time, or else we run into errors
        os.remove(texts_filename)
        os.remove(preds_filename)

        return {
            'id': idx,
            'x': x,
            'y': y,
            'width': width,
            'height': height,
            'text': text,
            'type': typeX,
        }


class ExtractText(Resource):
    def __init__(self, global_cache):
        self.cache = global_cache

    def post(self):
        req = request.get_json()
        filedata = json.dumps(req['filedata'])  # raw string
        filedata = filedata.split('base64')[-1]  # processed base64 string
        # these are the lines if you want to save the image
        filedata = base64.b64decode(filedata)  # now decoded
        filename = 'OCR.png'
        for_digitizer = 'digitizer.png'
        with open(filename, 'wb') as f:
            f.write(filedata)

        # I need this file for wpd load image
        with open(for_digitizer, 'wb') as f:
            f.write(filedata)

        reader = easyocr.Reader(['en'])
        output = reader.readtext(filename)
        os.remove(filename)  # delete the file after OCR

        x_arr = []
        y_arr = []
        w_arr = []
        h_arr = []
        text_arr = []
        type_arr = []
        for num, i in enumerate(output):
            b = i[0]
            x = float(b[0][0])
            x_ = b[1][0]
            y = float(b[0][1])
            y_ = b[2][1]
            w = float(x_ - x)
            h = float(y_ - y)
            #####
            x_arr.append(x)
            y_arr.append(y)
            w_arr.append(w)
            h_arr.append(h)
            text_arr.append(i[1])
            type_arr.append('u')

        send_to_frontend = {
            'x': x_arr,
            'y': y_arr,
            'w': w_arr,
            'h': h_arr,
            'text': text_arr,
            'type': type_arr
        }

        return send_to_frontend


from flask import Flask, request, send_from_directory, flash, redirect, url_for
from flask_restful import Resource, Api, abort
from flask_cors import CORS
import sys
from cachelib import SimpleCache

cache = SimpleCache(default_timeout=0)

app = Flask(__name__)
api = Api(app)

CORS(app, resources={r"/api/*": {"origins": "*"}})

api.add_resource(ExtractText,
                 '/api/extracttext',
                 resource_class_args=(cache,))

api.add_resource(AnalyzeAuto,
                 '/api/analyzeauto',
                 resource_class_args=(cache,))

api.add_resource(AutofillType,
                 '/api/autofilltype',
                 resource_class_args=(cache,))

api.add_resource(CompleteAnalysis,
                 '/api/completeanalysis',
                 resource_class_args=(cache,))


@app.route('/', methods=['GET', 'POST'])
def root():
    return app.send_static_file('index.html')


@app.route('/<path:path>', methods=['GET', 'POST'])
def send_js(path):
    return send_from_directory('static', path)


if __name__ == '__main__':
    port = int(5000)
    app.run(host='0.0.0.0', port=port, debug=True)
