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

SAMPLES_DIRECTORY = 'sample_charts/'


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
        image_filename = base_filename + '.png'
        box_filename = SAMPLES_DIRECTORY + base_filename + '-pred1-texts.csv'
        data_filename = SAMPLES_DIRECTORY + base_filename + '_data.csv'

        try:
            fn_d = data_filename
            fn_b = box_filename

            coords = []
            messages = []

            # Detect if the Y-Axis maximum was artificially change or isn't optimal
            detect_changed_y_max(fn_d, fn_b)    # only writes a comment for now

            # Detect if there are any important labels missing
            missing_labels = detect_missing_labels(fn_d, fn_b)

            # Detect if any axis have inconsistencies
            m, nonLinearX, nonLinearY, inconsistentX, inconsistentY = detect_inconsistent_scales(fn_b)
            print("axis problems: ", m)
            for e in m:
                messages.append(e)

            # Detect if there are multiple axis
            detected_axis = detect_multiple_axis(fn_b)

            # Detect inverted axis and add the result
            x, y, m, inverted = detect_inverted_axis(fn_b)
            if (x != None):
                coords.append([x, y])
                messages.append(m)

            # Detect trunction and add the result
            x, y, m, truncated = detect_truncation(fn_b)
            # comment max min append the result, there are guaranteed two values
            _X_pos_min, _Y_pos_min, _X_pos_max, _Y_pos_max, m_min, m_max = comment_max_min(fn_d, fn_b)
            m += m_min
            m += m_max
            coords.append([x, y])
            messages.append(m)

            # find aspect ratio and add the result
            m, c, misleadingAR = comment_aspect_ratio(fn_d, fn_b)  # messages, cords
            messages.append(m)
            coords.append(list(c))


            x_tick_labels, y_tick_labels, x_tick_pos, y_tick_pos = summarize_axes(fn_b, full=True)

            ar = calculate_aspect(fn_b)

        except:
            # clean up files
            # os.remove(fn_d)
            # os.remove(fn_b)
            raise Exception("Something went wrong. Try again."
                            "Make sure that there are bounding boxes and data.")

        data = pd.read_csv(fn_d)

        # in x:[] and y:[] format, need to process into {x: 0, y: 0 } format
        formatted_data = []
        for i in data.values:
            o = {}
            o['x'] = i[0]
            o['y'] = i[1]
            formatted_data.append(o)

        # tick labels and their positions are in separate arrays, need to combine them into one object per tick
        formatted_x_ticks = []
        for value, pos in zip(x_tick_labels, x_tick_pos):
            o = {}
            o['value'] = float(value)
            o['pos'] = float(pos[0])
            formatted_x_ticks.append(o)

        formatted_y_ticks = []
        for value, pos in zip(y_tick_labels, y_tick_pos):
            o = {}
            o['value'] = float(value)
            o['pos'] = float(pos[1])
            formatted_y_ticks.append(o)

        formatted_data = fix_non_linear_scales(formatted_data, formatted_x_ticks, 'x')  #TODO: call formatted data for an axis when it is not linear

        send_to_frontend = {
            'messages': messages,
            'coords': coords,           #find out what this does
            'xTicks': formatted_x_ticks,
            'yTicks': formatted_y_ticks,
            'aspectRatio': ar,
            'data': formatted_data,
            'detectedFeatures': { #adjust all methods that detect misleading features to return a boolean that shows if the feature is detected and insert it here
                "truncatedY": truncated,
                "invertedY": inverted,
                "misleadingAR": misleadingAR,           #first entry is if the AR is misleading, second is an improved AR
                "missingLabels": missing_labels,        #first entry is if there are missing labels, after is a list of which are missing
                "multipleAxis": detected_axis,          #first entry is if there are multiple axis, after are the names of the detected axis 
                "nonLinearX": nonLinearX,                  #when there are multiple axis, this is an array of booleans in the order of the axis
                "nonLinearY": nonLinearY,
                "inconsistentTicksX": inconsistentX,      #when there are multiple axis, this is an array of booleans in the order of the axis
                "inconsistentTicksY": inconsistentY
            }
        }

        # clean up files
        # os.remove(fn_d)
        # os.remove(fn_b)
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

            coords = []
            messages = []

            # Detect inverted axis and add the result
            x, y, m = detect_inverted_axis(fn_b)
            if (x != None):
                coords.append([x, y])
                messages.append(m)

            # find aspect ratio and add the result
            m, c = comment_aspect_ratio(fn_d, fn_b)  # messages, cords

            if m == None:
                pass
            else:
                messages.append(m)
                coords.append(list(c))

            # Detect trunction and add the result
            x, y, m = detect_truncation(fn_b)
            # comment max min append the result, there are guaranteed two values
            _X_pos_min, _Y_pos_min, _X_pos_max, _Y_pos_max, m_min, m_max = comment_max_min(fn_d, fn_b)
            # instead of appending to the data,
            # do it to the origin with the truncation message
            m += m_min
            m += m_max
            coords.append([x, y])
            messages.append(m)

            x_range, y_range, x_increment, y_increment = summarize_axes(fn_b)
            ar = calculate_aspect(fn_b)
            # data
        except:
            # os.remove(fn_d)
            # os.remove(fn_b)
            raise Exception("Something went wrong. Try again."
                            "Make sure that there are bounding boxes and data.")

        send_to_frontend = {
            'messages': messages,
            'coords': coords,
            'xRange': x_range,
            'yRange': y_range,
            'aspectRatio': ar,
            'data': data,
        }

        # clean up files
        # os.remove(fn_d)
        # os.remove(fn_b)

        return send_to_frontend


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
