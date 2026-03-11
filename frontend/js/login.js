// handle login page logic
console.log("Login page loaded");
import { apiRequest } from "./api.js";



const loader = document.getElementById("loader");


function init() {
  showLoader();
  //try to initialize with current user
  
  checkAuth();
}

init();

async function checkAuth() {
  try {
    console.log("Checking logged in user...");

    const res = await apiRequest(
      "http://127.0.0.1:5600/api/v1/auth/current-user",
      {
        method: "GET",
        credentials: "include"
      }
    );

    if (!res.ok){
      hideLoader();
      return;
      
    }

    const data = await res.json();

    if (!data.success){
      hideLoader();
      return;
    }

    redirectToDashboard();

  } catch (error) {
    hideLoader();
    console.log("User not logged in");
  }
}



document.getElementById("loginForm").addEventListener("submit", handleLoginSubmit);

async function handleLoginSubmit(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log(`email and pass ${email}, ${password}`);

  await loginUser(email, password);
}

async function loginUser(email, password) {
  try {

    const res = await fetch("http://127.0.0.1:5600/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // important for cookie auth
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      showError(data.message || "Login failed");
      return;
    }

    // cookie already set by backend
    redirectToDashboard();

  } catch (err) {
    console.error(err);
    showError("Server error");
  }
}

function redirectToDashboard() {
  window.location.href = "./dashboard.html";
}

function showError(message) {
  document.getElementById("errorMsg").innerText = message;
}
function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}




