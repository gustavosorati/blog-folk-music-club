export default function inputController() {
  const inputs = document.querySelectorAll(
    '.contact_form input, .contact_form textarea',
  );

  const button = document.querySelector('.sendMessage');

  inputs.forEach((input) => {
    input.addEventListener('change', checkInput);
  });

  button.addEventListener('click', (event) => {
    event.preventDefault();
  });

  function checkInput(event) {
    if (this.value === '') {
      this.parentNode.classList.remove('success');
      this.parentNode.classList.add('error');

      let error = this.nextElementSibling.nextElementSibling;
      error.innerText = `O campo não pode estar vazio`;
    } else {
      const email = this.getAttribute('type') === 'email' ? this.value : '';

      this.parentNode.classList.remove('error');
      this.parentNode.classList.add('success');

      if (email) {
        let isEmail = validadteEmail(email);

        if (!isEmail) errorMessage(this);
      }
    }
  }

  function validadteEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  function errorMessage(input) {
    console.log('funciton error');
    let error = input.nextElementSibling.nextElementSibling;
    error.innerText = `Porfavor informe um e-mail valido`;
    console.log(input.parentNode);

    input.parentNode.classList.remove('success');
    input.parentNode.classList.add('error');
  }
}
