const toggleAuth = document.getElementById('toggle-auth');
const formTitle = document.getElementById('form-title');
const nameField = document.getElementById('name-field');
const authForm = document.getElementById('auth-form');
const authSubmit = document.getElementById('auth-submit');

let isRegister = false;

toggleAuth.addEventListener('click', () => {
  isRegister = !isRegister;

  // Toggle form state
  formTitle.textContent = isRegister ? 'Register' : 'Log In';
  nameField.style.display = isRegister ? 'block' : 'none';
  authSubmit.textContent = isRegister ? 'Register' : 'Log In';
  toggleAuth.textContent = isRegister ? 'Already have an account? Log In' : 'Don’t have an account? Register';
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(authForm);
  const body = {
    name: data.get('name'),
    email: data.get('email'),
    password: data.get('password'),
  };

  const endpoint = isRegister ? '/api/register' : '/api/login';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    alert(result.message || result.error);
  } catch (error) {
    console.error(error);
    alert('Something went wrong!');
  }
});
