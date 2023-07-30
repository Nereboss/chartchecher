function tutorial() {
  const driver = new Driver();
  driver.highlight('#Simple11');
}

//tutorial for the main page
function tutorialMain() {
  const driver = new Driver();

  driver.defineSteps([
    {
      element: '#original-card',
      popover: {
        title: 'Input Chart',
        description: 'Here the original image is shown for a direct comparison.',
        position: 'mid-center'
      }
    },
    {
      element: '#recommended-card',
      popover: {
        title: 'Alternative Chart',
        description: 'This shows the alternative chart that we recommend, as it removes all the misleading features that are present in the original chart.',
        position: 'mid-center'
      }
    },
    {
      element: '#misleading-features-card',
      popover: {
        title: 'List of detected misleading features',
        description: 'This shows a list of all the misleading features that were detected in the original chart together with explanations. From here you can also choose to show or hide individual features in the recommended chart to further understand their effects.',
        position: 'mid-center'
      }
    },

  ]);
  driver.start();
}

//tutorial for the manual mode
function tutorialManual() {
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

//tutorial for the manual mode
let manualTutorial = document.getElementById('TutorialLink')
if (manualTutorial != null) {
  manualTutorial.addEventListener('click', function() {
    //need to set timeout for this thing to fire correctly (20ms for now)
    setTimeout(() => {
      //timeout begins
      tutorialManual();
    }, 200);
  });
}