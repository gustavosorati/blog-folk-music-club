export default function carrouselController() {
  const images = document.querySelectorAll('[data-js="carousel_item"]');
  const nextButton = document.querySelector('[data-js="carousel_button--next"]');
  const prevButton = document.querySelector('[data-js="carousel_button--prev"]');

  let currentSlide = 0;

    function manipulateSlideIndex(currentSlide, type) {

        images.forEach((imageItem, index) => {
            imageItem.classList.remove('carousel_item--visible', 'next', 'prev');
          });
          
        type === 'next'
          ? images[currentSlide].classList.add('carousel_item--visible', `${type}`)
          : images[currentSlide].classList.add('carousel_item--visible', `${type}`)
    }


  function nextImage() {
    currentSlide === images.length - 1 
        ? currentSlide = 0 
        : currentSlide++

    manipulateSlideIndex(currentSlide, 'next')
  }

  function prevImage() {
    currentSlide === 0 
        ? currentSlide = images.length - 1 
        : --currentSlide

    manipulateSlideIndex(currentSlide, 'prev')
  }

  nextButton.addEventListener('click', nextImage);
  prevButton.addEventListener('click', prevImage);
}
