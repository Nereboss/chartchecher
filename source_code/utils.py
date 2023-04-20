import math

import numpy as np
from scipy.signal import butter, lfilter, freqz
from sklearn.metrics import r2_score
import pandas as pd


# f is the filename for bounding boxes
# d is the data csv


def detect_truncation(f):
    """
    Fuction takes in the axis specification data and identifies
    if the y-axis is truncatedg
    return: (x,y) coordinates of the approximate location of where it happens
    This is calculated by the (x,y) of the y-axis-label (bottom-most)
    Otherwise return "The axis is not truncated"
    """
    x_range, y_range, x_increment, y_increment = summarize_axes(f)
    x_o, y_o = identify_origin(f, use='truncate')
    baseline = float(y_range[0])
    if (baseline != 0):
        message = "The y-axis is truncated!"
        return x_o, y_o, message
    else:
        message = "The y-axis is not truncated and starts at 0 [newline]"
        return x_o, y_o, message


def detect_inverted_axis(f):
    """
    Fuction takes in the axis specification data and identifies
    if the y-axis is inverted
    return: (x,y) coordinates of the approximate location of where it happens
    This is calculated by the (x,y) of the y-axis-label (bottom-most)
    otherwise return None
    """
    x_range, y_range, x_increment, y_increment = summarize_axes(f)
    x_o, y_o = identify_origin(f, use='invert')
    if (y_increment < 0):
        message = "The y-axis is inverted!"
        return x_o, y_o, message
    else:
        return None, None, None

def detect_changed_y_max(chart_data, box_data):
    """
    Function takes in chart and bounding box data and
    identifies if the Y-axis maximum is at a reasonable value for the chart
    return: TODO, currently only prints result in console
    """
    x_range_list, y_range_list, x_increment, y_increment = summarize_axes(box_data)
    y_min = float(y_range_list[0])     #y min and max are in str format, - not supported; how do other functions get results from summarize axes?
    y_max = float(y_range_list[1])
    y_range = y_max - y_min
    graph_data = pd.read_csv(chart_data)
    graph_y_data = graph_data['y'].to_numpy()
    graph_max = graph_y_data.max()
    graph_min = graph_y_data.min()
    inverted = False if y_min < y_max else True
    if inverted:
        used_range = graph_min - y_max
    else:
        used_range = graph_max - y_min
    used_range_factor = abs(used_range / y_range)
    if used_range_factor < 0.67:
        print("\n", f"The y-axis maximum is not well adjusted for the chart with {(1-round(used_range_factor, 4))*100}% of the space wasted!", "\n")

def detect_missing_labels(chart_data, box_data):
    """
    Function takes in bounding box data and detects if there are any labels missing.
    Missing title, x-axis-title or y-axis-title will lead to those placed being marked in the improved chart
    while missing x-axis-labels or y-axis labels will make it so we are unable to draw a chart
    """
    box_data = pd.read_csv(box_data)
    possible_types = ['title', 'x-axis-title', 'x-axis-label', 'y-axis-title', 'y-axis-label', 'legend-title', 'legend-label'] # we intentionally left out 'text-label' as that is optional
    type_values = box_data['type'].values
    missing = []
    for type in possible_types:
        if type not in type_values:
            missing.append(type)
    
    # TODO add missing labels to the csv-file (with -1 for all fields except text and type; that way we can know which fields were missing later)
    # differenciate between labels that makes it unable to draw a chart (if those exist) and others 
            
    #print missing elements to console
    print("\nThe chart is missing "+" and ".join([", ".join(missing[:-1]),missing[-1]] if len(missing) > 2 else missing)+". This may cause the chart to be taken out of context or make the shown data hard to validate.\n")



def comment_aspect_ratio(d, f):
    """
    Function takes in x,y data and the actual chart to determine whether the aspect ratio is ok
    Draws the info box on the right most x-axis label
    """
    df = pd.read_csv(d)
    x = df['x'].to_numpy()
    y = df['y'].to_numpy()

    # make a correction to the slopes

    x_labels, y_labels, x_pos, y_pos = summarize_axes(f, full=True)
    xl_first = float(x_labels[0])
    xl_last = float(x_labels[-1])
    yl_first = float(y_labels[0])
    yl_last = float(y_labels[-1])
    xp_first = float(x_pos[0][0])
    xp_last = float(x_pos[-1][0])
    yp_first = float(y_pos[0][1])
    yp_last = float(y_pos[-1][1])

    # x and y scales PER PIXEL
    x_s = (xl_last - xl_first) / (xp_last - xp_first)
    y_s = (yl_last - yl_first) / (yp_last - yp_first)
    IDEAL_SLOPE = bank_slopes_ms(x, y, scale_x=x_s, scale_y=y_s)
    ACTUAL_SLOPE = calculate_aspect(f)

    # need to check to see if these are off by a factor of sqrt(10)
    greater = 0
    smaller = 0

    if (IDEAL_SLOPE > ACTUAL_SLOPE):
        greater = IDEAL_SLOPE
        smaller = ACTUAL_SLOPE
    else:
        greater = ACTUAL_SLOPE
        smaller = IDEAL_SLOPE

    if greater/smaller < math.sqrt(10):
        return None, 'no_message'
        # the aspect ratio is not far from the ideal


    message = 'Actual Aspect Ratio (AR): ' + "{:.2f}".format(ACTUAL_SLOPE)
    message += '. Ideal AR: ' + "{:.2f}".format(IDEAL_SLOPE)

    if 'log' in comment_axis_scales_util(f):
        message += '. Log axis detected. Aspect Ratio is only robust for linear charts at this time.'

    _, _, x_p, _ = summarize_axes(f, full=True)
    last = len(x_p) - 1
    x_p = [float(i) for i in list(x_p[last])]
    return message, x_p


def comment_axis_scales_util(f):
    """
    Function takes in bounding boxes info and sees if the axes are line or log
    """
    # linear by default
    type_x = 'linear'
    type_y = 'linear'

    r = summarize_axes(f, full=True)
    x_axis_ticks = np.asarray(r[0]).astype(np.float)  # x axis ticks
    y_axis_ticks = np.asarray(r[1]).astype(np.float)  # y axis ticks

    if 0 in x_axis_ticks:
        type_x = 'linear'
    else:
        ## for x_axis ticks, calculate the fit
        x_i = np.arange(0, len(x_axis_ticks), 1)
        lin_fit = np.polyfit(x_i, x_axis_ticks, 1)
        log_fit = np.polyfit(x_i, np.log(x_axis_ticks), 1)

        lin_function = lin_fit[0] * x_i + lin_fit[1]
        log_function = log_fit[0] * x_i + log_fit[1]

        lin_score = r2_score(x_axis_ticks, lin_function)
        log_score = r2_score(np.log(x_axis_ticks), log_function)

        if lin_score > log_score:
            type_x = 'linear'
        else:
            type_x = 'log'

    if 0 in y_axis_ticks:
        type_y = 'linear'
    else:

        y_i = np.arange(0, len(y_axis_ticks), 1)
        lin_fit = np.polyfit(y_i, y_axis_ticks, 1)
        log_fit = np.polyfit(y_i, np.log(y_axis_ticks), 1)

        lin_function = lin_fit[0] * y_i + lin_fit[1]
        log_function = log_fit[0] * y_i + log_fit[1]

        lin_score = r2_score(y_axis_ticks, lin_function)
        log_score = r2_score(np.log(y_axis_ticks), log_function)

        if lin_score > log_score:
            type_y = 'linear'
        else:
            type_y = 'log'

    return type_x, type_y




def comment_max_min(d, f):
    """
    Function takes the max and the min points of the data (y) and attempts to output
    and attempts to annotate them
    requires: summarize axes() both versions
    """
    # let X,Y be the point
    x_min, y_min, x_max, y_max = find_min_max(d)

    x, y, x_p, y_p = summarize_axes(f, full=True)
    x = [float(i) for i in x]
    y = [float(i) for i in y]

    x_0 = [x[0], x_p[0]]
    x_m = [x[-1], x_p[-1]]
    y_0 = [y[0], y_p[0]]
    y_n = [y[-1], y_p[-1]]

    X_scale = (x_m[1][0] - x_0[1][0]) / (x_m[0] - x_0[0])  # pixels per step
    Y_scale = (y_n[1][1] - y_0[1][1]) / (y_n[0] - y_0[0])  # pixels per step

    X_pos_min = (x_min - x_0[0]) * X_scale + x_0[1][0]
    Y_pos_min = -(y_min - y_n[0]) * Y_scale + y_0[1][1]
    X_pos_max = (x_max - x_0[0]) * X_scale + x_0[1][0]
    Y_pos_max = -(y_max - y_n[0]) * Y_scale + y_0[1][1]

    m_min = ""
    m_max = ""
    return X_pos_min, Y_pos_min, X_pos_max, Y_pos_max, m_min, m_max


def find_min_max(d):
    df = pd.read_csv(d)
    x = df['x'].to_numpy()
    y = df['y'].to_numpy()
    min = y.argmin()
    max = y.argmax()
    return x[min], y[min], x[max], y[max]


def parse_num(num):
    try:
        return float(num)
    except:
        pass
    try:
        return int(''.join(c for c in num if c.isdigit()))
    except:
        print("Nan detected")


def identify_origin(filename, use='truncate'):
    """ Takes csv file in poco and heer and returns the coordinates of the
    origin. This is done by taking the bottom y-axis label and the left x-axis
    label
    """
    df = pd.read_csv(filename)
    df = df[['text', 'type', 'x', 'y']]  # drop all others, only need 'text' and 'type'
    y_labels = []
    x_labels = []
    x_pos = []
    y_pos = []
    for text, type, horiz_order, vert_order in zip(df['text'], df['type'], df['x'], df['y']):
        if (type == 'y-axis-label'):
            y_labels.append(text)
            y_pos.append(vert_order)
        elif (type == 'x-axis-label'):
            x_labels.append(text)
            x_pos.append(horiz_order)
        else:
            continue

    y_labels.reverse()  # reverse the y axis labels since the are read top to bottom
    reorder = np.asarray(x_pos).argsort()
    x_labels = np.asarray(x_labels)[reorder]
    x_pos = np.asarray(x_pos)[reorder]
    ######
    x_left = float(x_pos[0])
    y_bottom = float(y_pos[-1])

    if use == 'truncate':
        return (x_left, y_bottom + 50)
    else:
        return (x_left, y_bottom - 50)


def summarize_axes(filename, full=False):
    """Takes a csv file in the format of Poco and Heer InfoVis 2017 and returns
    a summary of the axes (axis ranges)"""
    df = pd.read_csv(filename)
    df = df[['text', 'type', 'x', 'y']]  # drop all others, only need 'text' and 'type'
    y_labels = []
    y_pos = []
    x_labels = []
    x_pos = []
    x_order_tracker = []
    y_order_tracker = []
    for text, type_, x_c, y_c in zip(df['text'], df['type'], df['x'], df['y']):
        if (type_ == 'y-axis-label'):
            y_labels.append(text)
            y_order_tracker.append(y_c)

            y_pos.append([x_c, y_c])
        elif (type_ == 'x-axis-label'):
            x_labels.append(text)
            x_order_tracker.append(x_c)
            x_pos.append([x_c, y_c])
        else:
            continue

    reorder_y = np.asarray(y_order_tracker).argsort()
    y_labels = np.asarray(y_labels)[reorder_y]
    y_pos = np.asarray(y_pos)[reorder_y]
    y_labels = y_labels.tolist()
    y_labels.reverse()

    reorder = np.asarray(x_order_tracker).argsort()
    x_labels = np.asarray(x_labels)[reorder]
    x_labels = x_labels.tolist()
    x_pos = np.asarray(x_pos)[reorder]

    x_range = [x_labels[0], x_labels[-1]]
    y_range = [y_labels[0], y_labels[-1]]

    x_increment = parse_num(x_labels[1]) - parse_num(x_labels[0])
    y_increment = parse_num(y_labels[1]) - parse_num(y_labels[0])

    # print("Summary: The x-axis is bounded by ", x_range,
    #       "\nThe y-axis is bounded by", y_range,
    #       "\nThe x-axis increments by", x_increment,
    #       "\nThe y-axis increments by", y_increment)
    if full == False:
        return x_range, y_range, x_increment, y_increment
    else:
        return x_labels, y_labels, x_pos, y_pos


def calculate_aspect_helper(p1, p2):
    """Calculates the aspect ratio of two non-colinear points
    Takes in a list of two items and returns a value, aspect ratio"""
    assert (len(p1) == 2)
    assert (len(p1) == len(p2))
    y = p2[1] - p1[1]
    x = p2[0] - p1[0]
    return float(x / y)


def calculate_aspect(filename):
    text_roles = pd.read_csv(filename)

    y_axis_labels = dict()
    y_axis_labels['label'] = []
    y_axis_labels['position'] = []
    x_axis_labels = dict()
    x_axis_labels['label'] = []
    x_axis_labels['position'] = []

    x_order_tracker = []

    for i in text_roles.iterrows():
        data = i[1]
        if (data['type'] == 'y-axis-label'):
            y_axis_labels['label'].append(data['text'])
            y_axis_labels['position'].append([data['x'], data['y'], data['width'], data['height']])
        elif (data['type'] == 'x-axis-label'):
            x_axis_labels['label'].append(data['text'])
            x_axis_labels['position'].append([data['x'], data['y'], data['width'], data['height']])
            x_order_tracker.append(data['x'])

    y_axis = []
    for i in y_axis_labels.values():
        y_axis.append(i)
    # y_axis [ 0 for values, 1 for bounding boxes] [ index/length ] [0-3: x,y,width,height]

    reorder = np.asarray(x_order_tracker).argsort()
    x_axis_labels['label'] = np.asarray(x_axis_labels['label'])[reorder]
    x_axis_labels['position'] = np.asarray(x_axis_labels['position'])[reorder]
    x_axis = []
    for i in x_axis_labels.values():
        x_axis.append(i)
    # top left is the top right corner of rhte topmost y-axis label
    top_left = [y_axis[1][0][0] + y_axis[1][0][2], y_axis[1][0][1] + y_axis[1][0][3]]
    # bottom right is the topright corner of the right most
    bottom_right = [x_axis[1][-1][0] + x_axis[1][-1][2], x_axis[1][-1][1] + x_axis[1][-1][3]]

    ar = calculate_aspect_helper(top_left, bottom_right)
    return ar


# bank45
def calc_slopes(x, y, cull=False, scale_x=1, scale_y=1):
    dx = abs(np.diff(x)) * scale_x
    dy = np.diff(y) * scale_y
    s = dy / dx
    touse = None
    if cull:
        touse = abs(s) > 0 and np.isfinite(s)
    else:
        touse = np.isfinite(s)
    s = s[touse]
    dx = dx[touse]
    dy = dy[touse]
    Rx = max(x) - min(x)
    Rx *= scale_x
    Ry = max(y) - min(y)
    Ry *= scale_y
    return s, dx, dy, Rx, Ry


def bank_slopes_ms(x, y, cull=False, scale_x=1, scale_y=1):
    s, dx, dy, Rx, Ry = calc_slopes(x, y, scale_x=scale_x, scale_y=scale_y)
    xyrat = ms_helper(s, dx, dy, Rx, Ry)
    return xyrat


def ms_helper(s, dx, dy, Rx, Ry, cull=False):
    # print(s)
    # print("s for slopes? in line 435")
    # print("note to calculate angles")
    ret = np.median(abs(s)) * Rx / Ry
    return abs(ret)
