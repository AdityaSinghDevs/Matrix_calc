// Global state
let currentMatrix = null;

// Load stored matrices on page load
window.addEventListener('load', loadStoredMatrices);

async function loadStoredMatrices() {
    try {
        const response = await fetch('/api/matrices');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const matrices = await response.json();
        updateStoredMatrices(matrices);
        updateMatrixSelects(matrices);
    } catch (error) {
        console.error('Failed to load matrices:', error);
    }
}

function updateStoredMatrices(matrices) {
    const container = document.getElementById('stored-matrices');
    container.innerHTML = '';
    
    if (!matrices || matrices.length === 0) {
        container.innerHTML = '<div class="text-gray-500">No matrices stored yet</div>';
        return;
    }
    
    matrices.forEach(matrix => {
        const matrixDiv = document.createElement('div');
        matrixDiv.className = 'bg-gray-50 p-4 rounded-lg';
        
        const header = document.createElement('h3');
        header.className = 'font-semibold mb-2';
        header.textContent = matrix.name;
        
        const grid = document.createElement('div');
        grid.className = 'grid gap-1';
        grid.style.gridTemplateColumns = `repeat(${matrix.cols}, 1fr)`;
        
        matrix.data.forEach(row => {
            row.forEach(value => {
                const cell = document.createElement('div');
                cell.className = 'p-2 text-center bg-white border rounded text-sm';
                cell.textContent = value.toFixed(2);
                grid.appendChild(cell);
            });
        });
        
        matrixDiv.appendChild(header);
        matrixDiv.appendChild(grid);
        container.appendChild(matrixDiv);
    });
}

function updateMatrixSelects(matrices) {
    const selects = ['matrix1-select', 'matrix2-select'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        const currentValue = select.value;
        
        // Clear all options except the first one
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Add matrix options
        if (matrices && matrices.length > 0) {
            matrices.forEach(matrix => {
                const option = document.createElement('option');
                option.value = matrix.name;
                option.textContent = matrix.name;
                select.appendChild(option);
            });
        }
        
        // Restore previous selection if it still exists
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

function createMatrixInputs() {
    const name = document.getElementById('matrix-name').value;
    const rows = parseInt(document.getElementById('matrix-rows').value);
    const cols = parseInt(document.getElementById('matrix-cols').value);
    
    if (!name || !rows || !cols) {
        alert('Please fill in all matrix details');
        return;
    }
    
    const container = document.getElementById('matrix-inputs');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'w-full p-2 border rounded text-center';
            input.placeholder = `${i+1},${j+1}`;
            input.dataset.row = i;
            input.dataset.col = j;
            container.appendChild(input);
        }
    }
    
    currentMatrix = { name, rows, cols };
    document.getElementById('save-matrix').classList.remove('hidden');
}

async function saveMatrix() {
    if (!currentMatrix) return;
    
    const inputs = document.getElementById('matrix-inputs').getElementsByTagName('input');
    const data = Array(currentMatrix.rows).fill().map(() => Array(currentMatrix.cols).fill(0));
    
    for (const input of inputs) {
        const i = parseInt(input.dataset.row);
        const j = parseInt(input.dataset.col);
        data[i][j] = parseFloat(input.value) || 0;
    }
    
    try {
        const response = await fetch('/api/matrix/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: currentMatrix.name,
                rows: currentMatrix.rows,
                cols: currentMatrix.cols,
                data
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Reset form
        document.getElementById('matrix-name').value = '';
        document.getElementById('matrix-rows').value = '';
        document.getElementById('matrix-cols').value = '';
        document.getElementById('matrix-inputs').innerHTML = '';
        document.getElementById('save-matrix').classList.add('hidden');
        currentMatrix = null;
        
        // Reload matrices
        await loadStoredMatrices();
    } catch (error) {
        console.error('Failed to save matrix:', error);
        alert('Failed to save matrix: ' + error.message);
    }
}

async function performOperation() {
    const matrix1Name = document.getElementById('matrix1-select').value;
    const matrix2Name = document.getElementById('matrix2-select').value;
    const operation = document.getElementById('operation-select').value;
    
    if (!matrix1Name || !matrix2Name) {
        alert('Please select both matrices');
        return;
    }
    
    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operation,
                matrix1: { name: matrix1Name },
                matrix2: { name: matrix2Name }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        
        displayResult(data.result);
        
        // Reload matrices to show the new result matrix
        await loadStoredMatrices();
    } catch (error) {
        console.error('Operation failed:', error);
        alert('Operation failed: ' + error.message);
    }
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    const resultMatrix = document.getElementById('result-matrix');
    
    resultDiv.classList.remove('hidden');
    resultMatrix.innerHTML = '';
    
    // Parse the result string and create a grid display
    const lines = result.split('\n');
    let inResultMatrix = false;
    let gridData = [];
    
    for (const line of lines) {
        if (line.includes('Matrix result')) {
            inResultMatrix = true;
            continue;
        }
        
        if (inResultMatrix && line.trim()) {
            const row = line.trim().split(/\s+/).map(n => parseFloat(n));
            if (row.length > 0 && !isNaN(row[0])) {
                gridData.push(row);
            }
        }
    }
    
    if (gridData.length > 0) {
        // Create grid display
        resultMatrix.style.gridTemplateColumns = `repeat(${gridData[0].length}, 1fr)`;
        
        for (const row of gridData) {
            for (const cell of row) {
                const div = document.createElement('div');
                div.className = 'p-2 border rounded text-center bg-white';
                div.textContent = cell.toFixed(2);
                resultMatrix.appendChild(div);
            }
        }
    } else {
        resultMatrix.innerHTML = '<div class="text-red-500">No valid result data</div>';
    }
} 