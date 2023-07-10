document.addEventListener("DOMContentLoaded", (e) => {
  const timeline = document.querySelector(".timeline");
  document.querySelector(
    ".timeline"
  ).style.maxHeight = `calc(90vh - ${timeline.offsetTop}px)`;

  [...document.querySelectorAll(".issues .issue button")].forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const issue = parseInt(e.target.textContent, 10);
      document.querySelector(
        ".viewer object"
      ).data = `issues/0${issue}-1965.pdf`;
    });
  });
});
