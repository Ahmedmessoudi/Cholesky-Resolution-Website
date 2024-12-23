import React from 'react';
import homeImage from '../assets/home_img.webp'; // Import de l'image

const Home = () => (
  <div className="container mt-4">
    {/* Header Section */}
    <div className="row">
      <div className="col-md-12 text-center">
        <h1 className="display-4">Welcome to the Cholesky Solver</h1>
        <p className="lead">
          Your go-to tool for efficient matrix resolution
        </p>
      </div>
    </div>

    {/* Main Content Section */}
    <div className="row mt-5">
      <div className="col-md-6">
        <img
          src={homeImage}
          alt="Cholesky Solver Illustration"
          className="img-fluid"
          style={{ borderRadius: '20px' }}
        />
      </div>
      <div className="col-md-6 d-flex align-items-center">
        <p>
          Welcome to our Cholesky Solver website, a powerful tool designed to
          simplify matrix decompositions. Whether you're a student, researcher,
          or professional, with an intuitive interface and fast calculations, you
          can solve complex linear systems and analyze matrices with ease. Start
          exploring the features and enhance your mathematical workflows today!
        </p>
      </div>
    </div>

    {/* Cholesky Decomposition Steps Section */}
    <div className="row mt-5">
      <div className="col-md-12">
        <h2 className="display-4 text-center">Steps for Cholesky resolution</h2>
        <ol>
          <li>
            <strong>Step 1:</strong> Ensure the matrix is symmetric and positive definite.
          </li>
          <li>
            <strong>Step 2:</strong> Start with the first row and column of the matrix, and compute the first element of the decomposition matrix.
          </li>
          <li>
            <strong>Step 3:</strong> Move to the next row and column, applying the Cholesky formula to calculate each element.
          </li>
          <li>
            <strong>Step 4:</strong> Repeat the process for all rows and columns until the entire decomposition matrix is found.
          </li>
          <li>
            <strong>Step 5:</strong> The result is a lower triangular matrix and an upper triangular matrix, and you can now solve linear systems or perform other matrix operations.
          </li>
        </ol>
      </div>
    </div>

    {/* Embedded YouTube Video Section */}
    <div className="row mt-5">
      <div className="col-md-12 text-center">
        <h2 className="display-4">Watch the Video on Cholesky Decomposition</h2>
        <iframe
          width="100%" 
          height="600" 
          src="https://www.youtube.com/embed/r-P3vkKVutU"
          title="Cholesky Decomposition Tutorial"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </div>
);

export default Home;
