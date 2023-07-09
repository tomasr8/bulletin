document.addEventListener("DOMContentLoaded", (e) => {
  [...document.querySelectorAll(".year .header")].forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const weeks = elem.parentNode.querySelector(".weeks");
      const height = weeks.style.height;
      console.log("height", height)
      if (height && height !== '0px') {
        weeks.style.height = 0;
      } else {
        console.log(`${weeks.scrollHeight}px`)
        weeks.style.height = `${weeks.scrollHeight}px`;
      }
    });
  });
});
