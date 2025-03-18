// Updated JavaScript for Object Removal
let isSelecting = false;
let startX, startY;
let selectionWidth, selectionHeight;
const selectionOverlay = document.getElementById('selectionOverlay');

// Initialize Object Removal
document.getElementById('removeLogoBtn').addEventListener('click', () => {
    canvas.style.cursor = 'crosshair';
    initSelection();
});

function initSelection() {
    isSelecting = true;
    canvas.addEventListener('mousedown', startSelection);
    canvas.addEventListener('mousemove', drawSelection);
    canvas.addEventListener('mouseup', finishSelection);
}

function startSelection(e) {
    if (!isSelecting) return;
    
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    
    selectionOverlay.style.display = 'block';
    selectionOverlay.style.left = startX + 'px';
    selectionOverlay.style.top = startY + 'px';
}

function drawSelection(e) {
    if (!isSelecting) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    selectionWidth = currentX - startX;
    selectionHeight = currentY - startY;
    
    selectionOverlay.style.width = Math.abs(selectionWidth) + 'px';
    selectionOverlay.style.height = Math.abs(selectionHeight) + 'px';
    selectionOverlay.style.left = (selectionWidth > 0 ? startX : currentX) + 'px';
    selectionOverlay.style.top = (selectionHeight > 0 ? startY : currentY) + 'px';
}

async function finishSelection() {
    isSelecting = false;
    canvas.style.cursor = 'default';
    selectionOverlay.style.display = 'none';
    
    // Get actual coordinates
    const x = parseInt(selectionOverlay.style.left);
    const y = parseInt(selectionOverlay.style.top);
    const width = parseInt(selectionOverlay.style.width);
    const height = parseInt(selectionOverlay.style.height);
    
    // Perform inpainting
    await removeSelectedArea(x, y, width, height);
    
    // Cleanup event listeners
    canvas.removeEventListener('mousedown', startSelection);
    canvas.removeEventListener('mousemove', drawSelection);
    canvas.removeEventListener('mouseup', finishSelection);
}

// Improved Inpainting Function
async function removeSelectedArea(x, y, width, height) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    
    // Get surrounding pixels
    const surrounding = tempCtx.getImageData(
        Math.max(x - 10, 0),
        Math.max(y - 10, 0),
        width + 20,
        height + 20
    );
    
    // Clone neighboring pixels into selected area
    const imageData = tempCtx.getImageData(x, y, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        // Simple cloning from top-left neighbor
        //const sourceX = x + (i/4 % width) - 1;
        //const sourceY = y + Math.floor((i/4) / width) - 1;

// Replace the pixel cloning logic with:
//for (let i = 0; i < data.length; i += 4) {
    const avg = getAverageColor(surrounding, x, y, width, height);
    data[i] = avg.r;     // Red
    data[i + 1] = avg.g; // Green
    data[i + 2] = avg.b; // Blue
    data[i + 3] = avg.a; // Alpha
}

function getAverageColor(imageData, x, y, width, height) {
    // Implement proper averaging of surrounding pixels
}
        
        if (sourceX >= 0 && sourceY >= 0) {
            const sourceIndex = (sourceY * tempCanvas.width + sourceX) * 4;
            data[i] = surrounding.data[sourceIndex];         // R
            data[i + 1] = surrounding.data[sourceIndex + 1]; // G
            data[i + 2] = surrounding.data[sourceIndex + 2]; // B
            data[i + 3] = surrounding.data[sourceIndex + 3]; // A
        }
    }
    
    ctx.putImageData(imageData, x, y);
}