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
        }
    });
}

socket.on("SERVER_SEND_MESSAGE", (data) => {
    console.log("here")
    console.log(data)
    const body = document.querySelector(".chat .inner-body");
    console.log(body);
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    console.log(myId);
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

    body.appendChild(div);
})