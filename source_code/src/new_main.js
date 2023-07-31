const portNumber = 5000;

const SCALE = 1.5;
const CHARTSIZE = 175*SCALE;  
const misleadingFeaturesTexts = {
    // some information about the misleading features changes dynamically with the chart
    // the places where such information is inserted are marked with INSERT_...
    // the places where the axis titles are inserted for misleading features that are axis-specific are marked with TITLE
    'missingLabels': ['Missing Labels', 
                'The chart is missing the following labels: INSERT_ALL. This can be misleading as it may cause the chart to be taken out of context or make the shown data harder to understand.'],
    'multipleAxis': ['Multiple Axis', 
                'The chart has multiple axis. This can be misleading, as it might not be clear which data series belongs to which axis. If the axis have different scales, it can also distort comparisons between data series and result in misleading patterns.'],
    'misleadingAR': ['Misleading Aspect Ratio', 
                'The aspect ratio of the chart is misleading. This can make trends appear more extreme than they actually are.'],
    'truncatedY': ['Truncated Y-Axis', 
                `The Y-Axis (Y-TITLE) is truncated. The bottom most value is INSERT_TRUNC instead of a more traditional 0. This can be misleading as it shows the differences between the displayed values as larger than they actually are.`],
    'invertedY': ['Inverted Y-Axis', 
                `The Y-Axis (Y-TITLE) is inverted. This can be misleading as it makes upwards trends appear like they are downwards trends and vice versa.`],
    'nonLinearX': ['Non-Linear X-Axis', 
                'The X-Axis (X-TITLE) does not follow a linear scale. This can make it difficult to judge trends as the same distance on the axis does not always represent the same difference in the data.'],
    'nonLinearY': ['Non-Linear Y-Axis', 
                'The Y-Axis (Y-TITLE) does not follow a linear scale. This can make it difficult to judge trends as the same distance on the axis does not always represent the same difference in the data.'],
    'inconsistentTicksX': ['Inconsistent Ticks on X-Axis', 
                'The tick markers along the X-Axis (X-TITLE) are place in inconsistent intervals. This can make it harder to judge the values on the graph.'],
    'inconsistentTicksY': ['Inconsistent Ticks on Y-Axis', 
                'The tick markers along the Y-Axis (Y-TITLE) are place in inconsistent intervals. This can make it harder to judge the values on the graph']
}

// -----------------------------global variables---------------------------------

let imageURL_auto; 
let imageWidth;
let imageHeight;

//data needed to draw the chart axis
var chartWidth;
var chartHeight;
var chartAR;            //aspect ratio of the chart in the original image
var chartTitle;         //title of the chart (if there is one)
var xAxisData;        //2d array containing all x-axis in ascending order [x-axis, x1-axis, ...] together with their title and tick labels
var yAxisData;        //2d array containing all y-axis in ascending order [y-axis, y1-axis, ...] together with their title and tick labels

//data needed to draw the graphs
var chartGraphData;
var detectedFeatures = {        //object represents all detectable misleading features; default is false but elements are arrays so that features can store necessary data for drawing of the charts
    "truncatedY": [false],
    "invertedY": [false],
    "misleadingAR": [false],                //can store an improved aspect ratio as 2nd entry
    "missingLabels": [false],               //stores all missing lavels after the first entry
    "multipleAxis": [false],                //stores the axis names of detected axis if there are multiple
    "nonLinearX": [false],                  //can store multiple booleans if there are multiple x-axis
    "nonLinearY": [false],                  //can store multiple booleans if there are multiple y-axis
    "inconsistentTicksX": [false],
    "inconsistentTicksY": [false]
}



//-----------------------------event listeners for buttons---------------------------------

const shareButton = document.getElementById('share-button')
shareButton.addEventListener('click', function() {shareButtonClicked()})
const helpButton = document.getElementById('help-button')
helpButton.addEventListener('click', function() {helpButtonClicked()})
const toggleOriginalOrControlChart = document.getElementById('toggle-button')
toggleOriginalOrControlChart.addEventListener('click', function() {toggleButtonClicked()})
const showAllDetectableFeaturesButton = document.getElementById('show-all-button')
showAllDetectableFeaturesButton.addEventListener('click', function() {showAllButtonClicked()})
const shareWholeUIButton = document.getElementById('wholeUIBTN')
shareWholeUIButton.addEventListener('click', function() {shareButtonClicked('#share-content')})
const shareChartOnlyButton = document.getElementById('chartOnlyBTN')
shareChartOnlyButton.addEventListener('click', function() {shareButtonClicked('#share-chart')})
const openManualModeButton = document.getElementById('manualModeBTN')
openManualModeButton.addEventListener('click', function() {window.location.href = '/views/analyze.html'})


// -----------------------------functions for event listeners---------------------------------

function shareButtonClicked(elementToDraw='#share-content') {

    html2canvas(document.querySelector(elementToDraw)).then(canvas => {
        var img = document.getElementById('share-image')
        var imageData = canvas.toDataURL("image/png")
        img.src = imageData
    });
}

function helpButtonClicked() {
    //start the tutorial, similar to the manual mode
    setTimeout(() => {
      //timeout begins
      tutorialMain();
    }, 200);
}

function toggleButtonClicked() {
    var originalImage = document.getElementById("original-image");
    var controlChart = document.getElementById("controlSVG");
    if (originalImage.style.display === "none") {
        originalImage.style.display = "block";
        controlChart.style.display = "none";
    } else {
        originalImage.style.display = "none";
        controlChart.style.display = "block";
    }
}

function showAllButtonClicked() {
    //redirect to the view that shows all detectable features
    window.location.href = '/views/detectable_features.html';
}


// -----------------------------communication with backend---------------------------------

chrome.storage.sync.get(['key'], function (result) {
    //set the image
    imageURL_auto = result.key;  //https://localhost/***/chart.png
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

    //shows the modal asking the user to confirm if the data was extracted correctly
    $(document).ready(function(){
        $("#controlChartModal").modal('show');
    });

    //process backend data into global variables
    processBackendData(backendData);
    //draw the original image into the UI
    drawOriginalImage();
    //draw the control chart into the UI
    drawChart(d3.select('#original-chart'), true, true)
    //draw the improved chart into the UI
    drawChart(d3.select('#recommended-chart'));
    //draw the misleading features into the UI
    drawMisleadFeaturesList();

    //draw the control chart modal
    drawOriginalImage('original-image-modal')
    drawChart(d3.select('#control-chart-modal'), true)
}

function processBackendData(backendData) {

    xAxisData = []
    yAxisData = []
    let axisData = backendData['axisData']
    for (axis in axisData) {
        if (/x\d*-axis/.test(axis)) {
            xAxisData.push(axis)
        }
        else if (/y\d*-axis/.test(axis)) {
            yAxisData.push(axis)
        }
    }
    xAxisData.sort()
    yAxisData.sort()
    xAxisData = xAxisData.map(axis => axisData[axis])
    yAxisData = yAxisData.map(axis => axisData[axis])

    chartAR = backendData['aspectRatio'];
    chartTitle = backendData['chartTitle'];
    //set height and width of the drawn charts based on the aspect ratio
    if (chartAR > 10 / 3) { //fix on x size
        chartWidth = CHARTSIZE;
        chartHeight = parseInt(chartWidth / chartAR);
    } else { //fix on y size
        chartHeight = CHARTSIZE;
        chartWidth = parseInt(chartAR * chartHeight);
    }
    chartGraphData = JSON.stringify(backendData['graphData']);
    chartGraphData = JSON.parse(chartGraphData);
    detectedFeatures = backendData['detectedFeatures'];
}

/**
 * function draws the original image into the UI
 * @param {html_element} elementToDraw the element in which the image will be drawn; default is 'original-image' 
 */
function drawOriginalImage(elementToDraw='original-image') {
    const img = document.getElementById(elementToDraw);
    toDataURL(imageURL_auto,
        function (dataUrl) {
            img.src = dataUrl;
            //set max width depending on the width and height of the image to not have it too wide or too tall
            let scaleFactor = 400 / imageHeight;
            let newWidth = imageWidth * scaleFactor;
            if (newWidth > 730) {
                img.style.maxWidth = '730px';
            } else {
                img.style.maxWidth = newWidth.toString() + 'px';
            }
        }
    );
}

/**
 * function that we use to draw all the chart images in the UI
 * if all detected tactics are false, it will draw the chart from the input-image (control chart)
 * @param {html_element} parentDiv the div in which the chart will be drawn
 * @param {boolean} controlChart whether or not to draw the control chart
 * @param {boolean} hidden whether or not the chart starts as hidden (for the chart that is placed instead of the original image)
 */
function drawChart(parentDiv, controlChart = false, hidden = false) {

    //-----------------set aspect ratio-----------------

    //the dimension of the drawn chart (in pixels)
    let xAxisSize = chartWidth;
    let yAxisSize = chartHeight;

    // when the original aspect ratio is misleading we need to draw the chart using the ideal aspect ratio
    if (!controlChart && detectedFeatures.misleadingAR[0]) {
        if(detectedFeatures.misleadingAR[1] > chartWidth / chartHeight) {
            yAxisSize = xAxisSize / detectedFeatures.misleadingAR[1];       //when the ideal AR is larger than the original AR we need to make the y-axis smaller
        }
        else {
            xAxisSize = yAxisSize * detectedFeatures.misleadingAR[1];       //when the ideal AR is smaller than the original AR we need to make the x-axis smaller
        }
    }

    //-----------------set x-axis scale-----------------

    let xScale = [];
    let drawnTickValuesX = [];

    for (let i = 0; i < xAxisData.length; i++) {
        //functions to get the domain and range out of the xTicks object (needed to correctly represent the ticks of the original image)
        let x0AxisTicks = xAxisData[i]['ticks'];
        let xOffset = x0AxisTicks[0].pos;
        let xFactor = (x0AxisTicks[x0AxisTicks.length-1].pos - xOffset) / xAxisSize;
        let xTicksDomain = x0AxisTicks.map(function (d) {return d.value;});
        drawnTickValuesX.push(xTicksDomain);     //needs to be saved to draw the ticks later because xTicksDomain can be overwritten
        let xTicksRange = x0AxisTicks.map(function (d) {return (d.pos - xOffset) / xFactor;});

        if (!controlChart && detectedFeatures.nonLinearX[0]) {       //when the x-axis is non-linear we need to use the first and last value to create a linear scale
            xTicksDomain = [x0AxisTicks[0].value, x0AxisTicks[x0AxisTicks.length-1].value];
            xTicksRange = [0, xAxisSize];
        }
        
        // using d3 to construct a linear scale for the x- and y-axis 
        // (domain is the range of values in the data, range is the range of values in the drawn chart)
        xScale.push(d3.scaleLinear()  
            .domain(xTicksDomain)
            .range(xTicksRange));
    }

    //-----------------set y-axis scales-----------------

    let yScale = [];
    let drawnTickValuesY = [];

    for (let i = 0; i < yAxisData.length; i++) {
        //functions to get the domain and range out of the yTicks object (needed to correctly represent the ticks of the original image)
        let y0AxisTicks = yAxisData[i]['ticks'];
        let yOffset = y0AxisTicks[0].pos;
        let yFactor = (y0AxisTicks[y0AxisTicks.length-1].pos - yOffset) / yAxisSize;
        let yTicksDomain = y0AxisTicks.map(function (d) {return d.value;});
        drawnTickValuesY.push(yTicksDomain);     //needs to be saved to draw the ticks later in case yTicksDomain is overwritten
        let yTicksRange = y0AxisTicks.map(function (d) {return (d.pos - yOffset) / yFactor;});

        //when the y-axis is truncated we need to "shift" the existing scale to start at zero
        if(!controlChart && detectedFeatures.truncatedY[i]) {
            let maxValue = yTicksDomain[yTicksDomain.length-1];
            let compressFactor = 1-(yTicksDomain[0]/maxValue);
            yTicksDomain = yTicksDomain.map(function (d) {return (d-maxValue)/compressFactor + maxValue;});
        }

        //when the y-axis is inverted we need to reverse the order of the ticks
        if(!controlChart && detectedFeatures.invertedY[i]) {
            yTicksDomain = yTicksDomain.reverse();
        }

        //when the y-axis is non-linear we need to use the first and last value to create a linear scale
        if (!controlChart && detectedFeatures.nonLinearY[i]) {
            yTicksDomain = [yTicksDomain[0].value, yTicksDomain[yTicksDomain.length-1].value];
            yTicksRange = [yAxisSize, 0];
        }

        yScale.push(d3.scaleLinear()
                .domain(yTicksDomain)
                .range(yTicksRange.reverse()));    //reverse as the largest value needs to be first because the chart will be drawn "top to bottom"
    }
    
    //-----------------prepare line dataset-----------------

    let line = d3.line()
        .x(function (d) {
            return xScale[0](d.x);
        }) // set the x values for the line generator
        .y(function (d) {
            return yScale[0](d.y);
        });

    let dataset = chartGraphData.map(function (d) {
        return {
            'x': parseFloat(d.x),
            'y': parseFloat(d.y)
        };
    });

    let elementID;
    if(controlChart) {
        elementID = 'controlSVG';
    } else {
        elementID = 'recommendedSVG';
    }
    let display;
    if(hidden) {
        display = 'display: none';
    }
    else {
        display = 'display: block';
    }

    const X_AXIS_DISTANCE = 50;             //the distance between the x-axis if multiple were found
    const X_AXIS_EXPAND = X_AXIS_DISTANCE*(xAxisData.length-1);
    const Y_AXIS_DISTANCE = 70;             //the distance between the y-axis if multiple were found
    const Y_AXIS_EXPAND = Y_AXIS_DISTANCE*(yAxisData.length-1);
    const EXPAND_WIDTH = 80 + Y_AXIS_EXPAND;
    const EXPAND_HEIGHT = 50 + 10 + 35 + X_AXIS_EXPAND;
    let svg = parentDiv
        .append('svg')
        .attr('class', 'mx-auto')
        .attr('width', xAxisSize + EXPAND_WIDTH)
        .attr('height', yAxisSize + EXPAND_HEIGHT)
        .attr('id', elementID)
        .attr('style', display)
        .append('g')
        .attr('align', 'center')
        .attr('transform', 'translate(20,30)');

    
    //-----------------draw chart title-----------------

        //chart title
        let titleColor = '#000000', title = chartTitle;
        if (!controlChart && detectedFeatures.missingLabels[0] && title == ' ') {
            title = 'missing chart title';
            titleColor = '#CC0000'
        }
        svg.append('text')
        .attr('x', (xAxisSize + EXPAND_WIDTH)/2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('fill', titleColor)
        .style("font-size", "20px")
        .text(title);

    const SHIFT_DOWN = 11;
    const SHIFT_RIGHT = 40;

    //-----------------set axis ticks-----------------

    let bottomAxis = [];
    for (let i = 0; i < xAxisData.length; i++) {
        // when the x-axis is inconsistent or truncated, we let d3 decide which ticks to draw. Otherwise we draw the ticks from the oginal image
        if(!controlChart && detectedFeatures.inconsistentTicksX[i]) {
            bottomAxis.push(d3.axisBottom(xScale[i]).ticks(xAxisData[i]['ticks'].length));
        } else {
            bottomAxis.push(d3.axisBottom(xScale[i]).tickValues(drawnTickValuesX[i]).tickFormat(x => `${x}`)) // weird tick format is necessary to not round the tick and keep the original from the image
        }
    }

    //loop over all y-axes to get correct ticks for each
    let leftAxis = [];
    for (let i = 0; i < yAxisData.length; i++) {
        //when the y-axis is inconsistent or truncated, we let d3 decide which ticks to draw. Otherwise we draw the ticks from the oginal image
        if(!controlChart && (detectedFeatures.inconsistentTicksY[i] || detectedFeatures.truncatedY[i])) {
            leftAxis.push(d3.axisLeft(yScale[i]).ticks(yAxisData[i]['ticks'].length));
        } else {                                        
            leftAxis.push(d3.axisLeft(yScale[i]).tickValues(drawnTickValuesY[i]).tickFormat(x => `${x}`)) // weird tick format is necessary to keep the exact unrounded number from original from the image
        }
    }

    //-----------------draw the axis-----------------

    // x-axis (in a loop as a chart can have multiple x-axes)
    for (let i = 0; i < xAxisData.length; i++) {

        //draw the axis
        svg.append('g')
            .style('font', '11px Segoe UI')
            .attr('transform', 'translate(' + (SHIFT_RIGHT+Y_AXIS_EXPAND) + ',' + (yAxisSize + SHIFT_DOWN + (i*X_AXIS_DISTANCE)) + ')')
            .call(bottomAxis[i]);

        //draw the axis title
        let xTitleColor = '#000000', xTitle = xAxisData[i]['title'];
        if (!controlChart && detectedFeatures.missingLabels[0] && xTitle == ' ') {
            xTitle = 'missing x axis title';
            xTitleColor = '#CC0000'
        }
        svg.append('text')
        .attr('x', (xAxisSize + EXPAND_WIDTH+Y_AXIS_EXPAND)/2)
        .attr('y', (yAxisSize + 50 + (i*X_AXIS_DISTANCE)))
        .attr('text-anchor', 'middle')
        .attr('fill', xTitleColor)
        .text(xTitle);

    }
    // y-axis (in a loop as a chart can have multiple y-axis)
    for (let i = 0; i < yAxisData.length; i++) {

        //draw the axis
        svg.append('g')
            .style('font', '11px Segoe UI')
            .attr('transform', 'translate(' + (SHIFT_RIGHT+i*Y_AXIS_DISTANCE) + ',' + SHIFT_DOWN + ')')
            .call(leftAxis[i]);

        //draw the axis title
        let yTitleColor = '#000000', yTitle = yAxisData[i]['title'];
        if (!controlChart && detectedFeatures.missingLabels[0] && yTitle == ' ') {
            yTitle = 'missing y axis title';
            yTitleColor = '#CC0000'
        }
        svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + i*Y_AXIS_DISTANCE +',' + (yAxisSize/2 + 10) + ')rotate(-90)')
        .attr('fill', yTitleColor)
        .text(yTitle);
    }

    //-----------------draw the graph-----------------

    svg.append('path')
        .datum(dataset) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .style('stroke', '#007bff')
        .attr('transform', 'translate(' + (SHIFT_RIGHT+Y_AXIS_EXPAND) + ',' + SHIFT_DOWN + ')')
        .attr('d', line); // 11. Calls the line generator

}

/**
 * function draws the detected misleading features into the list in the UI
 */
function drawMisleadFeaturesList() {
    inserter = (feature, axisNr=0) => {
        res = misleadingFeaturesTexts[feature][1]
        if (res.includes('INSERT_ALL')) {
            //replace INSERT_ALL with a list of insert-values and split off the last element with an 'and' instead of a comma
            res = res.replace('INSERT_ALL', detectedFeatures[feature].slice(1, detectedFeatures[feature].length - 1).join(', ') + ' and ' + detectedFeatures[feature][detectedFeatures[feature].length - 1]);
        }
        if (res.includes('INSERT_TRUNC')) {
            //insert the bottom most y-axis label of the correct axis
            res = res.replace('INSERT_TRUNC', yAxisData[axisNr]['ticks'][0].value);
        }

        //replace axis titles
        if (res.includes('X-TITLE')) {               //tested if its an x-axis feature
            let axisTitle = xAxisData[axisNr]['title'];
            let replacement = axisTitle == ' ' ? 'no title' : 'titled "' + axisTitle + '"';
            res = res.replace('X-TITLE', replacement);
        } else if (res.includes('Y-TITLE')) {        //tested if its an y-axis feature
            let axisTitle = yAxisData[axisNr]['title'];
            let replacement = axisTitle == ' ' ? 'no title' : 'titled "' + axisTitle + '"';
            res = res.replace('Y-TITLE', replacement);
        }
        //remove any remaining INSERT strings (necessary for enumeration of inserts without set length)
        res = res.replace(/INSERT_\p{L}+/i, '');
        res = res.replace(/INSERT_ALL/i, '');
        return res;
    }

    let misleadingFeaturesDiv = d3.select('#misleading-features-list-group')
    //for every feature we check if the backend detected it and if so we add it to the list
    for (feature in misleadingFeaturesTexts) {
        //first handle features that are not axis specific (only axis-specifc features end with X or Y)
        if (!/.*[XY]$/.test(feature)) {
            if (detectedFeatures[feature][0]) {
                appendMisleadingFeature(misleadingFeaturesDiv, feature, misleadingFeaturesTexts[feature][0], inserter(feature)
            )}
        } else {          //handle axis-specific features and loop through all axes
            for (currentAxis in detectedFeatures[feature]) {
                if (detectedFeatures[feature][currentAxis]) {
                    appendMisleadingFeature(misleadingFeaturesDiv, feature+currentAxis, misleadingFeaturesTexts[feature][0], inserter(feature, currentAxis))
                }
            }
        }
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
    //add the feature as a list item using the following HTML code
    parentDiv.append('li')
                .attr('class', 'list-group-item')
                .html(`<div class="row align-items-center">
                            <div class="col-11">
                                <div style="font-weight: bold;">${featureName}</div>
                                <p>${featureDescription}</p>
                            </div>
                            <div class="col-1">
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

    //if the id ends with a number, use that number as the axis number, otherwise use 0 (also used for all misleading features that are not axis specific)
    let axisNr = id.match(/\d+$/);
    axisNr = axisNr == null ? 0 : parseInt(axisNr);
    //remove the number at the end from the id (if there was one)
    id = id.replace(/\d+$/, '');
    
    //toggle the variable in the detectedFeatures object
    detectedFeatures[id][axisNr] = !detectedFeatures[id][axisNr];
    let oldChartSVG = document.getElementById('recommendedSVG');
    if (oldChartSVG != null) {
        oldChartSVG.remove();          //remove the old recommended chart so we can redraw it
    }
    //redraw the recommended chart
    let parentDiv = d3.select('#recommended-chart')
    drawChart(parentDiv)

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
        imageHeight = this.naturalHeight;
        canvas.width = this.naturalWidth;
        imageWidth = this.naturalWidth;
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