import React from 'react';
import './About.css'; // Import du fichier CSS personnalisé
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import AboutImage from '../assets/about_img.webp'; // Import de l'image
import { Link } from 'react-router-dom'; // Correct import for Link component

const About = () => (
  <div className="container mt-4">
    <div className="row">
      <div className="col-md-12 text-center">
        <h1 className="display-4">About Us</h1>
        <p className="lead">
          Simplifying Matrices, Empowering Solutions
        </p>
      </div>
    </div>
    <div className="row mt-5">
      {/* Texte descriptif */}
      <div className="col-md-6 d-flex align-items-center">
        <p>
        Welcome to our website dedicated to the Cholesky method, a powerful solution for symmetric matrix decompositions. Our goal is to make complex calculations accessible to everyone, whether you're a student, researcher, or professional. With an intuitive interface and powerful tools, we help you solve complex linear systems and analyze matrices quickly and accurately.
         Discover how our application can transform your mathematical workflows and guide you toward optimal solutions.
        </p>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-inner">
            <div className="card-front">
              <img
                src={AboutImage}
                alt="About Illustration"
                className="img-fluid rounded" // Classe Bootstrap pour le border-radius
                style={{
                  borderRadius: '20px',
                  objectFit: 'cover', // Rend l'image parfaitement ajustée
                  width: '100%',
                  height: '100%',
                }} // Style inline pour personnalisation
              />
            </div>
            <div className="card-back d-flex justify-content-center align-items-center">
              {/* Using Link for routing, instead of a button */}
              <Link to="/matrix/dense" className="btn btn-primary">
                Try it Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;
