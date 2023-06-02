let Gscale_auto; //scaling the main image
let imageURL_auto; // = "file:///D:/Daten/Bachelorarbeit/bachelor_thesis/source_code/sample_charts/sunspots_smooth.png";
// comment this in to always use the sunspots sample chart

//thumbnail sizes
// scaled up to fit our new UI but it breaks the old one
const SCALE = 1.5;
const THUMBNAIL_WIDTH = 175*SCALE;  
const THUMBNAIL_HEIGHT = 175*SCALE;
const portNumber = 5000;

//make the data needed to draw the chart global variables to be able to easily redraw the charts on an update
var chartWidth;
var chartHeight;
var chartXTicks;        //array of tick marks along the x axis first and last element are the min and max values
var chartYTicks;        //array of tick marks along the y axis first and last element are the min and max values
var chartGraphData;
var detectedFeatures = {        //object represents all detectable misleading features; default is false but elements are arrays so that features can store necessary data for drawing of the charts
    "truncatedY": [false],
    "invertedY": [false],
    "misleadingAR": [false],          //we need to store the ideal aspect ratio to draw the chart correctly (when this is zero, the aspect ratio is not misleading)
    "missingLabels": [false],
    "multipleAxis": [false],
    "nonLinearAxis": [false]
}

//function converts to base64
//dupplicated code frag
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

// comment this in to only use the sunspots sample chart 
// TODO: remove
// chrome.storage.sync.set({key: imageURL_auto}, function () {});

chrome.storage.sync.get(['key'], function (result) {
    //set the image
    const img = document.getElementById('mainChart');
    imageURL_auto = result.key;
    toDataURL(imageURL_auto,
        function (dataUrl) {
            img.src = dataUrl;
        }
    );

});


chrome.storage.sync.get(['key'], function (result) {
    //set the image
    imageURL_auto = result.key;
    console.log(imageURL_auto, result.key);
    const f = imageURL_auto; //https://localhost/***/chart.png
    const filename = f.split('/').reverse()[0];  //chart.png
    const base_filename = filename.split('.')[0]; //chart


    const endpoint = 'http://localhost:'        //endpoint is the AnalyzeAuto class in app.py
        + portNumber.toString()
        + '/api/analyzeauto';               //refers to the AnalyzeAuto class in app.py

    fetch(endpoint,
        {
            method: 'POST',                 //calls the post method
            headers:
                {
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            body: JSON.stringify(
                {
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
        .then(function (arr) {drawModalUI(arr);})

        .catch(function (error) {
            console.log('stl: ', error);
        });

});
const infoBoxGlobal = '<g width="30px" height="30px" class="infoBoxSVG" fill="#000000">' +
    ' <path d="m80 15c-35.88 0-65 29.12-65 65s29.12 65 65 65 65-29.12 65-65-29.12-65-65-65zm0 10c30.36 0 55 24.64 55 55s-24.64 55-55 55-55-24.64-55-55 24.64-55 55-55z"/> <path d="m57.373 18.231a9.3834 9.1153 0 1 1 -18.767 0 9.3834 9.1153 0 1 1 18.767 0z" transform="matrix(1.1989 0 0 1.2342 21.214 28.75)"/> <path d="m90.665 110.96c-0.069 2.73 1.211 3.5 4.327 3.82l5.008 0.1v5.12h-39.073v-5.12l5.503-0.1c3.291-0.1 4.082-1.38 4.327-3.82v-30.813c0.035-4.879-6.296-4.113-10.757-3.968v-5.074l30.665-1.105"/> </g>';

function drawModalUI(arr) {          //arr gets returned as a json object containing messages, coords, xRange, yRange, aspectRatio, data
    console.log(arr, 'arr from complete analysis');
    const local_xr = arr.xRange;
    const local_yr = arr.yRange;
    const local_ar = arr.aspectRatio;
    var local_data = JSON.stringify(arr.data);
    local_data = JSON.parse(local_data);
    local_data.splice(local_data.length - 1); //remove last element

    var l_margin = {top: 50, right: 10, bottom: 20, left: 150};

    chartWidth = THUMBNAIL_WIDTH - l_margin.left - l_margin.right;
    chartHeight = THUMBNAIL_HEIGHT - l_margin.top - l_margin.bottom;
    chartXTicks = arr.xTicks;
    chartYTicks = arr.yTicks;
    chartGraphData = JSON.stringify(arr.data);
    chartGraphData = JSON.parse(chartGraphData);
    chartGraphData.splice(chartGraphData.length - 1); //remove last element

    const small_margin = 10;


    if (local_ar > 10 / 3) {
        //fix x to THUMBNAIL_WIDTH
        chartWidth = THUMBNAIL_WIDTH - small_margin;
        chartHeight = parseInt(chartWidth / local_ar);
    } else {
        //fix y to THUMBNAIL_HEIGHT
        chartHeight = THUMBNAIL_HEIGHT - l_margin.top - l_margin.bottom;
        chartWidth = parseInt(local_ar * chartHeight);
    }

    const modal = document.getElementById('Modal2');
    const sameImage = document.getElementById('mainChart');
    const modalImg = document.getElementById('ModalImage');
    modal.style.display = 'block';
    modalImg.src = sameImage.src;

    const x = modalImg.width;
    const y = modalImg.height;
    const MAX_X = 1150;
    const MAX_Y = 700;
    let scalingRatio;

    if (x / y > MAX_X / MAX_Y) {
        //fix x to MAX_X
        modalImg.width = MAX_X;
        scalingRatio = MAX_X / x;
        modalImg.height = scalingRatio * y;
    } else {
        //fix y to MAX_Y
        modalImg.height = MAX_Y;
        scalingRatio = MAX_Y / y;
        modalImg.width = scalingRatio * x;
    }

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName('close')[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = 'none';
    };

    var modal2 = d3.select('#Modal2');
    var canvas = d3.select('#gameCanvasModal');

    let global_inverted = false;

    //draw the test UI
    // //TODO remove this
    var box = d3.select('#redBox');
    oldViewBox = box.append('div').attr('class', 'row justify-content-center')
    // drawThumbTrunc(l_margin, l_width, l_height, local_xr, local_yr, local_data, oldViewBox, 0, [], global_inverted);
    box.append('hr')
    // this does not correctly work for charts with inverted y-axis because we are not checking for that yet 
    // to fix this we first need to adjust the order in which the misleading features are detected
    drawTestUI(chartWidth, chartHeight, chartXTicks, chartYTicks, chartGraphData, box, arr.messages, global_inverted);



    for (var i = 0; i < arr.messages.length; ++i) {
        var msg = arr.messages[i];
        if (msg.includes('inverted')) {
            global_inverted = true;
        } //booleans
        var coords = arr.coords[i];

        var div = modal2.append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        const OFFSET = 30;
        const VERTICAL_OFFSET = 0;

        canvas.append('svg')
            .attr('z-index', 10000)
            .attr('width', '50px')
            .attr('height', '50px')
            .attr('x', coords[0] * scalingRatio + OFFSET)
            .attr('y', coords[1] * scalingRatio + VERTICAL_OFFSET)
            .attr('opacity', 0.3)
            .attr('viewBox', '0 0 180 180')
            .attr('class', 'draggable')
            .html(infoBoxGlobal)
            .on('mouseover', function () {
                this.attributes.opacity.value = 1;
            })
            .on('mouseout', function () {
                this.attributes.opacity.value = 0.3;
            })

            .append('rect')
            .attr('width', '200px')
            .attr('height', '200px')
            .attr('x', 0)
            .attr('y', 0)
            .attr('opacity', 0.3)
            .attr('fill', 'red')
            .attr('hiddenText', msg)
            .on('click', function () {


                //remove all the tool_tip_on_click before  a new click
                var paras = document.getElementsByClassName('tooltip_on_click');
                while (paras[0]) {
                    paras[0].parentNode.removeChild(paras[0]);
                }
                paras = document.getElementsByClassName('tooltip_svg');
                while (paras[0]) {
                    paras[0].parentNode.removeChild(paras[0]);
                }

                const annotation = (this.attributes.hiddenText.value);
                console.log("annotation", annotation);
                console.log("arr message", arr.messages)
                const trunc = annotation.includes('truncate'); //booleans
                const aspect = annotation.includes('(AR)'); //booleans
                const inverted = annotation.includes('inverted'); //booleans

                var div2 = modal2.append('div')
                    .attr('class', 'tooltip_on_click')
                    .style('opacity', 0);


                if (trunc) {
                    const ORIG_OFFSET = 150;
                    drawThumbTrunc(l_margin, chartWidth, chartHeight, local_xr, local_yr, local_data, div2, ORIG_OFFSET, annotation, global_inverted);

                    // //draw the test UI
                    //TODO remove this
                    // var box = d3.select('#redBox');
                    // oldViewBox = box.append('div').attr('class', 'row justify-content-center')
                    // drawThumbTrunc(l_margin, l_width, l_height, local_xr, local_yr, local_data, oldViewBox, ORIG_OFFSET, annotation, global_inverted);
                    // box.append('hr')

                    //we were able to savely remove everything else from the loop except this, try to find out what gets changed in the loop to effect this
                    drawTestUI(chartWidth, chartHeight, local_xr, local_yr, local_data, box, annotation, global_inverted);

                } else if (inverted) {
                    const ORIG_OFFSET = 150;
                    drawThumbInverted(l_margin, chartWidth, chartHeight, local_xr, local_yr, local_data, div2, ORIG_OFFSET, annotation);


                } else if (aspect) {
                    const ORIG_OFFSET = 150;
                    const str = annotation;
                    const aspect1 = (str.split('Actual Aspect Ratio (AR): ')[1].split('Ideal'));
                    const a1 = parseFloat(aspect1);
                    const aspect2 = str.split('Ideal AR: ')[1];
                    const a2 = parseFloat(aspect2);
                    drawThumbAR(l_margin, chartWidth, chartHeight, local_xr, local_yr, local_data, div2, ORIG_OFFSET, a1, a2, annotation, global_inverted);

                    //set timeout for Aspect Popup
                    setTimeout(() => {
                        const a = document.getElementById('WhatIsAspectRatio');
                        a.addEventListener('click', function () {
                            wpd.popup.show('AspectPopup');
                            const closer = document.getElementById('CloseAspectPopup');
                            closer.addEventListener('click', function () {
                                wpd.popup.close('AspectPopup');
                            });
                        });
                    }, 500);

                } else if (inverted) {
                    var svg = div2
                        .style('height', '80px')
                        .style('z-index', 10000000)
                        .html(annotation);

                } else {
                    var svg = div2
                        .style('height', '80px')
                        .style('z-index', 10000000)
                        .html(annotation);

                    try {

                        document.getElementById('WilkinsonAdvice').style.zIndex = '10000000';
                        document.getElementById('WilkinsonAdvice').addEventListener('click', function () {
                        });

                        setTimeout(() => {
                            const wilk = document.getElementById('WilkinsonAdvice');
                            wilk.addEventListener('click', function () {
                                wpd.popup.show('WilkinsonPopup');

                                const closer = document.getElementById('CloseStepSize');
                                closer.addEventListener('click', function () {
                                    wpd.popup.close('WilkinsonPopup');
                                });
                            });
                        }, 500);

                    } catch (e) {
                    }
                }
                div2.transition()
                    .duration(200)
                    .style('opacity', .85);

                div2.style('left', (event.x) - 20 + 'px')
                    .style('top', (event.y) - 90 + 'px');
            });

        var g = canvas.append('g')
            .attr('x', coords[0] + OFFSET)
            .attr('y', coords[1]);
        g.append('rect')
            .attr('x', coords[0] + OFFSET)
            .attr('y', coords[1]);
    }
}



//function that draws our whole test UI consisting of a title, the list of detected features, and the control and recommended charts
function drawTestUI(l_width, l_height, local_xr, local_yr, local_data, parentDiv, annotation, inverted) {
    
//this part should not be needed later when we change the input from the python file to directly return the needed data instead of the annotations
    //iterate over annotations to set which misleading features have been detected
    //TODO add more later (missling labels, multiple axis, non-linear axis, etc.)
    for (let i = 0; i < annotation.length; i++) {
        if (annotation[i] != null) {
            if (annotation[i].includes("truncated")  && !annotation[i].includes("not truncated")) {
                detectedFeatures.truncatedY[0] = true;
            }
            if (annotation[i].includes("inverted")) {
                detectedFeatures.invertedY[0] = true;
            }
            if (annotation[i].includes("(AR)")) {
                detectedFeatures.misleadingAR[0] = true;
                //change this later when the python files already returns the needed numbers
                //detectedFeatures.misleadingAR[2] = parseFloat(annotation[i].split("Ideal AR: ")[1]);

                //this is old code borrowed from the original work; replace it later
                const aspect1 = (annotation[i].split('Actual Aspect Ratio (AR): ')[1].split('Ideal'));
                const a1 = parseFloat(aspect1);
                const aspect2 = annotation[i].split('Ideal AR: ')[1];
                const a2 = parseFloat(aspect2);
                detectedFeatures.misleadingAR[1] = a1;
                detectedFeatures.misleadingAR[2] = a2;
            }
        }   
    }

    // draw an example header
    testUITitleDiv = parentDiv.append('div').attr('class', 'row test-row justify-content-center')
    testUITitleDiv.append('p').text("This is our test function for the control chart:")

    // draw the list of mislead features
    let detectedFeaturesDiv = parentDiv.append('div').attr('class', 'row justify-content-center')
    drawMisleadFeaturesList(detectedFeaturesDiv);

    // make a div for the charts
    let chartsDiv = parentDiv.append('div').attr('class', 'row justify-content-center')
    
    // draw the control chart
    let controlChartDiv = chartsDiv.append('div')
    controlChartDiv.append('p').text("Control Chart:")
    drawControlChart(controlChartDiv);

    // draw the recommended chart
    let recommendedChartDiv = chartsDiv.append('div')
    recommendedChartDiv.append('p').text("Truncated Chart:")
    //need to give the function that draws the recommended chart which misleading features have been detected
    // the control chart is bascially the same just with all misleading features set to false so we can use that for testing
    drawRecommendedChart(l_width, l_height, local_xr, local_yr, local_data, recommendedChartDiv, inverted);

    //test generic function to draw all the charts, this later replaces the others
    parentDiv.append('hr')
    let testChartDiv = parentDiv.append('div').attr('id', 'testChartDiv')
    drawAnyChart(testChartDiv);
}

//function to draw the list of mislead features
//TODO: we need to provide useful information about each detected feature in this list aswell
function drawMisleadFeaturesList(div) {
    innerDiv = div.append('p')    // we need an inner element (div or p both work) to make the text wrap as a div of class col ignores <br> tags
    innerDiv.text("Detected Misleading Features:").append('br');

    for (const [feature, isDetected] of Object.entries(detectedFeatures)) {
        console.log(`${feature}: ${isDetected}`)
        if (isDetected[0]) {
            innerDiv.append('text')
                .text("- " + feature)
                .append('button')
                .attr('type', 'button')
                .attr('id', feature)
                .attr('class', 'btn btn-primary btn-sm')
                .text(isDetected[0])
                .on('click', function () {toggleFeatureButton(feature)});
                innerDiv.append('br');
        }
    }
}

/**
 * updates the recommended chart to represent the given feature, also updates the global variable for that feature
 * @param {string} feature 
 */
function toggleFeatureButton(feature) {
    detectedFeatures[feature][0] = !detectedFeatures[feature][0];

    let featureButton = document.getElementById(feature);
    featureButton.firstChild.data = detectedFeatures[feature][0];      //sets the button text

    let oldChartSVG = document.getElementById('recommendedSVG');
    if (oldChartSVG != null) {
        oldChartSVG.remove();          //remove the old recommended chart
    }

    let parentDiv = d3.select('#testChartDiv')
    drawAnyChart(parentDiv);          //draw the recommended chart again now that the global variable has been updated
}


/**
 * function that we use to draw all the chart images in the UI
 * TODO: expand this function step by step to eventually include the removal of all misleading features
 * if all detected tactics are false, it will draw the input-image (control chart)
 * @param {*} chartWidth 
 * @param {*} chartHeight 
 * @param {Array} chartXRange 
 * @param {Array} chartYRange 
 * @param {*} chartGraphData 
 * @param {html_element} parentDiv 
 * @param {json} detectedFeatures contains all the detectable misleading features, every entry is either true or false whether it was detected or not
 */
function drawAnyChart(parentDiv) {

    const SPACING = 11;
    // const split_up = annotation.split('[newline]');
    const LIMIT_WIDTH = 30;

    //the dimension of the drawn chart (in pixels)
    let xAxisSize = chartWidth;
    let yAxisSize = chartHeight;

    // when the original aspect ratio is misleading we need to draw the chart using the ideal aspect ratio
    if (detectedFeatures.misleadingAR[0]) {
        if(detectedFeatures.misleadingAR[2] > chartWidth / chartHeight) {
            yAxisSize = xAxisSize / detectedFeatures.misleadingAR[2];       //when the ideal AR is larger than the original AR we need to make the y-axis smaller
        }
        else {
            xAxisSize = yAxisSize * detectedFeatures.misleadingAR[2];       //when the ideal AR is smaller than the original AR we need to make the x-axis smaller
        }
    }
    
    // using d3 to construct a linear scale for the x- and y-axis 
    // (domain is the range of values in the data, range is the range of values in the chart)
    let xScale = d3.scaleLinear()   
        .domain([chartXTicks[0].value, chartXTicks[chartXTicks.length-1].value])
        .range([0, xAxisSize]);

    let yAxis;              // yScale is height of graphic
    let yBottomValue = chartYTicks[0].value;       //the value at the bottom of the y-axis
    let yTopValue = chartYTicks[chartYTicks.length-1].value;          //the value at the very top of the y-axis

    // when the y-axis is truncated set the bottom value to zero instead if the truncated value
    if (detectedFeatures.truncatedY[0]) {
        yBottomValue = 0;
    }
    // when the y-axis is inverted switch top and buttom values to invert the axis again
    if (detectedFeatures.invertedY[0]) {
        let temp = yBottomValue;
        yBottomValue = yTopValue;
        yTopValue = temp;
    }
    yAxis = d3.scaleLinear()
            .domain([yBottomValue, yTopValue])
            .range([yAxisSize, 0]);      //height is first because it will be drawn "top to bottom"

    

    let line = d3.line()
        .x(function (d, i) {
            return xScale(d.x);
        }) // set the x values for the line generator
        .y(function (d) {
            return yAxis(d.y);
        });

    let dataset = chartGraphData.map(function (d) {
        return {
            'x': parseFloat(d.x),
            'y': parseFloat(d.y)
        };
    });

    const EXPAND_WIDTH = 80;
    const EXPAND_HEIGHT = 50;
    let svg = parentDiv
        .append('svg')
        .attr('width', xAxisSize + EXPAND_WIDTH)
        .attr('height', yAxisSize + EXPAND_HEIGHT)
        .attr('id', 'recommendedSVG')
        .append('g')
        .attr('align', 'center')

    // const SHIFT_DOWN = split_up.length * SPACING;
    const SHIFT_DOWN = 11;
    const SHIFT_RIGHT = 40;

    // x-axis
    svg.append('g')
        .attr('class', 'xaxisblack')
        .attr('color', 'black')
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + (yAxisSize + SHIFT_DOWN) + ')')
        .call(d3.axisBottom(xScale).ticks(3)); // Create an axis component with d3.axisBottom

    // y-axis
    svg.append('g')
        .style('font', '11px Segoe UI')
        .style('stroke', '#ef8a62')
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .call(d3.axisLeft(yAxis).ticks(3));

    //append the datapath
    svg.append('path')
        .datum(dataset) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .attr('d', line); // 11. Calls the line generator

}

//function to draw the control chart
//TODO: instead of just giving the x and y ranges, we need to give the number of ticks as well
function drawControlChart(div2) {

    const SPACING = 11;
    // const split_up = annotation.split('[newline]');
    const LIMIT_WIDTH = 30;

    var xScale = d3.scaleLinear()   // xScale is width of graphic
        .domain([chartXTicks[0].value, chartXTicks[chartXTicks.length-1].value])
        .range([0, chartWidth-100]);

    var yScale = d3.scaleLinear()   // yScale is height of graphic
        .domain([chartYTicks[0].value, chartYTicks[chartYTicks.length-1].value])
        .range([chartHeight, 0]);

    var line = d3.line()
        .x(function (d, i) {
            return xScale(d.x);
        }) // set the x values for the line generator
        .y(function (d) {
            return yScale(d.y);
        });

    var dataset = chartGraphData.map(function (d) {
        return {
            'x': parseFloat(d.x),
            'y': parseFloat(d.y)
        };
    });

    const EXPAND_WIDTH = 50;
    const EXPAND_HEIGHT = 50;
    var svg = div2
        .append('svg')
        .attr('width', chartWidth + EXPAND_WIDTH)
        .attr('height', chartHeight + EXPAND_HEIGHT)
        .append('g')
        .attr('align', 'center')

    // const SHIFT_DOWN = split_up.length * SPACING;
    const SHIFT_DOWN = 11;
    const SHIFT_RIGHT = 40;

    // x-axis
    svg.append('g')
        .attr('class', 'xaxisblack')
        .attr('color', 'black')
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + (chartHeight + SHIFT_DOWN) + ')')
        .call(d3.axisBottom(xScale).ticks(3)); // Create an axis component with d3.axisBottom

    // y-axis
    svg.append('g')
        .style('font', '11px Segoe UI')
        .style('stroke', '#ef8a62')
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .call(d3.axisLeft(yScale).ticks(3));

    //append the datapath
    svg.append('path')
        .datum(dataset) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .attr('d', line); // 11. Calls the line generator
}

function drawRecommendedChart(l_width, l_height, local_xr, local_yr, local_data, div2, inverted) {
    //function based in drawTrueChart

    const SPACING = 11;
    // const split_up = annotation.split('[newline]');
    let yScale;
    const LIMIT_WIDTH = 30;

    // using d3 to construct a linear scale for the x- and y-axis 
    // (domain is the range of values in the data, range is the range of values in the chart)
    var xScale = d3.scaleLinear()
        .domain([local_xr[0], local_xr[1]])
        .range([0, l_width - LIMIT_WIDTH]);

    if (inverted) {
        yScale = d3.scaleLinear()
            .domain([local_yr[0], 0]) //zero baseline
            .range([l_height, 0]);
    } else {
        yScale = d3.scaleLinear()
            .domain([0, local_yr[1]]) //zero baseline
            .range([l_height, 0]);
    }


    var line = d3.line()
        .x(function (d, i) {
            return xScale(d.x);
        })
        .y(function (d) {
            return yScale(d.y);
        });

    var dataset = local_data.map(function (d) {
        return {
            'x': parseFloat(d.x),
            'y': parseFloat(d.y)
        };
    });

    const EXPAND_WIDTH = 50;
    const EXPAND_HEIGHT = 50;
    var svg = div2
        .append('svg')
        .attr('width', l_width + EXPAND_WIDTH)
        .attr('height', l_height + EXPAND_HEIGHT)
        .append('g')
        .attr('align', 'center')

    // const SHIFT_DOWN = split_up.length * SPACING;
    const SHIFT_DOWN = 11;
    const SHIFT_RIGHT = 40;

    // x-axis
    svg.append('g')
        .attr('class', 'xaxisblack')
        .attr('color', 'black')
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + (l_height + SHIFT_DOWN) + ')')
        .call(d3.axisBottom(xScale).ticks(3)); // Create an axis component with d3.axisBottom

    // y-axis
    svg.append('g')
        .style('font', '11px Segoe UI')
        .style('stroke', '#67a9cf')
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .call(d3.axisLeft(yScale).ticks(3));

    // //append the datapath2
    svg.append('path')
        .datum(dataset) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .attr('d', line); // 11. Calls the line generator

}

function drawThumbAR(l_margin, l_width, l_height, local_xr, local_yr, local_data, div2, OFFSET, a1, a2, annotation, inverted) {

    const max_width = l_width;
    const max_height = l_height;

    let WIDTH1, WIDTH2, HEIGHT1, HEIGHT2;
    WIDTH1 = l_width, WIDTH2 = l_width;
    HEIGHT1 = l_height , HEIGHT2 = l_height;


    //adjust width1
    if (a1 > max_width / max_height) {
        //fix x(width) to max_width
        WIDTH1 = max_width;
        HEIGHT1 = WIDTH1 / a1;
    } else {
        //fix y(height) to max_height
        HEIGHT1 = max_height;
        WIDTH1 = HEIGHT1 * a1;
    }


    var dataset = local_data.map(function (d) {
        return {
            'x': parseFloat(d.x),
            'y': parseFloat(d.y)
        };
    });


    var xScale = d3.scaleLinear()
        .domain([local_xr[0], local_xr[1]])
        .range([0, WIDTH1]);

    var yScale = d3.scaleLinear()
        .domain([local_yr[0], local_yr[1]])
        .range([HEIGHT1, 0]);


    if (a2 > max_width / max_height) {
        //fix x(width) to max_width
        WIDTH2 = max_width;
        HEIGHT2 = WIDTH2 / a2;
    } else {
        //fix y(height) to max_height
        HEIGHT2 = max_height;
        WIDTH2 = HEIGHT2 * a2;
    }

    var xScale2 = d3.scaleLinear()
        .domain([local_xr[0], local_xr[1]])
        .range([0, WIDTH2]);

    var yScale2 = d3.scaleLinear()
        .domain([local_yr[0], local_yr[1]])
        .range([HEIGHT2, 0]);


    var line = d3.line()
        .x(function (d, i) {
            return xScale(d.x);
        }) // set the x values for the line generator
        .y(function (d) {
            return yScale(d.y);
        });

    var line2 = d3.line()
        .x(function (d, i) {
            return xScale2(d.x);
        }) // set the x values for the line generator
        .y(function (d) {
            return yScale2(d.y);
        });


    const EXPAND_WIDTH = 70;
    const EXPAND_HEIGHT = 300;
    var svg = div2.append('svg')
        .attr('width', l_width + l_margin.left + l_margin.right + EXPAND_WIDTH)
        .attr('height', l_height + l_margin.top + l_margin.bottom + EXPAND_HEIGHT)
        .append('g')
        .attr('transform', 'translate(' + (l_margin.left - OFFSET+25) + ',' + (l_margin.top) + ')');


    const split_up = annotation.split('. ');

    const SPACING = 11;
    for (var i = 0; i < split_up.length; ++i) {
        svg.append('text')
            .attr('width', 425)
            .attr('x', 180)
            .attr('y', -35 + i * SPACING)
            .attr('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('z-index', 10000000000)
            .text(split_up[i]);
    }


    //add title
    svg.append('text')
        .attr('x', 50)
        .attr('y', 18)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('z-index', 10000000000)
        .text('Original');

    //add second title
    svg.append('text')
        .attr('x', 250)
        .attr('y', 18)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('z-index', 10000000000)
        .text('Ideal Aspect Ratio');

    const SHIFT_DOWN = 30;
    const SHIFT_RIGHT = 10;


    //xaxis
    svg.append('g')
        .attr('class', 'xaxisblack')
        .attr('color', 'black')
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + (l_height + SHIFT_DOWN) + ')')
        .call(d3.axisBottom(xScale).ticks(0)); // Create an axis component with d3.axisBottom

    //second xaxis
    svg.append('g')
        .attr('class', 'xaxisblack')
        .attr('color', 'black')
        .attr('transform', 'translate(200,' + (l_height + SHIFT_DOWN/(a2/a1)) + ')')
        .call(d3.axisBottom(xScale).ticks(0)); // Create an axis component with d3.axisBottom
    // .attr("transform", "translate(" + (l_margin.left - OFFSET) + "," + (l_margin.top) + ")");


    //yaxis
    svg.append('g')
        .style('font', '11px Segoe UI')

        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .call(d3.axisLeft(yScale).ticks(1));

    //second yaxis
    svg.append('g')
        .style('font', '11px Segoe UI')

        .attr('transform', 'translate(200,' + SHIFT_DOWN + ')')
        .call(d3.axisLeft(yScale2).ticks(1));


    //append the datapath
    svg.append('path')
        .datum(dataset) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .attr('d', line); // 11. Calls the line generator


    //append the datapath2
    // for the datapath2, make sure the extent of the data is there.
    // extent for y
    svg.append('path')
        .datum(dataset) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('transform', 'translate(200,' + SHIFT_DOWN + ')')
        .attr('d', line2); // 11. Calls the line generator

    //add link

}

function drawThumbTrunc(l_margin, l_width, l_height, local_xr, local_yr, local_data, div2, OFFSET, annotation, inverted) {

    let yScale2;
    const LIMIT_WIDTH = 30;
    var xScale = d3.scaleLinear()
        .domain([local_xr[0], local_xr[1]])
        .range([0, l_width - LIMIT_WIDTH]);

    var xScale2 = d3.scaleLinear()
        .domain([local_xr[0], local_xr[1]])
        .range([0, l_width - LIMIT_WIDTH]);

    var yScale = d3.scaleLinear()
        .domain([local_yr[0], local_yr[1]])
        .range([l_height, 0]);

    if (inverted) {
        yScale2 = d3.scaleLinear()
            .domain([local_yr[0], 0]) //zero baseline
            .range([l_height, 0]);
    } else {
        yScale2 = d3.scaleLinear()
            .domain([0, local_yr[1]]) //zero baseline
            .range([l_height, 0]);
    }


    var line = d3.line()
        .x(function (d, i) {
            return xScale(d.x);
        }) // set the x values for the line generator
        .y(function (d) {
            return yScale(d.y);
        });

    var line2 = d3.line()
        .x(function (d, i) {
            return xScale2(d.x);
        })
        .y(function (d) {
            return yScale2(d.y);
        });

    var dataset = local_data.map(function (d) {
        return {
            'x': parseFloat(d.x),
            'y': parseFloat(d.y)
        };
    });

    const EXPAND_WIDTH = 50;
    var svg = div2.append('svg')
        .attr('width', l_width + l_margin.left + l_margin.right + EXPAND_WIDTH)
        .attr('height', 300)
        .append('g')
        .attr('transform', 'translate(' + (l_margin.left - OFFSET) + ',' + (l_margin.top) + ')');

    const split_up = annotation.split('[newline]');

    const SPACING = 11;
    for (var i = 0; i < split_up.length; ++i) {
        svg.append('text')
            .attr('width', 425)
            .attr('x', 130)
            .attr('y', -35 + i * SPACING)
            .attr('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('z-index', 10000000000)
            .text(split_up[i]);
    }

    //add title
    svg.append('text')
        .attr('x', 60)
        .attr('y', -15 + split_up.length * SPACING)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ef8a62')
        .attr('z-index', 10000000000)
        .text('Misleading');

    //add second title
    svg.append('text')
        .attr('x', 240)
        .attr('y', -15 + split_up.length * SPACING)
        .attr('text-anchor', 'middle')
        .attr('fill', '#67a9cf')
        .attr('z-index', 10000000000)
        .text('Corrected');

    const SHIFT_DOWN = split_up.length * SPACING;
    const SHIFT_RIGHT = 40;

    //xaxis
    svg.append('g')
        .attr('class', 'xaxisblack')
        .attr('color', 'black')
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + (l_height + SHIFT_DOWN) + ')')
        .call(d3.axisBottom(xScale).ticks(1)); // Create an axis component with d3.axisBottom

    //second xaxis
    svg.append('g')
        .attr('class', 'xaxisblack')
        .attr('color', 'black')
        .attr('transform', 'translate(200,' + (l_height + SHIFT_DOWN) + ')')
        .call(d3.axisBottom(xScale).ticks(1)); // Create an axis component with d3.axisBottom
    // .attr("transform", "translate(" + (l_margin.left - OFFSET) + "," + (l_margin.top) + ")");


    //yaxis
    svg.append('g')
        .style('font', '11px Segoe UI')
        // .attr('class', 'yaxisred')
        .style('stroke', '#ef8a62')
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .call(d3.axisLeft(yScale).ticks(3));

    //second yaxis
    svg.append('g')
        .style('font', '11px Segoe UI')
        // .attr('class', 'yaxisgreen')
        .style('stroke', '#67a9cf')
        .attr('transform', 'translate(200,' + SHIFT_DOWN + ')')
        .call(d3.axisLeft(yScale2).ticks(3));

    //append the datapath
    svg.append('path')
        .datum(dataset) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .attr('d', line); // 11. Calls the line generator

    //append the datapath2
    svg.append('path')
        .datum(dataset) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('transform', 'translate(200,' + SHIFT_DOWN + ')')
        .attr('d', line2); // 11. Calls the line generator
}


function drawThumbInverted(l_margin, l_width, l_height, local_xr, local_yr, local_data, div2, OFFSET, annotation) {
    const LIMIT_WIDTH = 30;
    var xScale = d3.scaleLinear()
        .domain([local_xr[0], local_xr[1]])
        .range([0, l_width - LIMIT_WIDTH]);

    var xScale2 = d3.scaleLinear()
        .domain([local_xr[0], local_xr[1]])
        .range([0, l_width - LIMIT_WIDTH]);


    var yScale = d3.scaleLinear()
        .domain([local_yr[0], local_yr[1]])
        .range([l_height, 0]);

    var yScale2 = d3.scaleLinear()
        .domain([local_yr[1], local_yr[0]])
        .range([l_height, 0]);

    var line = d3.line()
        .x(function (d, i) {
            return xScale(d.x);
        }) // set the x values for the line generator
        .y(function (d) {
            return yScale(d.y);
        });

    var line2 = d3.line()
        .x(function (d, i) {
            return xScale2(d.x);
        })
        .y(function (d) {
            return yScale2(d.y);
        });

    var dataset = local_data.map(function (d) {
        return {
            'x': parseFloat(d.x),
            'y': parseFloat(d.y)
        };
    });

    const EXPAND_WIDTH = 50;
    var svg = div2.append('svg')
        .attr('width', l_width + l_margin.left + l_margin.right + EXPAND_WIDTH)
        .attr('height', 300)
        .append('g')
        .attr('transform', 'translate(' + (l_margin.left - OFFSET) + ',' + (l_margin.top) + ')');

    const split_up = annotation.split('[newline]');

    const SPACING = 11;
    for (var i = 0; i < split_up.length; ++i) {
        svg.append('text')
            .attr('width', 425)
            .attr('x', 130)
            .attr('y', -35 + i * SPACING)
            .attr('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('z-index', 10000000000)
            .text(split_up[i]);
    }

    //add title
    svg.append('text')
        .attr('x', 70)
        .attr('y', -15 + split_up.length * SPACING)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ef8a62')
        .attr('z-index', 10000000000)
        .text('Misleading');

    //add second title
    svg.append('text')
        .attr('x', 230)
        .attr('y', -15 + split_up.length * SPACING)
        .attr('text-anchor', 'middle')
        .attr('fill', '#67a9cf')
        .attr('z-index', 10000000000)
        .text('Corrected');


    const SHIFT_DOWN = split_up.length * SPACING;
    const SHIFT_RIGHT = 40;

    //xaxis
    svg.append('g')
        .attr('class', 'xaxisblack')
        .attr('color', 'black')
        .attr('fill', '#ef8a62')
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + (l_height + SHIFT_DOWN) + ')')
        .call(d3.axisBottom(xScale).ticks(2)); // Create an axis component with d3.axisBottom

    //second xaxis
    svg.append('g')
        .attr('class', 'xaxisblack')
        .attr('color', 'black')
        .attr('transform', 'translate(200,' + (l_height + SHIFT_DOWN) + ')')
        .call(d3.axisBottom(xScale).ticks(2)); // Create an axis component with d3.axisBottom
    // .attr("transform", "translate(" + (l_margin.left - OFFSET) + "," + (l_margin.top) + ")");


    //yaxis
    svg.append('g')
        .style('font', '11px Segoe UI')
        .style('stroke', '#ef8a62')
        .attr('class', 'yaxisred')
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .call(d3.axisLeft(yScale).ticks(3));

    //second yaxis
    svg.append('g')
        .style('font', '11px Segoe UI')
        .style('stroke', '#67a9cf')
        .attr('transform', 'translate(200,' + SHIFT_DOWN + ')')
        .call(d3.axisLeft(yScale2).ticks(3));

    //append the datapath
    svg.append('path')
        .datum(dataset) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
        .attr('d', line); // 11. Calls the line generator

    //append the datapath2
    svg.append('path')
        .datum(dataset) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('transform', 'translate(200,' + SHIFT_DOWN + ')')
        .attr('d', line2); // 11. Calls the line generator
}


