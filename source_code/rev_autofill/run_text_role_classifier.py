

from docopt import docopt
from joblib import Parallel, delayed
import multiprocessing
import pandas as pd

import pandas as pd


import sys
sys.path.append('./rev_autofill/')


import rev.text
from rev import Chart, chart_dataset


def __classify(clf, chart, with_post=False, draw_debug=False, pad=0, save=False):
    print(clf.classify(chart, with_post, draw_debug, pad, save))


def auto_fill_type(fn):
    draw_debug = True
    image_name = fn

    from_bbs = int(1)  # --from_bbs FROM  1: from predicted1-bbs.csv  [default: 1]
    with_post = False
    pad = int(0)  # default

    chart = Chart(image_name, text_from=from_bbs)
    text_clf = rev.text.TextClassifier('default')
    pred_types = text_clf.classify(chart, with_post, draw_debug, pad, save=True)
    return pred_types


# !/usr/local/bin/python3.7

"""
Script to predict type of text tole and update *-texts.csv file.

Usage:
    run_text_box_classifier.py train FEATURES_CSV OUTPUT_MODEL_PLK
    run_text_box_classifier.py single INPUT_PNG [--from_bbs=FROM] [--with_post]  [--pad=PAD]
    run_text_box_classifier.py multiple INPUT_LIST_TXT [--from_bbs=FROM] [--with_post]  [--pad=PAD]
    run_text_box_classifier.py (-h | --help)
    run_text_box_classifier.py --version

Options:
    --from_bbs FROM  1: from predicted1-bbs.csv  [default: 1]
                     2: from predicted2-bbs.csv
    --with_post      Boolean, run post processing?
    --pad PAD        Add padding to boxes [default: 0]
    -h --help        Show this screen.
    --version        Show version.

Examples:
  # train text role classifier
  python scripts/run_text_role_classifier.py train data/features_all.csv out.plk

  # run text role classifier in a chart to wilkinson_table
  python scripts/run_text_role_classifier.py single examples/vega1.png

  # run text role classifier in multiple charts
  python scripts/run_text_role_classifier.py multiple data/academic.txt
"""

"""it is possible that the shebang is
#!/usr/bin/python3.7
"""