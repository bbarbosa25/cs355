document.addEventListener("DOMContentLoaded", async () => {
    const breedInput = document.getElementById("breedInput");
    const breedList = document.getElementById("breedList");
    const searchBtn = document.getElementById("searchBtn");
    const dogImage = document.getElementById("dogImage");
    const errorMessage = document.getElementById("errorMessage");

    let breeds = [];
    let interval;

    console.log("Fetching breed list...");

    // Fetch breeds from local Express API
    try {
        let res = await fetch("/breeds");
        breeds = await res.json();
        console.log("Breeds loaded:", breeds);

        // Populate <datalist> for autocomplete
        breeds.forEach(breed => {
            const option = document.createElement("option");
            option.value = breed;
            breedList.appendChild(option);
        });
    } catch (error) {
        console.log("Error loading breeds:", error);
    }

    // Fetch and display a random dog image from Dog CEO API directly
    async function fetchDogImage(breed) {
        console.log(`Fetching image for ${breed}...`);
        try {
            let res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
            let data = await res.json();

            if (data.status === "success") {
                dogImage.src = data.message;
                dogImage.style.display = "block";
                errorMessage.innerText = "";
                console.log("Image loaded successfully");
            } else {
                showError();
            }
        } catch (error) {
            console.log("Error fetching image:", error);
            showError();
        }
    }

    // Show error message if breed is not found
    function showError() {
        errorMessage.innerText = "No such breed found!";
        dogImage.style.display = "none";
        clearInterval(interval);
    }

    // Handle search button click
    searchBtn.addEventListener("click", () => {
        const breed = breedInput.value.toLowerCase().trim();

        if (!breeds.includes(breed)) {
            showError();
            return;
        }

        fetchDogImage(breed);
        clearInterval(interval);
        interval = setInterval(() => fetchDogImage(breed), 5000);
    });
});
