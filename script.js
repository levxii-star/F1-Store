const form          = document.getElementById("loginForm");
const emailInput    = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError    = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const formError     = document.getElementById("formError");

const emailPattern   = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const specialPattern = /[!?@#$%&_]/;

function setError(input, message, show) {
    input.classList.toggle("invalid", show);
    message.classList.toggle("show", show);
  }

  function validateEmail() {
    const ok = emailPattern.test(emailInput.value.trim());
    setError(emailInput, emailError, !ok);
    return ok;
  }

  function validatePassword() {
    const ok = specialPattern.test(passwordInput.value);
    setError(passwordInput, passwordError, !ok);
    return ok;
  }

  emailInput.addEventListener("blur", () => {
    if (emailInput.value !== "") validateEmail();
  });

  emailInput.addEventListener("input", () => {
    formError.classList.remove("show");
    if (emailError.classList.contains("show")) validateEmail();
  });

  passwordInput.addEventListener("blur", () => {
    if (passwordInput.value !== "") validatePassword();
  });

  passwordInput.addEventListener("input", () => {
    formError.classList.remove("show");
    if (passwordError.classList.contains("show")) validatePassword();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email    = emailInput.value.trim();
    const password = passwordInput.value;

    if (email === "" && password === "") {
      formError.classList.add("show");
      setError(emailInput, emailError, false);
      setError(passwordInput, passwordError, false);
      return;
    }
    formError.classList.remove("show");

    const emailOk    = validateEmail();
    const passwordOk = validatePassword();

    if (emailOk && passwordOk) {
      alert("Login successful!");
    }
  });
