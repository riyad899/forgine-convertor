const dropList = document.querySelectorAll("form select"),
    fromCurrency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button");

// Populate the dropdowns with currency options
for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_list) {
        let selected = i == 0 ? (currency_code == "USD" ? "selected" : "") : (currency_code == "AFN" ? "selected" : "");
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
        getExchangeRate(); // Update exchange rate on currency change
    });
}

// Load the flag for the selected currency
function loadFlag(element) {
    let imgTag = element.parentElement.querySelector("img");
    if (!imgTag) return; // Check if image element exists

    for (let code in country_list) {
        if (code == element.value) {
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

// Get exchange rates on window load
window.addEventListener("load", () => {
    getExchangeRate();
});

// Handle button click to fetch the exchange rate
getButton.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

// Swap the selected currencies when clicking the exchange icon
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;

    // Load flags and update exchange rates after swapping
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// Fetch the exchange rate and update the result text
function getExchangeRate() {
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;

    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRateTxt.innerText = "Getting exchange rate...";

    let url = `https://v6.exchangerate-api.com/v6/78ae14d7ce5450780bd6fd3d/latest/${fromCurrency.value}`;

    // Fetch the exchange rate from the API
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    }).catch(() => {
        exchangeRateTxt.innerText = "Something went wrong";
    });
}
