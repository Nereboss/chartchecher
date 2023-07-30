# Chrome Extension for Analyzing Line Charts

This tool uses Python 3.7.7. Tested on Win10 and Fedora 37.

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

# How to load the Chrome Extension

Navigate to Google Chrome, and go to `chrome://extensions/`
On the upper right corner, turn on developer mode. Then click on `Load unpacked` on the upper left corner. Select this root directory.
You have have to delete the ``__pycache__`` directory.

### How to use the system
For our demo (also presented in the use cases of the paper), go to the `chartchecker_sample_charts` directory of the codebase.
After you have loaded the sample images, right click the image to load our extension.
Line Chart Analyzer.
You can perform an Auto Analysis or Manual Analysis.

# Credits

https://github.com/vdsabev/image-downloader



https://github.com/GoogleChrome/chrome-extensions-samples/tree/master/api/downloads/download_links

# License

Please see LICENSE directory for information.

# For Developers

Short description of the folders/files that are relevant to extend the tool
```bash
├── app.py: the tools backend (needs to run for the tool to work)
├── bootstrap: the bootstrap files the tool uses
├── chartchecker_sample_charts: contains sample images together with their csv files that the tool currently needs for automatic analysis
├── lib: contains other libraries that are used
├── LICENSE: contains licenses of the used tools
│   ├── LICENSE_image-downloader.txt
│   └── LICENSE_reveye.txt
├── manifest.json: the manifest of the browser extension (needs to be updated to 3.0)
├── rev_autofill: contains all the files of the REV tool to extract and classify text data in charts
├── src
│   ├── analyze.js: main code of the manual mode
│   ├── Checkbox.js
│   ├── d3.v4.js: the D3 library, used to draw the charts
│   ├── defaults.js
│   ├── detectable_features.js: code of the view that shows a table of all misleading features our tool can detect
│   ├── driver.min.js
│   ├── event_handlers.js: contains all event handlers of the manual mode
│   ├── html2canvas.min.js: external tool used to covert the html to canvas for sharing
│   ├── html.js
│   ├── ImageActions.js
│   ├── jquery-3.5.1.min.js
│   ├── new_main.js: code of the main view
│   ├── options.js
│   ├── popup.js
│   ├── rightclicker.html: only calls rightclicker.js
│   ├── rightclicker.js: code of the right-click-menu
│   ├── send_images.js
│   ├── tutorial.js: used for the tutorials in the manual mode and main view
│   └── wpd.js: code of WebPlotDigitizer, external tool used for the manual mode
├── stylesheets: all css data
├── utils.py: contains the main backend utilities including detection of all misleading features
└── views: contains the different html views

```