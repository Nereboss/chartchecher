function tutorial() {
  const driver = new Driver();
  driver.highlight('#Simple11');
}

function tutorial3() {
  const driver = new Driver();
// Define the steps for introduction

  // position can be left, left-center, left-bottom, top,
  // top-center, top-right, right, right-center, right-bottom,
  // bottom, bottom-center, bottom-right, mid-center

  driver.defineSteps([
    {
      element: '#Simple11',
      popover: {
        title: 'Step 1',
        description: 'Click "Run Auto OCR" to automatically draw boxes over the text elements of the chart.' +
          'You can also manually draw the text by "Enable Box Drawing" and "Disable Box Drawing" ',
        position: 'mid-center'
      }
    },
    {
      element: '#Simple12',
      popover: {
        title: 'Step 2:',
        description: 'Make sure the boxes are correct. After the boxes are done, ' +
          'click on Autofill Type to automatically populate the type column.' +
          'You may also adjust the boxes by directly editing or deleting them.',
        position: 'mid-center'
      }
    },
    {
      element: '#DataToolsLeft',
      popover: {
        title: 'Step 3:',
        description: 'Calibrate the axes by using the axes submenu.' +
          'Then add the data by clicking the trajectory of the path in the image on the left.',
        position: 'mid-center'
      }
    },
        {
      element: '#DataToolsRight',
      popover: {
        title: 'Step 4:',
        description: 'Add and Delete points here. Finalize data extraction by clicking "Extract Data"',
        position: 'mid-center'
      }
    },
            {
      element: '#DataOnly',
      popover: {
        title: 'Step 5:',
        description: 'Review the data and use "Complete Analysis" to find potentially problematic ' +
          'elements in your chart.',
        position: 'mid-center'
      }
    },

  ]);
  driver.start();
}

document.getElementById('TutorialLink').addEventListener('click', function() {
  //need to set timeout for this thing to fire correctly (20ms for now)
  setTimeout(() => {
    //timeout begins
    tutorial3();
  }, 200);
});
