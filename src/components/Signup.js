import React, { useState } from "react";
import AuthService from "../auth/auth.service";
import EmailValidator from "email-validator";
import countryList from "react-select-country-list";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    mobileNumber: "",
    mainAddress: "",
    city: "",
    pincode: "",
    name: "",
    username: "",
    selectedCountry: null,
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    mobileNumber: "",
    mainAddress: "",
    city: "",
    pincode: "",
    name: "",
    username: "",
    countryCode: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCountryCodeChange = (selectedOption) => {
    setFormData({
      ...formData,
      selectedCountry: selectedOption,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const {
      email,
      password,
      confirmPassword,
      age,
      mobileNumber,
      mainAddress,
      city,
      pincode,
      name,
      username,
      selectedCountry,
    } = formData;

    setFormErrors({
      email: !email
        ? "Email is required."
        : EmailValidator.validate(email)
        ? ""
        : "Invalid email format.",
      password:
        password.length < 8
          ? "Password must be at least 8 characters long."
          : "",
      confirmPassword:
        password !== confirmPassword ? "Passwords do not match." : "",
      age:
        isNaN(parseInt(age)) ||
        parseInt(age) <= 0 ||
        parseInt(age) <= 15 ||
        parseInt(age) >= 99
          ? "Age should be a positive number and should be between 18 and 99."
          : "",
      mobileNumber:
        mobileNumber.length !== 10 ? "Mobile number should be 10 digits." : "",
      mainAddress: !mainAddress ? "Main address is required." : "",
      city: !city ? "City is required." : "",
      pincode: !pincode.match(/^\d{6}$/)
        ? "Pincode should be a 6-digit number."
        : "",
      name: !name ? "Name is required." : "",
      username: !username ? "Username is required." : "",
      countryCode: selectedCountry ? "" : "Country code is required.",
    });

    const hasErrors = Object.values(formErrors).some((error) => error !== "");

    if (hasErrors) {
      return;
    }

    try {
      const data = {
        name,
        username,
        email,
        password,
        age,
        countryCode: selectedCountry ? selectedCountry.value : "",
        mobileNumber,
        mainAddress,
        city,
        pincode,
      };
      await AuthService.signup(data).then(
        (response) => {
          navigate("/login");
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

  const options = countryList().getData();
  const countrySelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "4px",
    }),
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSignup} noValidate>
        <h3>Sign up</h3>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {formErrors.email && (
            <div className="invalid-feedback">{formErrors.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
            placeholder="Enter name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          {formErrors.name && (
            <div className="invalid-feedback">{formErrors.name}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            className={`form-control ${
              formErrors.username ? "is-invalid" : ""
            }`}
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          {formErrors.username && (
            <div className="invalid-feedback">{formErrors.username}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className={`form-control ${
              formErrors.password ? "is-invalid" : ""
            }`}
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {formErrors.password && (
            <div className="invalid-feedback">{formErrors.password}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className={`form-control ${
              formErrors.confirmPassword ? "is-invalid" : ""
            }`}
            placeholder="Confirm password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          {formErrors.confirmPassword && (
            <div className="invalid-feedback">{formErrors.confirmPassword}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="age" className="form-label">
            Age
          </label>
          <input
            type="number"
            id="age"
            className={`form-control ${formErrors.age ? "is-invalid" : ""}`}
            placeholder="Enter age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
          {formErrors.age && (
            <div className="invalid-feedback">{formErrors.age}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="mobileNumber" className="form-label">
            Mobile number
          </label>
          <div className="input-group">
            <div className="input-group-prepend">
              <Select
                options={options}
                value={formData.selectedCountry}
                onChange={handleCountryCodeChange}
                styles={countrySelectStyles}
              />
            </div>
            <input
              type="text"
              id="mobileNumber"
              className={`form-control ${
                formErrors.mobileNumber ? "is-invalid" : ""
              }`}
              placeholder="Enter mobile number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          {formErrors.mobileNumber && (
            <div className="invalid-feedback">{formErrors.mobileNumber}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="mainAddress" className="form-label">
            Main address
          </label>
          <input
            type="text"
            id="mainAddress"
            className={`form-control ${
              formErrors.mainAddress ? "is-invalid" : ""
            }`}
            placeholder="Enter main address"
            name="mainAddress"
            value={formData.mainAddress}
            onChange={handleInputChange}
            required
          />
          {formErrors.mainAddress && (
            <div className="invalid-feedback">{formErrors.mainAddress}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            id="city"
            className={`form-control ${formErrors.city ? "is-invalid" : ""}`}
            placeholder="Enter city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
          {formErrors.city && (
            <div className="invalid-feedback">{formErrors.city}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="pincode" className="form-label">
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            className={`form-control ${formErrors.pincode ? "is-invalid" : ""}`}
            placeholder="Enter pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            required
          />
          {formErrors.pincode && (
            <div className="invalid-feedback">{formErrors.pincode}</div>
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
