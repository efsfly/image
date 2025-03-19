// worker.js
self.addEventListener('message', ({ data }) => {
    const { imgData, quality, orientation } = data;
    const blobPromise = compressImage(imgData, quality, orientation);
    blobPromise.then(blob => {
        self.postMessage({ blob });
    });
});

async function compressImage(imgData, quality, orientation) {
    const img = await createImageBitmap(await (await fetch(imgData)).blob());
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // Apply orientation
    switch(orientation) {
        case 3:
            ctx.translate(img.width, img.height);
            ctx.rotate(Math.PI);
            break;
        case 6:
            canvas.width = img.height;
            canvas.height = img.width;
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(0, -img.height);
            break;
        case 8:
            canvas.width = img.height;
            canvas.height = img.width;
            ctx.rotate(-0.5 * Math.PI);
            ctx.translate(-img.width, 0);
            break;
    }

    ctx.drawImage(img, 0, 0);
    return canvas.convertToBlob({ type: 'image/jpeg', quality: quality/100 });
}