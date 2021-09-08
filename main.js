$("#slider").roundSlider({
    sliderType: "min-range",
    radius: 300,
    showTooltip: false,
    width: 300,
    value: 0,
    handleSize: 0,
    handleShape: "square",
    circleShape: "half-top",
})

$("#range").roundSlider({
    sliderType: "range",
    radius: 300,
    showTooltip: false,
    width: 300,
    handleSize: 0,
    circleShape: "half-top",
    animation: false,
    readOnly: true
})

// range = 25
// min:-10,15 , mid: 0,25 ,max: 85,110
// 15, 25
// -104.5, -85.5

$("#rotate").on("click", function () {
    let random = Math.floor(Math.random() * (110 - 15 + 1)) + 15
    let sliderVal = (random - 25).toString() + "," + random.toString()
    $("#range").roundSlider("setValue", sliderVal)
    if (random < 25) {
        let deg = -104.5 + 19 * (random - 15) / 10
        $(":root").attr("style", `--deg:${deg}deg`)
    } else {
        $(":root").attr("style", "--deg:-85.5deg")
    }
})

$("#reveal").on("click", function () {
    $bgColor = $("#slider .rs-range-color, #slider .rs-path-color")
    $bgColor.css("background-color") === "rgba(0, 0, 0, 0)" ?
        $bgColor.css("background-color", "#4ab0c2") :
        $bgColor.css("background-color", "rgba(0, 0, 0, 0)")
})

$("#slider").on("change", function (e) {
    console.log(e.value)
})
