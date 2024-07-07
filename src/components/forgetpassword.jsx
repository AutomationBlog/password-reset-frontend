import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation (more comprehensive validation recommended)
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    try {
      // Simulate API call to send reset password email (replace with actual API call)
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to send reset email with status: ${response.status}`
        );
      }

      // Handle successful email sending (e.g., display success message)
      console.log("Reset password email sent!");
      setEmail("");
      setErrorMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={handleEmailChange}
        />
        <Form.Text className="text-muted">
          We will send a password reset link to your email address.
        </Form.Text>
      </Form.Group>

      {errorMessage && <p className="text-danger">{errorMessage}</p>}

      <Button variant="primary" type="submit">
        Reset Password
      </Button>
    </Form>
  );
};

export default ForgotPasswordForm;
