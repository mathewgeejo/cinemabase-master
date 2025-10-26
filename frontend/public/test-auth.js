// Test script to verify authentication flow
// You can run this in the browser console to test the app

console.log("Testing CinemaBase Authentication Flow");

// Test 1: Check if user is already logged in
const currentUser = localStorage.getItem("user");
console.log("Current user in localStorage:", currentUser);

// Test 2: Check Redux store state
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  console.log("Redux DevTools available - check the store state");
}

// Test 3: Test registration flow
async function testRegistration() {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'testpassword123',
        role: 'user'
      })
    });
    const data = await response.json();
    console.log("Registration test result:", data);
    return data;
  } catch (error) {
    console.error("Registration test failed:", error);
  }
}

// Test 4: Test login flow
async function testLogin() {
  try {
    const response = await fetch('/api/auth/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'testpassword123'
      })
    });
    const data = await response.json();
    console.log("Login test result:", data);
    return data;
  } catch (error) {
    console.error("Login test failed:", error);
  }
}

// Test 5: Check if profile endpoint works
async function testProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.accessToken) {
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`
        }
      });
      const data = await response.json();
      console.log("Profile test result:", data);
      return data;
    } catch (error) {
      console.error("Profile test failed:", error);
    }
  } else {
    console.log("No access token found - user not logged in");
  }
}

console.log("Run testRegistration(), testLogin(), or testProfile() to test specific flows");