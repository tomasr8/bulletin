document.addEventListener("DOMContentLoaded", (e) => {
  const timeline = document.querySelector(".timeline");
  document.querySelector(
    ".timeline"
  ).style.maxHeight = `calc(90vh - ${timeline.offsetTop}px)`;

  [...document.querySelectorAll(".issues button")].forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const issue = parseInt(e.target.dataset.issue, 10);
      document.querySelector(
        ".viewer object"
      ).data = `issues/0${issue}-1965.pdf`;
    });
  });

  [...document.querySelectorAll(".year button")].forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const issues =
        elem.parentElement.parentElement.nextElementSibling.querySelector(
          ".issues"
        );
      console.log(issues);
      const height = issues.style.height;
      console.log("height", height);
      if (height && height !== "0px") {
        issues.style.height = 0;
      } else {
        console.log(`${issues.scrollHeight}px`);
        issues.style.height = `${issues.scrollHeight}px`;
      }
    });
  });
});
