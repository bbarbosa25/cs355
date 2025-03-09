function loadHits(pageID) {
    fetch(`/hits/${pageID}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("hitCount").innerText = 
                `The '${data.page}' page has been visited ${data.hits} times.`;
        })
        .catch(error => {
            document.getElementById("hitCount").innerText = "Error fetching hit count.";
        });
}
