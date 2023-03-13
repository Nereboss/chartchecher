//DATA


// view data table
const viewData = document.getElementById('viewData');
viewData.addEventListener('click', wpd.dataTable.showTable);

//close data table
const closeCsvWindow = document.getElementById('closeCsvWindow');
closeCsvWindow.addEventListener('click', function() {
  wpd.popup.close('csvWindow');
});


const manualSelectButton = document.getElementById('manual-select-button');
manualSelectButton.addEventListener('click', wpd.acquireData.manualSelection);

const manualAdjustButton = document.getElementById('manual-adjust-button');
manualAdjustButton.addEventListener('click', wpd.acquireData.adjustPoints);

const deletePointButton = document.getElementById('delete-point-button');
deletePointButton.addEventListener('click', wpd.acquireData.deletePoint);

const datasetDisplayColorPicker = document.getElementById('dataset-display-color-picker-button');
datasetDisplayColorPicker.addEventListener('click', wpd.dataSeriesManagement.startColorPicker);

const deleteDatasetButton = document.getElementById('deleteDatasetButton');
deleteDatasetButton.addEventListener('click', wpd.dataSeriesManagement.deleteDataset);

const dataFormatButton = document.getElementById('dataFormatButton');
dataFormatButton.addEventListener('click', wpd.dataTable.reSort);

const RenameDataset = document.getElementById('RenameDataset');
RenameDataset.addEventListener('click', wpd.dataSeriesManagement.renameDataset);

const closeRenameDataset = document.getElementById('closeRenameDataset');
closeRenameDataset.addEventListener('click', function() {
  wpd.popup.close('rename-dataset-popup');
});

const clearDataButton = document.getElementById('clearDataButton');
clearDataButton.addEventListener('click', wpd.acquireData.clearAll);


//AXES


const tweak = document.getElementById('tweak-axes-calibration-button');
tweak.addEventListener('click', wpd.alignAxes.reloadCalibrationForEditing);

const deleteCal = document.getElementById('deleteCal');
deleteCal.addEventListener('click', wpd.alignAxes.deleteCalibration);

//IMAGE
const closeImageInfoPopup = document.getElementById('closeImageInfoPopup');
closeImageInfoPopup.addEventListener('click', function() {
  wpd.popup.close('image-info-popup');
});


const imageEditingUndo = document.getElementById('image-editing-undo');
imageEditingUndo.addEventListener('click', wpd.imageEditing.undo);

const imageEditingRedo = document.getElementById('image-editing-redo');
imageEditingRedo.addEventListener('click', wpd.imageEditing.redo);

const imageCropper = document.getElementById('image-editing-crop');
imageCropper.addEventListener('click', wpd.imageEditing.startImageCrop);


//generic popup closer
const genericPopupCloser = document.getElementById('genericPopupCloser');
genericPopupCloser.addEventListener('click', function() {
  wpd.messagePopup.close();
});

//generic ok/cancel popup
const okCloser = document.getElementById('okCloser');
okCloser.addEventListener('click', wpd.okCancelPopup.ok);
const cancelCloser = document.getElementById('cancelCloser');
cancelCloser.addEventListener('click', wpd.okCancelPopup.cancel);

