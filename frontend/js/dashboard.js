
// prevent showing cached dashboard after logout
window.addEventListener("pageshow", function (event) {
  if (event.persisted || performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
    window.location.reload();
  }
});

console.log("Dashboard js loaded");

import { apiRequest } from "./api.js";

const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const loading = document.getElementById("loading");

const logoutBtn = document.getElementById("logoutBtn");

// change password elements
const changePasswordBtn = document.getElementById("changePasswordBtn");
const oldPasswordInput = document.getElementById("oldPassword");
const newPasswordInput = document.getElementById("newPassword");

// delete account
const deleteAccountBtn = document.getElementById("deleteAccountBtn");



// Load current user
async function loadUser() {
  try {
    console.log("Loading current user..");
    
    const res = await apiRequest(//wrap with apiRequest its handle access token expiry and call 
      //refresh access token then using new access token its again call this current user 
      "http://127.0.0.1:5600/api/v1/auth/current-user",
      {
        method: "GET",
        credentials: "include"
      }
    );

    const data = await res.json();
    console.log(data);

    if (!res.ok || !data.success) {
      window.location.replace("./index.html");
      return;
    }

    loading.style.display = "none";

    usernameEl.textContent = data.data.username;
    emailEl.textContent = data.data.email;

  } catch (error) {

    console.error("Dashboard error:", error);
    window.location.replace("./index.html");

  }
}

loadUser();


//logout
logoutBtn?.addEventListener("click", async () => {

  try {

    logoutBtn.disabled = true;
    logoutBtn.textContent = "Logging out...";

    await apiRequest(
      "http://127.0.0.1:5600/api/v1/auth/logout",
      {
        method: "POST"
      }
    );

    setTimeout(() => {
      window.location.replace("./index.html");
    }, 800);

  } catch (error) {

    console.error("Logout error:", error);

    logoutBtn.disabled = false;
    logoutBtn.textContent = "Logout";

  }

});


//change Password
changePasswordBtn?.addEventListener("click", async () => {

  const oldPassword = oldPasswordInput.value;
  const newPassword = newPasswordInput.value;

  if (!oldPassword || !newPassword) {
    alert("Please fill all fields");
    return;
  }

  try {

    changePasswordBtn.disabled = true;
    changePasswordBtn.textContent = "Updating...";

    const res = await apiRequest(
      "http://127.0.0.1:5600/api/v1/auth/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Password changed successfully");

    oldPasswordInput.value = "";
    newPasswordInput.value = "";

  } catch (error) {

    console.error("Change password error:", error);

  } finally {

    changePasswordBtn.disabled = false;
    changePasswordBtn.textContent = "Change Password";

  }

});


//delete Account
deleteAccountBtn?.addEventListener("click", async () => {

  const confirmDelete = confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );

  if (!confirmDelete) return;

  const password = prompt("Enter your password to confirm account deletion:");

  if (!password) return;

  try {

    deleteAccountBtn.disabled = true;
    deleteAccountBtn.textContent = "Deleting...";

    const res = await apiRequest(
      "http://127.0.0.1:5600/api/v1/auth/delete-me",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      deleteAccountBtn.disabled = false;
      deleteAccountBtn.textContent = "Delete Account";
      return;
    }

    alert("Account deleted successfully");

    window.location.replace("./register.html");

  } catch (error) {

    deleteAccountBtn.disabled = false;
    deleteAccountBtn.textContent = "Delete Account";

  }

});