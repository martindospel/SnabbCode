import ai from "./assets/ai.svg";
import human from "./assets/human.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadingInterval;

function loader(element) {
  element.textContent = "";

  loadingInterval = setInterval(() => {
    // Update text content of loading indicator
    element.textContent += ".";

    // If loading indicator has reached three dots, reset it
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 18);
}

function generateUniqueId() {
  const currentTime = Date.now();
  const numberRandom = Math.random();
  const numberHexDecStr = numberRandom.toString(16);

  return `id-${currentTime}-${numberHexDecStr}`;
}

function chatSegment(isAi, value, uniqueId) {
  return `
      <div class="wrapper ${isAi && "ai"}">
          <div class="chat">
              <div class="profile">
                  <img 
                    src=${isAi ? ai : human} 
                    alt="${isAi ? "ai" : "human"}" 
                  />
              </div>
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // human's chatSegment
  chatContainer.innerHTML += chatSegment(false, data.get("prompt"));
  // to clear textarea input
  form.reset();

  // ai's chatSegment
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatSegment(true, " ", uniqueId);
  // to focus scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
  // specific message div
  const responseDiv = document.getElementById(uniqueId);

  // responseDiv.innerHTML = "..."
  loader(responseDiv);

  //now fetch data from server and get ai's response
  const response = await fetch("https://snabby.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });
  clearInterval(loadingInterval);
  responseDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(responseDiv, parsedData);
  } else {
    const error = await response.text();
    responseDiv.innerHTML = "An error occured";
    responseDiv.style.color = "red";
    alert(error);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    handleSubmit(e);
  }
});
