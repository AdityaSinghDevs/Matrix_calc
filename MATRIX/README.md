# Matrix Calculator

A sleek, cyberpunk-themed matrix calculator with a web interface. This application allows users to create matrices, perform operations (addition, multiplication), and visualize the results.

![Matrix Calculator](https://i.imgur.com/5hnSffj.png)

## Features

- Create and store matrices with custom dimensions
- Perform matrix addition and multiplication
- Responsive, modern UI with cyberpunk aesthetics
- Real-time matrix manipulation

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v12.0.0 or higher)
- npm (comes with Node.js)

## Important Note

The repository includes the pre-compiled `matrix_calculator.exe` file - you do NOT need to compile the C code yourself. The web application will use this executable automatically.

## Getting Started

Follow these steps to get the Matrix Calculator up and running on your local machine:

### Step 1: Clone the Repository

1. Open a Command Prompt (Windows) or Terminal (macOS/Linux)
2. Navigate to the folder where you want to download the project 
   ```
   # Example: Navigate to Desktop
   cd Desktop
   ```
3. Clone the repository by running:
   ```bash
   git clone https://github.com/AdityaSinghDevs/Matrix_calc.git
   ```
4. Navigate into the project folder:
   ```bash
   cd MATRIX
   ```

### Step 2: Install Dependencies

1. Make sure you're in the project folder (matrix-calculator)
2. Run the following command to install all required packages:
   ```bash
   npm install
   ```
3. You should see a progress bar and text showing the installation progress

### Step 3: Start the Server

1. In the same command prompt/terminal window, run:
   ```bash
   npm start
   ```
   Or alternatively:
   ```bash
   node server.js
   ```
2. You should see a message saying "Server running at http://localhost:3000" (or a different port if 3000 is in use)
3. Keep this window open while using the application

### Step 4: Access the Application

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Type the following address in the address bar and press Enter:
   ```
   http://localhost:3000
   ```
   If the server indicated a different port number, use that instead of 3000
3. The Matrix Calculator interface should now load in your browser

## How the Application Works

The web interface communicates with a Node.js server, which performs matrix operations directly in JavaScript. The application handles all matrix storage and calculations internally - no external computation is needed.

## How to Use the Calculator

### Creating a Matrix

1. Enter a name for your matrix in the "Matrix Name" field
2. Specify the number of rows and columns
3. Click the "Generate" button
4. Fill in the matrix values
5. Click "Save Matrix"

### Performing Operations

1. Select the first matrix from the dropdown
2. Choose the operation (Addition or Multiplication)
3. Select the second matrix
4. Click "Calculate"
5. View the result displayed below

## Understanding Matrix Operations

### Matrix Addition

Matrix addition is only possible when both matrices have the same dimensions. The result is a matrix where each element is the sum of the corresponding elements in the input matrices.

### Matrix Multiplication

To multiply matrix A by matrix B:
- The number of columns in A must equal the number of rows in B
- The resulting matrix will have dimensions: (rows of A) × (columns of B)
- Each element is calculated using the dot product of the corresponding row in A and column in B

## Troubleshooting

### Server Won't Start

If you encounter issues starting the server:
1. Make sure no other application is using the specified port
2. Verify that Node.js is properly installed by running `node -v` in your command prompt/terminal
3. Try reinstalling dependencies with `npm install`
4. If you see an error about missing modules, try deleting the "node_modules" folder and run `npm install` again

### Browser Can't Connect to Server

1. Ensure the server is still running in your command prompt/terminal
2. Check that you're using the correct URL (including the correct port number)
3. Try using a different browser
4. If using localhost doesn't work, try using 127.0.0.1 instead (e.g., http://127.0.0.1:3000)

### Matrix Operations Errors

If matrix operations aren't working correctly:
1. Verify that your matrices have valid dimensions for the operation
2. Ensure all matrix cells contain valid numbers
3. Check that both matrices have been properly saved

## Closing the Application

1. To stop the server, go to the command prompt/terminal window where it's running
2. Press CTRL+C on your keyboard
3. If prompted to terminate the batch job, type Y and press Enter

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Mathematics: Custom matrix operation implementation in JavaScript

## Contributing

Contributions are welcome! If you'd like to contribute, please:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Created by:
- Arjun
- Vibhu
- Shivansh
- Hiya
- Parina
- Ruhaan

---

For any questions or support, please open an issue in the GitHub repository. 
