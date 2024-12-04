let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageInput = document.querySelector("#image input");

const api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAR_A8f5r-W8AB5K29QEJw8ESxJcTSo_Fo"

let user = {
    message:null,
    file:{
        mime_type: null,
        data: null
    }
}
async function generateResponse(aiChatbox){
    
    let text = aiChatbox.querySelector(".ai-chatarea")
    let requestOption = {
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: user.message } , (user.file.data?[{"inline_data":user.file}]:[])

                    ]
                }
            ]
        }),
    };
    try {
        let response = await fetch(api_url,requestOption)
        let data = await response.json()
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
         
        text.innerHTML = apiResponse
    } catch (error) {
        console.error("Error during API call:", error);
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        image.src = `image/img.png`
        image.classList.remove("choose")
    }

    
}

function createChatbox(html,classes){
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}

function handlechatResponse(mes){
    user.message = mes; 
    let html = ` <img src="image/person.png" alt="" id="userimage" width="50">
    <div class="user-chatarea">
        ${user.message} 
        ${user.file.data?`<img src="data:${user.file.mine_type};base64,${user.file.data}" class="chooseimg" />`: ""}
    </div>`
    prompt.value=""
    let userchatbox = createChatbox(html,"user-chatbox");
    chatContainer.appendChild(userchatbox);
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
     
    setTimeout(() => {
        let html = `<img src="image/ai.png" alt="" id="aiimage" width="50">
        <div class="ai-chatarea"> 
        <img src="loading.gif" alt="" class="load" width="60px">
        </div>`
        let aiChatbox = createChatbox(html,"ai-chatbox")
        chatContainer.appendChild(aiChatbox)
        generateResponse(aiChatbox)
    }, 600);
}

prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        handlechatResponse(prompt.value);
        
    } 
})

imageInput.addEventListener("change",()=>{
    const file = imageInput.files[0]
    if(!file) return
    let reader = new FileReader();
    reader.onload=(e)=>{
        let base64String = e.target.result.split(",")[1]
        user.file={
            mime_type: file.type,
            data : base64String
        }
        image.src = `data:${user.file.mine_type};base64,${user.file.data}`
        image.classList.add("choose")
    }
    
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})