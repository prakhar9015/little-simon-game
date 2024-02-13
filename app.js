// How to rain confetti after each successfull submission...


let current_level = 1
let user = []
let computer = []
// let max_score = 0;  // don't touch this variable again ever...

let max_score = Number(localStorage.getItem("max_level"))

function set_high_score(maxScore, currentScore){
    if (maxScore < currentScore){
        maxScore = currentScore
        localStorage.setItem("max_level", maxScore)
    } 
    return maxScore;
}


let img_list = ["alladin.webp", "brave.jpg", "chin-up.jpg", "lion-king.png", "nemo.jpg", "try-harder.jpg"]

function randomisation(data_list){

    let random_img = Math.floor(Math.random() * data_list.length)
    return data_list[random_img]
}


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
    if (current_level > 1){
        $("#level-title").append("<span class='level-plus-big '>+</span>")
        $("#level-title").append("<span class='level-plus-little'>+</span>")
    }
    
    
    if (current_level > max_score){
        $("#congratulate_winner").text(``)
    }

    $("#current_score_div").text(``)
    $("#congratulate_winner").text(``)
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
    }, 870)

    play_music_animation_btn("wrong");
    $(".container .btn").addClass("btn-disabled-style")

    $("h1").text("Game Over. Try again! ♾️")

    $("#current_score_div").text(`Current level: ${current_level}`)

    // before updating max_score
    if (current_level > max_score){
        $("#congratulate_winner").text(`congratulations! 🎉 New highest record 🍾 \n
        keep going ${player_nameFromLocalStorage} !
        `)
    }else if (current_level == max_score){
        $("#congratulate_winner").text(` Hey ${player_nameFromLocalStorage}, you almost made it !
        Try again. you're gonna make a new record ! ✨
        `)
    }else {
        $("#congratulate_winner").text(` ${player_nameFromLocalStorage}, you're just ${max_score-current_level} 
        points away. Work hard ! 💪
        `)
    }

    // Update the max_score variable using the set_high_score function
    max_score = set_high_score(max_score, current_level);

    $("#high_score_div").html(`<h2>Highest Level:  ${max_score}</h2>`)

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
$("#high_score_div").html(`<h2>Highest Level: ${max_score}</h2>`)


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

let player_nameFromLocalStorage = localStorage.getItem("player_name")
console.log(`player_nameFromLocalStorage: ${player_nameFromLocalStorage}`)


if (!player_nameFromLocalStorage){
    $("#start-btn").html("Enter your name... <i class='fa-solid fa-bounce fa-lg'>🚀</i>")
    $("#start-btn").on("click", get_user_name)
}

function get_user_name(){ 

    if (player_nameFromLocalStorage){  // why it's not falsy, since it's undefined...
        welcome_user(player_nameFromLocalStorage)
        $("#start-btn").on("click", keydownHandler)
        // console.log("I am calling start btn from player_nameFromLocalStorage")
    }else {
        setTimeout(()=> {
            let playerName = prompt("what is your name ❓")
            console.log(`player name: ${playerName} and length: ${playerName.length}`)

            if (playerName.length > 0 && playerName != null && playerName != undefined){

                if (playerName.length > 25){  // MAKE IT ONLY 25 character's long
                    playerName = playerName.slice(0, 25)
                }
                localStorage.setItem("player_name", playerName) 
                // console.log(`max_score from else block: ${max_score}`)
                localStorage.setItem("max_level", 0) // this will be string
                welcome_user(playerName) 
                player_nameFromLocalStorage = playerName
                $("#start-btn").html("Start <i class='fa-solid fa-bounce fa-lg'>🚀</i>")
                $("#start-btn").on("click", keydownHandler)
                // console.log("I am calling start btn from playerName")
            }
        }, 900)
    }
}

get_user_name()
    
    

function welcome_user(player){

    console.log(`player name: ${player} and length: ${player.length}`)
    $("h1").text(`welcome ${player}`)
    $("#user_name").html(`<h2>${player}'s</h2>`)
}


// $("#congratulate_winner").text(`congratulations! 🎉 New highest record 🍾\n
// keep going ${player_nameFromLocalStorage} !
// `)