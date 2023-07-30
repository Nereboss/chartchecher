const truncated = document.getElementById('truncated')
truncated.addEventListener('click', () => {truncatedButtonClicked()})
const inverted = document.getElementById('inverted')
inverted.addEventListener('click', () => {invertedButtonClicked()})
const ar = document.getElementById('ar')
ar.addEventListener('click', () => {arButtonClicked()})
const labels = document.getElementById('labels')
labels.addEventListener('click', () => {labelsButtonClicked()})
const multi = document.getElementById('multi')
multi.addEventListener('click', () => {multiButtonClicked()})
const scale = document.getElementById('scale')
scale.addEventListener('click', () => {scaleButtonClicked()})
const tick = document.getElementById('tick')
tick.addEventListener('click', () => {tickButtonClicked()})

function truncatedButtonClicked() {
    chrome.storage.sync.set({key: "../chartchecker_sample_charts/LakeMeadCase.png"}, function () {
    });
    window.location.href = '/views/new_main.html';
}

function invertedButtonClicked() {
    chrome.storage.sync.set({key: "../chartchecker_sample_charts/stand_your_ground.jpg"}, function () {
    });
    window.location.href = '/views/new_main.html';
}

function arButtonClicked() {
    chrome.storage.sync.set({key: "../chartchecker_sample_charts/sunspots_smooth.png"}, function () {
    });
    window.location.href = '/views/new_main.html';
}

function labelsButtonClicked() {
    chrome.storage.sync.set({key: "../chartchecker_sample_charts/MissingAxisLabelsExample1.png"}, function () {
    });
    window.location.href = '/views/new_main.html';
}

function multiButtonClicked() {
    chrome.storage.sync.set({key: "../chartchecker_sample_charts/MultipleAxisExample.png"}, function () {
    });
    window.location.href = '/views/new_main.html';
}

function scaleButtonClicked() {
    chrome.storage.sync.set({key: "../chartchecker_sample_charts/InconsistentAxisExample1.png"}, function () {
    });
    window.location.href = '/views/new_main.html';
}

function tickButtonClicked() {
    chrome.storage.sync.set({key: "../chartchecker_sample_charts/InconsistentAxisExample1.png"}, function () {
    });
    window.location.href = '/views/new_main.html';
}