const portNumber = 5000;

// -----------------------------global variables---------------------------------

let imageURL_auto; 

let misleadingFeaturesTexts = {
    'featureOne': ['Feature 1', 'Test description of the misleading feature that was detected'],  //put some test text here
    'featureTwo': ['Feature 2', 'Anotherone']       //maybe this description needs to be editable because we want to dynamically allow for information to be added (or maybe add placeholder text and use replace)
    //TODO: add the real features here
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
}

function showAllButtonClicked() {
    console.log('show all button clicked')
}


// -----------------------------test main---------------------------------

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
    .then(function (arr) {console.log("did the backend connection work?", arr);})   //call function to draw the UI here
    .catch(function (error) {
        console.log('stl: ', error);
    });
});

let misleadingFeaturesDiv = d3.select('#misleading-features-list-group')
for (feature in misleadingFeaturesTexts) {
    appendMisleadingFeature(misleadingFeaturesDiv, feature, misleadingFeaturesTexts[feature][0], misleadingFeaturesTexts[feature][1])
}


//-----------------------------functions---------------------------------

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
                                    <button type="button" class="btn btn-outline-primary" id="${featureID}">Hide</button>
                                </div>
                            </div>
                        </div>`)
    const button = document.getElementById(featureID)
    button.addEventListener('click', function() {misleadingFeatureButtonClicked(featureID)})
}

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