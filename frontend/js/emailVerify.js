console.log("email verify loaded");

const resultDiv = document.getElementById("result");
const loadingDiv = document.getElementById("loading");

// get token from URL
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
console.log(token);

async function verifyEmail() {

  if (!token) {
    loadingDiv.style.display = "none";
    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = `<p class="text-red-400">Invalid verification link</p>`;
    return;
  }

  try {
    console.log("fetching server..");
    
    const res = await fetch(`http://127.0.0.1:5600/api/v1/auth/verify-email/${token}`);

    const data = await res.json();
    console.log(data);
    

    loadingDiv.style.display = "none";
    resultDiv.classList.remove("hidden");

    if (res.ok) {

      resultDiv.innerHTML = `
        <p class="text-green-400 font-semibold">
        ✅ Email verified successfully
        </p>

        <a href="./index.html"
        class="inline-block mt-4 text-indigo-400 hover:text-indigo-300">
        Go to Login
        </a>
      `;

    } else {

      resultDiv.innerHTML = `
        <p class="text-red-400">
        ${data.message}
        </p>
      `;

    }

  } catch (error) {

    loadingDiv.style.display = "none";
    resultDiv.classList.remove("hidden");

    resultDiv.innerHTML = `
      <p class="text-red-400">
      Verification failed. Try again later.
      </p>
    `;
  }

}

verifyEmail();