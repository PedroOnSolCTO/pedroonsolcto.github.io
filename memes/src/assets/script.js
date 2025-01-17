// Basic references
let gifInfo = null;
let gifLoaded = false;
let currentFrame = null;
let isDrawMode = false;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let selectedSticker = null;
let disabledFrames = {};
let frameBuffer = null;

// DOM elements
const topTextOverlay = document.getElementById('top-text-overlay');
const bottomTextOverlay = document.getElementById('bottom-text-overlay');
const memeCanvas = document.getElementById('meme-canvas');
const memeCtx = memeCanvas.getContext('2d');
const previewCanvas = document.getElementById('preview-canvas');
const previewCtx = previewCanvas.getContext('2d');
const drawCanvas = document.getElementById('drawCanvas');
const drawCtx = drawCanvas.getContext('2d');
const gifImage = document.getElementById('backgroundGif');
const topTextInput = document.getElementById('top-text');
const bottomTextInput = document.getElementById('bottom-text');
const fontSizeInput = document.getElementById('font-size');
const fontFamilySelect = document.getElementById('font-family');
const textFillColorInput = document.getElementById('text-fill-color');
const textStrokeColorInput = document.getElementById('text-stroke-color');
const textShadowCheckbox = document.getElementById('text-shadow-checkbox');
const filterSelect = document.getElementById('filter-select');
const stickersContainer = document.getElementById('stickersContainer');
const stickerInput = document.getElementById('sticker-input');
const addStickerBtn = document.getElementById('add-sticker-btn');
const quickStickers = document.getElementById('quick-stickers');
const drawColorInput = document.getElementById('draw-color');
const drawSizeInput = document.getElementById('draw-size');
const toggleDrawBtn = document.getElementById('toggle-draw');
const clearDrawBtn = document.getElementById('clear-draw');
const captureBtn = document.getElementById('capture-btn');
// const gifBtn = document.getElementById('gifBtn');
const memeContainer = document.getElementById('meme-container');
const gifUploadInput = document.getElementById('gif-upload');
const drawModeToggle = document.getElementById('draw-mode-toggle');
const drawingIndicator = document.querySelector('.drawing-indicator');
const framesGrid = document.getElementById('frames-grid');

// Initialize variables
let currentFilter = 'none';

// Global worker blob for GIF generation
let workerBlob = null;

// Initialize worker blob when DOM loads
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/npm/gif.js/dist/gif.worker.js');
    if (!response.ok) throw new Error('Network response was not OK');
    workerBlob = await response.blob();
  } catch (error) {
    console.error('Error loading GIF worker:', error);
  }
});

// Helper function for HSL to RGB conversion
function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

// Function to update CSS filter on GIF preview
function updateGifFilter() {
  switch (currentFilter) {
    case 'grayscale':
      previewCanvas.style.filter = 'grayscale(100%)';
      break;
    case 'sepia':
      previewCanvas.style.filter = 'sepia(100%)';
      break;
    case 'invert':
      previewCanvas.style.filter = 'invert(100%)';
      break;
    case 'dreamy':
      previewCanvas.style.filter = 'brightness(110%) saturate(110%)';
      break;
    case 'cartoon':
      previewCanvas.style.filter = 'contrast(200%) saturate(150%)';
      break;
    case 'crunchy':
      previewCanvas.style.filter = 'contrast(300%)';
      break;
    case 'hue-rotate':
      previewCanvas.style.filter = 'none';
      break;
    default:
      previewCanvas.style.filter = 'none';
  }
}

// Helper function to draw text with stroke and fill
function strokeFillTextWrap(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];

  // Break text into lines that fit within maxWidth
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  // Draw each line
  lines.forEach((line, i) => {
    // Draw stroke
    ctx.strokeStyle = strokeColorInput.value;
    ctx.lineWidth = fontSizeInput.value / 15;
    ctx.strokeText(line.trim(), x, y + i * lineHeight);

    // Draw fill
    ctx.fillStyle = textFillColorInput.value;
    ctx.fillText(line.trim(), x, y + i * lineHeight);
  });
}

// Helper function to draw image with object-fit: contain behavior
function drawImageContain(ctx, img, x, y, width, height) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const containerRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > containerRatio) {
    // Image is wider than container
    drawHeight = width / imgRatio;
    offsetY = (height - drawHeight) / 2;
  } else {
    // Image is taller than container
    drawWidth = height * imgRatio;
    offsetX = (width - drawWidth) / 2;
  }

  ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
}

// Function to draw text with stroke and fill on canvas
function drawText(text, y, fontSize, ctx) {
  ctx.save();

  // Set text properties
  const fontFamily = fontFamilySelect.value;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Get text color and stroke color from inputs
  const fillColor = textFillColorInput.value;
  const strokeColor = textStrokeColorInput.value;
  const textShadow = textShadowCheckbox.checked;

  // Calculate text width and position
  const maxWidth = memeCanvas.width * 0.9;
  const x = memeCanvas.width / 2;

  // Add text shadow if enabled
  if (textShadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }

  // Function to wrap text
  function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine += ' ' + word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  // Get wrapped lines
  const lines = wrapText(text, maxWidth);
  const lineHeight = fontSize * 1.2;
  const totalHeight = lineHeight * (lines.length - 1);

  // Adjust y position based on whether it's top or bottom text
  let startY = y;
  if (y > memeCanvas.height / 2) {
    // Bottom text - move up to accommodate multiple lines
    startY -= totalHeight;
  }

  // Draw each line
  lines.forEach((line, i) => {
    // Draw stroke
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = fontSize / 15;
    ctx.strokeText(line.trim(), x, startY + i * lineHeight);

    // Draw fill
    ctx.fillStyle = fillColor;
    ctx.fillText(line.trim(), x, startY + i * lineHeight);
  });

  ctx.restore();
}

function updateCanvas() {
  if (!gifInfo || !gifLoaded) return;

  // Create frame buffer if it doesn't exist
  if (!frameBuffer) {
    frameBuffer = new Uint8ClampedArray(gifInfo.width * gifInfo.height * 4);
  }

  // Get frame data at original GIF dimensions
  gifInfo.decodeAndBlitFrameRGBA(currentFrame, frameBuffer);
  const imageData = new ImageData(frameBuffer, gifInfo.width, gifInfo.height);

  // Create a temporary canvas at GIF's original dimensions
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = gifInfo.width;
  tempCanvas.height = gifInfo.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.putImageData(imageData, 0, 0);

  // Clear the preview canvas
  previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  memeCtx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);

  // Draw the frame scaled to our 360x360 container
  previewCtx.drawImage(tempCanvas, 0, 0, previewCanvas.width, previewCanvas.height);

  // Apply current filter if any
  if (currentFilter !== 'none') {
    const frameData = previewCtx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
    applyFilter(frameData, currentFilter);
    previewCtx.putImageData(frameData, 0, 0);
  }

  // Draw text
  const fontSize = parseFloat(fontSizeInput.value) * 24;
  const topText = topTextInput.value.toUpperCase();
  const bottomText = bottomTextInput.value.toUpperCase();

  if (topText) {
    drawText(topText, fontSize + 10, fontSize, memeCtx);
  }
  if (bottomText) {
    drawText(bottomText, memeCanvas.height - fontSize - 10, fontSize, memeCtx);
  }
}

// Animation loop for GIF playback
function animate() {
  if (!gifLoaded || !gifInfo) return;

  // Count enabled frames
  let enabledFrameCount = 0;
  for (let i = 0; i < gifInfo.numFrames(); i++) {
    if (!disabledFrames[i]) enabledFrameCount++;
  }

  // If no frames are enabled, stop animation and clear canvas
  if (enabledFrameCount === 0) {
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    return;
  }

  // If current frame is disabled, find next enabled frame
  if (currentFrame === null || disabledFrames[currentFrame]) {
    currentFrame = findNextEnabledFrame(currentFrame);
    if (currentFrame === null) return; // No enabled frames found
  }

  // Create buffer if it doesn't exist
  if (!frameBuffer) {
    frameBuffer = new Uint8ClampedArray(gifInfo.width * gifInfo.height * 4);
  }

  // Get frame data and update canvas
  gifInfo.decodeAndBlitFrameRGBA(currentFrame, frameBuffer);
  updateCanvas();

  // Find next enabled frame
  let nextFrame = findNextEnabledFrame(currentFrame);

  // If no next frame found, try from beginning
  if (nextFrame === null) {
    nextFrame = findNextEnabledFrame(-1);
  }

  // If we found a next frame, schedule it
  if (nextFrame !== null) {
    const frameInfo = gifInfo.frameInfo(nextFrame);
    setTimeout(() => {
      currentFrame = nextFrame;
      animate();
    }, getFrameDelay(frameInfo));
  }
}

// Helper function to find next enabled frame
function findNextEnabledFrame(currentIndex) {
  const numFrames = gifInfo.numFrames();
  let startIndex = currentIndex === null ? 0 : currentIndex + 1;

  // Search from startIndex to end
  for (let i = startIndex; i < numFrames; i++) {
    if (!disabledFrames[i]) return i;
  }

  // If not found, search from beginning
  for (let i = 0; i < startIndex; i++) {
    if (!disabledFrames[i]) return i;
  }

  return null; // No enabled frames found
}

// Helper function to get frame delay in milliseconds
function getFrameDelay(frameInfo) {
  // GIF delay is in centiseconds (1/100th of a second)
  let delay = frameInfo.delay;
  // If delay is 0 or too small, use 10 centiseconds (100ms)
  if (delay < 1) delay = 10;
  // Convert centiseconds to milliseconds
  return delay * 10;
}

// Function to start animation
function startAnimation() {
  if (!gifLoaded || !gifInfo) return;

  // Find first enabled frame
  for (let i = 0; i < gifInfo.numFrames(); i++) {
    if (!disabledFrames[i]) {
      currentFrame = i;
      animate();
      break;
    }
  }
}

// Function to adjust container size based on GIF dimensions
function adjustContainerSize() {
  if (!gifInfo) return;

  const containerWidth = 360;
  const containerHeight = 360;

  // Update all canvases
  [previewCanvas, memeCanvas, drawCanvas].forEach(canvas => {
    canvas.width = containerWidth;
    canvas.height = containerHeight;
  });

  // Force a redraw
  updateCanvas();
}

// Function to apply filters to image data
function applyFilter(imageData, filterType) {
  const data = imageData.data;

  switch (filterType) {
    case 'grayscale':
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
      break;

    case 'sepia':
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189); // red
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168); // green
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131); // blue
      }
      break;

    case 'invert':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
      }
      break;

    case 'dreamy':
      for (let i = 0; i < data.length; i += 4) {
        // Brightness 110% and Saturation 110%
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Convert to HSL to adjust saturation
        const max = Math.max(r, g, b) / 255;
        const min = Math.min(r, g, b) / 255;
        const l = (max + min) / 2;
        const d = max - min;
        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        // Increase saturation by 10%
        const newS = Math.min(1, s * 1.1);

        // Apply brightness increase of 10%
        data[i] = Math.min(255, r * 1.1);
        data[i + 1] = Math.min(255, g * 1.1);
        data[i + 2] = Math.min(255, b * 1.1);

        // Apply saturation adjustment
        const factor = newS / (s || 1);
        const mid = l * 255;
        data[i] = Math.min(255, mid + (data[i] - mid) * factor);
        data[i + 1] = Math.min(255, mid + (data[i + 1] - mid) * factor);
        data[i + 2] = Math.min(255, mid + (data[i + 2] - mid) * factor);
      }
      break;

    case 'cartoon':
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Convert to HSL to adjust saturation
        const max = Math.max(r, g, b) / 255;
        const min = Math.min(r, g, b) / 255;
        const l = (max + min) / 2;
        const d = max - min;
        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        // Increase saturation by 50%
        const newS = Math.min(1, s * 1.5);

        // Apply contrast increase of 200%
        const factor = (259 * (200 + 255)) / (255 * (259 - 200));
        data[i] = Math.min(255, factor * (r - 128) + 128);
        data[i + 1] = Math.min(255, factor * (g - 128) + 128);
        data[i + 2] = Math.min(255, factor * (b - 128) + 128);

        // Apply saturation adjustment
        const satFactor = newS / (s || 1);
        const mid = l * 255;
        data[i] = Math.min(255, mid + (data[i] - mid) * satFactor);
        data[i + 1] = Math.min(255, mid + (data[i + 1] - mid) * satFactor);
        data[i + 2] = Math.min(255, mid + (data[i + 2] - mid) * satFactor);
      }
      break;

    case 'crunchy':
      for (let i = 0; i < data.length; i += 4) {
        // Apply contrast increase of 300%
        const contrast = 3; // 300% = 3
        data[i] = Math.min(255, Math.max(0, ((data[i] / 255 - 0.5) * contrast + 0.5) * 255));
        data[i + 1] = Math.min(
          255,
          Math.max(0, ((data[i + 1] / 255 - 0.5) * contrast + 0.5) * 255)
        );
        data[i + 2] = Math.min(
          255,
          Math.max(0, ((data[i + 2] / 255 - 0.5) * contrast + 0.5) * 255)
        );
      }
      break;

    case 'hue-rotate':
      previewCanvas.style.filter = 'none';
      for (let i = 0; i < data.length; i += 4) {
        // Convert RGB to HSL
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h,
          s,
          l = (max + min) / 2;

        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }

        // Rotate hue by 90 degrees (0.25 in the range [0,1])
        h = (h + 0.25) % 1;

        // Convert back to RGB
        if (s === 0) {
          data[i] = data[i + 1] = data[i + 2] = l * 255;
        } else {
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          data[i] = hue2rgb(p, q, h + 1 / 3) * 255;
          data[i + 1] = hue2rgb(p, q, h) * 255;
          data[i + 2] = hue2rgb(p, q, h - 1 / 3) * 255;
        }
      }
      break;
  }
}

// Function to extract and display GIF frames
function displayGifFrames(gifData) {
  framesGrid.innerHTML = ''; // Clear existing frames
  disabledFrames = {}; // Reset disabled frames

  if (!gifData || gifData.numFrames() === 0) return;

  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');

  // Set canvas size to match GIF dimensions
  tempCanvas.width = gifData.width;
  tempCanvas.height = gifData.height;

  // Create buffer for frame data
  const frameBuffer = new Uint8ClampedArray(gifData.width * gifData.height * 4);

  // Process each frame
  for (let i = 0; i < gifData.numFrames(); i++) {
    const frameAnalysis = analyzeFrame(gifData, i);
    const isKeyFrame = frameAnalysis.isKeyFrame;
    const isTransition = frameAnalysis.isTransition;
    const isReversalPoint = frameAnalysis.isReversalPoint;

    // Clear canvas for new frame
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Get frame data
    gifData.decodeAndBlitFrameRGBA(i, frameBuffer);

    // Create ImageData and draw to canvas
    const imageData = new ImageData(frameBuffer, gifData.width, gifData.height);
    tempCtx.putImageData(imageData, 0, 0);

    // Create wrapper div for frame
    const wrapper = document.createElement('div');
    wrapper.className = 'frame-wrapper';
    if (isKeyFrame) wrapper.classList.add('key-frame');
    if (isTransition) wrapper.classList.add('transition-frame');
    if (isReversalPoint) wrapper.classList.add('reversal-frame');

    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'frame-image-container';

    // Create frame info
    const frameLabel = document.createElement('div');
    frameLabel.className = 'frame-label';
    frameLabel.innerHTML = `${i + 1}`;

    // Create thumbnail
    const img = document.createElement('img');
    img.src = tempCanvas.toDataURL();
    img.title = `Frame ${i + 1}`;
    img.dataset.frameIndex = i;
    img.dataset.isKeyFrame = isKeyFrame;
    img.dataset.isTransition = isTransition;

    // Add click handler to preview frame
    img.addEventListener('click', () => {
      if (!disabledFrames[i]) {
        currentFrame = i;
        updateCanvas();
      }
    });

    // Create toggle switch
    const toggleLabel = document.createElement('label');
    toggleLabel.className = 'frame-toggle';

    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.checked = true;
    if (isKeyFrame) {
      toggleInput.classList.add('key-frame-toggle');
    }
    if (isTransition) {
      toggleInput.classList.add('transition-frame-toggle');
    }

    const toggleSlider = document.createElement('span');
    toggleSlider.className = 'frame-toggle-slider';

    // Add click handler for toggle
    toggleInput.addEventListener('change', e => {
      e.stopPropagation();
      const frameIndex = i;

      if (toggleInput.checked) {
        // Enable frame
        disabledFrames[frameIndex] = false;
        img.classList.remove('disabled');
      } else {
        // Disable frame
        disabledFrames[frameIndex] = true;
        img.classList.add('disabled');
      }
      // Restart animation from first enabled frame
      currentFrame = null;
      startAnimation();
    });

    imageContainer.appendChild(img);
    imageContainer.appendChild(frameLabel);
    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(toggleSlider);
    wrapper.appendChild(imageContainer);
    wrapper.appendChild(toggleLabel);
    framesGrid.appendChild(wrapper);
  }
}

// Function to analyze frame importance
function analyzeFrame(gifData, frameIndex) {
  const frameInfo = gifData.frameInfo(frameIndex);
  const totalFrames = gifData.numFrames();

  // Create buffers for comparison
  const currentBuffer = new Uint8ClampedArray(gifData.width * gifData.height * 4);
  const prevBuffer = new Uint8ClampedArray(gifData.width * gifData.height * 4);
  const nextBuffer = new Uint8ClampedArray(gifData.width * gifData.height * 4);

  // Get current frame data
  gifData.decodeAndBlitFrameRGBA(frameIndex, currentBuffer);

  // Get previous frame data if not first frame
  if (frameIndex > 0) {
    gifData.decodeAndBlitFrameRGBA(frameIndex - 1, prevBuffer);
  }

  // Get next frame data if not last frame
  if (frameIndex < totalFrames - 1) {
    gifData.decodeAndBlitFrameRGBA(frameIndex + 1, nextBuffer);
  }

  // Calculate difference from previous frame
  let diffFromPrev = 0;
  let diffToNext = 0;
  let totalPixels = gifData.width * gifData.height;

  for (let i = 0; i < currentBuffer.length; i += 4) {
    // Check difference from previous frame
    if (
      frameIndex > 0 &&
      (currentBuffer[i] !== prevBuffer[i] ||
        currentBuffer[i + 1] !== prevBuffer[i + 1] ||
        currentBuffer[i + 2] !== prevBuffer[i + 2] ||
        currentBuffer[i + 3] !== prevBuffer[i + 3])
    ) {
      diffFromPrev++;
    }

    // Check difference to next frame
    if (
      frameIndex < totalFrames - 1 &&
      (currentBuffer[i] !== nextBuffer[i] ||
        currentBuffer[i + 1] !== nextBuffer[i + 1] ||
        currentBuffer[i + 2] !== nextBuffer[i + 2] ||
        currentBuffer[i + 3] !== nextBuffer[i + 3])
    ) {
      diffToNext++;
    }
  }

  const percentFromPrev = (diffFromPrev / totalPixels) * 100;
  const percentToNext = (diffToNext / totalPixels) * 100;

  return {
    frameNumber: frameIndex + 1,
    disposal: frameInfo.disposal,
    delay: frameInfo.delay, // Convert to ms
    percentFromPrev: percentFromPrev.toFixed(2),
    percentToNext: percentToNext.toFixed(2),
    isTransition: percentFromPrev > 80 || percentToNext > 80,
    isKeyFrame: frameInfo.disposal === 2 || frameIndex === 0,
    isReversalPoint: percentFromPrev > 60 && percentToNext > 60,
  };
}

// Function to toggle all frames
function toggleAllFrames(enabled) {
  if (!gifInfo) return;

  // Update disabled frames object
  for (let i = 0; i < gifInfo.numFrames(); i++) {
    if (enabled) {
      delete disabledFrames[i];
    } else {
      disabledFrames[i] = true;
    }
  }

  // Update all frame toggles in the grid
  const frameToggles = document.querySelectorAll('.frame-toggle input[type="checkbox"]');
  frameToggles.forEach((toggle, index) => {
    if (index === 0) return; // Skip the "Toggle All" checkbox
    toggle.checked = enabled;
    const frameWrapper = toggle.closest('.frame-wrapper');
    if (frameWrapper) {
      const img = frameWrapper.querySelector('img');
      if (img) {
        if (enabled) {
          img.classList.remove('disabled');
        } else {
          img.classList.add('disabled');
        }
      }
    }
  });

  // If all frames are disabled, clear the canvas
  if (!enabled) {
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    return;
  }

  // Restart animation from first enabled frame
  currentFrame = findNextEnabledFrame(-1);
  if (currentFrame !== null) {
    animate();
  }
  currentFrame = null;
  startAnimation();
}

// Function to add sticker
function addSticker(emoji) {
  const el = document.createElement('div');
  el.className = 'sticker';
  el.textContent = emoji;

  // Initialize all transform values
  el.dataset.scale = '1';
  el.dataset.rotate = '0';
  el.dataset.translateX = '0';
  el.dataset.translateY = '0';

  stickersContainer.appendChild(el);

  // Calculate initial position after element is in DOM
  requestAnimationFrame(() => {
    const rect = el.getBoundingClientRect();
    const containerRect = stickersContainer.getBoundingClientRect();

    // Place sticker in the exact center of the container
    const translateX = Math.round((containerRect.width - rect.width) / 2);
    const translateY = Math.round((containerRect.height - rect.height) / 2);

    el.dataset.translateX = translateX;
    el.dataset.translateY = translateY;
    updateTransform(el);
  });

  makeDraggable(el);
  el.addEventListener('mousedown', e => {
    e.stopPropagation();
    selectSticker(el);
  });
}

function selectSticker(st) {
  // If clicking the same sticker, do nothing
  if (selectedSticker === st) return;

  // If there was a previously selected sticker, deselect it
  if (selectedSticker) {
    deselectSticker();
  }

  selectedSticker = st;
  st.classList.add('selected');
  addHandles(st);
}

function deselectSticker() {
  if (!selectedSticker) return;
  removeHandles(selectedSticker);
  selectedSticker.classList.remove('selected');
  selectedSticker = null;
}

function addHandles(st) {
  const rotateHandle = createHandle('rotate-handle', '↻');
  const tlHandle = createHandle('scale-handle tl', '◻');
  const trHandle = createHandle('scale-handle tr', '◻');
  const blHandle = createHandle('scale-handle bl', '◻');
  const brHandle = createHandle('scale-handle br', '◻');

  st.appendChild(rotateHandle);
  st.appendChild(tlHandle);
  st.appendChild(trHandle);
  st.appendChild(blHandle);
  st.appendChild(brHandle);

  let mode = '';
  let initRotate;
  let initAngle;
  let centerX;
  let centerY;
  let initialTransform;

  // Add click handler for instant 90-degree rotation
  rotateHandle.addEventListener('click', e => {
    e.stopPropagation();
    const currentRotate = parseFloat(st.dataset.rotate || '0');
    st.dataset.rotate = (currentRotate + 90) % 360;
    updateTransform(st);
  });

  // Keep the drag rotation functionality
  rotateHandle.addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    mode = 'rotate';

    // Store initial transform state
    initialTransform = {
      rotate: parseFloat(st.dataset.rotate || '0'),
      scale: parseFloat(st.dataset.scale || '1'),
      translateX: parseFloat(st.dataset.translateX || '0'),
      translateY: parseFloat(st.dataset.translateY || '0'),
    };

    const rect = st.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
    initRotate = initialTransform.rotate;
    initAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    document.addEventListener('mousemove', rotateSticker);
    document.addEventListener('mouseup', endTransform);
  });

  [tlHandle, trHandle, blHandle, brHandle].forEach(h => {
    h.addEventListener('mousedown', e => {
      e.stopPropagation();
      mode = 'scale';
      document.addEventListener('mousemove', scaleSticker);
      document.addEventListener('mouseup', endTransform);
    });
  });

  function rotateSticker(e) {
    const rect = st.getBoundingClientRect();
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const diff = angle - initAngle;
    const deg = (initRotate + diff * (180 / Math.PI)) % 360;
    st.dataset.rotate = deg;
    updateTransform(st);
  }

  function scaleSticker(e) {
    if (mode !== 'scale') return;
    const rect = st.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Calculate scale based on initial distance and current distance
    const initialScale = parseFloat(st.dataset.initialScale || '1');
    const initialDist = parseFloat(st.dataset.initialDist || dist.toString());

    if (!st.dataset.initialDist) {
      st.dataset.initialDist = dist.toString();
      st.dataset.initialScale = st.dataset.scale;
    }

    const scaleFactor = dist / initialDist;
    const newScale = Math.max(0.2, Math.min(3, initialScale * scaleFactor));
    st.dataset.scale = newScale;
    updateTransform(st);
  }

  function endTransform() {
    mode = '';
    // Reset initial values when transform ends
    if (st.dataset.initialDist) {
      delete st.dataset.initialDist;
      delete st.dataset.initialScale;
    }
    document.removeEventListener('mousemove', rotateSticker);
    document.removeEventListener('mousemove', scaleSticker);
    document.removeEventListener('mouseup', endTransform);
  }
}

function removeHandles(st) {
  st.querySelectorAll('.rotate-handle, .scale-handle').forEach(h => h.remove());
}

function createHandle(className, symbol) {
  const handle = document.createElement('div');
  handle.className = `handle ${className}`;
  handle.innerHTML = symbol;
  return handle;
}

function updateTransform(st) {
  const scale = parseFloat(st.dataset.scale || '1');
  const rotate = parseFloat(st.dataset.rotate || '0');
  const translateX = parseFloat(st.dataset.translateX || '0');
  const translateY = parseFloat(st.dataset.translateY || '0');

  // Apply transforms in a specific order: translate -> rotate -> scale
  st.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`;
}

function makeDraggable(el) {
  let isDragging = false;
  let startX;
  let startY;
  const trashCan = document.getElementById('trash-can');

  el.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    if (e.target === el) {
      isDragging = true;
      const translateX = parseFloat(el.dataset.translateX || '0');
      const translateY = parseFloat(el.dataset.translateY || '0');
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();

      const translateX = e.clientX - startX;
      const translateY = e.clientY - startY;

      el.dataset.translateX = translateX;
      el.dataset.translateY = translateY;

      const trashRect = trashCan.getBoundingClientRect();
      const stickerRect = el.getBoundingClientRect();

      // Check if sticker is over trash can
      if (
        stickerRect.right > trashRect.left &&
        stickerRect.left < trashRect.right &&
        stickerRect.bottom > trashRect.top &&
        stickerRect.top < trashRect.bottom
      ) {
        trashCan.classList.add('drag-over');
      } else {
        trashCan.classList.remove('drag-over');
      }

      updateTransform(el);
      updateCanvas();
    }
  }

  function dragEnd(e) {
    if (!isDragging) return;

    const trashRect = trashCan.getBoundingClientRect();
    const stickerRect = el.getBoundingClientRect();

    // Check if sticker should be deleted
    if (
      stickerRect.right > trashRect.left &&
      stickerRect.left < trashRect.right &&
      stickerRect.bottom > trashRect.top &&
      stickerRect.top < trashRect.bottom
    ) {
      el.remove();
      trashCan.classList.remove('drag-over');
    }

    isDragging = false;
    updateCanvas();
  }
}

// Drawing
function draw(e) {
  if (!isDrawing || !isDrawMode) return;

  const rect = drawCanvas.getBoundingClientRect();
  const scaleX = drawCanvas.width / rect.width;
  const scaleY = drawCanvas.height / rect.height;

  drawCtx.beginPath();
  drawCtx.lineCap = 'round';
  drawCtx.lineJoin = 'round';
  drawCtx.strokeStyle = drawColorInput.value;
  drawCtx.lineWidth = parseInt(drawSizeInput.value);

  drawCtx.moveTo(lastX * scaleX, lastY * scaleY);
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  drawCtx.lineTo(x, y);
  drawCtx.stroke();
  [lastX, lastY] = [x / scaleX, y / scaleY];
}

// Update container size when window is resized
window.addEventListener('resize', adjustContainerSize);
addStickerBtn.addEventListener('click', () => {
  const emoji = stickerInput.value.trim();
  if (emoji) {
    addSticker(emoji);
    stickerInput.value = '';
  }
});
quickStickers.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    addSticker(btn.textContent, memeCanvas.width / 2, memeCanvas.height / 2);
  });
});

document.addEventListener('mousedown', () => {
  if (selectedSticker) {
    deselectSticker();
  }
});

drawCanvas.addEventListener('mousedown', e => {
  if (!isDrawMode) return;
  isDrawing = true;
  const rect = drawCanvas.getBoundingClientRect();
  const scaleX = drawCanvas.width / rect.width;
  const scaleY = drawCanvas.height / rect.height;
  lastX = ((e.clientX - rect.left) * scaleX) / scaleX;
  lastY = ((e.clientY - rect.top) * scaleY) / scaleY;
});

drawCanvas.addEventListener('mousemove', draw);
drawCanvas.addEventListener('mouseup', () => (isDrawing = false));
drawCanvas.addEventListener('mouseout', () => (isDrawing = false));

// Clear drawing
clearDrawBtn.addEventListener('click', () => {
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
});

// Update drawing mode
drawModeToggle.addEventListener('change', () => {
  isDrawMode = drawModeToggle.checked;
  document.body.classList.toggle('drawing-mode', isDrawMode);
});

// Update drawing style when color or size changes
drawColorInput.addEventListener('input', () => {
  drawCtx.strokeStyle = drawColorInput.value;
});

drawSizeInput.addEventListener('input', () => {
  drawCtx.lineWidth = parseInt(drawSizeInput.value);
});

// Add event listeners for text inputs to update canvas in real-time
[
  topTextInput,
  bottomTextInput,
  fontSizeInput,
  textFillColorInput,
  textStrokeColorInput,
  textShadowCheckbox,
  filterSelect,
].forEach(input => {
  ['input', 'change'].forEach(event => {
    input.addEventListener(event, () => {
      if (input === filterSelect) {
        currentFilter = filterSelect.value;
        updateGifFilter();
      }
      updateCanvas();
    });
  });
});

// Capture PNG
async function captureMeme() {
  // Create a temporary canvas at the GIF dimensions
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 360;
  tempCanvas.height = 360;
  const tempCtx = tempCanvas.getContext('2d');

  // Scale for GIF dimensions
  const scale = 360 / previewCanvas.width;

  // Draw the current frame with filter
  tempCtx.save();
  tempCtx.scale(scale, scale);
  tempCtx.drawImage(previewCanvas, 0, 0);
  tempCtx.restore();

  // Draw the meme canvas (text overlay)
  tempCtx.save();
  tempCtx.scale(scale, scale);
  tempCtx.drawImage(memeCanvas, 0, 0);
  tempCtx.restore();

  // Draw the drawing canvas
  tempCtx.save();
  tempCtx.scale(scale, scale);
  tempCtx.drawImage(drawCanvas, 0, 0);
  tempCtx.restore();

  // Use html2canvas to capture the stickers
  const overlayCanvas = await html2canvas(stickersContainer, {
    backgroundColor: null,
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true,
  });

  // Draw the stickers overlay
  tempCtx.save();
  tempCtx.scale(scale, scale);
  tempCtx.drawImage(overlayCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
  tempCtx.restore();

  // Add watermark
  tempCtx.save();
  tempCtx.font = '16px Arial';
  tempCtx.textAlign = 'right';
  tempCtx.textBaseline = 'bottom';
  // Add stroke
  tempCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  tempCtx.lineWidth = 3;
  tempCtx.strokeText('$PEDRO', tempCanvas.width - 20, tempCanvas.height - 10);
  // Add fill
  tempCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  tempCtx.fillText('$PEDRO', tempCanvas.width - 20, tempCanvas.height - 10);
  tempCtx.restore();

  // Create download link
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = tempCanvas.toDataURL('image/png');
  link.click();
}

// Add event listener for the capture button
document.getElementById('capture-btn').addEventListener('click', captureMeme);

// Function to create a frame with all overlays
async function createFrameWithOverlays() {
  // Create canvas at container dimensions
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 360;
  tempCanvas.height = 360;
  const tempCtx = tempCanvas.getContext('2d');

  // Create a temporary canvas for the current frame at original dimensions
  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = gifInfo.width;
  frameCanvas.height = gifInfo.height;
  const frameCtx = frameCanvas.getContext('2d');

  // Get frame data at original dimensions
  if (!frameBuffer) {
    frameBuffer = new Uint8ClampedArray(gifInfo.width * gifInfo.height * 4);
  }
  gifInfo.decodeAndBlitFrameRGBA(currentFrame, frameBuffer);
  const imageData = new ImageData(frameBuffer, gifInfo.width, gifInfo.height);
  frameCtx.putImageData(imageData, 0, 0);

  // Apply filter if any
  if (currentFilter !== 'none') {
    const frameData = frameCtx.getImageData(0, 0, gifInfo.width, gifInfo.height);
    applyFilter(frameData, currentFilter);
    frameCtx.putImageData(frameData, 0, 0);
  }

  // Draw the frame scaled to our 360x360 container
  tempCtx.drawImage(frameCanvas, 0, 0, previewCanvas.width, previewCanvas.height);

  // Draw the meme canvas (text overlay) scaled
  tempCtx.save();
  tempCtx.scale(1, 1);
  tempCtx.drawImage(memeCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
  tempCtx.restore();

  // Draw the drawing canvas scaled
  tempCtx.save();
  tempCtx.scale(1, 1);
  tempCtx.drawImage(drawCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
  tempCtx.restore();

  // Use html2canvas to capture the stickers
  const overlayCanvas = await html2canvas(stickersContainer, {
    backgroundColor: null,
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true,
  });

  // Draw the stickers overlay scaled
  tempCtx.save();
  tempCtx.scale(1, 1);
  tempCtx.drawImage(overlayCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
  tempCtx.restore();

  // Add watermark
  tempCtx.save();
  tempCtx.font = '16px Arial';
  tempCtx.textAlign = 'right';
  tempCtx.textBaseline = 'bottom';
  // Add stroke
  tempCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  tempCtx.lineWidth = 3;
  tempCtx.strokeText('$PEDRO', tempCanvas.width - 20, tempCanvas.height - 10);
  // Add fill
  tempCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  tempCtx.fillText('$PEDRO', tempCanvas.width - 20, tempCanvas.height - 10);
  tempCtx.restore();

  return tempCanvas;
}

// Function to download animated GIF
async function downloadAnimatedGif() {
  if (!gifInfo || !gifLoaded) return;
  if (!workerBlob) {
    console.error('GIF worker not loaded');
    return;
  }

  let workerBlobUrl = null;
  if (!workerBlobUrl) {
    workerBlobUrl = URL.createObjectURL(workerBlob);
  }

  // Create a new GIF at container dimensions
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: 360,
    height: 360,
    workerScript: workerBlobUrl,
  });

  // Store the current frame
  const originalFrame = currentFrame;

  // Add loading indicator
  const downloadBtn = document.getElementById('download-gif-btn');
  const originalText = downloadBtn.innerHTML;
  downloadBtn.innerHTML =
    '<span class="material-symbols-outlined">hourglass_empty</span> Processing...';
  downloadBtn.disabled = true;

  try {
    // Process each enabled frame
    for (let i = 0; i < gifInfo.numFrames(); i++) {
      if (disabledFrames[i]) continue;

      // Set current frame
      currentFrame = i;
      updateCanvas();

      // Create frame with overlays
      const frameCanvas = await createFrameWithOverlays();

      // Add frame to GIF with original delay
      const frameInfo = gifInfo.frameInfo(i);
      gif.addFrame(frameCanvas, {
        delay: getFrameDelay(frameInfo) / 10, // Convert back to centiseconds for gif.js
        copy: true,
      });
    }

    // Render GIF
    gif.on('finished', function (blob) {
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'animated-meme.gif';
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;

      // Restore original frame
      currentFrame = originalFrame;
      updateCanvas();
    });

    gif.render();
  } catch (error) {
    console.error('Error creating GIF:', error);
    downloadBtn.innerHTML = originalText;
    downloadBtn.disabled = false;
    currentFrame = originalFrame;
    updateCanvas();
  }
}

// Add event listener for the download GIF button
document.getElementById('download-gif-btn').addEventListener('click', downloadAnimatedGif);

// Add event listener for toggle all frames switch
document.getElementById('toggle-all-frames').addEventListener('change', function (e) {
  toggleAllFrames(e.target.checked);
});

// Handle file upload
function handleGifLoad(buffer) {
  try {
    gifInfo = new GifReader(new Uint8Array(buffer));
    currentFrame = 0;
    gifLoaded = true;
    disabledFrames = {}; // Reset disabled frames for new GIF
    frameBuffer = new Uint8ClampedArray(gifInfo.width * gifInfo.height * 4);
    displayGifFrames(gifInfo);
    adjustContainerSize();
    startAnimation(); // Start the animation after loading
  } catch (error) {
    console.error('Error parsing GIF:', error);
  }
}

gifUploadInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    handleGifLoad(e.target.result);
  };
  reader.readAsArrayBuffer(file);
});

// Try to load the default GIF
fetch('pedro.gif')
  .then(response => response.arrayBuffer())
  .then(buffer => {
    handleGifLoad(buffer);
  })
  .catch(error => {
    console.error('Error loading default GIF:', error);
  });

// Set canvas dimensions to match the image
memeCanvas.width = 360;
memeCanvas.height = 360;

// Initial draw of the image
memeCtx.fillStyle = 'transparent';
memeCtx.fillRect(0, 0, memeCanvas.width, memeCanvas.height);

// Set draw canvas dimensions to match
function initDrawCanvas() {
  drawCanvas.width = memeCanvas.width;
  drawCanvas.height = memeCanvas.height;
  drawCtx.lineCap = 'round';
  drawCtx.lineJoin = 'round';
  drawCtx.strokeStyle = drawColorInput.value;
  drawCtx.lineWidth = parseInt(drawSizeInput.value);
}

initDrawCanvas();
