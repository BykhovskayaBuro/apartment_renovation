const exampleLabels = document.querySelectorAll(".example__label");
const exampleInputs = document.querySelectorAll(".example__input");
// const calcLabels = document.querySelectorAll(".calc__label");

// exampleLabels.forEach(function (parent) {
//   if (parent.querySelector("input:checked")) {
//     parent.classList.add("example__label--checked");
//   }
// });

exampleInputs.forEach((input, index) => {
  input.addEventListener("change", function () {
    exampleLabels.forEach((label) => (label.style.fontWeight = ""));
    exampleLabels[0].style.fontWeight = "700";
    if (input.checked) {
      exampleLabels[index].style.fontWeight = "700";
    }
  });
});

// calcLabels.forEach(function (parent) {
//   if (parent.querySelector("input:checked")) {
//     parent.classList.add("calc__label--active");
//   }
// });

//ionRangeSlider, slider in the calculator(section 'About')

$(".js-range-slider").ionRangeSlider({
  type: "single",
  min: 0,
  max: 200,
  from: 35,
  onStart: function (data) {
    $(".js-range-slider__to").text(data.from);
  },
  onChange: function (data) {
    $(".js-range-slider__to").text(data.from);
  },
});
