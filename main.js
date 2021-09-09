let current_topic = 0
let locked = false
let answer
let red_turn = true
let slider_width = $(window).width() < 610 ? $(window).width() / 2 - 5 : 300
let turn = red_turn ? ["紅隊", "黃隊"] : ["黃隊", "紅隊"]
let message = [`${turn[0]}回合，請出題者轉轉盤`, `轉好後，請${turn[0]}出題者看旋轉最終位置，並出題`, `請${turn[0]}隊員移動指針位置，然後請${turn[1]}隊員選擇左右，再按確定`]

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
    }
    return a
}
// range = 25
// min:-10,15 , mid: 0,25 ,max: 85,110
// 15, 25
// -104.5, -86
function rotate() {
    answer = Math.floor(Math.random() * (110 - 15 + 1)) + 15
    let sliderVal = (answer - 25).toString() + "," + answer.toString()
    $("#range").roundSlider("setValue", sliderVal)
    if (answer < 25) {
        let deg = -104.5 + 18.5 * (answer - 15) / 10
        $("body").get(0).style.setProperty("--deg", `${deg}deg`)
    } else {
        $("body").get(0).style.setProperty("--deg", "-86deg")
    }
}

function toggle_slider() {
    $bgColor = $("#slider .rs-range-color, #slider .rs-path-color")
    $bgColor.css("background-color") === "rgba(0, 0, 0, 0)" ?
        $bgColor.css("background-color", "#65cbdd") :
        $bgColor.css("background-color", "rgba(0, 0, 0, 0)")
}

function change_topic() {
    $(".topic1").html(topic[current_topic][0])
    $(".topic2").html(topic[current_topic][1])
    current_topic++
}

function reset() {
    red_turn = !red_turn
    toggle_slider()
    change_topic()
    $("#slider").roundSlider("setValue", "0")
    $("#confirm").html("確定")
    $('input[name="radio"]').prop("checked", false)
    $("#confirm").attr("disabled", true)
    $("#rotate, #reveal").attr("disabled", false)
    turn = red_turn ? ["紅隊", "黃隊"] : ["黃隊", "紅隊"]
    message = [`${turn[0]}回合，請出題者轉轉盤`, `轉好後，請${turn[0]}出題者看旋轉最終位置，並出題`, `請${turn[0]}隊員移動指針位置，然後請${turn[1]}隊員選擇左右，再按確定`]
    $(".hint").html(message[0])
}

$("#slider").roundSlider({
    sliderType: "min-range",
    radius: slider_width,
    showTooltip: false,
    width: slider_width,
    value: 0,
    handleSize: 0,
    handleShape: "square",
    circleShape: "half-top",
})

$("#range").roundSlider({
    sliderType: "range",
    radius: slider_width,
    showTooltip: false,
    width: slider_width,
    handleSize: 0,
    circleShape: "half-top",
    animation: false,
    readOnly: true
})

// Initialize
rotate()
shuffle(topic)
change_topic()
$("body").get(0).style.setProperty("--handle-length", `${slider_width * 0.687}px`)

$(window).resize(function () {
    slider_width = $(window).width() < 610 ? $(window).width() / 2 - 5 : 300
    $("#slider, #range").roundSlider({
        radius: slider_width,
        width: slider_width
    })
    $("body").get(0).style.setProperty("--handle-length", `${slider_width * 0.687}px`)
})

$("#rotate").on("click", function () {
    $(".hint").html(message[1])
})

$("#reveal").on("click", function () {
    $("#rotate").attr("disabled", true)
    if (locked) {
        $("#reveal").attr("disabled", true)
        $("#confirm").attr("disabled", false)
        $(".hint").html(message[2])
    }
    toggle_slider()
    locked = !locked
})

$("#confirm").on("click", function () {
    if ($(this).html() === "下一局") {
        reset()
        return false
    }
    if (!$("input[name=radio]:checked").val()) {
        alert(`請${turn[1]}選擇左右`)
        return false
    }
    let val = $("#slider").roundSlider("getValue")
    let is_left = $("input[name=radio]:checked").val() === "left"
    let round = red_turn ? ["red", "yellow"] : ["yellow", "red"]
    let score1 = 0
    let score2 = 0

    if (val >= answer - 15 && val <= answer - 10) {
        score1 = 4
    } else if ((val >= answer - 20 && val < answer - 15) || (val > answer - 10 && val <= answer - 5)) {
        score1 = 3
    } else if ((val >= answer - 25 && val < answer - 20) || (val > answer - 5 && val <= answer)) {
        score1 = 2
    }

    if ((is_left && val > answer - 10) || (!is_left && val < answer - 15)) {
        score2 = 1
    }

    $(`.${round[0]}`).html(parseInt($(`.${round[0]}`).html()) + score1)
    $(`.${round[1]}`).html(parseInt($(`.${round[1]}`).html()) + score2)
    $(".hint").html(`${turn[0]}得 ${score1} 分，${turn[1]}得 ${score2} 分`)

    toggle_slider()
    $(this).html("下一局")
})