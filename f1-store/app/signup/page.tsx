"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Jersey_15 } from "next/font/google";
import { supabase } from "@/lib/supabase";
import "../login.css";

const jersey = Jersey_15({ subsets: ["latin"], weight: "400" });

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const specialPattern = /[!?@#$%&_]/;

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [formError, setFormError] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function checkEmail(value: string) {
    const ok = emailPattern.test(value.trim());
    setEmailError(!ok);
    return ok;
  }

  function checkPassword(value: string) {
    const ok = value.length >= 6 && specialPattern.test(value);
    setPasswordError(!ok);
    return ok;
  }

  function checkConfirm(value: string, pw: string) {
    const ok = value === pw;
    setConfirmError(!ok);
    return ok;
  }

  function clearMessages() {
    setFormError(false);
    setSignupError("");
    setSuccess("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearMessages();

    if (email.trim() === "" && password === "" && confirm === "") {
      setFormError(true);
      setEmailError(false);
      setPasswordError(false);
      setConfirmError(false);
      return;
    }

    const emailOk = checkEmail(email);
    const passwordOk = checkPassword(password);
    const confirmOk = checkConfirm(confirm, password);
    if (!emailOk || !passwordOk || !confirmOk) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        setSignupError("This email is already registered");
      } else {
        setSignupError(error.message);
      }
      return;
    }

    if (data.session) {
      setSuccess("Account created successfully");
    } else {
      setSuccess("Account created! Please check your email to confirm it.");
    }
  }

  return (
    <div className={`page ${jersey.className}`}>
      <div className="screen">
        <header className="topbar">
          { }
          <img src="/F1-logo.png" alt="F1 Logo" className="logo" />
        </header>

        <div className="lang" aria-label="Change language" role="button" tabIndex={0}>
          { }
          <img src="/Globe-icon.png" alt="Language" className="langu" />
        </div>

        <div className="stripe s1" />
        <div className="stripe s2" />
        <div className="stripe s3" />
        <div className="stripe s4" />
        <div className="stripe s5" />
        <div className="stripe s6" />
        <div className="stripe s7" />

        <main className="main">
          <section className="card">
            <div className="padded">
              <h1>Create account</h1>
              <p className="sub">
                Already a member? <Link href="/">Log in</Link>
              </p>

              <form onSubmit={handleSubmit} noValidate>
                {formError && (
                  <p className="error show" id="formError">
                    Please fill in all required fields
                  </p>
                )}

                <div className="field">
                  <input
                    type="email"
                    placeholder="Email*"
                    autoComplete="email"
                    value={email}
                    className={emailError ? "invalid" : ""}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearMessages();
                      if (emailError) checkEmail(e.target.value);
                    }}
                    onBlur={() => {
                      if (email !== "") checkEmail(email);
                    }}
                  />
                  {emailError && (
                    <p className="error show">
                      Please provide a valid email address
                    </p>
                  )}
                </div>

                <div className="field">
                  <input
                    type="password"
                    placeholder="Password includes !, ?, @, #, $, %, &, or _"
                    autoComplete="new-password"
                    value={password}
                    className={passwordError ? "invalid" : ""}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearMessages();
                      if (passwordError) checkPassword(e.target.value);
                      if (confirm !== "") checkConfirm(confirm, e.target.value);
                    }}
                    onBlur={() => {
                      if (password !== "") checkPassword(password);
                    }}
                  />
                  {passwordError && (
                    <p className="error show">
                      Please enter a valid password (6+ characters with ! ? @ # $
                      % &amp; or _)
                    </p>
                  )}
                </div>

                <div className="field">
                  <input
                    type="password"
                    placeholder="Confirm password*"
                    autoComplete="new-password"
                    value={confirm}
                    className={confirmError ? "invalid" : ""}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      clearMessages();
                      if (confirmError) checkConfirm(e.target.value, password);
                    }}
                    onBlur={() => {
                      if (confirm !== "") checkConfirm(confirm, password);
                    }}
                  />
                  {confirmError && (
                    <p className="error show">Passwords do not match</p>
                  )}
                </div>

                {signupError && <p className="error show">{signupError}</p>}
                {success && <p className="success">{success}</p>}

                <div className="actions">
                  <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Creating..." : "Sign Up"}
                  </button>
                  <br />
                  <Link href="/" className="forgot">
                    Back to log in
                  </Link>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}