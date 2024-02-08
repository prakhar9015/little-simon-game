let current_level = 1
let user = []
let computer = []
let max_score = 0;  // don't touch this variable again ever...

// Don't take the help of chatGPT, use your own brain and debugging skills...


function set_high_score(maxScore, currentScore){
    if (maxScore < currentScore){
        maxScore = currentScore
    } 
    return maxScore;
}


let img_list = ["alladin.webp", "brave.jpg", "chin-up.jpg", "lion-king.png", "nemo.jpg", "try-harder.jpg"]

function randomisation(data_list){
    
    let random_img = Math.floor(Math.random() * data_list.length)
    return data_list[random_img]
}

// Add the method of High Score ... while only eqach rounds... of wrong game...
// can also make it add a backend technology or "LocalStorage" of browser to store user's Highest score... ???
// How to rain confetti after each successfull submission...

function addBtnClick_check(){

    // Add event listener to the buttons and also check the user's choice with computer 
    $(".container .btn").click((event)=> {

        let btn_clicked_id = event.target.id
        play_music_animation_btn(btn_clicked_id)
        user.push(btn_clicked_id)
        check_pattern()
    })
}

function play_music_animation_btn(songName){  // play song functionality (built-in)
    var song = new Audio(`sounds/${songName}.mp3`)
    song.play()

    $(`#${songName}`).addClass("pressed")
    setTimeout(()=> {
        $(`#${songName}`).removeClass("pressed")
    }, 180)

}

function for_auto_btn_clicks(songName){

    var song = new Audio(`sounds/${songName}.mp3`)
    song.play()
    $(`#${songName}`).addClass("auto-btn")

    // if (current_level  > 1){
    //     $("#level-title").append("<span class='level-plus-big '>+</span>")
    //     $("#level-title").append("<span class='level-plus-little'>+</span>")
    // }
    
    setTimeout(()=> {
        $(`#${songName}`).removeClass("auto-btn")
        $("span").remove()
    }, 485)

}


function choose_random_btn(){  // computer choosing a random btn

    let btn_list = ["red", "green", "yellow", "blue"]
    let random_choice = Math.floor(Math.random() * btn_list.length)

    let random_btn = btn_list[random_choice]

    setTimeout(()=> {
        $("h1").text(`Level ${current_level}`)
        for_auto_btn_clicks(random_btn)
    }, 960)

    computer.push(random_btn)
    console.log(`COMPUTER ARRAY: ➡️ ${computer}`)
}


function update_level(){  // if user_array == computer_array (increase level, pick a random btn)

    // setTimeout(()=> {
        // $("h1").text(`Level ${current_level}`)
    // }, 600)

    if (current_level > 1){
        $("#level-title").append("<span class='level-plus-big '>+</span>")
        $("#level-title").append("<span class='level-plus-little'>+</span>")
    }
    

    choose_random_btn()
    $(document).off("keydown")
    user = []
    $(".container .btn").removeClass("btn-disabled-style")
}


function end_game_work(){  // end the game when patterns are incorrect
    $(".container .btn").off("click")

    $("body").addClass("game-over")
    setTimeout(()=> {
        $("body").removeClass("game-over")
    }, 850)

    play_music_animation_btn("wrong");
    $(".container .btn").addClass("btn-disabled-style")

    $("#high_score_div").html(`<h2>High Score: ${set_high_score(max_score, current_level)}</h2>`)

    $("h1").text("Game Over. Try again! ♾️")
    computer = []
    user = []
    current_level = 1 

    $("#start-btn").html("Try again <i class='fa-solid fa-bounce fa-lg'>🚀</i>")

    $("#img-value").attr("src", `images/${randomisation(img_list)}`)

    setTimeout(()=>{
        $("#start-btn").fadeIn()
        $("#img-value").slideDown()
    }, 380)

}



// as soon as the user has started to click the buttons... start checking 
function check_pattern(){

    let is_pattern_correct = true;

    for (let i=0; i < user.length; i++){
        if (computer[i] == user[i]){
            is_pattern_correct = true;
        }else {
            is_pattern_correct = false;
            console.log(`computer ➡️ ${computer[i]} 🆚 user ➡️ ${user[i]}  ❌`)
            end_game_work()
            break;
            // end the game ...
        }
    }

    console.log(`is_pattern_correct: ${is_pattern_correct}`)

    if (is_pattern_correct == true && computer.length == user.length){
        current_level++;
        update_level()
    }
}
        


// -------- Real flow of game starts here ----------


$(".container .btn").addClass("btn-disabled-style") // add the btn-disabled-class
$("#high_score_div").html(`<h2>High Score: 0</h2>`)

const keydownHandler = () => {  // what to do when the game starts

    setTimeout(()=> {
        $("#start-btn").fadeOut()
        $("#img-value").slideUp()
    }, 500)

    setTimeout(()=>{
        $(".container .btn").removeClass("btn-disabled-style")
        update_level()
        addBtnClick_check()
    }, 700)
}

$("#start-btn").on("click", keydownHandler)

