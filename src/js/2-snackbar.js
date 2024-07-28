import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let formData = {
  delay: 0,
  state: '',
};

const form = document.querySelector('.form');

const onFocusOut = event => {
  formData[event.target.name] = event.target.value;
};

const onSubmit = event => {
  event.preventDefault();

  let settings = {
    titleSize: '16px',
    titleLineHeight: '24px',
    titleColor: '#FFF',
    messageSize: '16px',
    messageLineHeight: '24px',
    messageColor: '#FFF',
    theme: 'dark',
    position: 'topRight',
  };

  const msg = `${
    formData.state.charAt(0).toUpperCase() + formData.state.slice(1)
  } promise in ${formData.delay}ms`;
  const result = formData.state === 'fulfilled';
  const delay = formData.delay;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      result ? resolve(msg) : reject(msg);
    }, delay);
  })
    .then(msg => {
      settings.title = 'OK';
      settings.iconUrl = './img/icon-success.svg';
      settings.backgroundColor = '#59A10D';
      settings.message = msg;
      iziToast.show(settings);
    })
    .catch(msg => {
      settings.title = 'Error';
      settings.iconUrl = './img/icon-error.svg';
      settings.backgroundColor = '#EF4040';
      settings.message = msg;
      iziToast.show(settings);
    });

  event.target.reset();
};

form.addEventListener('focusout', onFocusOut);
form.addEventListener('submit', onSubmit);
