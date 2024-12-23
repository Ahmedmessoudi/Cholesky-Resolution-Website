import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MatrixComponent.css';
import * as XLSX from 'xlsx';

const MatrixComponent = () => {
  const [n, setN] = useState(0); // Taille de la matrice
  const [bandSize, setBandSize] = useState(1); // Taille de la bande

  const [matrix, setMatrix] = useState([]); // Matrice principale
  const [b, setB] = useState([]); // Vecteur b
  const [L, setL] = useState(null); // Matrice triangulaire inférieure
  const [LT, setLT] = useState(null); // Transposée de L
  const [x, setX] = useState(null); // Vecteur x (résultat)

  // Générer une matrice symétrique avec la diagonale aléatoire et le reste null
  const generateBandMatrix = (size, band, isRandom = true) => {
    const matrix = Array.from({ length: size }, (_, i) =>
    Array(size).fill(0).map((_, j) => {
          // Allow the user to input values for the diagonal and band
          if (i === j) {
            return ''; // Diagonal cells are editable
          }
          if (Math.abs(i - j) <= band) {
            return ''; // Band cells are editable
          }
          return 0; // Non-diagonal, non-band cells are set to 0
        })
    );
  
    if (isRandom && size >= 7) {
      // Generate random values for the band, ensuring symmetry
      for (let i = 0; i < size; i++) {
        for (let j = Math.max(0, i - band); j <= Math.min(size - 1, i + band); j++) {
          const value = i === j ? Math.floor(Math.random() * 10) + size : Math.floor(Math.random() * 20) - 10;
          matrix[i][j] = value;
          matrix[j][i] = value; // Ensure symmetry
        }
      }
  
      // Ensure diagonal dominance for positive definiteness
      for (let i = 0; i < size; i++) {
        matrix[i][i] = Math.abs(matrix[i].reduce((sum, val) => sum + Math.abs(val), 0)) + 1;
      }
    }
  
    return matrix;
  };
  
  
  

  // Mise à jour de la taille de la matrice
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
  
    if (newSize >= 7) {
      // For sizes >= 7, generate the symmetric band matrix and a random vector b
      const symmetricMatrix = generateBandMatrix(newSize, bandSize);
      const b = generateVectorB(newSize); // Generate vector b only for n >= 7
      setN(newSize);
      setMatrix(symmetricMatrix);
      setB(b);
    } else if (newSize > 0) {
      // For sizes < 7, allow the user to manually enter both diagonal and band values
      const newMatrix = Array.from({ length: newSize }, (_, i) =>
        Array(newSize).fill(0).map((_, j) => {
          // Allow the user to input values for the diagonal and band
          if (i === j) {
            return ''; // Diagonal cells are editable
          }
          if (Math.abs(i - j) <= bandSize) {
            return ''; // Band cells are editable
          }
          return 0; // Non-diagonal, non-band cells are set to 0
        })
      );
      setN(newSize);
      setMatrix(newMatrix);
      setB([]); // Clear vector b for sizes < 7 as the user will manually input values
    } else {
      alert('Veuillez entrer une taille valide (n >= 1).');
    }
  };
  
  

  // Mise à jour de la taille de la bande
  const handleBandSizeChange = (e) => {
    const newBandSize = parseInt(e.target.value, 10);
    if (newBandSize >= 0 && newBandSize < n) {
      const newMatrix = generateBandMatrix(n, newBandSize);
      setBandSize(newBandSize);
      setMatrix(newMatrix);
    } else {
      alert('La taille de la bande doit être un entier positif et inférieur à n.');
    }
  };

  // Modification des cellules de la matrice
  const handleCellChange = (rowIndex, cellIndex, value) => {
    if (Math.abs(rowIndex - cellIndex) > bandSize) return; // Ignore changes outside the band
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
  
      if (!sheetData || sheetData.length < 2) {
        console.error("Le fichier Excel est vide ou invalide.");
        return;
      }
  
      // Lire la taille de la bande (k) depuis A1
      let k = parseInt(sheetData[0]?.[0], 10);
  
      if (isNaN(k) || k <= 0) {
        console.error("La taille de la bande (k) dans A1 est invalide.");
        return;
      }
  
      const size = sheetData.length - 1; // Exclure la première ligne (A1)
      
      // Vérifier que k est valide : il ne doit pas être supérieur à la taille de la matrice - 2
      if (k > size - 2) {
        console.error(`La taille de la bande ne peut pas être supérieure à ${size - 2}.`);
        // Optionnel : ajuster k à une valeur valide, par exemple la taille maximale autorisée
        k = size - 2;
        console.log(`La taille de la bande a été ajustée à ${k}.`);
      }
  
      console.log(`Taille de la bande détectée : ${k}`);
  
      // Extraire la matrice en ignorant la première ligne
      const importedMatrix = sheetData.slice(1);
  
      // Créer une matrice bande
      const bandMatrix = Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => {
          // Vérifier si l'élément est dans la bande
          if (Math.abs(i - j) <= k) {
            // L'élément est dans la bande
            return importedMatrix[i]?.[j] ?? 0;
          }
          // L'élément est hors de la bande (mettre 0)
          return 0;
        })
      );
  
      // Mise à jour des états React pour refléter les données importées
      setN(size); // Mettre à jour la taille de la matrice
      setMatrix(bandMatrix); // Mettre à jour la matrice avec la bande
      setB(Array(size).fill('')); // Réinitialiser le vecteur b
      setBandSize(bandMatrix);
    };
    reader.readAsArrayBuffer(file);
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
    newB[index] = parseFloat(value) || 0; // Ensure it's a valid number or fallback to 0
    setB(newB);
  };

  // Sauvegarde de la matrice dans un fichier
  const saveMatrixToFile = () => {
    const matrixString = matrix.map((row) =>
      row.map((cell) => (cell === null ? '' : cell)).join(', ')
    ).join('\n');
    const blob = new Blob([matrixString], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'matrix.txt');
  };

  // Résolution de la matrice via le backend
  const solveMatrix = async () => {
    try {
      if (
        matrix.some((row) =>
          row.some((cell) => cell === '' || cell === null || isNaN(parseFloat(cell)))
        ) || b.some((val) => val === '' || isNaN(parseFloat(val)))
      ) {
        alert('Toutes les cellules de la matrice et du vecteur b doivent être remplies avec des valeurs numériques.');
        return;
      }

      const formattedMatrix = matrix.map((row) =>
        row.map((cell) => (cell === null ? 0 : parseFloat(cell)))
      );
      const formattedB = b.map((val) => parseFloat(val));

      const response = await fetch('http://localhost:5000/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matrix: formattedMatrix, vector: formattedB }),
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
      <div className="mb-3">
        <label htmlFor="bandSize" className="form-label">
          Band Size (k):
        </label>
        <input
          type="number"
          id="bandSize"
          className="form-control"
          value={bandSize}
          onChange={handleBandSizeChange}
          min="0"
          max={n - 2}
        />
      </div>
      {n > 0 && (
  <div className="table-responsive" class="matrix"style={{ maxHeight: '70vh' }}>
    <h3>Matrice A :</h3>
    <table className="table-table-bordered-table-sm">
      <tbody>
        {matrix.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => {
              const isBandCell = Math.abs(rowIndex - cellIndex) <= bandSize;
              const isDiagonal = rowIndex === cellIndex;

              return (
                <td key={cellIndex}>
                  {isDiagonal || isBandCell ? (
                    <input
                      type="number"
                      value={cell === '' ? '' : cell}
                      onChange={(e) => handleCellChange(rowIndex, cellIndex, parseFloat(e.target.value))}
                      className="form-control text-center"
                      placeholder=""
                      tabIndex="0" // Make band cells and diagonal cells tabbable
                    />
                  ) : (
                    <input
                      type="text"
                      value={cell}
                      readOnly
                      className="form-control text-center"
                      tabIndex="-1" // Make non-band, non-diagonal cells not tabbable
                    />
                  )}
                </td>
              );
            })}
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
                  readOnly={n > 7}
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
            <button onClick={saveMatricesToFile} className="btn btn-secondary mt-3" class="buttonSaveMatrix"> Download Solution </button>
        </div>
        )}
      
      <div>
        <h3>Program Flow:</h3>
        <ul>
          <li><strong>State Initialization:</strong> The program initializes state variables for the matrix size (n), the band size, the main matrix, the vector b, and the L and LT matrices (lower triangular and transposed).</li>
          <li><strong>Matrix Generation:</strong> A function generates a symmetric matrix with a band, ensuring diagonal dominance to guarantee positive definiteness.</li>
          <li><strong>Cell Modification:</strong> The user can enter values for the elements of the matrix, adhering to the specified band.</li>
          <li><strong>Input Verification:</strong> The program checks if the entries for the matrix and vector b are valid before solving the system of equations.</li>
          <li><strong>Matrix Resolution:</strong> The program sends the data to the server to solve the matrix using the Cholesky method.</li>
          <li><strong>Displaying Results:</strong> Once the calculation is performed, the L, LT matrices, and the x vector (solution) are displayed.</li>
          <li><strong>Import from Excel File:</strong> The user can import a matrix and vector b from an Excel file for processing.</li>
          <li><strong>Exporting Results:</strong> The program allows the user to download the matrices and results as text files.</li>
          <li><strong>Error Handling:</strong> Error messages are displayed if the matrix or vector b contain invalid entries or if an error occurs during resolution.</li>
          <li><strong>Rounded x Vector Calculation:</strong> A rounded version of the x vector is displayed and can also be downloaded.</li>
        </ul>
      </div>


    </div>
  );
};

export default MatrixComponent;
