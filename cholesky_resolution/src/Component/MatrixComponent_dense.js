import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MatrixComponent.css';
import * as XLSX from 'xlsx';

const MatrixComponent = () => {
  const [n, setN] = useState(0); // Taille de la matrice
  const [matrix, setMatrix] = useState([]); // Matrice principale
  const [b, setB] = useState([]); // Vecteur b
  const [L, setL] = useState(null); // Matrice triangulaire inférieure
  const [LT, setLT] = useState(null); // Transposée de L
  const [x, setX] = useState(null); // Vecteur x (résultat)

 // Générer une matrice triangulaire inférieure avec des valeurs entières (positives et négatives)
 const generateLowerTriangular = (size) => {
  const L = Array.from({ length: size }, () => Array(size).fill(0));
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= i; j++) {
      // Générer des valeurs entières aléatoires entre -10 et 10
      L[i][j] = i === j 
        ? Math.floor(Math.random() * 21) - 10 || 1 // Diagonale dominante, évite 0
        : Math.floor(Math.random() * 21) - 10;
    }
  }
  return L;
};

// Générer une matrice symétrique positive définie avec des valeurs entières (positives et négatives)
const generateSymmetricPositiveDefinite = (L) => {
  const size = L.length;
  const symmetricMatrix = Array.from({ length: size }, () => Array(size).fill(0));

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      for (let k = 0; k <= Math.min(i, j); k++) {
        symmetricMatrix[i][j] += L[i][k] * L[j][k];
      }
    }
  }

  // Arrondir les valeurs au nombre entier le plus proche
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      symmetricMatrix[i][j] = Math.round(symmetricMatrix[i][j]);
    }
  }

  return symmetricMatrix;
};

const handleSizeChange = (e) => {
  const newSize = parseInt(e.target.value, 10);
  if (newSize >= 7) {
    const L = generateLowerTriangular(newSize);
    const symmetricMatrix = generateSymmetricPositiveDefinite(L);
    const b = generateVectorB(newSize); // Générer un vecteur b seulement pour n >= 7
    setN(newSize);
    setMatrix(symmetricMatrix);
    setB(b); // Assigner le vecteur b généré
  } else if (newSize > 0) {
    const newMatrix = Array.from({ length: newSize }, () =>
      Array(newSize).fill('')
    );
    setN(newSize);
    setMatrix(newMatrix);
    setB([]); // Réinitialiser le vecteur b pour les tailles < 7
  } else {
    alert('Veuillez entrer une taille valide (n >= 1).');
  }
};

  // Modification des cellules de la matrice
  const handleCellChange = (rowIndex, cellIndex, value) => {
    const newMatrix = matrix.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === rowIndex && cIdx === cellIndex) {
          return value;
        }
        if (rIdx === cellIndex && cIdx === rowIndex) {
          return value; // Assurer la symétrie
        }
        return cell;
      })
    );
    setMatrix(newMatrix);
  };

  const generateVectorB = (size) => {
    const b = [];
    for (let i = 0; i < size; i++) {
      let value;
      do {
        // Génère un entier entre -10 et 10, exclut 0
        value = Math.floor(Math.random() * 21) - 10;
      } while (value === 0); // Répète jusqu'à ce que la valeur soit différente de 0
      b.push(value);
    }
    return b;
  };
  
  // Modification des éléments du vecteur b
  const handleVectorBChange = (index, value) => {
    const newB = [...b];
    newB[index] = value;
    setB(newB);
  };

  // Sauvegarde des matrices L et LT
  const saveMatricesToFile = () => {
    if (!matrix || !b || !L || !LT || !x) {
      alert('Toutes les informations ne sont pas disponibles. Veuillez résoudre la matrice d\'abord.');
      return;
    }
  
    const matrixString = 
      `Matrice A (Symétrique):\n${matrix.map((row) => row.join(', ')).join('\n')}\n\n` +
      `Vecteur b:\n${b.join(', ')}\n\n` +
      `Matrice L (Triangulaire Inférieure):\n${L.map((row) => row.join(', ')).join('\n')}\n\n` +
      `Matrice L^T (Transposée):\n${LT.map((row) => row.join(', ')).join('\n')}\n\n` +
      `Vecteur x (Solution):\n${x.join(', ')}`;
  
    const blob = new Blob([matrixString], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'matrix_solution.txt');
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      const importedMatrix = sheetData.map((row) => row.map((cell) => (cell !== undefined ? cell : '')));
      const size = importedMatrix.length;

      setN(size);
      setMatrix(importedMatrix);
      setB(Array(size).fill(''));
    };
    reader.readAsArrayBuffer(file);
  };

  // Sauvegarde de la matrice dans un fichier
  const saveMatrixToFile = () => {
    const matrixString = matrix.map((row) => row.join(', ')).join('\n');
    const blob = new Blob([matrixString], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'matrix.txt');
  };

  // Résolution de la matrice via le backend
  const solveMatrix = async () => {
    try {
      if (
        matrix.some((row) =>
          row.some((cell) => cell === '' || isNaN(parseFloat(cell)))
        ) || b.some((val) => val === '' || isNaN(parseFloat(val)))
      ) {
        alert('Toutes les cellules de la matrice et du vecteur b doivent être remplies avec des valeurs numériques.');
        return;
      }
  
      const formattedMatrix = matrix.map((row) =>
        row.map((cell) => parseFloat(cell))
      );
      const formattedB = b.map((val) => parseFloat(val));
  
      const response = await fetch('http://localhost:5000/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matrix: formattedMatrix, vector: formattedB }), // Utilisation correcte de 'vector'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur inconnue.');
      }
  
      const data = await response.json();
      setL(data.L);
      setLT(data.LT);
      setX(data.x);
    } catch (error) {
      console.error('Erreur lors de la résolution :', error.message);
      alert(`Une erreur est survenue : ${error.message}`);
    }
  };
  

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Cholesky Resolution</h1>
      <div className="mb-3">
        <label htmlFor="matrixSize" className="form-label">
          Matrix Size (n x n) :
        </label>
        <input
          type="number"
          id="matrixSize"
          className="form-control"
          value={n}
          onChange={handleSizeChange}
          min="1"
        />
      </div>
      {n > 0 && (
  <div className="table-responsive" class="matrix" style={{ maxHeight: '70vh' }}>
    <h3>Matrice A :</h3>
    <table className="table-table-bordered-table-sm">
      <tbody>
        {matrix.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>
                <input
                  type="text"
                  value={cell}
                  onChange={(e) =>
                    handleCellChange(rowIndex, cellIndex, e.target.value)
                  }
                  className="form-control text-center"
                  tabIndex={rowIndex >= cellIndex ? 0 : -1} // Focusable only for lower triangular cells
                  readOnly={rowIndex < cellIndex || n > 7} // Editable only for lower triangular cells
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      {n > 0 && (
        <div className="mt-3">
          <h3>Vecteur b :</h3>
          <div className="row">
            {Array.from({ length: n }).map((_, index) => (
              <div key={index} className="col">
                <input
                  type="text"
                  value={b[index] || ''}
                  onChange={(e) => handleVectorBChange(index, e.target.value)}
                  className="form-control text-center"
                  readOnly={n > 7} // Non modifiable si n > 7
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={saveMatrixToFile} className="btn btn-primary mt-3 me-2" class="buttonSaveMatrix">
        Download Matrix
      </button>
      <button onClick={solveMatrix} className="btn btn-success mt-3" class="buttonSaveMatrix">
        Solve Matrix
      </button>
      <div className="mt-3">
      <button
        onClick={() => document.getElementById('excelFileInput').click()}
        className="btn btn-success mt-3" class="buttonSaveMatrix"
      >
        Import from Excel
      </button>
      <input
        id="excelFileInput"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleImportExcel}
        hidden
      />
    </div>

      {L && (
  <div className="mt-4">
    <h3>Matrice L (Triangulaire Inférieure) :</h3>
    <table
      className="table table-bordered table-sm"
      style={{ borderRadius: '10px', overflow: 'hidden' }}
    >
      <tbody>
        {L.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="text-center">
                {Math.round(cell * 100) / 100} {/* Round to 2 decimal places */}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{LT && (
  <div className="mt-4">
    <h3>Matrice L<sup>T</sup> :</h3>
    <table
      className="table table-bordered table-sm"
      style={{ borderRadius: '10px', overflow: 'hidden' }}
    >
      <tbody>
        {LT.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="text-center">
                {Math.round(cell * 100) / 100} {/* Round to 2 decimal places */}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{x && (
        <div className="mt-4">
          <h3>Vecteur x (Résultat) :</h3>
          <div className="row">
            {x.map((val, index) => (
              <div key={index} className="col">
                <input
                  type="text"
                  value={val}
                  readOnly
                  className="form-control text-center"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {x && (
  <div className="mt-4">
    <h3>Vecteur round(x) (Résultat) :</h3>
    <div className="row">
      {x.map((val, index) => (
        <div key={index} className="col">
          <input
            type="text"
            value={Math.round(val * 100) / 100} // Round to 2 decimal places
            readOnly
            className="form-control text-center"
          />
        </div>
      ))}
    </div>
      <button onClick={saveMatricesToFile} className="btn btn-secondary mt-3" class="buttonSaveMatrix">
          Download Solution
        </button>
    </div>
    )}

    <div>
      <h3>Program Flow:</h3>
      <ul>
        <li><strong>State Initialization:</strong> The program initializes state variables for the matrix size (n), the main matrix, the vector b, matrices L and LT (lower triangular and transposed), and the vector x (solution).</li>
        <li><strong>Matrix Generation:</strong> A function generates a lower triangular matrix L, then a symmetric positive definite matrix from L. Once n greater or equal 7, a vector b is also generated.</li>
        <li><strong>Element Modification:</strong> The user can enter values into the matrix and vector b, with the matrix symmetry being managed and editing limits for matrices larger than size 7.</li>
        <li><strong>Import from Excel:</strong> The user can import a matrix and vector b from an Excel file and load them into the interface.</li>
        <li><strong>Data Verification:</strong> The program checks that all cells in the matrix and vector b are filled and contain numeric values before solving the matrix.</li>
        <li><strong>Resolution via Backend:</strong> The program sends the data (matrix and vector b) to the backend to solve the system of equations using the Cholesky method. Matrices L and LT, as well as vector x (solution), are retrieved and displayed.</li>
        <li><strong>Matrix Display:</strong> Matrices L (lower triangular), LT (transposed), and vector x (result) are displayed to the user, with values rounded to two decimal places.</li>
        <li><strong>Rounded x Calculation:</strong> The vector x is rounded to two decimal places and displayed in the interface. It can also be downloaded as a text file with the matrices and results.</li>
        <li><strong>Export Results:</strong> The program allows the matrices and results to be downloaded as text files (input matrix, matrices L and LT, solution x).</li>
        <li><strong>Error Handling:</strong> If an error occurs during the solution or if inputs are invalid, error messages are displayed to guide the user.</li>
      </ul>
    </div>


  </div>
  );
};

export default MatrixComponent;
