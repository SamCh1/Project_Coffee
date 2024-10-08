import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';



// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData){
    const inputContent = formSendData.querySelector("input[name='content']")
    formSendData.addEventListener("submit" , (event) => {
        event.preventDefault();
        const content = inputContent.value;
        if(content){
            socket.emit("CLIENT_SEND_MESSAGE", content);
            inputContent.value = "";
            socket.emit("CLIEN_SEND_TYPING","hidden");
        }
    });
}

// SERVER_SEND_MESSAGE
socket.on("SERVER_SEND_MESSAGE", (data) => {
    const body = document.querySelector(".chat .inner-body");
    const elementListTyping = body.querySelector(".inner-list-typing")
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const div = document.createElement("div");
    let htmlFullName = "";

    if(myId != data.userId){
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
    }else{
        div.classList.add("inner-outgoing");
    }

    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;

    body.insertBefore(div, elementListTyping);
    body.scrollTop = body.scrollHeight;
})

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll Chat To Bottom


//Show chat icon
const buttonIcon = document.querySelector(".button-icon")

if(buttonIcon){
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip)

    //Show tooltip
    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle('shown');
    })

    // Insert Icon into input
    const emojiPicker = document.querySelector("emoji-picker");
    const inputChat= document.querySelector(".chat .inner-form input[name='content']");

    emojiPicker.addEventListener('emoji-click', event => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;
    })

    //show Typing
    var timeOut;
    inputChat.addEventListener("keyup",() => {
        socket.emit("CLIENT_SEND_TYPING", "show");
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }, 3000);
    });
//End show typing
}

//End show chat icon

//SERVER_RETURN_TYPING

const elementListTyping = document.querySelector(".chat .inner-body .inner-list-typing");
socket.on("SERVER_RETURN_TYPING", (data) => {
    if(data.type == "show"){
        const existTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`)
        if(!existTyping){
            const boxTyping = document.createElement("div");
            boxTyping.classList.add("box-typing");
            boxTyping.setAttribute("user-id", data.userId);
            boxTyping.innerHTML = `
                <div class="inner-name"> ${data.fullName} </div>
                <div class="inner-dots">
                    <span></span> 
                    <span></span> 
                    <span></span>
                </div> 
            `;
            elementListTyping.appendChild(boxTyping);
        }
    } else {
        const boxTypingRemove = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
        if(boxTypingRemove){
            elementListTyping.removeChild(boxTypingRemove);
        }
    }
});
//End SERVER_RETURN_TYPING