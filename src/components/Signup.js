import React, { useState } from "react";
import AuthService from "../auth/auth.service";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handleSignup = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
    setIsPasswordValid(password.length >= 8);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      await AuthService.signup(email, password).then(
        (response) => {
          console.log("Signup successful!");
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSignup}>
        <h3>Sign up</h3>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="text"
            id="email"
            className={`form-control ${!isEmailValid ? "is-invalid" : ""}`}
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!isEmailValid && (
            <div className="invalid-feedback">Invalid email format</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className={`form-control ${!isPasswordValid ? "is-invalid" : ""}`}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isPasswordValid && (
            <div className="invalid-feedback">
              Password must be at least 8 characters long
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-warning">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;
