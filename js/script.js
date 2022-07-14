const info = {
    wtConditions: document.querySelector('.weather-conditions'),
    wtImg: document.querySelector('.weather-img'),
    city: document.querySelector('.city'),
    day: document.querySelector('.day'),
    climate: document.querySelector('.climate'),
    modal: document.querySelector('.modal-search'),
    inputSearch: document.getElementById('input-search')
}

const api = axios.create({
    baseURL: "https://api.openweathermap.org/data/2.5/"
});

const apiOptions = {
    key: "3d0b9945013b810f8c78a0d6e5a6e03f",
    lang: "pt_br",
    units: "metric"
}

window.addEventListener('load', ()=>{
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(getPosition, errorPosition);
    } else {
        alert('navegador não compativel com geolocalização');
    }

    function getPosition(pos){
        console.log(pos);
        let lon = pos.coords.longitude;
        let lat = pos.coords.latitude;

        getWeather(lon, lat);
    }

    function errorPosition(err){
        alert(err);
    }
});

function getWeather(lon, lat){
    api.get(`weather?lat=${lat}&lon=${lon}&lang=${apiOptions.lang}&units=${apiOptions.units}&appid=${apiOptions.key}`).then((res)=>{
        
        if(!res.status == 200){
            alert('falha');
        } else {
            showWeather(res.data);
        }

    }).catch((err)=>{
        console.log(err);
    });
}

info.inputSearch.addEventListener('keypress', (event)=>{
    if(event.key == "Enter"){
        searchCityClimate();
    } else {
        return;
    }
});
function searchCityClimate(){
    let input = info.inputSearch.value;

    api.get(`weather?q=${input}&lang=${apiOptions.lang}&units=${apiOptions.units}&appid=${apiOptions.key}`).then((res)=>{
        if(!res.status == 200){
            alert('falha');
        } else {
            showModal();
            showWeather(res.data);
            info.inputSearch.value = "";
        }
    }).catch((err)=>{
        console.log(err);
    })
}

function showWeather(climate){
    console.log(climate)
    let icon = climate.weather[0].icon;
    
    let temp = climate.main.temp;
    info.climate.innerText = Math.round(temp);
    
    let city = climate.name;
    info.city.innerText = city;

    let description = climate.weather[0].description;
    info.wtConditions.innerText = description;

    let idImg = climate.weather[0].icon;
    info.wtImg.src = `../img/${idImg}.png`;

    let d = new Date();
    info.day.innerText= formatDate(d);

}

function formatDate(date){
    let dayAr = ["Domingo","Segunda", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sabado"];
    let monthAr = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto"];

    let d = date.getDay();
    let day = dayAr[date.getDay()];
    let month = monthAr[date.getMonth()];
    let year = date.getFullYear();

    return `${day}, ${d} ${month} de ${year}`;

}

function showModal(){
    let modal = info.modal.classList.contains('is-active');
    if(modal == true){
        info.modal.classList.remove('is-active');
    } else {
        info.modal.classList.add('is-active');
    }
}
