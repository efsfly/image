// Updated script.js
// Modified updatePreview function for Wolfram-style cards
function updatePreview(results) {
    previewContainer.innerHTML = results.map(result => `
        <div class="preview-card">
            <div style="padding: 1rem;">
                <img src="${result.preview}" style="width: 100%; border-radius: 4px;">
            </div>
            <table class="stat-table">
                <tr>
                    <td>Original Size</td>
                    <td>${formatBytes(result.original.size)}</td>
                </tr>
                <tr>
                    <td>Compressed Size</td>
                    <td>${formatBytes(result.compressed.size)}</td>
                </tr>
                <tr>
                    <td>Reduction</td>
                    <td style="color: ${result.reduction > 0 ? '#0066b8' : '#d7191c'}">
                        ${result.reduction}%
                    </td>
                </tr>
            </table>
            <div style="padding: 1rem; border-top: 1px solid var(--neutral-gray);">
                ${createShareButtons(result.compressed).outerHTML}
            </div>
        </div>
    `).join('');
}

// Enhanced error handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${message}
    `;
    document.querySelector('.container').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Modified handleFiles with error handling
function handleFiles(newFiles) {
    try {
        files = [...files, ...newFiles].filter(file => {
            if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
                showError('Only JPEG files are allowed');
                return false;
            }
            if (file.size > 50 * 1024 * 1024) {
                showError('Files must be smaller than 50MB');
                return false;
            }
            return true;
        });
        
        // Rest of processing logic...
    } catch (error) {
        showError('Failed to process files');
    }
}

// Progress animation handler
function updateProgress(percentage) {
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = `${percentage}%`;
    
    if (percentage >= 100) {
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 500);
    }
}

// Web Worker status indicators
function toggleProcessingState(isProcessing) {
    const uploadZone = document.getElementById('dropZone');
    uploadZone.style.opacity = isProcessing ? 0.6 : 1;
    uploadZone.style.pointerEvents = isProcessing ? 'none' : 'all';
}