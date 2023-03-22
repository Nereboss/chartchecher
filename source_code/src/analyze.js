let Gscale; //scaling the main image
let Gboundingboxes = []; //the bounding boxes
let Gcounter = 10; //just a global atomic counter
let imageURL;


//thumbnail sizes
const THUMBNAIL_WIDTH = 150;
const THUMBNAIL_HEIGHT = 130;

//function converts to base64
function toDataURL(src, callback, outputFormat) {
  let image = new Image();
  image.crossOrigin = 'Anonymous';
  image.onload = function() {
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


chrome.storage.sync.get(['key'], function(result) {
  //set the image
  const img = document.getElementById('mainChart');
  imageURL = result.key;
  toDataURL(imageURL,
    function(dataUrl) {
      // console.log('base 64 RESULT:', dataUrl);
      img.src = dataUrl;
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 600;
      const ASPECT = MAX_WIDTH / MAX_HEIGHT;

      //need to set timeout for this thing to fire correctly (20ms for now)
      setTimeout(() => {
        //do the scaling
        if (img.width / img.height > ASPECT) {
          //if the image has big aspect ratio, fix width to MAX_WIDTH, and scale height
          Gscale = MAX_WIDTH / img.width;
          img.width *= Gscale;
        } else {
          //if the image has small aspect ratio, fix height to MAX_HEIGHT, and scale width
          Gscale = MAX_HEIGHT / img.height;
          img.height *= Gscale;
        }

        //set the game Canvas to equal the image size
        const gameCanvas = document.getElementById('gameCanvas');
        const game = document.getElementById('gameCanvas').attributes;
        game.height.value = img.height;
        game.width.value = img.width;
        //also make enable and disable gameCanvas
        const enable = document.getElementById('enableGameCanvas');
        const disable = document.getElementById('disableGameCanvas');
        enable.addEventListener('click', function() {
          gameCanvas.style.zIndex = 7; //set the z-index to 7 or 8
        });
        disable.addEventListener('click', function() {
          gameCanvas.style.zIndex = 1; //set the z-index to 1
        });


        // scale these too?
        // <canvas className='canvasLayers' id='mainCanvas' style='z-index:1;'></canvas>
        // <canvas className='canvasLayers' id='dataCanvas' style='z-index:2;'></canvas>
        // <canvas className='canvasLayers' id='drawCanvas' style='z-index:3;'></canvas>
        // <canvas className='canvasLayers' id='hoverCanvas' style='z-index:4;'></canvas>
        // <canvas className='canvasLayers' id='topCanvas' style='z-index:5;'></canvas>
        const mc = document.getElementById('mainCanvas');
        const dc = document.getElementById('dataCanvas');
        const drc = document.getElementById('drawCanvas');
        const hc = document.getElementById('hoverCanvas');
        const tc = document.getElementById('topCanvas');
        mc.width = img.width;
        mc.height = img.height;
        dc.width = img.width;
        dc.height = img.height;
        drc.width = img.width;
        drc.height = img.height;
        hc.width = img.width;
        hc.height = img.height;
        tc.width = img.width;
        tc.height = img.height;


      }, 20);


    }
  );

});


//these two lines enables the bounding boxes to be changed whenever the table is changed
const boundingBoxUpdater = document.getElementById('Simple12');
boundingBoxUpdater.addEventListener('change', updateBoundingBox);


//this method enables box drawing and updates Gboundingboxes
function enableBoxDrawing() {
  var boxdrawer = d3.select('#gameCanvas')
    .on('mousedown', mousedown)
    .on('mouseup', mouseup);

  $('mainChart').mousedown(function() {
    return false;
  });

  function mousedown() {
    var m = d3.mouse(this);
    rect = boxdrawer.append('rect')
      .attr('x', m[0])
      .attr('y', m[1])
      .attr('height', 0)
      .attr('width', 0)
      .attr('fill-opacity', '0.0')
      .attr('stroke', 'green')
      .attr('stroke-opacity', '1.0');

    boxdrawer.on('mousemove', mousemove);
  }

  function mousemove(d) {
    var m = d3.mouse(this);

    rect.attr('width', Math.max(0, m[0] - +rect.attr('x')))
      .attr('height', Math.max(0, m[1] - +rect.attr('y')));
  }

  function mouseup() {
    boxdrawer.on('mousemove', null);
    var o = {};
    o.Q = '&times;';
    o.id = Gboundingboxes.length;
    o.x = rect._groups[0][0].x.baseVal.value / Gscale;
    o.y = rect._groups[0][0].y.baseVal.value / Gscale;
    o.width = rect._groups[0][0].width.baseVal.value / Gscale;
    o.height = rect._groups[0][0].height.baseVal.value / Gscale;
    o.text = '';
    o.type = '';
    Gboundingboxes.push(o);
    redoTable();
    enableDelete();
    reRenderBoundingBoxes();

  }
}


//upon changing Gboundingboxes, the table is re-done in this method
function redoTable() {
  var titles = d3.keys(Gboundingboxes[0]);
  const myNode = document.getElementById('BoundingBoxTable');
  myNode.innerHTML = '';

  var table = d3.select('#BoundingBoxTable').append('table');
  var rows = table.append('tbody').selectAll('tr')
    .data(Gboundingboxes).enter()
    .append('tr')
    .attr('index', function(d, i) {
      return i;
    })
    .attr('id', function(d, i) {
      return 'boundingID' + i;
    })
  ;

  var headers = table.append('thead').append('tr')
    .selectAll('th')
    .data(titles).enter()
    .append('th')
    .text(function(d) {
      return d;
    });

  rows.selectAll('td')
    .data(function(d) {
      return titles.map(function(k) {
        return { 'value': d[k], 'name': k };
      });
    }).enter()
    .append('td')
    .attr('data-th', function(d) {
      return d.name;
    })
    .attr('class', function(d, i) {
      if (i == 0) return 'removerX';

    })
    .attr('id', function(d, i) {

      if (i == 1) return 'bounding' + d.value;

    })
    .html(function(d, i) {
      if (i == 0) return d.value;
      else if (i == 1 || i == 2 || i == 3 || i == 4 || i == 5) {
        var str_debug = d.value.toString().replace('\'', '');
        var f = parseInt(str_debug);
        var uniqueName = 'input' + Gcounter.toString();
        Gcounter++;
        return '<input class="changeme" style="width:70px" value =' + f + '></input>';
      } else return '<input id="' + uniqueName + '" class="changeme" style="width:100px" value ='
        + d.value.toString().replace('\'', '') + '></input>';
    });

}


//this function enables the boxes to be deleted when X is clicked
function enableDelete() {
  d3.select('#BoundingBoxTable').selectAll('.removerX')
    .on('click', function(d) {
      var toBeDeleted = (this.parentElement);


      var deleteID = parseInt(toBeDeleted.id.replace('boundingID', ''));
      var lengthtemp = Gboundingboxes.length;
      if (deleteID == lengthtemp) {
        //last element so delete it from Gboubnding boxes and call remove
        Gboundingboxes.pop();
        toBeDeleted.remove();
      } else {
        Gboundingboxes.splice(deleteID, 1);
        toBeDeleted.remove();
      }
      redoTable();
      reRenderBoundingBoxes();
      enableDelete();
    });
}

function reRenderBoundingBoxes() {
  var scaledBoxes = [];
  scaledBoxes = Gboundingboxes;
  var x = document.getElementById('gameCanvas');
  x.innerHTML = '';
  var boxdrawer = d3.select('#gameCanvas');

  for (var i = 0; i < scaledBoxes.length; ++i) {
    var cur = scaledBoxes[i];
    rect = boxdrawer.append('rect')
      .attr('x', cur.x * Gscale)
      .attr('y', cur.y * Gscale)
      .attr('height', cur.height * Gscale)
      .attr('width', cur.width * Gscale)
      .attr('fill-opacity', '0.0')
      .attr('stroke', 'green')
      .attr('stroke-opacity', '1.0');
  }
}


//when a user changes values in the box, then the table and boxes are changed too
// re-enables delete
function updateBoundingBox() {
  var rawData = document.getElementById('BoundingBoxTable')
    .children[0].children[0].children;

  Gboundingboxes = [];
  for (var i = 0; i < rawData.length; ++i) {
    var d = rawData[i].children;
    var o = {};
    o.Q = '&times;';
    o.id = d[1].children[0].value;
    o.x = d[2].children[0].value;
    o.y = d[3].children[0].value;
    o.width = d[4].children[0].value;
    o.height = d[5].children[0].value;
    o.text = d[6].children[0].value;
    o.type = d[7].children[0].value;
    Gboundingboxes.push(o);
  }
  redoTable();
  enableDelete();
  reRenderBoundingBoxes();
}


enableBoxDrawing(); //initializes the box drawing
//set all the event handlers and DOM
const ocr = document.getElementById('OCR');
const mainChart = document.getElementById('mainChart');
const portNumber = 5000;

function OCR() {

  const endpoint = 'http://localhost:'
    + portNumber.toString()
    + '/api/extracttext';


  toDataURL(imageURL,
    function(dataUrl) {

      fetch(endpoint,
        {
          method: 'POST',
          headers:
            {
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          body: JSON.stringify(
            {
              'filedata': dataUrl
            })
        })
        .catch(function(error) {
          console.log('Error in Freq POST: ', error);
        })
        .then(function(response) {
          if (response.ok)
            return response.json();
          throw new Error('Network response was not ok.');
        })
        .then(function(arr) {
          var LENGTH = arr.x.length; //should be the same for all
          var OFFSET = Gboundingboxes.length; // static offset
          for (var i = 0; i < LENGTH; ++i) {
            var o = {};
            o.Q = '&times;';
            o.id = i + OFFSET;
            o.x = arr.x[i];
            o.y = arr.y[i];
            o.width = arr.w[i];
            o.height = arr.h[i];
            o.text = arr.text[i];
            o.type = arr.type[i];
            Gboundingboxes.push(o);
          }
          redoTable();
          enableDelete();
          reRenderBoundingBoxes();

        })

        .catch(function(error) {
          console.log('stl: ', error);
        });
    }
  );
}

ocr.addEventListener('click', OCR);

const fillTypeButton = document.getElementById('fillType');

fillTypeButton.addEventListener('click', function() {


  toDataURL(imageURL,
    function(dataUrl) {

      var json_id = [];
      var json_x = [];
      var json_y = [];
      var json_width = [];
      var json_height = [];
      var json_text = [];
      var json_type = [];

      for (var i = 0; i < Gboundingboxes.length; ++i) {
        json_id.push(Gboundingboxes[i].id);
        json_x.push(Gboundingboxes[i].x);
        json_y.push(Gboundingboxes[i].y);
        json_width.push(Gboundingboxes[i].width);
        json_height.push(Gboundingboxes[i].height);
        if (Gboundingboxes[i].text == '') {
          json_text.push('missing');
        } else {
          json_text.push(Gboundingboxes[i].text);
        }
        if (Gboundingboxes[i].type == '') {
          json_type.push('u');
        } else {
          json_type.push(Gboundingboxes[i].type);
        }
      }

      //also pass in the original image size
      const chart = document.getElementById('mainChart');
      var origHeight = chart.height / Gscale;
      var origWidth = chart.width / Gscale;


      const endpoint = 'http://localhost:'
        + portNumber.toString()
        + '/api/autofilltype';

      fetch(endpoint,
        {
          method: 'POST',
          headers:
            {
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          body: JSON.stringify(
            {
              'id': json_id,
              'x': json_x,
              'y': json_y,
              'width': json_width,
              'height': json_height,
              'text': json_text,
              'type': json_type,
              'origHeight': origHeight,
              'origWidth': origWidth,
              'filedata': dataUrl
            })
        })
        .catch(function(error) {
          console.log('Error in Freq POST: ', error);
        })
        .then(function(response) {
          if (response.ok)
            return response.json();
          throw new Error('Network response was not ok.');
        })
        .then(function(arr) {
          console.log(arr, 'arr from autofillType');
          var LENGTH = arr.x.length; //should be the same for all
          var titles = d3.keys(Gboundingboxes[0]);
          Gboundingboxes = []; // ok to clear since we are re-writing the data
          for (var i = 0; i < LENGTH; ++i) {
            var o = {};
            o.Q = '&times;';
            o.id = i;
            o.x = arr.x[i];
            o.y = arr.y[i];
            o.width = arr.width[i];
            o.height = arr.height[i];
            o.text = arr.text[i];
            o.type = arr.type[i];
            Gboundingboxes.push(o);
          }
          const myNode = document.getElementById('BoundingBoxTable');
          myNode.innerHTML = '';
          var table = d3.select('#BoundingBoxTable').append('table');
          var rows = table.append('tbody').selectAll('tr')
            .data(Gboundingboxes).enter()
            .append('tr')
            .attr('index', function(d, i) {
              return i;
            })
            .attr('id', function(d, i) {
              return 'boundingID' + i;
            });


          var headers = table.append('thead').append('tr')
            .selectAll('th')
            .data(titles).enter()
            .append('th')
            .text(function(d) {
              return d;
            });

          rows.selectAll('td')
            .data(function(d) {
              return titles.map(function(k) {
                return { 'value': d[k], 'name': k };
              });
            }).enter()
            .append('td')
            .attr('data-th', function(d) {
              return d.name;
            })
            .attr('class', function(d, i) {
              if (i == 0) return 'removerX';
            })
            .attr('id', function(d, i) {

              if (i == 1) return 'bounding' + d.value;

            })

            .html(function(d, i) {
              if (i == 0) return d.value;
              else if (i == 1 || i == 2 || i == 3 || i == 4 || i == 5) {
                var str_debug = d.value.toString().replace('\'', '');
                var f = parseInt(str_debug);
                var uniqueName = 'input' + Gcounter.toString();
                Gcounter++;
                return '<input id="' + uniqueName + '" class="changeme" style="width:70px" value =' + f + '></input>';
              } else return '<input id="' + uniqueName + '" class="changeme" style="width:100px" value ='
                + d.value.toString().replace('\'', '') + '></input>';
            });
          enableDelete();
          reRenderBoundingBoxes();


        })

        .catch(function(error) {
          console.log('stl: ', error);
        });


    }
  );


});


wpd.imageManager.load(); //load the image to wpd for it to function correctly


//first hide start-sidebar
const hide_start_sidebar = document.getElementById('start-sidebar');
hide_start_sidebar.style.display = 'none';
console.log('hide sidebar');

//calibrate Axes
const cal_axes = document.getElementById('calibrateAxes');
cal_axes.addEventListener('click', function() {
  wpd.alignAxes.addCalibration();
});


//first find a way to close the align axes
//onClick="wpd.popup.close('axesList');"
const closeAlign = document.getElementById('closeAlign');
closeAlign.addEventListener('click', function() {
  wpd.popup.close('axesList');
});
//choose the plot type with onclick="wpd.alignAxes.start();"
const alignButton = document.getElementById('alignAxesButton');
alignButton.addEventListener('click', function() {
  wpd.alignAxes.start();
});
//click proceed to pick corners
const proceed = document.getElementById('proceed');
proceed.addEventListener('click', function() {
  wpd.alignAxes.pickCorners(); //pick corners
  gameCanvas.style.zIndex = 1; //disable box drawing
});

//manual enter the cal
const completeCalAlign = document.getElementById('xybtn');
completeCalAlign.addEventListener('click', wpd.alignAxes.align);

//complete calibration
const completeCal = document.getElementById('calibrateComplete');
completeCal.addEventListener('click', function() {
  wpd.alignAxes.getCornerValues();
  //close the axes calibration popup
  wpd.popup.close('axes-calibration-sidebar');

});

//add the dataset
const addData = document.getElementById('addDataset');
addData.addEventListener('click', function() {
  wpd.dataSeriesManagement.showAddDataset();
});

//during the dataset dialog box, add in the event listeners
const add_dataset_popup = document.getElementById('add-dataset-popup');
const close_dataset_popup = document.getElementById('closeDatasetPopup');
const add_single_dataset = document.getElementById('add-single-dataset-name-input');


close_dataset_popup.addEventListener('click', function() {
  wpd.popup.close('add-dataset-popup');
});

add_single_dataset.addEventListener('click',
  function() {
    console.log('trying to add single dataset');
    wpd.dataSeriesManagement.addSingleDataset();
    wpd.popup.close('add-dataset-popup');
  }
);


//extract data function needs to refactor and integrate correctly for behavior
function extractDataToTable() {
  var q = document.getElementById('digitizedDataTable');
  q.focus();
  q.select();
  try {
    var rawData = q.value.split('\n');
    var processedData = [];
    for (var i = 0; i < rawData.length; i++) {
      var o = {};
      var splitter = rawData[i].split('; ');
      o.x = splitter[0];
      o.y = splitter[1];
      processedData.push(o);
    }

    var data = processedData;
    var titles = d3.keys(data[0]);
    const myNode = parent.document.getElementById('StandardData');
    myNode.innerHTML = '';
    var table = d3.select(myNode).append('table');
    var rows = table.append('tbody').selectAll('tr')
      .data(data).enter()
      .append('tr')
      .attr('index', function(d, i) {
        return i;
      });

    let titleMap = new Map();
    titleMap[titles[0]] = 'x';
    titleMap[titles[1]] = 'y';
    var headers = table.append('thead').append('tr')
      .selectAll('th')
      .data(titles).enter()
      .append('th')
      .text(function(d) {
        return titleMap[d];
      });

    rows.selectAll('td')
      .data(function(d) {
        return titles.map(function(k) {
          return { 'value': d[k], 'name': k };
        });
      }).enter()
      .append('td')
      .attr('data-th', function(d) {
        return d.name;
      })
      .attr('class', 'DataElements')

      .html(function(d) {
        return d.value;
      });


    // document.execCommand('copy');
  } catch (r) {
    console.log('copyToClipboard', r.message);
  }
}


//two buttons do the same
const extractData = document.getElementById('extractData');
extractData.addEventListener('click', extractDataToTable);

const extractData2 = document.getElementById('extractData2');
extractData2.addEventListener('click', function() {
  //have to open the popup, extract data, then close the popup
  wpd.dataTable.showTable();
  extractDataToTable();
  wpd.popup.close('csvWindow');

});

//complete analysis
function completeAnalysis() {
  var d = document.getElementById('mainChart');
  var origHeight = d.height / Gscale;
  var origWidth = d.width / Gscale;

  var dataProcess = d3.select('#StandardData').selectAll('tr');
  // iterate over dataProcess._groups[0][i].__data__
  var data = [];
  for (var i = 0; i < dataProcess._groups[0].length; ++i) {
    var o = {};
    try {
      o.x = dataProcess._groups[0][i].__data__.x;
      o.y = dataProcess._groups[0][i].__data__.y;
      data.push(o);
    } catch (e) {
      break;
    }
  }


  toDataURL(imageURL,
    function(dataUrl) {
      const endpoint = 'http://localhost:'
        + portNumber.toString()
        + '/api/completeanalysis';

      fetch(endpoint,
        {
          method: 'POST',
          headers:
            {
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          body: JSON.stringify(
            {
              'origHeight': origHeight,
              'origWidth': origWidth,
              'd': data,
              'box': Gboundingboxes
              // 'fn': STD_IMAGE,
              //need to pass in filedata again
            })
        })
        .catch(function(error) {
          console.log('Error in complete analysis POST: ', error);
        })
        .then(function(response) {
          if (response.ok)
            return response.json();
          throw new Error('Network response was not ok.');
        })
        .then(function(arr) {
          console.log(arr, 'arr from complete analysis');

          const local_xr = arr.xRange;
          const local_yr = arr.yRange;
          const local_ar = arr.aspectRatio;
          var local_data = JSON.parse(arr.data);
          local_data.splice(local_data.length - 1); //remove last element


          const small_margin = 10;

          var l_margin = { top: 50, right: 10, bottom: 20, left: 150 },
            l_width = THUMBNAIL_WIDTH - l_margin.left - l_margin.right,
            l_height = THUMBNAIL_HEIGHT - l_margin.top - l_margin.bottom;

          if (local_ar > 10 / 3) {
            //fix x to THUMBNAIL_WIDTH
            l_width = THUMBNAIL_WIDTH - small_margin;
            l_height = parseInt(l_width / local_ar);
          } else {
            //fix y to THUMBNAIL_HEIGHT
            l_height = THUMBNAIL_HEIGHT - l_margin.top - l_margin.bottom;
            l_width = parseInt(local_ar * l_height);
          }


          const modal = document.getElementById('Modal2');
          const sameImage = document.getElementById('mainChart');
          // Get the image and insert it inside the modal - use its "alt" text as a caption
          const modalImg = document.getElementById('ModalImage');
          modal.style.display = 'block';
          modalImg.src = sameImage.src;

          const x = modalImg.width;
          const y = modalImg.height;
          const MAX_X = 1150;
          const MAX_Y = 700;
          let scalingRatio = 1;

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
          span.onclick = function() {
            modal.style.display = 'none';
          };

          var modal2 = d3.select('#Modal2');
          var canvas = d3.select('#gameCanvasModal');

          for (var i = 0; i < arr.messages.length; ++i) {
            var msg = arr.messages[i];
            var coords = arr.coords[i];

            var div = modal2.append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);

            const OFFSET = 0;
            const VERTICAL_OFFSET = -60;

            canvas.append('svg')
              .attr('width', '50px')
              .attr('height', '50px')
              .attr('x', coords[0] * scalingRatio + OFFSET)
              .attr('y', coords[1] * scalingRatio + VERTICAL_OFFSET)
              .attr('opacity', 0.3)
              .attr('viewBox', '0 0 180 180')
              .attr('class', 'draggable')
              .html(infoBoxGlobal)
              .on('mouseover', function() {
                this.attributes.opacity.value = 1;
              })
              .on('mouseout', function() {
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
              .on('click', function(d) {
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
                const trunc = annotation.includes('truncate'); //booleans
                const aspect = annotation.includes('(AR)'); //booleans
                const inverted = annotation.includes('inverted'); //booleans

                var div2 = modal2.append('div')
                  .attr('class', 'tooltip_on_click')
                  .style('opacity', 0);


                if (trunc) {
                  const ORIG_OFFSET = 150;
                  drawThumbTrunc(l_margin, l_width, l_height, local_xr, local_yr, local_data, div2, ORIG_OFFSET, annotation);

                } else if (aspect) {
                  const ORIG_OFFSET = 150;
                  const str = annotation;
                  const aspect1 = (str.split('Actual Aspect Ratio (AR): ')[1].split('Ideal'));
                  const a1 = parseFloat(aspect1);
                  const aspect2 = str.split('Ideal AR: ')[1];
                  const a2 = parseFloat(aspect2);
                  drawThumbAR(l_margin, l_width, l_height, local_xr, local_yr, local_data, div2, ORIG_OFFSET, a1, a2, annotation);
                  //set timeout for Aspect Popup
                  setTimeout(() => {
                    //Wilkinson
                    // WilkinsonPopup -- id
                    const a = document.getElementById('WhatIsAspectRatio');
                    a.addEventListener('click', function() {

                      wpd.popup.show('WhatIsAspectRatio');

                      const closer = document.getElementById('CloseAspectPopup');
                      closer.addEventListener('click', function() {
                        wpd.popup.close('WhatIsAspectRatio');
                      });

                    });

                  }, 500);


                  //set timeout for Aspect Popup
                  setTimeout(() => {
                    //Wilkinson
                    // WilkinsonPopup -- id
                    const arp = document.getElementById('WhatIsAspectRatio');
                    arp.addEventListener('click', function() {

                      wpd.popup.show('AspectPopup');

                      const closer = document.getElementById('CloseAspectPopup');
                      closer.addEventListener('click', function() {
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
                    document.getElementById('WilkinsonAdvice').addEventListener('click', function() {
                    });

                    //set timeout for wilkinson
                    setTimeout(() => {
                      //Wilkinson
                      // WilkinsonPopup -- id
                      const wilk = document.getElementById('WilkinsonAdvice');
                      wilk.addEventListener('click', function() {
                        console.log('wilkinson popup');
                        wpd.popup.show('WilkinsonPopup');

                        const closer = document.getElementById('CloseStepSize');
                        closer.addEventListener('click', function() {
                          wpd.popup.close('WilkinsonPopup');
                        });

                      });

                    }, 500);
                  } catch (e) {
                    console.log('log');
                  }


                }
                div2.transition()
                  .duration(200)
                  .style('opacity', .85);

                div2.style('left', (d3.event.pageX) + 'px')
                  .style('top', (d3.event.pageY) + 2.75 * VERTICAL_OFFSET + 'px');
              });

            var g = canvas.append('g')
              .attr('x', coords[0] + OFFSET)
              .attr('y', coords[1]);
            g.append('rect')
              .attr('x', coords[0] + OFFSET)
              .attr('y', coords[1]);


          }
        })

        .catch(function(error) {
          console.log('stl: ', error);
        });
    }
  );


}

const completeAnalysisButton = document.getElementById('CompleteAnalysis');
completeAnalysisButton.addEventListener('click', function() {
  completeAnalysis();
});


//need to hide the mainCanvas
// const mc = document.getElementById('mainCanvas');
// mc.setAttribute()

const infoBoxGlobal = '<g width="30px" height="30px" class="infoBoxSVG" fill="#000000">' +
  ' <path d="m80 15c-35.88 0-65 29.12-65 65s29.12 65 65 65 65-29.12 65-65-29.12-65-65-65zm0 10c30.36 0 55 24.64 55 55s-24.64 55-55 55-55-24.64-55-55 24.64-55 55-55z"/> <path d="m57.373 18.231a9.3834 9.1153 0 1 1 -18.767 0 9.3834 9.1153 0 1 1 18.767 0z" transform="matrix(1.1989 0 0 1.2342 21.214 28.75)"/> <path d="m90.665 110.96c-0.069 2.73 1.211 3.5 4.327 3.82l5.008 0.1v5.12h-39.073v-5.12l5.503-0.1c3.291-0.1 4.082-1.38 4.327-3.82v-30.813c0.035-4.879-6.296-4.113-10.757-3.968v-5.074l30.665-1.105"/> </g>';

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


  var dataset = local_data.map(function(d) {
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
    .x(function(d, i) {
      return xScale(d.x);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.y);
    });

  var line2 = d3.line()
    .x(function(d, i) {
      return xScale2(d.x);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale2(d.y);
    });


  const EXPAND_WIDTH = 80;
  const EXPAND_HEIGHT = 260;
  var svg = div2.append('svg')
    .attr('width', l_width + l_margin.left + l_margin.right + EXPAND_WIDTH)
    .attr('height', l_height + l_margin.top + l_margin.bottom + EXPAND_HEIGHT)
    .append('g')
    .attr('transform', 'translate(' + (l_margin.left - OFFSET) + ',' + (l_margin.top) + ')');


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
    .attr('transform', 'translate(190,' + SHIFT_DOWN + ')')
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
    .x(function(d, i) {
      return xScale(d.x);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.y);
    });

  var line2 = d3.line()
    .x(function(d, i) {
      return xScale2(d.x);
    })
    .y(function(d) {
      return yScale2(d.y);
    });

  var dataset = local_data.map(function(d) {
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
    .attr('x', 210)
    .attr('y', -15 + split_up.length * SPACING)
    .attr('text-anchor', 'middle')
    .attr('fill', '#67a9cf')
    .attr('z-index', 10000000000)
    .text('Y-axis Starts at 0');

  const SHIFT_DOWN = split_up.length * SPACING;
  const SHIFT_RIGHT = 40;

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
    .attr('transform', 'translate(160,' + (l_height + SHIFT_DOWN) + ')')
    .call(d3.axisBottom(xScale).ticks(0)); // Create an axis component with d3.axisBottom
  // .attr("transform", "translate(" + (l_margin.left - OFFSET) + "," + (l_margin.top) + ")");


  //yaxis
  svg.append('g')
    .style('font', '11px Segoe UI')
    .attr('class', 'yaxisred')
    .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
    .call(d3.axisLeft(yScale).ticks(3));

  //second yaxis
  svg.append('g')
    .style('font', '11px Segoe UI')
    .attr('class', 'yaxisgreen')
    .attr('transform', 'translate(160,' + SHIFT_DOWN + ')')
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
    .attr('transform', 'translate(160,' + SHIFT_DOWN + ')')
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
    .x(function(d, i) {
      return xScale(d.x);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.y);
    });

  var line2 = d3.line()
    .x(function(d, i) {
      return xScale2(d.x);
    })
    .y(function(d) {
      return yScale2(d.y);
    });

  var dataset = local_data.map(function(d) {
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
    .attr('x', 200)
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
    .call(d3.axisBottom(xScale).ticks(0)); // Create an axis component with d3.axisBottom

  //second xaxis
  svg.append('g')
    .attr('class', 'xaxisblack')
    .attr('color', 'black')
    .attr('transform', 'translate(160,' + (l_height + SHIFT_DOWN) + ')')
    .call(d3.axisBottom(xScale).ticks(0)); // Create an axis component with d3.axisBottom
  // .attr("transform", "translate(" + (l_margin.left - OFFSET) + "," + (l_margin.top) + ")");


  //yaxis
  svg.append('g')
    .style('font', '11px Segoe UI')
    .attr('class', 'yaxisred')
    .attr('transform', 'translate(' + SHIFT_RIGHT + ',' + SHIFT_DOWN + ')')
    .call(d3.axisLeft(yScale).ticks(3));

  //second yaxis
  svg.append('g')
    .style('font', '11px Segoe UI')
    .attr('class', 'yaxisgreen')
    .attr('transform', 'translate(160,' + SHIFT_DOWN + ')')
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
    .attr('transform', 'translate(160,' + SHIFT_DOWN + ')')
    .attr('d', line2); // 11. Calls the line generator
}


