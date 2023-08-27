let flag = 0;
let slideIndex = 1;
var time;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  flag = 1;
  clearTimeout(time);
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  flag = 2;
  clearTimeout(time);
  showSlides(slideIndex = n);
}
function StopTimer()
{
  if(flag == 4)
    flag = 0;
  else if(flag != 4)
    flag = 4;
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  if (flag == 0)
  {
         slideIndex++;
         if (slideIndex > slides.length) {slideIndex = 1}    
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  if(flag != 4)
  {
    flag = 0;
    time = setTimeout(showSlides, 5000);
  }
  else
  {
    time = setTimeout(showSlides, 5000);
  }
}