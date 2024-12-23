//algorithme de resolution de cholesky en c++ avec le frameWork Crow
//la decomposition en L et LT 
/*

#include "crow_all.h"
#include <vector>
#include <cmath>
#include <sstream>
#include <utility>

using namespace std;

// Fonction pour effectuer la décomposition de Cholesky
pair<vector<vector<double>>, vector<vector<double>>> choleskyDecomposition(const vector<vector<double>>& matrix) {
    size_t n = matrix.size();
    vector<vector<double>> L(n, vector<double>(n, 0.0));
    vector<vector<double>> LT(n, vector<double>(n, 0.0));

    for (size_t i = 0; i < n; ++i) {
        for (size_t j = 0; j <= i; ++j) {
            double sum = 0.0;

            for (size_t k = 0; k < j; ++k) {
                sum += L[i][k] * L[j][k];
            }

            if (i == j) {
                // Diagonale
                L[i][j] = sqrt(matrix[i][i] - sum);
            } else {
                // Éléments inférieurs
                L[i][j] = (matrix[i][j] - sum) / L[j][j];
            }
        }
    }

    // Construire la matrice LT comme transposée de L
    for (size_t i = 0; i < n; ++i) {
        for (size_t j = 0; j <= i; ++j) {
            LT[j][i] = L[i][j];
        }
    }

    return {L, LT}; // Retourne L et LT
}

// Fonction pour convertir une matrice en JSON
crow::json::wvalue matrixToJson(const vector<vector<double>>& matrix) {
    crow::json::wvalue jsonMatrix = crow::json::wvalue::list();

    for (const auto& row : matrix) {
        crow::json::wvalue jsonRow = crow::json::wvalue::list();
        for (double value : row) {
            jsonRow.push_back(value);
        }
        jsonMatrix.push_back(jsonRow);
    }

    return jsonMatrix;
}

int main() {
    crow::SimpleApp app;

    // Endpoint pour résoudre la matrice avec Cholesky
    CROW_ROUTE(app, "/solve").methods("POST"_method)([](const crow::request& req) {
        auto body = crow::json::load(req.body);

        // Valider l'entrée JSON
        if (!body || !body.has("matrix")) {
            return crow::response(400, "Invalid input: 'matrix' is required.");
        }

        vector<vector<double>> matrix;

        // Charger la matrice depuis le JSON
        for (const auto& jsonRow : body["matrix"]) {
            vector<double> row;
            for (const auto& jsonValue : jsonRow) {
                row.push_back(jsonValue.d());
            }
            matrix.push_back(row);
        }

        try {
            // Effectuer la décomposition de Cholesky
            auto [L, LT] = choleskyDecomposition(matrix);

            // Construire la réponse JSON
            crow::json::wvalue response;
            response["L"] = matrixToJson(L);
            response["LT"] = matrixToJson(LT);

            return crow::response(response);
        } catch (const exception& e) {
            return crow::response(500, string("Error during Cholesky decomposition: ") + e.what());
        }
    });

    // Lancer le serveur
    app.port(5000).multithreaded().run();
}

*/
