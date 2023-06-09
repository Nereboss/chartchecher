// -----------------------------global variables---------------------------------

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
                                    <button type="button" class="btn btn-outline-primary" id="${featureID}">hide</button>
                                </div>
                            </div>
                        </div>`)
    const button = document.getElementById(featureID)
    button.addEventListener('click', function() {misleadingFeatureButtonClicked(featureID)})
}

function misleadingFeatureButtonClicked(id) {
    const button = d3.select('#'+id)
    if (button.text() == 'show') {
        button.text('hide')
        button.attr('class', 'btn btn-primary')
    } else if (button.text() == 'hide') {
        button.text('show')
        button.attr('class', 'btn btn-outline-primary')
    } else {
        console.log('Error: button text is not show or hide')
    }
    console.log(`${id} button clicked; toggle the feature here`) //TODO toggle the feature here
}