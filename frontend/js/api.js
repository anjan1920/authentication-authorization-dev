//this function call when access token expired and need to refresh access token

export  async function apiRequest(url, options = {}) {

  let res = await fetch(url, {
    ...options,
    credentials: "include"
  });

  if (res.status === 401) {
    //fetch
    await fetch("http://127.0.0.1:5600/api/v1/auth/refresh-token", {
      method: "POST",
      credentials: "include"
    });

    //now again fetch that post with new token
    res = await fetch(url, {
      ...options,
      credentials: "include"
    });
  }

  return res;
}
