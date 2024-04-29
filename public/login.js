const loginButton = document.getElementById('loginBtn');

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

const handleUsername = () => {
  const username = document.getElementById('username').value.trim();
  if (username !== '') {
    document.getElementById('username_error').innerText = '';
  }
};

const handlePassword = () => {
  const password = document.getElementById('password').value.trim();
  if (password !== '') {
    document.getElementById('password_error').innerText = '';
  }
};

const handleLogin = (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === '') {
    document.getElementById('username_error').innerText =
      'Please enter your username';
  } else if (password === '') {
    document.getElementById('password_error').innerText =
      'Please enter your password';
  } else {
    document.body.classList.add('dimmed');
    getUsername.disabled = true;
    getPassword.disabled = true;
    loginButton.disabled = true;
    document.getElementById('dot-spinner').style.display = 'flex';
    const data = {
      username,
      password
    };

    fetch('/login', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(async (response) => {
        if (response.redirected) {
          window.location.replace(response.url);
          return;
        }
        const package = await response.json();

        document.body.classList.remove('dimmed');
        getUsername.disabled = false;
        getPassword.disabled = false;
        loginButton.disabled = false;
        document.getElementById('dot-spinner').style.display = 'none';
        document.getElementById('server_error').innerText = package.message;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

// Add event listeners

toggle.addEventListener('click', handleToggle);

getUsername.addEventListener('input', handleUsername);

getPassword.addEventListener('input', handlePassword);

loginButton.addEventListener('click', handleLogin);

// remove event listeners
