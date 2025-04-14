'use strict';

const $ = sel => document.querySelector(sel);
let me = null;

$('#loginBtn').addEventListener('click', function () {
  const username = $('#loginUsername').value.trim();
  const password = $('#loginPassword').value.trim();

  if (!username || !password) {
    showError('Missing username or password');
    return;
  }

  fetch('/users/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(r => r.json())
    .then(data => {
      if (data.error) {
        showError(data.error);
      } else {
        me = data;
        showHome(data);
      }
    })
    .catch(e => {
      console.error(e);
      showError('Something went wrong with login.');
    });
});

$('#registerBtn').addEventListener('click', () => {
  const userInfo = {
    username: $('#registerUsername').value.trim(),
    password: $('#registerPassword').value.trim(),
    name: $('#registerName').value.trim(),
    email: $('#registerEmail').value.trim()
  };

  if (Object.values(userInfo).some(v => !v)) {
    showError('All fields are required.');
    return;
  }

  fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInfo)
  })
    .then(r => r.json())
    .then(data => {
      if (data.error) {
        showError(data.error);
      } else {
        me = data;
        showHome(data);
      }
    })
    .catch(() => showError('Failed to register. Check your connection?'));
});

$('#updateBtn').addEventListener('click', () => {
  const payload = {
    name: $('#updateName').value.trim(),
    email: $('#updateEmail').value.trim()
  };

  if (!me?.username || !me?.authenticationToken) {
    showError('Missing user context.');
    return;
  }

  fetch(`/users/${me.username}/${me.authenticationToken}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(result => {
      if (result.ok) {
        alert('Updated successfully!');
      } else {
        showError('Could not update your info.');
      }
    })
    .catch(() => showError('Update failed.'));
});

$('#deleteBtn').addEventListener('click', () => {
  if (!confirm('This will delete your account. Are you 100% sure?')) return;

  if (!me?.username || !me?.authenticationToken) {
    showError('Missing user data.');
    return;
  }

  fetch(`/users/${me.username}/${me.authenticationToken}`, {
    method: 'DELETE'
  })
    .then(r => r.json())
    .then(res => {
      if (res.ok) {
        me = null;
        showLogin();
      } else {
        showError('Could not delete account.');
      }
    })
    .catch(() => showError('Delete request failed.'));
});

$('#logoutLink').onclick = function () {
  me = null;
  showLogin();
};

// Navigation
$('#loginLink').onclick = showLogin;
$('#registerLink').onclick = showRegister;

function showHome(user) {
  $('#loginScreen').classList.add('hidden');
  $('#registerScreen').classList.add('hidden');
  $('#homeScreen').classList.remove('hidden');

  $('#name').innerText = user.name || '';
  $('#username').innerText = user.username || '';
  $('#updateName').value = user.name || '';
  $('#updateEmail').value = user.email || '';

  listUsers();
}

function showLogin() {
  reset();
  $('#loginScreen').classList.remove('hidden');
  $('#registerScreen').classList.add('hidden');
  $('#homeScreen').classList.add('hidden');
}

function showRegister() {
  reset();
  $('#registerScreen').classList.remove('hidden');
  $('#loginScreen').classList.add('hidden');
  $('#homeScreen').classList.add('hidden');
}

function showError(msg) {
  const el = $('#error');
  el.innerText = msg;
  el.classList.add('visible'); // maybe fade in or red border in CSS
}

function reset() {
  document.querySelectorAll('input').forEach(input => input.value = '');
  $('#error').innerText = '';
  $('#userlist').innerHTML = '';
}

function listUsers() {
  fetch('/users')
    .then(r => r.json())
    .then(users => {
      const ul = $('#userlist');
      ul.innerHTML = '';
      users.forEach(u => {
        const item = document.createElement('li');
        item.textContent = u.username;
        ul.appendChild(item);
      });
    })
    .catch(err => {
      console.warn('User listing failed:', err);
    });
}
