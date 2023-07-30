# Chrome Extension for Analyzing Line Charts

This tool uses Python 3.7.7. Tested on Win10.

Navigate to the main app directory and install requirements with:

```
python3.7 -m pip install -r requirements.txt
```

This tool also uses:
REV([paper](http://idl.cs.washington.edu/papers/reverse-engineering-vis/)), a text analysis pipeline which detects text elements in a chart, classifies their role (e.g., chart title, x-axis label, y-axis title, etc.), and recovers the text content using optical character recognition. It also uses a Convolutional Neural Network for mark type classification. Using the identified text elements and graphical mark type, it infers the encoding specification of an input chart image.

Start
```
python3.7 app.py
```

#How to load the Chrome Extension

Navigate to Google Chrome, and go to `chrome://extensions/`
On the upper right corner, turn on developer mode. Then click on `Load unpacked` on the upper left corner. Select this root directory.
You have have to delete the ``__pycache__`` directory.

###How to use the system
For our demo (also presented in the use cases of the paper), go to the `chartchecker_sample_charts` directory of the codebase.
After you have loaded the sample images, right click the image to load our extension.
Line Chart Analyzer.
You can perform an Auto Analysis or Manual Analysis.

# Credits

https://github.com/vdsabev/image-downloader



https://github.com/GoogleChrome/chrome-extensions-samples/tree/master/api/downloads/download_links

# License

Please see LICENSE directory for information.
