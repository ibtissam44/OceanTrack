// src/pages/login.jsx
import React from "react";
import LoginForm from "../components/LoginForm";
import loginImage from "../assets/images/login.jpg";

const LoginPage = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-sky-50 px-4">
      <div className="w-full md:w-[900px] h-auto md:h-[600px] flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden border border-sky-200">
        <div className="w-full md:w-1/2 bg-gradient-to-r from-sky-300 to-sky-400 text-white flex flex-col justify-center items-center p-6">
          <LoginForm />
        </div>
        <div className="w-full md:w-1/2 bg-white text-sky-600 flex flex-col justify-center items-center p-6 md:p-8">
          <div className="w-full hidden md:block">
            <img src={loginImage} alt="Login" className="rounded-lg" />
          </div>
          <div className="flex flex-col justify-between h-full mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-sky-800">
              Pas encore inscrit ?
            </h2>
            <p className="mb-6 text-center text-sm md:text-base text-sky-700">
              Créez un compte pour accéder à toutes nos fonctionnalités.
            </p>
            <a
              href="/signup"
              className="px-4 py-2 md:px-6 md:py-3 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-colors duration-300 text-center"
            >
              Inscrivez-vous !
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;