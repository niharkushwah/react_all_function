import React, { useState } from "react";
import AuthService from "../auth/auth.service";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [age, setAge] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mainAddress, setMainAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
    setIsPasswordValid(password.length >= 8);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      const data = {
        name,
        username,
        email,
        password,
        age,
        countryCode,
        mobileNumber,
        mainAddress,
        city,
        pincode,
      };
      await AuthService.signup(data).then(
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
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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

        <div className="mb-3">
          <label htmlFor="age" className="form-label">
            Age
          </label>
          <input
            type="number"
            id="age"
            className="form-control"
            placeholder="Enter age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="countryCode" className="form-label">
            Country code
          </label>
          <input
            type="text"
            id="countryCode"
            className="form-control"
            placeholder="Enter country code"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mobileNumber" className="form-label">
            Mobile number
          </label>
          <input
            type="text"
            id="mobileNumber"
            className="form-control"
            placeholder="Enter mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mainAddress" className="form-label">
            Main address
          </label>
          <input
            type="text"
            id="mainAddress"
            className="form-control"
            placeholder="Enter main address"
            value={mainAddress}
            onChange={(e) => setMainAddress(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            id="city"
            className="form-control"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="pincode" className="form-label">
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            className="form-control"
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-warning">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;
