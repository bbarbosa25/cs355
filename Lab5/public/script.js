document.addEventListener("DOMContentLoaded", () => {
    const searchField = document.getElementById("searchField");
    const insertField = document.getElementById("insertField");
    const searchBtn = document.getElementById("searchBtn");
    const insertBtn = document.getElementById("insertBtn");
    const resultDiv = document.getElementById("results");

    if (!searchField || !insertField || !searchBtn || !insertBtn || !resultDiv) {
        console.error("❌ One or more elements are missing in index.html.");
        return;
    }

    insertBtn.addEventListener("click", () => {
        fetch("/insert?doc=" + encodeURIComponent(insertField.value))
            .then(r => r.text())
            .then(txt => { resultDiv.innerText = txt; })
            .catch(err => { resultDiv.innerText = "Error inserting document: " + err.message; });
    });

    searchBtn.addEventListener("click", () => {
        fetch("/search?find=" + encodeURIComponent(searchField.value))
            .then(r => r.text())
            .then(txt => { resultDiv.innerText = txt; })
            .catch(err => { resultDiv.innerText = "Error searching database: " + err.message; });
    });
});
