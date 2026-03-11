// handle admin login page logic
console.log("Admin login page loaded");

import { apiRequest } from "./api.js";

const loader = document.getElementById("loader");

function init() {
  showLoader();
  checkAuth();
}

init();

async function checkAuth() {
  try {
    console.log("Checking logged in admin...");

    const res = await apiRequest(
      "http://127.0.0.1:5600/api/v1/auth/current-user",
      {
        method: "GET",
        credentials: "include"
      }
    );

    if (!res.ok) {
      hideLoader();
      return;
    }

    const data = await res.json();

    if (!data.success) {
      hideLoader();
      return;
    }

    redirectToDashboard();

  } catch (error) {
    hideLoader();
    console.log("Admin not logged in");
  }
}

document.getElementById("adminLoginForm").addEventListener("submit", handleLoginSubmit);

async function handleLoginSubmit(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log(`Admin email and pass ${email}, ${password}`);

  await loginAdmin(email, password);
}


async function loginAdmin(email, password) {
  try {

    const res = await fetch("http://127.0.0.1:5600/api/v1/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      showError(data.message || "Admin login failed");
      return;
    }

    redirectToDashboard();

  } catch (err) {
    console.error(err);
    showError("Server error");
  }
}

function redirectToDashboard() {
  window.location.href = "./admin-dashboard.html";
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