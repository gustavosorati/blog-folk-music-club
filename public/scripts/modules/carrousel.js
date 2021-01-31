export default function carrousel() {
  const images = document.querySelectorAll('.main img');

  let index = 0;
  const indexImages = images.length;

  function changeBackground() {
    images[index].classList.remove('active');

    index < indexImages - 1 ? index++ : (index = 0);

    images[index].classList.add('active');
  }

  setInterval(() => {
    changeBackground();
  }, 7000);
}
