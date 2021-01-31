export default function writeMachine(text) {
  let textArray = text.innerHTML.split('');
  text.innerHTML = '';

  textArray.forEach((letra, i) => {
    setTimeout(() => (text.innerHTML += letra), 75 * i);
  });
}
