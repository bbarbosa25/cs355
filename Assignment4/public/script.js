document.addEventListener("DOMContentLoaded", async () => {
    const breedInput = document.getElementById("breedInput");
    const breedList = document.getElementById("breedList");
    const searchBtn = document.getElementById("searchBtn");
    const dogImage = document.getElementById("dogImage");
    const errorMessage = document.getElementById("errorMessage");
    const refreshBtn = document.getElementById("refreshBtn"); // New refresh button

    let breeds = [];

    try {
        const res = await fetch("/breeds");
        breeds = await res.json();

        breeds.forEach(breed => {
            const option = document.createElement("option");
            option.value = breed;
            breedList.appendChild(option);
        });
    } catch (error) {
        console.error("Failed to load breed list:", error);
    }

    async function fetchDogImage(breed) {
        try {
            const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
            const data = await res.json();

            if (data.status === "success") {
                dogImage.src = data.message;
                dogImage.style.display = "block";
                errorMessage.innerText = "";
            } else {
                errorMessage.innerText = "No image found for this breed.";
                dogImage.style.display = "none";
            }
        } catch (error) {
            errorMessage.innerText = "Error fetching image. Try again.";
            dogImage.style.display = "none";
        }
    }

    searchBtn.addEventListener("click", () => {
        const breed = breedInput.value.toLowerCase().trim();
        
        if (!breeds.includes(breed)) {
            errorMessage.innerText = "Breed not found.";
            dogImage.style.display = "none";
            return;
        }

        fetchDogImage(breed);
    });

    refreshBtn.addEventListener("click", () => {
        const breed = breedInput.value.toLowerCase().trim();
        if (breed && breeds.includes(breed)) {
            fetchDogImage(breed);
        }
    });
});

