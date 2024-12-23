from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import math

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
CORS(app)

# Cholesky decomposition
def cholesky_decomposition(matrix):
    n = len(matrix)
    L = np.zeros((n, n))

    for i in range(n):
        for j in range(i + 1):
            sum_value = sum(L[i][k] * L[j][k] for k in range(j))
            if i == j:
                diff = matrix[i][i] - sum_value
                if diff <= 0:  # Check for positive definiteness
                    raise ValueError(f"Matrix is not positive definite at row {i}, col {j}.")
                L[i][j] = math.sqrt(diff)
            else:
                L[i][j] = (matrix[i][j] - sum_value) / L[j][j]
    return L, L.T

# Forward substitution for solving Ly = b
def forward_substitution(L, b):
    n = len(b)
    y = np.zeros(n)
    for i in range(n):
        y[i] = (b[i] - sum(L[i][j] * y[j] for j in range(i))) / L[i][i]
    return y

# Backward substitution for solving L^T x = y
def backward_substitution(LT, y):
    n = len(y)
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = (y[i] - sum(LT[i][j] * x[j] for j in range(i + 1, n))) / LT[i][i]
    return x

# Validation of matrix cells
def verify_matrix(matrix):
    for row in matrix:
        for cell in row:
            if cell is None or cell == "":
                return False
    return True

# API endpoint for solving the system
@app.route('/solve', methods=['POST'])
def solve():
    try:
        # Get the request data
        data = request.get_json()

        # Validate input
        if not data or 'matrix' not in data or 'vector' not in data:
            return jsonify({"error": "Invalid input: 'matrix' and 'vector' are required."}), 400

        matrix = np.array(data['matrix'], dtype=float)
        b = np.array(data['vector'], dtype=float)

        # Validate matrix and vector dimensions
        if len(matrix) != len(b):
            return jsonify({"error": "Dimension mismatch between matrix and vector."}), 400

        # Check if matrix is filled (no empty cells)
        if not verify_matrix(matrix):
            return jsonify({"error": "Matrix contains empty cells. Please fill all the cells."}), 400

        # Perform Cholesky decomposition
        L, LT = cholesky_decomposition(matrix)

        # Solve Ly = b using forward substitution
        y = forward_substitution(L, b)

        # Solve L^T x = y using backward substitution
        x = backward_substitution(LT, y)

        # Return the response with matrices L, LT, and vector x
        return jsonify({
            "L": L.tolist(),
            "LT": LT.tolist(),
            "x": x.tolist()
        })

    except ValueError as ve:
        return jsonify({"error": f"Value error: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
