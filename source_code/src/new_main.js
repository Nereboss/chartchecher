const portNumber = 5000;

const SCALE = 1.5;
const CHARTSIZE = 175*SCALE;  
const margin = {top: 50, right: 10, bottom: 20, left: 150};

const misleadingFeaturesTexts = {
    // some information about the misleading features changes dynamically with the chart
    // the places where such information is inserted are marked with INSERT1, INSERT2, etc.
    // the places where all missing labels are inserted are marked with INSERTALL
    'truncatedY': ['Truncated Y-Axis', 
                'The Y-Axis is truncated. The bottom most value is INSERT1 instead of a more traditional 0. This can be misleading as it displays the differences between those values as larger than they actually are.'],
    'invertedY': ['Inverted Y-Axis', 
                'The Y-Axis is inverted.'],
    'misleadingAR': ['Misleading Aspect Ratio', 
                'The aspect ratio of the chart is misleading.'],
    'missingLabels': ['Missing Labels', 
                'The chart is missing the following labels: INSERTALL. This can be misleading as it makes it harder to understand the context of the chart.'],
    'multipleAxis': ['Multiple Axis', 
                'The chart has multiple axis.'],
    'nonLinearX': ['Non-Linear X-Axis', 
                'The X-Axis does not follow a linear scale.'],
    'nonLinearY': ['Non-Linear Y-Axis', 
                'The Y-Axis does not follow a linear scale.'],
    'inconsistentTicksX': ['Inconsistent Ticks on X-Axis', 
                'The X-Axis has inconsistent ticks.'],
    'inconsistentTicksY': ['Inconsistent Ticks on Y-Axis', 
                'The Y-Axis has inconsistent ticks.']
    //TODO: improve descriptions 
}

// -----------------------------global variables---------------------------------

let imageURL_auto; 

//data needed to draw the chart axis
var chartWidth;
var chartHeight;
var chartAR;            //aspect ratio of the chart in the original image
var chartXTicks;        //array of tick marks along the x axis first and last element are the min and max values
var chartYTicks;        //array of tick marks along the y axis first and last element are the min and max values

//data needed to draw the graphs
var chartGraphData;
var detectedFeatures = {        //object represents all detectable misleading features; default is false but elements are arrays so that features can store necessary data for drawing of the charts
    "truncatedY": [false],
    "invertedY": [false],
    "misleadingAR": [false],                //can store an improved aspect ratio as 2nd entry
    "missingLabels": [false],               //stores all missing lavels after the first entry
    "multipleAxis": [false],                //stores the axis names of detected axis if there are multiple
    "nonLinearX": [false],                  //can stor multiple booleans if there are multiple x-axis
    "nonLinearY": [false],                  //can stor multiple booleans if there are multiple y-axis
    "inconsistentTicksX": [false],
    "inconsistentTicksY": [false]
}



//-----------------------------event listeners---------------------------------

const shareButton = document.getElementById('share-button')
shareButton.addEventListener('click', function() {shareButtonClicked()})
const helpButton = document.getElementById('help-button')
helpButton.addEventListener('click', function() {helpButtonClicked()})
const toggleOriginalOrControlChart = document.getElementById('toggle-button')
toggleOriginalOrControlChart.addEventListener('click', function() {toggleButtonClicked()})
const showAllDetectableFeaturesButton = document.getElementById('show-all-button')
showAllDetectableFeaturesButton.addEventListener('click', function() {showAllButtonClicked()})


// -----------------------------functions for event listeners---------------------------------

function shareButtonClicked() {
    console.log('share button clicked')
}

function helpButtonClicked() {
    console.log('help button clicked')
}

function toggleButtonClicked() {
    console.log('toggle button clicked')
    var image = document.getElementById("original-chart");
    if (image.style.display === "none") {
        image.style.display = "block";
    } else {
        image.style.display = "none";
    }
}

function showAllButtonClicked() {
    console.log('show all button clicked')
}


// -----------------------------communication with backend---------------------------------

chrome.storage.sync.get(['key'], function (result) {
    //set the image
    imageURL_auto = result.key;  //https://localhost/***/chart.png
    // console.log(imageURL_auto, result.key);
    const filename = imageURL_auto.split('/').reverse()[0];  //chart.png
    const base_filename = filename.split('.')[0]; //chart

    const endpoint = 'http://localhost:'        //endpoint is the AnalyzeAuto class in app.py
        + portNumber.toString()
        + '/api/analyzeauto';               //refers to the AnalyzeAuto class in app.py

    fetch(endpoint, {
        method: 'POST',                 //calls the post method
        headers: {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        body: JSON.stringify({
                'base_filename': base_filename
            })
    })
    .catch(function (error) {
        console.log('Error in Freq POST: ', error);
    })
    .then(function (response) {
        if (response.ok)
            return response.json();
        throw new Error('Network response was not ok.');
    })
    .then(function (arr) {drawUI(arr)})   //call function to draw the UI here
    .catch(function (error) {
        console.log('stl: ', error);
    });
});


// -----------------------------functions to draw the main sections---------------------------------

/**
 * main function that draws the UI
 * @param {*} backendData the data returned from the backend
 */
function drawUI(backendData) {

    //process backend data into global variables
    processBackendData(backendData);
    //draw the original image into the UI
    drawOriginalImage();
    //draw the control chart into the UI
    //draw the improved chart into the UI
    //draw the misleading features into the UI
    drawMisleadFeaturesList();
}

function processBackendData(backendData) {

    chartXTicks = backendData['xTicks'];
    chartYTicks = backendData['yTicks'];
    chartAR = backendData['aspectRatio'];
    //set height and width of the drawn charts based on the aspect ratio
    if (chartAR > 10 / 3) { //fix on x size
        chartWidth = CHARTSIZE;
        chartHeight = parseInt(chartWidth / chartAR);
    } else { //fix on y size
        chartHeight = CHARTSIZE;
        chartWidth = parseInt(chartAR * chartHeight);
    }
    chartGraphData = JSON.stringify(backendData['data']);
    chartGraphData = JSON.parse(chartGraphData);
    chartGraphData.splice(chartGraphData.length - 1); //remove last element
    detectedFeatures = backendData['detectedFeatures'];
}

/**
 * function draws the original image into the UI
 */
function drawOriginalImage() {
    const img = document.getElementById('original-chart');
    toDataURL(imageURL_auto,
        function (dataUrl) {
            img.src = dataUrl;
        }
    );
}

/**
 * function draws the detected misleading features into the list in the UI
 */
function drawMisleadFeaturesList() {
    inserter = (feature) => {
        res = misleadingFeaturesTexts[feature][1]
        if (res.includes('INSERTALL')) {
            //replace INSERTALL with a list of insert-values and split off the last element with an 'and' instead of a comma
            res = res.replace('INSERTALL', detectedFeatures[feature].slice(1, detectedFeatures[feature].length - 1).join(', ') + ' and ' + detectedFeatures[feature][detectedFeatures[feature].length - 1]);
        } else {
            for (let i = 1; i < detectedFeatures[feature].length; i++) {
                console.log('INSERT'+i)
                res = res.replace('INSERT'+i, detectedFeatures[feature][i]);
            }
        }
        //remove any remaining INSERT strings (necessary for enumeration of inserts without set length)
        res = res.replace(/INSERT\d+/i, '');
        res = res.replace(/INSERTALL/i, '');
        return res;
    }

    let misleadingFeaturesDiv = d3.select('#misleading-features-list-group')
    //for every feature we check if the backend detected it and if so we add it to the list
    for (feature in misleadingFeaturesTexts) {
        if (detectedFeatures[feature][0]) {
            appendMisleadingFeature(misleadingFeaturesDiv, feature, misleadingFeaturesTexts[feature][0], inserter(feature)
        )}
    }
}


//-----------------------------functions to draw smaller elements---------------------------------

/**
 * function draws a misleading feature in the misleading features list
 * @param {HTMLElement} parentDiv The div to append the misleading feature to
 * @param {string} featureID the ID of the feature in the HTML code
 * @param {string} featureName the name of the feature that will be displayed
 * @param {string} featureDescription the description of the feature that will be displayed
 */
function appendMisleadingFeature(parentDiv, featureID, featureName, featureDescription) {
    //TODO can add a style with a max width here based on the images so a large description doesnt stretch the UI too much
    //add the feature as a list item using the following HTML code
    parentDiv.append('li')
                .attr('class', 'list-group-item')
                .html(`<div class="row align-items-center">
                            <div class="col-9">
                                <div style="font-weight: bold;">${featureName}</div>
                                ${featureDescription}
                            </div>
                            <div class="col-3">
                                <div class="d-flex justify-content-end">
                                    <button type="button" class="btn btn-primary" id="${featureID}">Hide</button>
                                </div>
                            </div>
                        </div>`)
    const button = document.getElementById(featureID)
    button.addEventListener('click', function() {misleadingFeatureButtonClicked(featureID)})
}

/**
 * function toggles the misleading feature in the recommended chart when the button is clicked
 * @param {HTMLElement} id the ID of the button that was clicked
 */
function misleadingFeatureButtonClicked(id) {
    const button = d3.select('#'+id)
    if (button.text() == 'Show') {
        button.text('Hide')
        button.attr('class', 'btn btn-primary')
    } else if (button.text() == 'Hide') {
        button.text('Show')
        button.attr('class', 'btn btn-outline-primary')
    } else {
        console.log('Error: button text is not Show or Hide')
    }
    console.log(`${id} button clicked; toggle the feature here`) //TODO toggle the feature here
}

//-----------------------------helper functions---------------------------------

/**
 * function converts an image URL to a data URL (also converts it to base64)
 * @param {*} src 
 * @param {*} callback 
 * @param {*} outputFormat 
 */
function toDataURL(src, callback, outputFormat) {
    let image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function () {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
    };
    image.src = src;
    if (image.complete || image.complete === undefined) {
        image.src = 'data:image/gif;base64, R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        image.src = src;
    }
}