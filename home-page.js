import {renderGameForm, handleGameFormSubmit, renderGamePost} from "./game-form-script.js";

const gamesCollection = firebase.firestore().collection('games')

  const getGames = async () => {
      const games = await gamesCollection.get();
      return games;
  }


const renderGameFormButton = function() {
    let game_form_button = document.createElement('button');
    game_form_button.id = "game-form-button";
    game_form_button.className = "button is-block is-primary is-inverted";
    game_form_button.innerHTML = `Create Post`;
    return game_form_button;
}

const handleGameFormButton = function(event) {
    event.preventDefault();
    $("#game-form").toggle("fast");
    if($("#game-form-button").html() == "Create Post"){
        $("#game-form-button").removeClass("is-primary is-inverted");
        $("#game-form-button").addClass("is-danger");
        $("#game-form-button").html("Cancel Post");
    } else {
        $("#game-form-button").html("Create Post");
        $("#game-form-button").removeClass("is-danger");
        $("#game-form-button").addClass("is-primary is-inverted");
    }
}

const renderFilterBar = function () {
    let filter_form = document.createElement('div');
    filter_form.classList.add("container");
   // filter_form.classList.add("has-text-centered");
    filter_form.innerHTML = `
    <p class = "subtitle has-text-grey is-3 has-text-centered">Filter</p>
<div class="columns">
    <div class="column">
        <div class="select filter-select">
            <select>
                <option>Sport</option>
                <option>Baseball</option>
                <option>Basketball</option>
                <option>Football</option>
                <option>Soccer</option>
                <option>Tennis</option>
                <option>Volleyball</option>
            </select>
        </div>
    </div>
    <div class="column">
        <div class="select filter-select">
            <select>
                <option>Skill Level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
            </select>
        </div>
    </div>
<div class="column">
<div class="field filter-input">
    <div class="control">
        <input class="input" type="time" style="width: 140px; height:35px;" placeholder="ex.) 12:00pm">
    </div>
</div>
</div>
<div class = "column">
<div class="field is-grouped filter">
        <div class="control apply is-grouped"></div>
</div>
</div>
    `
    //Create buttons and apend them
    let button_container = filter_form.getElementsByClassName('apply')[0];
    let apply_button = document.createElement("button");
    apply_button.className = "button is-danger apply-button";
    apply_button.innerHTML=`Apply`;
    button_container.appendChild(apply_button);
    let clear_button = document.createElement("button");
    clear_button.className = "button is-clear clear-button";
    clear_button.innerHTML=`Clear`;
    button_container.appendChild(clear_button);
    //TODO: Handle button presses
    // filter_form.getElementsByClassName('sport-option-1')[0].addEventListener('click', () => {
    //     let temp = filter_form.getElementsByClassName('sport-option-1');
    //     console.log(temp)
    // })
    filter_form.getElementsByClassName('apply-button')[0].addEventListener('click', () => {
        let time = filter_form.getElementsByClassName('input')[0].value;
        handleFilterApplyButton(time);
    })
    filter_form.getElementsByClassName('clear-button')[0].addEventListener('click', () => {
        
    })
    return filter_form;
}

const handleFilterApplyButton = function () {
    alert("Apply button was pressed");
}

const handleLogOutButton = function() {
    firebase.auth().signOut().then(function() {
        window.location.href='./index.html'
      }).catch(function(error) {
        console.log("An error occurred")
      });
}

// renderGames();

const loadIntoDom = async function () {
    $("#filter-container").append(renderFilterBar());
    $("#game-form-container").append(renderGameForm());
    $("#game-form-container").append(renderGameFormButton());
    $("#game-form").hide();
    $(document).on("click", "#game-form-button", handleGameFormButton);
    $(document).on("submit", "#game-form", handleGameFormSubmit);
    $(document).on("click", "#log-out-button", handleLogOutButton);
    var games = await gamesCollection.get();
    
    games.forEach(async game => {
        const gameData = game.data();
        var gamePost = {
                afirst: gameData.afirst,
                alast: gameData.alast,
                name: gameData.name,
                location: gameData.location,
                gameDate: new Date(gameData.gameDate),
                gameTime: gameData.gameTime,
                numPlayers: gameData.numPlayers,
                sportSelect: gameData.sportSelect,
                skillSelect: gameData.skillSelect,
            };
        const theGamePost = await renderGamePost(gamePost);
        $("#feed").append(theGamePost)
        })
        if($("#no-games-message").is(':visible')) {
            $("#no-games-message").toggle();
        }
        $(".navbar-burger").on("click", function() {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
        });
    }

 $(function() {
    loadIntoDom();
 });