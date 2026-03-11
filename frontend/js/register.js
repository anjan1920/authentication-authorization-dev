console.log("Register js loaded");

const form = document.getElementById("registerForm");
const btnText = document.getElementById("btnText");
const loader = document.getElementById("loader");
const btn = document.getElementById("registerBtn");

const resendBtn = document.getElementById("resendBtn");
const message = document.getElementById("message");

let userEmail = "";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Submit clicked");
  

  const username = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  userEmail = email;

  btnText.textContent = "Registering...";
  loader.classList.remove("hidden");
  btn.disabled = true;

  try {

    const res = await fetch("http://127.0.0.1:5600/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    const data = await res.json();

    if(res.ok){

      form.innerHTML = `
        <p class="text-green-400 text-center">
        Registration successful. Check your email to verify your account.
        </p>
      `;

      resendBtn.classList.remove("hidden");
      message.textContent = "Didn't receive email? Click below to resend.";

    }else{
      document.getElementById("errorMsg").textContent = data.message;
    }

  } catch (err) {
    document.getElementById("errorMsg").textContent = "Something went wrong";
  }

  btnText.textContent = "Register";
  loader.classList.add("hidden");
  btn.disabled = false;

});


resendBtn.addEventListener("click", async () => {

  message.textContent = "Sending verification email again...";

  try {

    const response = await fetch("http://127.0.0.1:5600/api/v1/auth/resend-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: userEmail
      })
    });

    const data = await response.json();

    if(response.ok){
      message.textContent = "Verification email sent again. Check your inbox.";
    }else{
      message.textContent = data.message || "Failed to resend email";
    }

  } catch (error) {
    message.textContent = "Something went wrong.";
  }

});