
//Open up Chrome dev tool select the 'Sources' tab → copy and pase the following code into a Chrome snippet, then select Ctrl + Enter to run

const setWeatherData = async function (nestedDiv) {

    //utilise 'place postal address' to retrieve relevant information for getting weather info from API
    const locationPostalCode = document.querySelector("p[data-testid='place-postal-address']").innerText.split(",");
    //format the post code into a string appropriate for API call
    const formattedPostalCode = locationPostalCode[locationPostalCode.length - 1].trim().replace(" ", '+');

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    //Consuming API to retrieve 5 day forecast for relevant location
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${formattedPostalCode},GB&units=metric&appid={OPEN WEATHER API KEY HERE}`);
        const data = await response.json();

        let previousDate = 0;

        const { list } = data;

        //format weather forecast data-block to be displayed in weather dropdown in the 'Visitor information' section.
        const weatherForecasts = list.map(function (forecast, index) {

            const foreacstDate = new Date(forecast.dt * 1000);

            const currentDate = foreacstDate.getDate();

            if (currentDate !== previousDate) {
                previousDate = currentDate;
                return `
                <div id="${index}" class="forecastMainContainer">
                    <div class="forecastTitleContainer">
                        <h4>${days[foreacstDate.getDay()]} </h4> 
                        <p class="forcastDate"> - ${foreacstDate.getDate()} ${months[foreacstDate.getMonth()]}</p>
                    </div>
                    <div class="forecastInfoContainers">
                        <img
                            src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"
                            alt="img"
                            class="forecastImage"
                        >
                        </img>
                        <span class="forecastMaxTemp"><strong>${Number(forecast.main.temp_max).toFixed(1)}º</strong></span>
                        <p class="forecastMinTemp">${Number(forecast.main.temp_min).toFixed(1)}º</p>
                        <p class="forecastDescription">${forecast.weather[0].description}</p>
                    </div>
                </div>
                `;
            }
        })
        nestedDiv.innerHTML = weatherForecasts.join('');

        //mutate and alter CSS for forecast data-blocks
        const forecastContainers = document.getElementsByClassName("forecastMainContainer");
        for (let forecastContainer of forecastContainers) {
            forecastContainer.style.cssText = `
            display: flex;
            flex: 1 0 auto;
            flex-direction: column;
            padding: 8px;
            border-right: 1px solid rgb(201,201,201);
            width: 211px;
            `;
        }

        const forecastTitleContainer = document.getElementsByClassName("forecastTitleContainer");
        for (let titleContainer of forecastTitleContainer) {
            titleContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: baseline;
            `;
        }

        const forecastImages = document.getElementsByClassName("forecastImage");
        for (let forecastImage of forecastImages) {
            forecastImage.style.cssText = `
            background-color: rgb(159, 159, 159);
            border-radius: 50px;
            margin: 16px;
            height: 70px;
            width: 70px
            `;
        }

        const forecastInfoContainers = document.getElementsByClassName("forecastInfoContainers");
        for (let forecastInfoContainer of forecastInfoContainers) {
            forecastInfoContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            `;
        }

        const forecastMaxTemps = document.getElementsByClassName("forecastMaxTemp");
        for (let forecastMaxTemp of forecastMaxTemps) {
            forecastMaxTemp.style.cssText = `
            margin-bottom: 8px;
            `;
        }

        const forecastMinTemps = document.getElementsByClassName("forecastMinTemp");
        for (let forecastMinTemp of forecastMinTemps) {
            forecastMinTemp.style.cssText = `
            margin-bottom: 4px;
            `;
        }

        const forecastDescriptions = document.getElementsByClassName("forecastDescription");
        for (let forecastDescription of forecastDescriptions) {
            forecastDescription.style.cssText = `
            margin: 0px;
            `;
        }

        const forcastDates = document.getElementsByClassName("forcastDate");
        for (let forcastDate of forcastDates) {
            forcastDate.style.cssText = `
            color: rgb(167, 167, 167);
            `;
        }

        document.getElementById("36").style.border = "none";

    } catch (error) {

        console.log(error);
    }
}

const renderWeatherTab = function () {

    //clones 'Openint times' dropdown to create the weather dropdown
    const weatherTab = document.querySelector("#place-opening-times").cloneNode(true);
    weatherTab.setAttribute('id', 'location-weather');
    weatherTab.setAttribute('data-testid', 'visitor-info-accordion--item-location-weather');

    //on selecting the 'Weather' dropdown open and close the weather dropdown
    const nestedButton = weatherTab.querySelector("#accordion-item-heading--place-opening-times");

    weatherTab.querySelector("span").textContent = 'Weather';

    const nestedDiv = weatherTab.querySelector("#accordion-item-body--place-opening-times");

    const weatherChevron = weatherTab.querySelector("div > span");

    nestedButton.addEventListener("click", function () {

        nestedDiv.style.cssText = nestedDiv.style.visibility === 'hidden' ? "--calc-height: 250px; visibility: visible;" : "--calc-height: 0px; visibility: hidden;"
        nestedDiv.style.display = "flex";
        nestedDiv.style.overflow = "auto";
        nestedDiv.style.margin = "4px";
        nestedDiv.style.overflowY = "hidden";

        //flip chevron
        weatherChevron.style.transform = nestedDiv.style.visibility === 'hidden' ? "rotate(0deg)" : "rotate(180deg)"

    });

    //clear inner contents from clone of 'Opening times dropdown'
    nestedDiv.innerHTML = ''

    //populate the weather dropdown with API weather info
    setWeatherData(nestedDiv);

    //insert weather dopdown just after 'Opening times' dropdown
    document.getElementById("place-opening-times").insertAdjacentElement("afterend", weatherTab);
}

const init = async function () {

    //stops duplication, adds weather dropdown into 'Visitor information'.
    if (!document.getElementById("location-weather"))
        renderWeatherTab();
};

init();