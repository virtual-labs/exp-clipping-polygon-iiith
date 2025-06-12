let canvas = document.getElementById("canvas");
var heightRatio = 1;
canvas.height = canvas.width * heightRatio;
resize(canvas);
let ctx = canvas.getContext("2d");
let status = 0;
let statusPrev = [];
statusPrev[0] = status;
window.devicePixelRatio = 2;
let width = 1200;
let height = 600;
let scale = window.devicePixelRatio;
canvas.width = Math.floor(width * scale);
canvas.height = Math.floor(height * scale);
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.scale(scale, scale);
ctx.font = "10px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
let x = width / 2;
let y = height / 2;
let noofLines = 5;
let currentLine = 0;
let previousLine = 0;
let topLeftRectX = document.getElementById("cnt-top-left-x").value;
let topLeftRectY = document.getElementById("cnt-top-left-y").value;
let bottomRightRectX = document.getElementById("cnt-bottom-right-x").value;
let bottomRightRectY = document.getElementById("cnt-bottom-right-y").value;
let nextButton = document.getElementById("next_button");
let submitButton = document.getElementById("submit");
let previousButton = document.getElementById("prev_button");
let resetButton = document.getElementById("reset_button");
let text = document.getElementById("text");
let logicText = document.getElementById("logic_text");
let pointStatText = document.getElementById("pointstat_text");
let lineStatText = document.getElementById("linestat_text");
let outputDiv= document.getElementById("output");
const PointsX = [],
  PointsY = [],
  initialPointsX = [],
  initialPointsY = [],
  dupPointsX = [],
  dupPointsY = [],
  lineCoordinatesX = [],
  lineCoordinatesY = [];
const prevPointsX = [],
  prevPointsY = [],
  prevdupPointsX = [],
  prevdupPointsY = [];
for (let i = 0; i < noofLines; i++) {
  prevPointsX[i] = [];
  prevPointsY[i] = [];
  prevdupPointsX[i] = [];
  prevdupPointsY[i] = [];
}
PointsX[0] = document.getElementById("firstPointX").value;
PointsY[0] = document.getElementById("firstPointY").value;
PointsX[1] = document.getElementById("secondPointX").value;
PointsY[1] = document.getElementById("secondPointY").value;
PointsX[2] = document.getElementById("thirdPointX").value;
PointsY[2] = document.getElementById("thirdPointY").value;
PointsX[3] = document.getElementById("FourthPointX").value;
PointsY[3] = document.getElementById("FourthPointY").value;
PointsX[4] = document.getElementById("FifthPointX").value;
PointsY[4] = document.getElementById("FifthPointY").value;

for (let i = 0; i < noofLines; i++) {
  initialPointsX[i] = PointsX[i];
  lineCoordinatesX[i] = PointsX[i];
  initialPointsY[i] = PointsY[i];
  lineCoordinatesY[i] = PointsY[i];
  dupPointsX[i] = PointsX[i];
  initialPointsY[i] = PointsY[i];
  dupPointsY[i] = PointsY[i];
}
let intersection_x,
  intersection_y,
  previousIntersection_x = [],
  previousIntersection_y = [];
let firstPoint = 5;
let secondPoint = 10;
let currentPoint = firstPoint;
let inside = 0;
let leftSide = 1;
let rightSide = 2;
let bottomSide = 4;
let topSide = 8;
let isDark = 0;
let ifCompleted = 0;
let firstPointStatus = 0;
let isClipped = 0;
let noOfIterations = 0,
  previousnoOfIterations = [];
(transitionIteration = 0), (previoustransitionIteration = []);
let noOfLinesClipped = 0;

// Add new variables to track intermediate vertices
let intermediateVertices = [];
let currentIntermediateVertices = [];

// Add at the top with other global variables
let stepHistory = [];
let currentStep = -1;

// Function to display intermediate vertices
function displayIntermediateVertices(vertices, color = "yellow") {
  // Clear previous vertices display
  const currentVerticesDiv = document.getElementById("current-vertices");
  currentVerticesDiv.innerHTML = "";
  
  // Draw vertices on canvas
  ctx.fillStyle = color;
  ctx.font = "12px Arial";
  for (let i = 0; i < vertices.length; i++) {
    const x = vertices[i].x;
    const y = vertices[i].y;
    
    // Draw point on canvas
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw coordinates next to point
    ctx.fillText(`(${Math.round(x)},${Math.round(y)})`, x + 5, y - 5);
    
    // Add to HTML display
    const vertexDiv = document.createElement("div");
    vertexDiv.innerHTML = `<span class="vertex-point"></span>(${Math.round(x)}, ${Math.round(y)})`;
    currentVerticesDiv.appendChild(vertexDiv);
  }
}

// Function to update intermediate vertices display
function updateIntermediateVerticesDisplay() {
  if (currentIntermediateVertices.length > 0) {
    // Clear previous canvas content
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the grid and clipping window
    grid();
    
    // Draw the clipping window
    drawLine(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "#fb0483");
    drawLine(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "#fb0483");
    drawLine(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "#fb0483");
    drawLine(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "#fb0483");
    
    // Draw the current intermediate vertices
    displayIntermediateVertices(currentIntermediateVertices);
    
    // Draw lines between vertices
    ctx.beginPath();
    ctx.moveTo(currentIntermediateVertices[0].x, currentIntermediateVertices[0].y);
    for (let i = 1; i < currentIntermediateVertices.length; i++) {
      ctx.lineTo(currentIntermediateVertices[i].x, currentIntermediateVertices[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function convertToBinary(x) {
  let bin = "";
  for (let i = 3; i >= 0; i--) {
    if (x & (1 << i)) {
      bin = bin + "1";
    } else {
      bin = bin + "0";
    }
  }
  return bin;
}
const toggleInstructions = document.getElementById("toggle-instructions");
const procedureMessage = document.getElementById("procedure-message");

// Function to show the instructions overlay
const showInstructions = () => {
  procedureMessage.style.display = "block";
};

// Function to hide the instructions overlay
const hideInstructions = (event) => {
  // Close if click is outside the overlay or if it's the toggle button again
  if (
    !procedureMessage.contains(event.target) &&
    event.target !== toggleInstructions
  ) {
    procedureMessage.style.display = "none";
  }
};

// Attach event listeners
toggleInstructions.addEventListener("click", (event) => {
  // Toggle the visibility of the overlay
  if (procedureMessage.style.display === "block") {
    procedureMessage.style.display = "none";
  } else {
    showInstructions();
  }
  event.stopPropagation(); // Prevent immediate closure after clicking the button
});

document.addEventListener("click", hideInstructions);

// Prevent closing the overlay when clicking inside it
procedureMessage.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent the click inside from closing the overlay
});

function coordinatesText(x, y) {
  ctx.fillStyle = "red";
  ctx.font = "16px serif";
  ctx.fillText("(" + x + "," + y + ")", x - 30, y - 10);
}
function drawLine(x1, y1, x2, y2, width, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 2 * width;
  ctx.strokeStyle = color;
  ctx.stroke();
}
function chooseLine() {
  console.log("chooseLine function called");
  if (noOfLinesClipped == 0) {
    lineStatText.innerHTML = "Clipping line 1";
  } else if (noOfLinesClipped == 1) {
    lineStatText.innerHTML = "Clipping line 2";
  } else if (noOfLinesClipped == 2) {
    lineStatText.innerHTML = "Clipping line 3";
  } else if (noOfLinesClipped == 3) {
    lineStatText.innerHTML = "Clipping line 4";
  } else if (noOfLinesClipped == 4) {
    lineStatText.innerHTML = "Clipping line 5";
  }
}
function point(colour1, colour2, colour3) {
  for (let i = 0; i < noofLines; i++) {
    ctx.beginPath();
    ctx.arc(PointsX[i], PointsY[i], 2, 0, 2 * Math.PI, false);
    ctx.lineWidth = 5;
    ctx.strokeStyle = colour1;
    ctx.stroke();
  }
  for (let i = 0; i < noofLines; i++) {
    ctx.font = "16px serif";
    ctx.fillText(
      "(" + parseInt(PointsX[i]) + "," + parseInt(PointsY[i]) + ")",
      parseInt(PointsX[i]),
      parseInt(PointsY[i] - 10)
    );
    ctx.fillStyle = colour3;
  }
  for (let i = 0; i < noofLines; i++) {
    ctx.font = "16px serif";
    ctx.fillText(
      "(" + parseInt(PointsX[i]) + "," + parseInt(PointsY[i]) + ")",
      parseInt(PointsX[i]),
      parseInt(PointsY[i] - 10)
    );
    ctx.fillStyle = colour2;
  }
}
function grid() {
  /* document.getElementById("text").style.font = "20px serif"; */
  point("blue", "red", "red");
  coordinatesText(topLeftRectX, topLeftRectY);
  coordinatesText(bottomRightRectX, bottomRightRectY);
  coordinatesText(topLeftRectX, bottomRightRectY);
  coordinatesText(bottomRightRectX, topLeftRectY);
  drawLine(0, 0, 0, height, 2, "yellow");
  drawLine(topLeftRectX, 0, topLeftRectX, height, 2, "yellow");
  drawLine(bottomRightRectX, 0, bottomRightRectX, height, 2, "yellow");
  drawLine(0, 0, width, 0, 2, "yellow");
  drawLine(0, topLeftRectY, width, topLeftRectY, 2, "yellow");
  drawLine(0, bottomRightRectY, width, bottomRightRectY, 2, "yellow");
}
function main() {
  grid();
  for (let i = 0; i < noofLines; i++) {
    drawLine(
      PointsX[i],
      PointsY[i],
      PointsX[(i + 1) % noofLines],
      PointsY[(i + 1) % noofLines],
      2,
      "white"
    );
  }
}

// Add this function to track steps
function saveStep() {
  const step = {
    currentLine: currentLine,
    status: status,
    isDark: isDark,
    firstPointStatus: firstPointStatus,
    currentPoint: currentPoint,
    intersection_x: intersection_x,
    intersection_y: intersection_y,
    PointsX: [...PointsX],
    PointsY: [...PointsY],
    dupPointsX: [...dupPointsX],
    dupPointsY: [...dupPointsY],
    noOfIterations: noOfIterations,
    transitionIteration: transitionIteration
  };
  
  // If we're going back and then making a new step, remove future steps
  if (currentStep < stepHistory.length - 1) {
    stepHistory = stepHistory.slice(0, currentStep + 1);
  }
  
  stepHistory.push(step);
  currentStep = stepHistory.length - 1;
  console.log("Step saved:", currentStep, "Total steps:", stepHistory.length);
}

// Update the check function to save steps
function check() {
  console.log("check function called with status:", status);
  console.log("currentLine:", currentLine, "firstPointStatus:", firstPointStatus);
  console.log("isDark:", isDark, "isClipped:", isClipped);

  if (isClipped == 1) {
    console.log("Final state - clipping complete");
    // Final state after all clipping is done
    currentIntermediateVertices = clipAgainstTop(currentIntermediateVertices, bottomRightRectY);
    
    // Update all text elements with completion message
    const completionMessage = "Clipping process finished";
    renderObservations(completionMessage);
    text.innerHTML = "Polygon Clipping Complete";
    logicText.innerHTML = "All edges have been clipped";
    pointStatText.innerHTML = "Final vertices shown in table";
    lineStatText.innerHTML = "Clipping process finished";

    // Disable the next button
    const nextButton = document.getElementById("next-button");
    if (nextButton) {
      nextButton.disabled = true;
      nextButton.style.opacity = "0.5";
      nextButton.style.cursor = "not-allowed";
      nextButton.style.pointerEvents = "none";
      nextButton.title = "Clipping process is complete";
    }

    // Draw the final line
    drawLine(
      PointsX[currentLine],
      PointsY[currentLine],
      PointsX[(currentLine + 1) % noofLines],
      PointsY[(currentLine + 1) % noofLines],
      2,
      "#fb0483"
    );
    return;
  } else if (status == 0) {
    console.log("Status 0 - Initial state");
    // Initialize vertices for left edge clipping
    currentIntermediateVertices = [];
    for (let i = 0; i < noofLines; i++) {
      currentIntermediateVertices.push({ x: Number(PointsX[i]), y: Number(PointsY[i]) });
    }
    renderObservations("Starting polygon clipping.");
    text.innerHTML = "Left edge is selected for clipping";
    logicText.innerHTML = "Checking if point is inside left boundary";
    pointStatText.innerHTML = firstPointStatus === 0 ? "First Point is Selected" : "Second Point is Selected";
    lineStatText.innerHTML = "Line " + (currentLine + 1) + " selected";

  if (noOfIterations == 1) {
    statusPrev[currentLine] = status;
  }

    if ((currentPoint == 0 && firstPointStatus == 1) ||
    findintersection(
      PointsX[currentLine],
      PointsX[(currentLine + 1) % noofLines],
      PointsY[currentLine],
      PointsY[(currentLine + 1) % noofLines],
      "#606060"
        ) == 0) {
    noOfLinesClipped++;
    if (noOfLinesClipped == noofLines) {
      isClipped = 1;
      return;
    }
    moveToNextLine();
  }

  if (currentPoint == 0 && firstPointStatus == 0) {
    currentPoint = secondPoint;
    firstPointStatus = 1;
    transitionIteration = noOfIterations;
  }

    if (isDark == 0) {
      console.log("Drawing left edge in blue");
      drawLine(
        topLeftRectX,
        topLeftRectY,
        topLeftRectX,
        bottomRightRectY,
        2,
        "blue"
      );
      isDark = 1;
    } else {
      if ((leftSide & currentPoint) != 0) {
        point("#606060", "#606060", "#606060");
        intersection();
        if (firstPointStatus == 0) {
          point("blue", "red", "red");
          ifCompleted++;
        }
      }
      drawLine(
        topLeftRectX,
        topLeftRectY,
        topLeftRectX,
        bottomRightRectY,
        2,
        "yellow"
      );
      status = 1; // Changed from 2 to 1 to maintain correct sequence
      isDark = 0;
    }
  } else if (status == 1) {
    console.log("Status 1 - Right edge clipping");
    currentIntermediateVertices = clipAgainstRight(currentIntermediateVertices, Number(bottomRightRectX));
    renderObservations("Clipping against right edge (x = " + bottomRightRectX + ")");
    text.innerHTML = "Right edge is selected for clipping";
    logicText.innerHTML = "Checking if point is inside right boundary";
    pointStatText.innerHTML = firstPointStatus === 0 ? "First Point is Selected" : "Second Point is Selected";
    lineStatText.innerHTML = "Clipping line " + (currentLine + 1);

    if (isDark == 0) {
      console.log("Drawing right edge in blue");
      drawLine(
        bottomRightRectX,
        topLeftRectY,
        bottomRightRectX,
        bottomRightRectY,
        2,
        "blue"
      );
      isDark = 1;
    } else {
      if ((rightSide & currentPoint) != 0) {
        ifCompleted++;
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      drawLine(
        bottomRightRectX,
        topLeftRectY,
        bottomRightRectX,
        bottomRightRectY,
        2,
        "yellow"
      );
      status = 2; // Changed from 3 to 2 to maintain correct sequence
      isDark = 0;
    }
  } else if (status == 2) {
    console.log("Status 2 - Bottom edge clipping");
    currentIntermediateVertices = clipAgainstBottom(currentIntermediateVertices, Number(topLeftRectY));
    renderObservations("Clipping against bottom edge (y = " + topLeftRectY + ")");
    text.innerHTML = "Bottom edge is selected for clipping";
    logicText.innerHTML = "Checking if point is inside bottom boundary";
    pointStatText.innerHTML = firstPointStatus === 0 ? "First Point is Selected" : "Second Point is Selected";
    lineStatText.innerHTML = "Clipping line " + (currentLine + 1);

    if (isDark == 0) {
      console.log("Drawing bottom edge in blue");
      drawLine(
        topLeftRectX,
        bottomRightRectY,
        bottomRightRectX,
        bottomRightRectY,
        2,
        "blue"
      );
      isDark = 1;
    } else {
      if ((bottomSide & currentPoint) != 0) {
        ifCompleted++;
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      drawLine(
        topLeftRectX,
        bottomRightRectY,
        bottomRightRectX,
        bottomRightRectY,
        2,
        "yellow"
      );
      status = 3; // Changed from 1 to 3 to maintain correct sequence
      isDark = 0;
    }
  } else if (status == 3) {
    console.log("Status 3 - Top edge clipping");
    currentIntermediateVertices = clipAgainstTop(currentIntermediateVertices, Number(bottomRightRectY));
    renderObservations("Clipping against top edge (y = " + bottomRightRectY + ")");
    text.innerHTML = "Top edge is selected for clipping";
    logicText.innerHTML = "Checking if point is inside top boundary";
    pointStatText.innerHTML = firstPointStatus === 0 ? "First Point is Selected" : "Second Point is Selected";
    lineStatText.innerHTML = "Clipping line " + (currentLine + 1);

    if (isDark == 0) {
      console.log("Drawing top edge in blue");
      drawLine(
        topLeftRectX,
        topLeftRectY,
        bottomRightRectX,
        topLeftRectY,
        2,
        "blue"
      );
      isDark = 1;
    } else {
      if ((topSide & currentPoint) != 0) {
        ifCompleted++;
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      drawLine(
        topLeftRectX,
        topLeftRectY,
        bottomRightRectX,
        topLeftRectY,
        2,
        "yellow"
      );
      status = 0; // Reset to 0 for next line
      isDark = 0;
    }
  }

  noOfIterations++;
  console.log("End of check function - noOfIterations:", noOfIterations);
  
  // Save the current step before making changes
  saveStep();
}
function findintersection(x1, x2, y1, y2, colour) {
  if (
    (x1 - topLeftRectX <= 0 && x2 - topLeftRectX <= 0) ||
    (x1 - bottomRightRectX >= 0 && x2 - bottomRightRectX >= 0) ||
    (y1 - topLeftRectY <= 0 && y2 - topLeftRectY <= 0) ||
    (y1 - bottomRightRectY >= 0 && y2 - bottomRightRectY >= 0)
  ) {
    drawLine(x1, y1, x2, y2, 2, colour);
    return 0;
  }
  let slope = (y2 - y1) / (x2 - x1);
  let y_intercept = y1 - slope * x1;
  let variable = 0;
  if (
    slope * topLeftRectX + y_intercept < topLeftRectY ||
    slope * topLeftRectX + y_intercept > bottomRightRectY
  ) {
    variable = variable + 1;
  }
  if (
    slope * bottomRightRectX + y_intercept < topLeftRectY ||
    slope * bottomRightRectX + y_intercept > bottomRightRectY
  ) {
    variable = variable + 1;
  }
  if (
    (bottomRightRectY - y_intercept) / slope < topLeftRectX ||
    (bottomRightRectY - y_intercept) / slope > bottomRightRectX
  ) {
    variable = variable + 1;
  }
  if (
    (topLeftRectY - y_intercept) / slope < topLeftRectX ||
    (topLeftRectY - y_intercept) / slope > bottomRightRectX
  ) {
    variable = variable + 1;
  }
  if (variable == 4) {
    drawLine(x1, y1, x2, y2, 2, colour);
    return 0;
  } else {
    return 1;
  }
}
function intersection() {
  if (status == 0) {
    let slope =
      (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) /
      (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
    let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
    intersection_y = slope * topLeftRectX + y_intercept;
    intersection_x = topLeftRectX;
    ctx.beginPath();
    if (firstPointStatus == 0) {
      ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
    } else {
      ctx.moveTo(
        dupPointsX[(currentLine + 1) % noofLines],
        dupPointsY[(currentLine + 1) % noofLines]
      );
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (firstPointStatus == 0) {
      dupPointsX[currentLine] = PointsX[currentLine];
      dupPointsY[currentLine] = PointsY[currentLine];
      PointsX[currentLine] = intersection_x;
      PointsY[currentLine] = intersection_y;
    } else {
      dupPointsX[(currentLine + 1) % noofLines] =
        PointsX[(currentLine + 1) % noofLines];
      dupPointsY[(currentLine + 1) % noofLines] =
        PointsY[(currentLine + 1) % noofLines];
      PointsX[(currentLine + 1) % noofLines] = intersection_x;
      PointsY[(currentLine + 1) % noofLines] = intersection_y;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    currentPoint = currentPoint & (15 - leftSide);
  } else if (status == 1) {
    let slope =
      (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) /
      (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
    let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
    intersection_y = slope * bottomRightRectX + y_intercept;
    intersection_x = bottomRightRectX;
    ctx.beginPath();
    if (firstPointStatus == 0) {
      ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
    } else {
      ctx.moveTo(
        dupPointsX[(currentLine + 1) % noofLines],
        dupPointsY[(currentLine + 1) % noofLines]
      );
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (firstPointStatus == 0) {
      dupPointsX[currentLine] = PointsX[currentLine];
      dupPointsY[currentLine] = PointsY[currentLine];
      PointsX[currentLine] = intersection_x;
      PointsY[currentLine] = intersection_y;
    } else {
      dupPointsX[(currentLine + 1) % noofLines] =
        PointsX[(currentLine + 1) % noofLines];
      dupPointsY[(currentLine + 1) % noofLines] =
        PointsY[(currentLine + 1) % noofLines];
      PointsX[(currentLine + 1) % noofLines] = intersection_x;
      PointsY[(currentLine + 1) % noofLines] = intersection_y;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    currentPoint = currentPoint & (15 - rightSide);
  } else if (status == 2) {
    let slope =
      (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) /
      (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
    let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
    intersection_x = (bottomRightRectY - y_intercept) / slope;
    intersection_y = bottomRightRectY;
    ctx.beginPath();
    if (firstPointStatus == 0) {
      ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
    } else {
      ctx.moveTo(
        dupPointsX[(currentLine + 1) % noofLines],
        dupPointsY[(currentLine + 1) % noofLines]
      );
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (firstPointStatus == 0) {
      dupPointsX[currentLine] = PointsX[currentLine];
      dupPointsY[currentLine] = PointsY[currentLine];
      PointsX[currentLine] = intersection_x;
      PointsY[currentLine] = intersection_y;
    } else {
      dupPointsX[(currentLine + 1) % noofLines] =
        PointsX[(currentLine + 1) % noofLines];
      dupPointsY[(currentLine + 1) % noofLines] =
        PointsY[(currentLine + 1) % noofLines];
      PointsX[(currentLine + 1) % noofLines] = intersection_x;
      PointsY[(currentLine + 1) % noofLines] = intersection_y;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    currentPoint = currentPoint & (15 - bottomSide);
  } else if (status == 3) {
    let slope =
      (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) /
      (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
    let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
    intersection_x = (topLeftRectY - y_intercept) / slope;
    intersection_y = topLeftRectY;
    ctx.beginPath();
    if (firstPointStatus == 0) {
      ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
    } else {
      ctx.moveTo(
        dupPointsX[(currentLine + 1) % noofLines],
        dupPointsY[(currentLine + 1) % noofLines]
      );
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (firstPointStatus == 0) {
      dupPointsX[currentLine] = PointsX[currentLine];
      dupPointsY[currentLine] = PointsY[currentLine];
      PointsX[currentLine] = intersection_x;
      PointsY[currentLine] = intersection_y;
    } else {
      dupPointsX[(currentLine + 1) % noofLines] =
        PointsX[(currentLine + 1) % noofLines];
      dupPointsY[(currentLine + 1) % noofLines] =
        PointsY[(currentLine + 1) % noofLines];
      PointsX[(currentLine + 1) % noofLines] = intersection_x;
      PointsY[(currentLine + 1) % noofLines] = intersection_y;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    currentPoint = currentPoint & (15 - topSide);
  }
}

main();

nextButton.addEventListener("click", () => {
  console.log("Next button clicked");
  check();
});

previousButton.addEventListener("click", () => {
  console.log("Previous button clicked");
  prev();
});

resetButton.addEventListener("click", () => {
  console.log("Reset button clicked");
  main();
});

// Comment out mobile button listeners
// document.getElementById("next_button_mobile").addEventListener("click", check);
// document.getElementById("prev_button_mobile").addEventListener("click", previousLineChange);
// document.getElementById("reset_button_mobile").addEventListener("click", () => location.reload());

// Comment out the line that sets innerHTML for the non-existent 'text' element
// text.innerHTML = "<br> <br> Left edge is selected for clipping the line aganist the left point";

function computeNewPointsBinary(PointsX, PointsY, x, y) {
  firstPoint = 0;
  secondPoint = 0;
  if (PointsX[x] - topLeftRectX < 0) {
    firstPoint = firstPoint + Math.pow(2, 0);
  }
  if (PointsX[x] - bottomRightRectX > 0) {
    firstPoint = firstPoint + Math.pow(2, 1);
  }
  if (PointsY[x] - bottomRightRectY > 0) {
    firstPoint = firstPoint + Math.pow(2, 2);
  }
  if (PointsY[x] - topLeftRectY < 0) {
    firstPoint = firstPoint + Math.pow(2, 3);
  }

  if (PointsX[y] - topLeftRectX < 0) {
    secondPoint = secondPoint + Math.pow(2, 0);
  }
  if (PointsX[y] - bottomRightRectX > 0) {
    secondPoint = secondPoint + Math.pow(2, 1);
  }
  if (PointsY[y] - bottomRightRectY > 0) {
    secondPoint = secondPoint + Math.pow(2, 2);
  }
  if (PointsY[y] - topLeftRectY < 0) {
    secondPoint = secondPoint + Math.pow(2, 3);
  }
}
submitButton.addEventListener("click", () => {
  if (noOfIterations == 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    topLeftRectX = document.getElementById("cnt-top-left-x").value;
    topLeftRectY = document.getElementById("cnt-top-left-y").value;
    bottomRightRectX = document.getElementById("cnt-bottom-right-x").value;
    bottomRightRectY = document.getElementById("cnt-bottom-right-y").value;
    PointsX[0] = document.getElementById("firstPointX").value;
    PointsY[0] = document.getElementById("firstPointY").value;
    PointsX[1] = document.getElementById("secondPointX").value;
    PointsY[1] = document.getElementById("secondPointY").value;
    PointsX[2] = document.getElementById("thirdPointX").value;
    PointsY[2] = document.getElementById("thirdPointY").value;
    PointsX[3] = document.getElementById("FourthPointX").value;
    PointsY[3] = document.getElementById("FourthPointY").value;
    PointsX[4] = document.getElementById("FifthPointX").value;
    PointsY[4] = document.getElementById("FifthPointY").value;
    for (let i = 0; i < noofLines; i++) {
      initialPointsX[i] = PointsX[i];
      dupPointsX[i] = PointsX[i];
      initialPointsY[i] = PointsY[i];
      dupPointsY[i] = PointsY[i];
    }
    computeNewPointsBinary(PointsX, PointsY, 0, 1);
    if (firstPointStatus == 0) {
      currentPoint = firstPoint;
    } else {
      currentPoint = secondPoint;
    }
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();
    grid();
    currentLine = 0;
    for (let i = 0; i < noofLines; i++) {
      drawLine(
        PointsX[i],
        PointsY[i],
        PointsX[(i + 1) % noofLines],
        PointsY[(i + 1) % noofLines],
        2,
        "white"
      );
    }
  }
});

resetButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fill();
  grid();
  for (let i = 0; i < noofLines; i++) {
    PointsX[i] = initialPointsX[i];
    PointsY[i] = initialPointsY[i];
    dupPointsX[i] = initialPointsX[i];
    dupPointsY[i] = initialPointsY[i];
  }
  for (let i = 0; i < noofLines; i++) {
    drawLine(
      PointsX[i],
      PointsY[i],
      PointsX[(i + 1) % noofLines],
      PointsY[(i + 1) % noofLines],
      2,
      "white"
    );
  }
  status = 0;
  statusPrev = [];
  statusPrev[0] = status;
  currentLine = 0;
  previousLine = 0;
  for (let i = 0; i < noofLines; i++) {
    prevPointsX[i] = [];
    prevPointsY[i] = [];
    prevdupPointsX[i] = [];
    prevdupPointsY[i] = [];
  }
  intersection_x,
    intersection_y,
    (previousIntersection_x = []),
    (previousIntersection_y = []);
  computeNewPointsBinary(PointsX, PointsY, 0, 1);
  currentPoint = firstPoint;
  inside = 0;
  isDark = 0;
  ifCompleted = 0;
  firstPointStatus = 0;
  isClipped = 0;
  (noOfIterations = 0), (previousnoOfIterations = []);
  (transitionIteration = 0), (previoustransitionIteration = []);
  noOfLinesClipped = 0;
  text.innerHTML = "";
  logicText.innerHTML = "";
  pointStatText.innerHTML = "";
  lineStatText.innerHTML = "";
  outputDiv.innerHTML = "";
});
function resize(canvas) {
  var displayWidth = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = 2 * displayWidth;
    canvas.height = displayHeight;
  }
}
function redraw() {
  console.log("Redrawing state for line:", currentLine, "with status:", status);
  
  // Draw the axes first
  drawLine(0, canvas.height / 2, canvas.width, canvas.height / 2, 1, "black");
  drawLine(canvas.width / 2, 0, canvas.width / 2, canvas.height, 1, "black");
  
  // Draw the clipping window
  drawLine(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "black");
  drawLine(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "black");
  drawLine(bottomRightRectX, bottomRightRectY, topLeftRectX, bottomRightRectY, 2, "black");
  drawLine(topLeftRectX, bottomRightRectY, topLeftRectX, topLeftRectY, 2, "black");
  
  // Draw all polygon lines
  for (let i = 0; i < noofLines; i++) {
    if (i === currentLine) {
      // Draw current line in pink
      drawLine(
        PointsX[i],
        PointsY[i],
        PointsX[(i + 1) % noofLines],
        PointsY[(i + 1) % noofLines],
        2,
        "#fb0483"
      );
    } else {
      // Draw other lines in their original color
      drawLine(
        PointsX[i],
        PointsY[i],
        PointsX[(i + 1) % noofLines],
        PointsY[(i + 1) % noofLines],
        2,
        "black"
      );
    }
  }
  
  // Draw the current edge being clipped
  if (status === 0) {
      drawLine(
        topLeftRectX,
        topLeftRectY,
        topLeftRectX,
        bottomRightRectY,
        2,
      isDark ? "yellow" : "blue"
      );
  } else if (status === 1) {
      drawLine(
        bottomRightRectX,
        topLeftRectY,
      bottomRightRectX,
      bottomRightRectY,
        2,
      isDark ? "yellow" : "blue"
      );
  } else if (status === 2) {
      drawLine(
        topLeftRectX,
        bottomRightRectY,
        bottomRightRectX,
        bottomRightRectY,
        2,
      isDark ? "yellow" : "blue"
      );
  } else if (status === 3) {
      drawLine(
        topLeftRectX,
        topLeftRectY,
        bottomRightRectX,
        topLeftRectY,
        2,
      isDark ? "yellow" : "blue"
    );
  }
  
  // Draw intersection points if they exist
  if (intersection_x !== undefined && intersection_y !== undefined) {
    point("#606060", "#606060", "#606060");
  }
}
function prev() {
  console.log("Prev button clicked");
  console.log("Current step:", currentStep, "Total steps:", stepHistory.length);
  
  if (currentStep <= 0) {
    console.log("Already at the first step, can't go back");
    // Disable prev button
    const prevButton = document.getElementById("prev-button");
    if (prevButton) {
      prevButton.disabled = true;
      prevButton.style.opacity = "0.5";
      prevButton.style.cursor = "not-allowed";
      prevButton.style.pointerEvents = "none";
      prevButton.title = "Already at the first step";
    }
    // Update observation message
    renderObservations("Already at the first step - Starting polygon clipping.");
    return;
  }
  
  // Enable prev button if it was disabled
  const prevButton = document.getElementById("prev-button");
  if (prevButton) {
    prevButton.disabled = false;
    prevButton.style.opacity = "1";
    prevButton.style.cursor = "pointer";
    prevButton.style.pointerEvents = "auto";
    prevButton.title = "Go to previous step";
  }
  
  // Go back one step
  currentStep--;
  const step = stepHistory[currentStep];
  
  // Restore the state from the step
  currentLine = step.currentLine;
  status = step.status;
  isDark = step.isDark;
  firstPointStatus = step.firstPointStatus;
  currentPoint = step.currentPoint;
  intersection_x = step.intersection_x;
  intersection_y = step.intersection_y;
  
  // Restore points by updating array elements
  for (let i = 0; i < noofLines; i++) {
    PointsX[i] = step.PointsX[i];
    PointsY[i] = step.PointsY[i];
    dupPointsX[i] = step.dupPointsX[i];
    dupPointsY[i] = step.dupPointsY[i];
  }
  
  // Restore iteration counts
  noOfIterations = step.noOfIterations;
  transitionIteration = step.transitionIteration;
  
  // Update the observations with consistent messages
  if (status === 0) {
    renderObservations("Starting polygon clipping.");
    text.innerHTML = "Left edge is selected for clipping";
    logicText.innerHTML = "Checking if point is inside left boundary";
  } else if (status === 1) {
    renderObservations("Clipping against right edge (x = " + bottomRightRectX + ")");
    text.innerHTML = "Right edge is selected for clipping";
    logicText.innerHTML = "Checking if point is inside right boundary";
  } else if (status === 2) {
    renderObservations("Clipping against bottom edge (y = " + topLeftRectY + ")");
    text.innerHTML = "Bottom edge is selected for clipping";
    logicText.innerHTML = "Checking if point is inside bottom boundary";
  } else if (status === 3) {
    renderObservations("Clipping against top edge (y = " + bottomRightRectY + ")");
    text.innerHTML = "Top edge is selected for clipping";
    logicText.innerHTML = "Checking if point is inside top boundary";
  }
  
  // Update point and line status
  pointStatText.innerHTML = firstPointStatus === 0 ? "First Point is Selected" : "Second Point is Selected";
  lineStatText.innerHTML = "Line " + (currentLine + 1) + " selected";
  
  console.log("State restored to step:", currentStep);
}
function moveToNextLine() {
  console.log("Moving to next line. Current line:", currentLine);
  
  // Save current state before moving to next line
  previousIntersection_x[currentLine] = intersection_x;
  previousIntersection_y[currentLine] = intersection_y;
  for (let i = 0; i < noofLines; i++) {
    prevPointsX[i][currentLine] = PointsX[i];
    prevPointsY[i][currentLine] = PointsY[i];
    prevdupPointsX[i][currentLine] = dupPointsX[i];
    prevdupPointsY[i][currentLine] = dupPointsY[i];
  }
  previousnoOfIterations[currentLine] = noOfIterations - 1;
  previoustransitionIteration[currentLine] = transitionIteration;
  
  // Reset points to initial state
  for (let i = 0; i < noofLines; i++) {
    PointsX[i] = initialPointsX[i];
    PointsY[i] = initialPointsY[i];
    dupPointsX[i] = PointsX[i];
    dupPointsY[i] = PointsY[i];
  }
  
  previousLine = currentLine;
  currentLine = (currentLine + 1) % noofLines;
  firstPointStatus = 0;
  noOfIterations = 0;
  transitionIteration = 0;
  isDark = 0;
  
  // Compute new points for the current line
  computeNewPointsBinary(
    PointsX,
    PointsY,
    currentLine,
    (currentLine + 1) % noofLines
  );
  
  if (firstPointStatus == 0) {
    currentPoint = firstPoint;
  } else {
    currentPoint = secondPoint;
  }

  // Check if we've completed all lines
  if (noOfLinesClipped >= noofLines) {
    console.log("All lines clipped, marking as complete");
    isClipped = 1;
    // Trigger the completion state
    check();
    return; // Exit after triggering completion
  }
}

function startClipping() {
  const vertices = [];
  for (let i = 0; i < noofLines; i++) {
    vertices.push({ x: PointsX[i], y: PointsY[i] });
  }
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw the grid and clipping window
  grid();
  
  // Draw the clipping window
  drawLine(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "#fb0483");
  drawLine(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "#fb0483");
  drawLine(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "#fb0483");
  drawLine(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "#fb0483");
  
  const clippedVertices = clipPolygonSutherlandHodgeman(
    vertices,
    topLeftRectX,
    topLeftRectY,
    bottomRightRectX,
    bottomRightRectY
  );
  
  // Draw the final clipped polygon
  ctx.beginPath();
  ctx.moveTo(clippedVertices[0].x, clippedVertices[0].y);
  for (let i = 1; i < clippedVertices.length; i++) {
    ctx.lineTo(clippedVertices[i].x, clippedVertices[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Display final vertices
  displayIntermediateVertices(clippedVertices, "white");
}

function clipPolygonSutherlandHodgeman(vertices, xmin, ymin, xmax, ymax) {
  let result = vertices;
  currentIntermediateVertices = [...vertices];
  
  // Show initial vertices
  updateIntermediateVerticesDisplay();
  
  // Clip against each boundary
  result = clipAgainstLeft(result, xmin);
  currentIntermediateVertices = [...result];
  updateIntermediateVerticesDisplay();
  
  result = clipAgainstTop(result, ymax);
  currentIntermediateVertices = [...result];
  updateIntermediateVerticesDisplay();
  
  result = clipAgainstRight(result, xmax);
  currentIntermediateVertices = [...result];
  updateIntermediateVerticesDisplay();
  
  result = clipAgainstBottom(result, ymin);
  currentIntermediateVertices = [...result];
  updateIntermediateVerticesDisplay();
  
  return result;
}

function clipAgainstLeft(vertices, xmin) {
  let result = [];
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    
    if (current.x >= xmin) {
      result.push(current);
    }
    
    if ((current.x < xmin && next.x >= xmin) || (current.x >= xmin && next.x < xmin)) {
      const intersection = {
        x: xmin,
        y: current.y + (next.y - current.y) * (xmin - current.x) / (next.x - current.x)
      };
      result.push(intersection);
    }
  }
  return result;
}

function clipAgainstTop(vertices, ymax) {
  let result = [];
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    
    if (current.y <= ymax) {
      result.push(current);
    }
    
    if ((current.y > ymax && next.y <= ymax) || (current.y <= ymax && next.y > ymax)) {
      const intersection = {
        x: current.x + (next.x - current.x) * (ymax - current.y) / (next.y - current.y),
        y: ymax
      };
      result.push(intersection);
    }
  }
  return result;
}

function clipAgainstRight(vertices, xmax) {
  let result = [];
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    
    if (current.x <= xmax) {
      result.push(current);
    }
    
    if ((current.x > xmax && next.x <= xmax) || (current.x <= xmax && next.x > xmax)) {
      const intersection = {
        x: xmax,
        y: current.y + (next.y - current.y) * (xmax - current.x) / (next.x - current.x)
      };
      result.push(intersection);
    }
  }
  return result;
}

function clipAgainstBottom(vertices, ymin) {
  let result = [];
  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    
    if (current.y >= ymin) {
      result.push(current);
    }
    
    if ((current.y < ymin && next.y >= ymin) || (current.y >= ymin && next.y < ymin)) {
      const intersection = {
        x: current.x + (next.x - current.x) * (ymin - current.y) / (next.y - current.y),
        y: ymin
      };
      result.push(intersection);
    }
  }
  return result;
}

function displayClippedVertices(vertices) {
  outputDiv.innerHTML = "<strong>Clipped Polygon Vertices:</strong><br>";
  for (let vertex of vertices) {
    let flooredX = Math.floor(vertex[0]);
    let flooredY = Math.floor(vertex[1]);
    outputDiv.innerHTML += `(${flooredX}, ${flooredY}),`;
  }
}

// Add event listeners for mobile buttons
// document.getElementById("next_button_mobile").addEventListener("click", check);
// document.getElementById("prev_button_mobile").addEventListener("click", previousLineChange);
// document.getElementById("reset_button_mobile").addEventListener("click", () => location.reload());

function renderObservations(stepMessage) {
  // Update the step message
  const stepMsgDiv = document.getElementById("observation-step-message");
  if (stepMsgDiv) {
    stepMsgDiv.innerHTML = stepMessage || "";
  }

  // Render the intermediate vertices in the table format
  const table = document.getElementById("observations-table");
  if (table) {
    const tbody = table.querySelector('.table-body');
    if (tbody) {
      tbody.innerHTML = ""; // Clear previous observations
      
      // Add vertices
      for (let i = 0; i < currentIntermediateVertices.length; i++) {
        const vertex = currentIntermediateVertices[i];
        const row = document.createElement('tr');
        row.innerHTML = `<td>Vertex ${i + 1}</td><td>(${Math.round(vertex.x)}, ${Math.round(vertex.y)})</td>`;
        tbody.appendChild(row);
      }
    }
  }
}

// Add this to the initialization code
function initializeStepHistory() {
  // Save initial state
  const initialStep = {
    currentLine: 0,
    status: 0,
    isDark: 0,
    firstPointStatus: 0,
    currentPoint: firstPoint,
    intersection_x: undefined,
    intersection_y: undefined,
    PointsX: [...initialPointsX],
    PointsY: [...initialPointsY],
    dupPointsX: [...initialPointsX],
    dupPointsY: [...initialPointsY],
    noOfIterations: 0,
    transitionIteration: 0
  };
  stepHistory = [initialStep];
  currentStep = 0;
  console.log("Step history initialized");
}


