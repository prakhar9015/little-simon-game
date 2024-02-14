// How to rain confetti after each successfull submission...

let current_level = 1
let user = []
let computer = []

let max_score = Number(localStorage.getItem("max_level")) // don't touch this variable again ever...

// This function checks, for maximum score from current level
function set_high_score(maxScore, currentScore){
    if (maxScore < currentScore){
        maxScore = currentScore
        localStorage.setItem("max_level", maxScore)
    } 
    return maxScore;
}

// A list of images, to be chosen randomly
let img_list = ["alladin.webp", "brave.jpg", "chin-up.jpg", "lion-king.png", "nemo.jpg", "try-harder.jpg", "right-path.jpg", 
    "adventure-is-there.webp", "be-yourself.png", "faith-trust.jpg", "go-for-it.webp", "i-wanna-live.webp", "infinity.webp", "let-it-be.webp", "you-will-get-it.jpg",
    "fly-higher.webp", "silencio-bruno.jpg", "valuable-identity.webp"
]

// randomly choosing imgages form the list above
function randomisation(data_list){
    let random_img = Math.floor(Math.random() * data_list.length)
    return data_list[random_img]
}


// Add event listener to the buttons(red, green, blue & yellow) and also check the user's choice with computer 
function addBtnClick_check(){
    $(".container .btn").click((event)=> {
        let btn_clicked_id = event.target.id
        play_music_animation_btn(btn_clicked_id)
        user.push(btn_clicked_id)
        check_pattern()
    })
}


// play song functionality (built-in) and also add (buttons) pressed class
function play_music_animation_btn(songName){ 
    var song = new Audio(`sounds/${songName}.mp3`)
    song.play()

    $(`#${songName}`).addClass("pressed")
    setTimeout(()=> {
        $(`#${songName}`).removeClass("pressed")
    }, 180)
}


// This is same as above, ONLY it works for `auto-clicks`, i.e, when computer chooses a btn randomly
function for_auto_btn_clicks(songName){
    var song = new Audio(`sounds/${songName}.mp3`)
    song.play()
    $(`#${songName}`).addClass("auto-btn")
    
    setTimeout(()=> {
        $(`#${songName}`).removeClass("auto-btn")
        $("span").remove()
    }, 485)
}


// How computer chooses a button randomly, from the list of colors
function choose_random_btn(){  

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


// If user_pattern == computer_pattern, then increase the level, and add animations
function update_level(){  
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
    user = []
}


// end the game when patterns are incorrect and provide user feedback
function end_game_work(){ 
    $(".container .btn").off("click")

    $("body").addClass("game-over")
    setTimeout(()=> {
        $("body").removeClass("game-over")
    }, 870)

    play_music_animation_btn("wrong");
    $(".container .btn").addClass("btn-disabled-style")

    $("h1").text("Game Over. Try again! ♾️")

    $("#current_score_div").text(`Current level: ${current_level}`)

    // made this feedback message more dynamic... and encouraging!
    if (current_level > max_score){
        $("#congratulate_winner").text(`congratulations! 🎉 New highest record 🍾 \n
            keep going ${player_nameFromLocalStorage} !
        `)
    }else if (current_level == max_score){
        $("#congratulate_winner").text(` Hey ${player_nameFromLocalStorage}, you almost made it. \n
            Try again. you're gonna make a new record ! ✨
        `)
    }else {

        let spelling = "points";

        if (max_score-current_level == 1){
            spelling = "point"
        }

        $("#congratulate_winner").text(`Hey ${player_nameFromLocalStorage}, \n you're just ${max_score-current_level} 
            ${spelling} away. Work hard 💪
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
        $("#refresh-img").fadeIn()
        $("#settings").fadeIn()
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
    if (is_pattern_correct == true && computer.length == user.length){
        current_level++;
        update_level()
    }
}
        

// -------- Real flow of game starts here ----------

$(".container .btn").addClass("btn-disabled-style") // add the btn-disabled-class
$("#high_score_div").html(`<h2>Highest Level: ${max_score}</h2>`)

// what to do when the game starts
const keydownHandler = () => {

    setTimeout(()=> {
        $("#start-btn").fadeOut()
        $("#img-value").slideUp()
        $("#refresh-img").fadeOut()
        $("#settings").fadeOut()
        $("#settings-content").slideUp()
    }, 500)

    setTimeout(()=>{
        $(".container .btn").removeClass("btn-disabled-style")
        update_level()
        addBtnClick_check()
    }, 700)
}

let player_nameFromLocalStorage = localStorage.getItem("player_name")

// If player name is not found in localstorage, then switch the btn to `enter your name`
if (!player_nameFromLocalStorage){
    $("#start-btn").html("Enter your name... <i class='fa-solid fa-bounce fa-lg'>🚀</i>")
    $("#start-btn").on("click", get_user_name)
}


// This function checks for userName in localstorage, if not found, then asks it 
function get_user_name(){
    
    $("#img-value").attr("src", `images/${randomisation(img_list)}`)

    if (player_nameFromLocalStorage){  // why it's not falsy, since it's undefined...
        $("#start-btn").off("click") // remove this first eventListener
        welcome_user(player_nameFromLocalStorage)
        $("#start-btn").on("click", keydownHandler)
    }else {
        setTimeout(()=> {
            let playerName = prompt("what is your name dear player❓").toLowerCase()

            if (playerName.length > 0 && playerName != null && playerName != undefined){

                if (playerName.length > 25){  // MAKE IT ONLY 25 character's long
                    playerName = playerName.slice(0, 25)
                }
                $("#start-btn").off("click")  // remove this first eventListener
                localStorage.setItem("player_name", playerName) 
                localStorage.setItem("max_level", 0) // this will be string
                welcome_user(playerName) 
                player_nameFromLocalStorage = playerName
                $("#start-btn").html("Start <i class='fa-solid fa-bounce fa-lg'>🚀</i>")
                $("#start-btn").on("click", keydownHandler)
            }
        }, 700) // 900
    }
}

get_user_name()  // calling this function as soon as the game starts 


// This function, welcomes the user, when the game starts or they create /updates their profile .
function welcome_user(player){
    $("h1").text(`welcome ${player}`)
    $("#user_name").html(`<h2>${player}'s</h2>`)
}


$("#refresh-img").on("click", function() {
    $("#img-value").attr("src", `images/${randomisation(img_list)}`)
})

$("#settings").on("click", ()=> {

    if (player_nameFromLocalStorage){
        // $("#settings-i").toggleClass("fa-spin")
        $("#settings-i").addClass("fa-spin")

        setTimeout(()=> {
            $("#settings-i").removeClass("fa-spin")
        }, 700)

        $("#settings-content").slideToggle()
    }else {
        alert(" 🪧 To use this feature, you must enter your name first...")
    }
})

$("#update-name").on("click", ()=> {
    let new_name = prompt("what is your new name ❓").toLowerCase()

    if (new_name.length > 0 && new_name != null && new_name != undefined){

        if (new_name.length > 25){  // MAKE IT ONLY 25 character's long
            new_name = new_name.slice(0, 25)
        }
        localStorage.setItem("player_name", new_name) 
        alert("Name successfully updated ✅")
        welcome_user(new_name) 
        $("#user_name").html(`<h2>${new_name}'s</h2>`)
    }
})

$("#reset-score").on("click", ()=> {
    let reset = prompt(`Are you sure, you wanna reset the level ❓\n
    Type 'yes' or 'no'
    `).toLowerCase()

    if (reset == "yes"){
        localStorage.setItem("max_level", 0)
        alert("Level set to 0 ✅")
        $("#high_score_div").html(`<h2>Highest Level: 0</h2>`)
    }
})

$("#settings-content").hide()