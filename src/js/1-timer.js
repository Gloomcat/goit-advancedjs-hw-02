import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const timer = {
  elements: {
    days: document.querySelector('.value[data-days]'),
    hours: document.querySelector('.value[data-hours]'),
    minutes: document.querySelector('.value[data-minutes]'),
    seconds: document.querySelector('.value[data-seconds]'),
  },
  starter: document.querySelector('button[data-start]'),
  dateInput: document.querySelector('input#datetime-picker'),
  deadline: null,
  intervalId: null,

  start() {
    if (!this.deadline) {
      return;
    }

    this.stop();

    this.starter.disabled = true;
    this.dateInput.disabled = true;

    this.displayDiff(this.deadline.getTime() - Date.now());

    this.intervalId = setInterval(() => {
      const diff = this.deadline.getTime() - Date.now();

      if (diff <= 0) {
        this.stop();
        return;
      }

      this.displayDiff(diff);
    }, 1000);
  },

  displayDiff(diff) {
    let { days, hours, minutes, seconds } = this.convertMs(diff);

    this.elements.days.textContent = this.pad(days);
    this.elements.hours.textContent = this.pad(hours);
    this.elements.minutes.textContent = this.pad(minutes);
    this.elements.seconds.textContent = this.pad(seconds);
  },

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.deadline = null;

      this.starter.disabled = false;
      this.dateInput.disabled = false;
    }
  },

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  },

  pad(value) {
    return String(value).padStart(2, '0');
  },
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= Date.now()) {
      iziToast.warning({
        iconUrl: './img/icon-error.svg',
        backgroundColor: '#EF4040',
        title: 'Error',
        titleSize: '16px',
        titleLineHeight: '24px',
        titleColor: '#FFF',
        message: 'Please choose a date in the future',
        messageSize: '16px',
        messageLineHeight: '24px',
        messageColor: '#FFF',
        theme: 'dark',
        position: 'topRight',
      });
      timer.starter.disabled = true;
    } else {
      timer.starter.disabled = false;
      timer.deadline = selectedDates[0];
    }
  },
};

flatpickr('input#datetime-picker', options);

timer.starter.addEventListener('click', _ => {
  timer.start();
});
