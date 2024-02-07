let current_level = 1
is_game_start = false
let user = []
let computer = []



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
        // console.log(`USER ARRAY: 👉 ${user}`)
        check_pattern()
    })
}

function play_music_animation_btn(songName){  // play song functionality (built-in)
    var song = new Audio(`sounds/${songName}.mp3`)
    song.play()

    $(`#${songName}`).addClass("pressed")
    setTimeout(()=> {
        $(`#${songName}`).removeClass("pressed")
    }, 200)

}

function for_auto_btn_clicks(songName){

    var song = new Audio(`sounds/${songName}.mp3`)
    song.play()
    $(`#${songName}`).addClass("auto-btn")

    if (computer.length >= 2){
        $("#level-title").append("<span class='level-plus-big '>+</span>")
        $("#level-title").append("<span class='level-plus-little'>+</span>")
    }
    
    setTimeout(()=> {
        $(`#${songName}`).removeClass("auto-btn")
        $("span").remove()
    }, 400) // remove the class after 150 ms

}


function choose_random_btn(){  // computer choosing a random btn

    let btn_list = ["red", "green", "yellow", "blue"]
    let random_choice = Math.floor(Math.random() * btn_list.length)

    let random_btn = btn_list[random_choice]

    setTimeout(()=> {
        for_auto_btn_clicks(random_btn)
    }, 650)

    computer.push(random_btn)
    console.log(`COMPUTER ARRAY: ➡️ ${computer}`)
}


function update_level(){  // if user_array == computer_array (increase level, pick a random btn)
    $("#level-title").text(`Level ${current_level}`)
    choose_random_btn()
    $(document).off("keydown")
    // console.log("update level has been called...")
    user = []
    $(".container .btn").removeClass("btn-disabled-style")
}


function end_game_work(){  // end the game when patterns are incorrect
    $(".container .btn").off("click")

    $("body").addClass("game-over")
    setTimeout(()=> {
        $("body").removeClass("game-over")
    }, 600)

    play_music_animation_btn("wrong");
    $(".container .btn").addClass("btn-disabled-style")

    console.log("click event listener turned off")
    $("h1").text("Game Over. Try again!♾️")
    computer = []
    user = []
    current_level = 1 

    $("#start-btn").html("Try again <i class='fa-solid fa-bounce fa-lg'>🚀</i>")

    $("#img-value").attr("src", `images/${randomisation(img_list)}`)

    setTimeout(()=>{
        $("#start-btn").fadeIn()
        $("#img-value").slideDown()
    }, 350)

    // $(document).on("keydown", keydownHandler)

}



// as soon as the user has started to click the buttons... start checking 
function check_pattern(){

    let is_pattern_correct = true;

    for (let i=0; i < user.length; i++){
        // console.log(`COMPUTER: ➡️ ${computer.length} 🆚 USER: 👉 ${user.length}`)

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

const keydownHandler = () => {  // what to do when the game starts

    setTimeout(()=> {
        $("#start-btn").fadeOut()
        $("#img-value").slideUp()
    }, 500)

    setTimeout(()=>{
        is_game_start = true
        $(".container .btn").removeClass("btn-disabled-style")
        update_level()
        addBtnClick_check()
    }, 700)

}

// $(document).on("keydown", keydownHandler)  // In beginning, start listening for keyboard strokes

$("#start-btn").on("click", keydownHandler)
