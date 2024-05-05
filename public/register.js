const signupButton = document.getElementById('signupBtn');
const getEmail = document.getElementById('email');
const getUsername = document.getElementById('username');
const getPassword = document.getElementById('password');
const toggle = document.getElementById('toggle');

// Create event functions

const handleToggle = () => {
  if (
    toggle.classList.contains('fa-eye-slash') &&
    getPassword.getAttribute('type') === 'text'
  ) {
    toggle.classList.remove('fa-eye-slash');
    toggle.classList.add('fa-eye');
    getPassword.setAttribute('type', 'password');
  } else {
    toggle.classList.remove('fa-eye');
    toggle.classList.add('fa-eye-slash');
    getPassword.setAttribute('type', 'text');
  }
};

const handleEmail = () => {
  const email = document.getElementById('email').value.trim();
  const regEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regEx.test(email)) {
    document.getElementById('email_error').innerText =
      'Please enter a valid email';
  } else {
    document.getElementById('email_error').innerText = '';
  }
};

const handleUsername = () => {
  const username = document.getElementById('username').value.trim();
  if (username.length < 6 || username.length > 20) {
    document.getElementById('username_error').innerText =
      'Username must be between 5 to 10 characters';
  } else {
    document.getElementById('username_error').innerText = '';
  }
};

const handlePassword = () => {
  const password = document.getElementById('password').value.trim();
  const regEx =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
  if (!regEx.test(password)) {
    document.getElementById('password_error').innerText =
      'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character';
  } else {
    document.getElementById('password_error').innerText = '';
  }
};

const handleSignup = (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (email === '') {
    document.getElementById('email_error').innerText =
      'Please enter your email';
  } else if (username === '') {
    document.getElementById('username_error').innerText =
      'Please enter your username';
  } else if (password === '') {
    document.getElementById('password_error').innerText =
      'Please enter your password';
  } else {
    document.body.classList.add('dimmed');
    getEmail.disabled = true;
    getUsername.disabled = true;
    getPassword.disabled = true;
    signupButton.disabled = true;
    document.getElementById('dot-spinner').style.display = 'flex';
    const data = {
      email,
      username,
      password
    };
    fetch('/register', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async (response) => {
        if (response.redirected) {
          window.location.replace(response.url);
          return;
        }

        const package = await response.json();
        document.body.classList.remove('dimmed');
        getEmail.disabled = false;
        getUsername.disabled = false;
        getPassword.disabled = false;
        signupButton.disabled = false;
        document.getElementById('dot-spinner').style.display = 'none';
        document.getElementById('server_error').innerText = package.message;
      })
      .catch((err) => console.log(err));
  }
};

// Add event listeners

toggle.addEventListener('click', handleToggle);

getEmail.addEventListener('input', handleEmail);

getUsername.addEventListener('input', handleUsername);

getPassword.addEventListener('input', handlePassword);

signupButton.addEventListener('click', handleSignup);
