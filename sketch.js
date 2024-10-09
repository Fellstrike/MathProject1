function setup() {
  createCanvas(1500, 1000);
  background(55);
  noLoop(); // Static drawing, no need for continuous loop
  
  // Define custom color palette (HSB mode allows smooth gradients)
  let colorPalette = [
    color(180, 0, 0), //red       
    color(26, 128, 0),    //green      
    color(0, 0, 180),    //blue  
    color(180, 0, 0), //red       
    color(26, 128, 0),    //green      
    color(0, 0, 180),    //blue 
    color(26, 128, 0),    //green      
    color(0, 0, 180),    //blue 
    color(0, 0, 180),    //blue 
    color(0, 0, 180),    //blue 
  ];
  
  noFill(); // Only using strokes for the division lines
  strokeWeight(2);

  // Define the initial rectangle as the entire canvas
  let initialRect = {
    x: 0,
    y: 0,
    width: width,
    height: height,
    level: 1 // Starting depth level
  };

  // Start subdivision with the custom color palette
  divideRect(initialRect, 2, colorPalette, 0); // Start with the first color (pink)
}

/**
 * Recursively divides a rectangle based on the shuffled 2:3:5 ratio and applies a gradient.
 * @param {Object} rect - The rectangle to divide.
 * @param {Number} splitsLeft - Number of divisions left.
 * @param {Array} colorPalette - The array of colors to cycle through.
 * @param {Number} colorIndex - The index of the current color in the palette.
 */
function divideRect(rect, splitsLeft, colorPalette, colorIndex) {
  if (splitsLeft <= 0) return;

  // Define and shuffle the ratio
  let ratios = shuffleArray([2, 3, 5]);
  const total = ratios.reduce((a, b) => a + b, 0);

  // Horizontal and vertical division points
  let divX = [];
  let divY = [];

  // Horizontal divisions
  let currentX = rect.x;
  for (let i = 0; i < ratios.length; i++) {
    let sectionWidth = (ratios[i] / total) * rect.width;
    divX.push(currentX + sectionWidth);
    currentX += sectionWidth;
  }

  // Vertical divisions
  let currentY = rect.y;
  let vertRatios = shuffleArray([2, 3, 5]); // Shuffle for vertical divisions
  for (let i = 0; i < vertRatios.length; i++) {
    let sectionHeight = (vertRatios[i] / total) * rect.height;
    divY.push(currentY + sectionHeight);
    currentY += sectionHeight;
  }

  // Set the stroke color from the current color in the palette
  stroke(colorPalette[colorIndex % colorPalette.length]); // Loop back when exceeding color count

  // Draw the division lines
  // Vertical lines
  for (let x of divX.slice(0, -1)) { // Exclude the last division which is the edge
    stroke(colorPalette[colorIndex % colorPalette.length]);
    line(x, rect.y, x, rect.y + rect.height);
    colorIndex++;
  }

  // Horizontal lines
  for (let y of divY.slice(0, -1)) { // Exclude the last division which is the edge
    stroke(colorPalette[colorIndex % colorPalette.length]);
    line(rect.x, y, rect.x + rect.width, y);
    colorIndex++;
  }

  // Now, for each sub-rectangle, divide further
  let sections = [];

  for (let i = 0; i < ratios.length; i++) {
    for (let j = 0; j < vertRatios.length; j++) {
      let subRect = {
        x: i === 0 ? rect.x : divX[i - 1],
        y: j === 0 ? rect.y : divY[j - 1],
        width: (ratios[i] / total) * rect.width,
        height: (vertRatios[j] / total) * rect.height,
        level: rect.level + 1
      };
      sections.push(subRect);
    }
  }

  // Recursively divide each section
  for (let section of sections) {
    let isFiveRatio = ratios[sections.indexOf(section) % ratios.length] === 5;
    let newSplitsLeft = splitsLeft - 1;

    // Allow additional division for sections with '5' ratio that haven't been split twice yet
    if (section.level < 3 || (isFiveRatio && section.level < 4)) {
      newSplitsLeft++;
    }

    // Increment the color index as we subdivide further, looping through the palette
    let newColorIndex = colorIndex; // Move to the next color

    divideRect(section, newSplitsLeft, colorPalette, newColorIndex); // Recursively divide with next color
  }
}

/**
 * Shuffles an array randomly.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
