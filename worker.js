// worker.js
self.addEventListener('message', async (e) => {
    const { imgData, quality, orientation, index } = e.data;
    const blob = await compressImage(imgData, quality, orientation);
    self.postMessage({ result: blob, index });
});

async function compressImage(imgData, quality, orientation) {
    const img = await createImageBitmap(await (await fetch(imgData)).blob());
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // Apply orientation
    switch(orientation) {
        case 3: ctx.rotate(Math.PI); break;
        case 6: ctx.rotate(Math.PI/2); break;
        case 8: ctx.rotate(-Math.PI/2); break;
    }

    ctx.drawImage(img, 0, 0);
    return canvas.convertToBlob({ type: 'image/jpeg', quality: quality/100 });
}