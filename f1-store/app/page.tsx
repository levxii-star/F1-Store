"use client";

import { useState, FormEvent } from "react";
import { Jersey_15 } from "next/font/google";
import { supabase } from "@/lib/supabase";
import "./login.css";

const jersey = Jersey_15({ subsets: ["latin"], weight: "400" });

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const specialPattern = /[!?@#$%&_]/;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [formError, setFormError] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function checkEmail(value: string) {
    const ok = emailPattern.test(value.trim());
    setEmailError(!ok);
    return ok;
  }

  function checkPassword(value: string) {
    const ok = specialPattern.test(value);
    setPasswordError(!ok);
    return ok;
  }

  function clearMessages() {
    setFormError(false);
    setLoginError("");
    setSuccess(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearMessages();

    // Both fields empty
    if (email.trim() === "" && password === "") {
      setFormError(true);
      setEmailError(false);
      setPasswordError(false);
      return;
    }

    // Check each field
    const emailOk = checkEmail(email);
    const passwordOk = checkPassword(password);
    if (!emailOk || !passwordOk) return;

    // Ask Supabase if this is a registered user
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      setLoginError("Incorrect email or password");
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className={`page ${jersey.className}`}>
      <div className="screen">
        <header className="topbar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/F1-logo.png" alt="F1 Logo" className="logo" />
        </header>

        <div className="lang" aria-label="Change language" role="button" tabIndex={0}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
              <h1>Log in</h1>
              <p className="sub">
                Not a member yet?{" "}
                <a href="https://ph.pinterest.com/pin/702983823139237712/">
                  Create account
                </a>
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
                    placeholder="Password*"
                    autoComplete="current-password"
                    value={password}
                    className={passwordError ? "invalid" : ""}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearMessages();
                      if (passwordError) checkPassword(e.target.value);
                    }}
                    onBlur={() => {
                      if (password !== "") checkPassword(password);
                    }}
                  />
                  {passwordError && (
                    <p className="error show">Please enter a valid password</p>
                  )}
                </div>

                {loginError && <p className="error show">{loginError}</p>}
                {success && <p className="success">Logged in successfully</p>}

                <div className="actions">
                  <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                  </button>
                  <br />
                  <a
                    href="https://ph.pinterest.com/pin/1126392556797400767/"
                    className="forgot"
                  >
                    Forgot password
                  </a>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}