const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
let port = 3000;

// Use JavaScript implementation for matrices
const matrices = new Map();

app.use(express.json());
app.use(express.static('public'));

app.post('/api/matrix/create', (req, res) => {
    const { name, rows, cols, data } = req.body;
    console.log('Creating matrix:', name);
    
    matrices.set(name, { name, rows, cols, data });
    res.json({ message: 'Matrix created successfully' });
});

app.get('/api/matrices', (req, res) => {
    console.log('Getting all matrices');
    const matrixList = Array.from(matrices.entries()).map(([name, matrix]) => ({
        name,
        rows: matrix.rows,
        cols: matrix.cols,
        data: matrix.data
    }));
    res.json(matrixList);
});

app.post('/api/calculate', (req, res) => {
    const { operation, matrix1, matrix2 } = req.body;
    console.log('Calculating:', operation);
    
    const m1 = matrices.get(matrix1.name);
    const m2 = matrices.get(matrix2.name);
    
    if (!m1 || !m2) {
        return res.status(404).json({ error: 'One or both matrices not found' });
    }
    
    let result;
    let resultData;
    
    if (operation === 'add') {
        if (m1.rows !== m2.rows || m1.cols !== m2.cols) {
            return res.status(400).json({ error: 'Matrix dimensions don\'t match for addition' });
        }
        
        resultData = Array(m1.rows).fill().map(() => Array(m1.cols).fill(0));
        for (let i = 0; i < m1.rows; i++) {
            for (let j = 0; j < m1.cols; j++) {
                resultData[i][j] = m1.data[i][j] + m2.data[i][j];
            }
        }
    } else if (operation === 'multiply') {
        if (m1.cols !== m2.rows) {
            return res.status(400).json({ error: 'Matrix dimensions don\'t match for multiplication' });
        }
        
        resultData = Array(m1.rows).fill().map(() => Array(m2.cols).fill(0));
        for (let i = 0; i < m1.rows; i++) {
            for (let j = 0; j < m2.cols; j++) {
                for (let k = 0; k < m1.cols; k++) {
                    resultData[i][j] += m1.data[i][k] * m2.data[k][j];
                }
            }
        }
    } else {
        return res.status(400).json({ error: 'Invalid operation' });
    }
    
    // Store the result
    const resultName = 'result';
    matrices.set(resultName, {
        name: resultName,
        rows: resultData.length,
        cols: resultData[0].length,
        data: resultData
    });
    
    // Format result similar to C program output
    let formattedResult = `Matrix result (${resultData.length}x${resultData[0].length}):\n`;
    resultData.forEach(row => {
        formattedResult += row.map(val => val.toFixed(2)).join('\t') + '\n';
    });
    
    res.json({ result: formattedResult });
});

// Function to try different ports
const startServer = (initialPort) => {
    const server = app.listen(initialPort)
        .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${initialPort} is busy, trying ${initialPort + 1}...`);
                startServer(initialPort + 1);
            } else {
                console.error('Server error:', err);
            }
        })
        .on('listening', () => {
            port = initialPort;
            console.log(`Server running at http://localhost:${port}`);
            console.log(`JavaScript implementation being used to handle matrices`);
        });
};

// Start the server
startServer(port); 