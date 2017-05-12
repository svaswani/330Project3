"use strict";
// api.ai token and url
var accessToken = "427fba490ee242f5b6081ce0fd8bd27a",
    baseUrl = "https://api.api.ai/v1/";

// giphy api token
var giphyToken = "dc6zaTOxFJmzC";

// writes to chatbox once content comes from api and user sends content
function writeToChatbox(sender, message) {
    var chatbox = $("#chatbox");
    var start = chatbox[0].innerHTML;

    // new lines
    if (start.length > 0) {
        start += "<br>";
    }
    // if it's a giphy put it in an image tag
    // search the url to check if giphy
    if (message.indexOf("giphy") >= 0 && message.indexOf("http") >= 0) {
        start += sender + ": ";
        chatbox[0].innerHTML = start + '<img src=" ' + message + ' \n" />';
    }
    // otherwise just send as text
    else {
        start += sender + ": ";
        chatbox[0].innerHTML = start + message;
    }

    chatbox[0].scrollTop = chatbox[0].scrollHeight;
}

// message received 
function messageReceived(text) {
    var chatbox = $("#chatbox");
    //console.log("Received " + text);
    //writeToChatbox("Chatbot", text);
}

// sends to apis 
function send(text) {
    //console.log(JSON.stringify({ query: text, lang: "en", sessionId: "stealth" }));
    var chatbox = $("#chatbox");
    writeToChatbox("You", text);
    //console.log("Sending " + text);
    // post requirements for api.ai
    $.ajax({
        type: "POST",
        url: baseUrl + "query",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "Bearer " + accessToken);
        },
        data: JSON.stringify({ query: text, lang: "en", sessionId: "stealth", v: 20150910 }),
        success: function (data) {
            // prepareResponse(data);
            //console.log(data.result.speech);
            writeToChatbox("Stella", data.result.speech);
        },
        // debgugging... did something go wrong?
        error: function () {
            console.log("meep");
        }
    });

    // timer for response from stella
    window.setTimeout(function () {
        messageReceived(text);
    }, 500);
}

// send on enter 
document.onkeydown = function () {
    if (window.event.keyCode == '13') {
        submit();
    }
}

// submit user message and send content to send function
function submit(event) {
    var inputbox = $('#usermsg');
    var message = inputbox.html();
    if(message.charAt(0)=="<"){
        message = document.getElementById("drag1").src;
        console.log(message);
    }
    send(message);
    inputbox.html("");
}

// send giphy from user to send function
function sendGiphy(url) {
    var inputbox = $('#usermsg');
    var message = url;
    send(message);
    inputbox.html("");
    giphySearch("");
}

// search for gif by pressing the button
function giphyButton(event) {
    var inputbox = $('#usermsg');
    var message = inputbox.html();
    //giphyUrl = "http://api.giphy.com/v1/gifs/search?q=" + message + "&api_key=dc6zaTOxFJmzC";
    giphySearch(message);
    inputbox.html("");
}

// giphy search and giphy api requests 
function giphySearch(text) {
    //console.log(text);
    // post req
    $.ajax({
        type: "GET",
        url: "https://api.giphy.com/v1/gifs/search?q=" + text + "&api_key=dc6zaTOxFJmzC",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            // concatenate each image url from api into an image tag that loads into the html
            var html = "";
            for (var i = 0; i < data.data.length; i++) {
                html += '<img src="' + data.data[i].images.fixed_height_small.url + '" onclick="sendGiphy(\'' + data.data[i].images.fixed_height_small.url + '\')" draggable=true ondragstart="drag(event)" id="drag1"/>';
            }
            document.getElementById("giphyImages").innerHTML = html;
            //console.log(data.data[i].images.fixed_height_small.url);

        },
        // dubugging if something goes wrong
        error: function () {
            console.log("meep");
        }
    });
}

// drag and drop events
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //console.log(data);
    ev.target.appendChild(document.getElementById(data));
    //console.log(document.getElementById(data).src);
}
// jQuery Document
$(document).ready(function () {
});