
// prevent showing cached dashboard after logout
window.addEventListener("pageshow", function (event) {
  if (event.persisted || performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
    window.location.reload();
  }
});

console.log("Admin dashboard loaded");

import { apiRequest } from "./api.js";

const adminName = document.getElementById("adminName");
const displayBox = document.getElementById("displayBox");
const pageBody = document.getElementById("pageBody");





init();

async function init() {
  await loadAdmin();
}

async function loadAdmin() {
  try {

    const res = await apiRequest(
      "http://127.0.0.1:5600/api/v1/auth/current-user",
      {
        method: "GET",
        credentials: "include"
      }
    );

    if (!res.ok) {
      window.location.href = "./admin-login.html";
      return;
    }

    const data = await res.json();

    // show dashboard only after auth success
    pageBody.classList.remove("hidden");

    console.log(data);

    adminName.innerText = `Welcome ${data.data.username || "Admin"}`;

  } catch (error) {
    window.location.href = "./admin-login.html";
  }
}

/* ================= SERVER HEALTH ================= */

document
  .getElementById("serverHealthBtn")
  .addEventListener("click", checkServerHealth);

async function checkServerHealth() {

  showBoxLoader("Checking server...");

  try {

    const res = await apiRequest(
      "http://127.0.0.1:5600/api/v1/admin/healthcheck",
      { method: "GET", credentials: "include" }
    );

    if (!res.ok) {
      displayBox.innerHTML = `
        <p class="text-red-400">Failed to fetch server health.</p>
      `;
      return;
    }

    const data = await res.json();

    await delay(500);

    const health = data.data;

    displayBox.innerHTML = `
      <h3 class="text-lg font-semibold mb-3">Server Health</h3>

      <p><b>Status:</b> ${health.status?.server || "Running"}</p>
      <p><b>Message:</b> ${health.message}</p>
      <p><b>Uptime:</b> ${health.uptime}</p>
      <p><b>Timestamp:</b> ${health.timestamp}</p>
      <p><b>Memory used:</b> ${health.status?.memory_used_percent || "N/A"}%</p>
    `;

  } catch (error) {

    displayBox.innerHTML = `
      <p class="text-red-400">Server not reachable.</p>
    `;

  }
}

/* ================= USERS ================= */

document
  .getElementById("checkUsersBtn")
  .addEventListener("click", loadUsers);

async function loadUsers() {

  showBoxLoader("Loading users...");

  try {

    const res = await apiRequest(
      "http://127.0.0.1:5600/api/v1/admin/getAllUsers",
      { method: "GET", credentials: "include" }
    );

    if (!res.ok) {
      displayBox.innerHTML = `
        <p class="text-red-400">Failed to load users.</p>
      `;
      return;
    }

    const data = await res.json();

    await delay(500);

    const users = data.users;

    if (!users || users.length === 0) {
      displayBox.innerHTML = "<p>No users found</p>";
      return;
    }

    let html = `
      <h3 class="text-lg font-semibold mb-3">
        Users (${data.totalUsers})
      </h3>

      <div class="space-y-2">
    `;

    users.forEach(user => {

      html += `
        <div class="border-b border-gray-700 pb-2">
          <p>Email: ${user.email}</p>
          <p>Verified: ${user.isEmailVerified ? "✔ Yes" : "❌ No"}</p>
        </div>
      `;

    });

    html += `</div>`;

    displayBox.innerHTML = html;

  } catch (error) {

    displayBox.innerHTML = `
      <p class="text-red-400">Server error while fetching users.</p>
    `;

  }
}

/* ================= CHANGE PASSWORD ================= */

document
  .getElementById("changePasswordBtn")
  .addEventListener("click", changePassword);

async function changePassword() {

  const oldPassword = prompt("Enter current password:");

  if (!oldPassword) return;

  const newPassword = prompt("Enter new password:");

  if (!newPassword) return;

  try {

    const res = await apiRequest(
      "http://127.0.0.1:5600/api/v1/auth/change-password",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Password change failed");
      return;
    }

    alert("Password changed successfully");

  } catch (error) {

    console.error(error);
    alert("Server error");

  }
}

/* ================= LOGOUT ================= */

document
  .getElementById("logoutBtn")
  .addEventListener("click", logoutAdmin);

async function logoutAdmin() {

  try {

    const res = await apiRequest(
      "http://127.0.0.1:5600/api/v1/auth/logout",
      {
        method: "POST",
        credentials: "include"
      }
    );

    if (!res.ok) {
      alert("Logout failed");
      return;
    }

    window.location.href = "./admin-login.html";

  } catch (error) {

    console.error("Server error:", error);
    alert("Server not reachable. Please try again.");

  }
}

/* ================= DELETE ACCOUNT ================= */

document
  .getElementById("deleteAccountBtn")
  .addEventListener("click", deleteAccount);

async function deleteAccount() {

  const confirmDelete = confirm(
    "Are you sure you want to delete your admin account?"
  );

  if (!confirmDelete) return;

  const password = prompt("Enter password to confirm:");

  if (!password) return;

  try {

    const res = await apiRequest(
      "http://127.0.0.1:5600/api/v1/delete-me",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      }
    );

    if (!res.ok) {
      alert("Failed to delete account");
      return;
    }

    alert("Account deleted");

    window.location.href = "./admin-login.html";

  } catch (error) {

    alert("Server error while deleting account");

  }
}

/* ================= UI HELPERS ================= */

function showBoxLoader(message = "Loading...") {

  displayBox.classList.remove("hidden");

  displayBox.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-[150px] space-y-3">
      <div class="w-8 h-8 border-4 border-gray-600 border-t-amber-500 rounded-full animate-spin"></div>
      <p class="text-gray-400">${message}</p>
    </div>
  `;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}