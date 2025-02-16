document.addEventListener("DOMContentLoaded", () => {
    const breedInput = document.getElementById("breedInput");
    const breedList = document.getElementById("breedList");
    const searchBtn = document.getElementById("searchBtn");
    const dogImage = document.getElementById("dogImage");
    const errorMessage = document.getElementById("errorMessage");

    let breedNames = [];
    let interval;

    console.log("Trying to get breed list..."); 

    async function grabAllTheBreeds() {
        try {
            let response = await fetch("https://dog.ceo/api/breeds/list/all");
            let data = await response.json();
            breedNames = Object.keys(data.message);
            breedNames.forEach(breed => {
                const option = document.createElement("option");
                option.value = breed;
                breedList.appendChild(option);
            });
            console.log("Got the breed list!");
        } catch (error) {
            console.log("Failed to load breed list 😬", error);
        }
    }

    async function loadDogPic(breed) {
        console.log(`Fetching image for ${breed}...`); 
        try {
            let response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
            let data = await response.json();

            if (data.status === "success") {
                dogImage.src = data.message;
                dogImage.style.display = "block";
                errorMessage.innerText = "";
                console.log("Image loaded successfully 🐶");
            } else {
                displayProblem();
            }
        } catch (error) {
            console.log("Uh oh, something went wrong while fetching the image! 😓", error);
            displayProblem();
        }
    }

    function displayProblem() {
        let messages = [
            "That breed doesn’t exist!",
            "Sorry, no doggos found!",
            "No such breed found. Try another one.",
            "Hmm... are you sure that's a real breed? 🤔"
        ];
        let randomMessage = messages[Math.floor(Math.random() * messages.length)];
        errorMessage.innerText = randomMessage;
        dogImage.style.display = "none";
        clearInterval(interval);
        console.log("Displayed error: " + randomMessage); 
    }

    searchBtn.addEventListener("click", () => {
        const breed = breedInput.value.toLowerCase().trim();

        if (!breedNames.includes(breed)) {
            displayProblem();
            return;
        }

        loadDogPic(breed);
        clearInterval(interval);
        interval = setInterval(() => loadDogPic(breed), 5000); 
    });

    grabAllTheBreeds();
});
