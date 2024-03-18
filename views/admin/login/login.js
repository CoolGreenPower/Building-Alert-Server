document.getElementById("loginForm").addEventListener("submit", async(event) => {
    event.preventDefault();
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/admin/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "same-origin",
        redirect: "follow",
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      // Clear the form after successful password reset
      if (!response.ok) throw new Error("Login failed");

      window.location.href = response.url;
    } catch(err) {
      console.log(err);
      document.getElementById("debugMessage").innerHTML = "Login failed"
    }

});