const info = {
    container: document.getElementById('container'),
    body: document.querySelector('body'),
    wtConditions: document.querySelector('.weather-conditions'),
    wtImg: document.querySelector('.weather-img'),
    city: document.querySelector('.city'),
    day: document.querySelector('.day'),
    climate: document.querySelector('.climate'),
    modal: document.querySelector('.modal-search'),
    modalClose: document.querySelector('.close-modal-search'),
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
        errorPosition(err.response.data.message);
    }
});

function getWeather(lon, lat){
    api.get(`weather?lat=${lat}&lon=${lon}&lang=${apiOptions.lang}&units=${apiOptions.units}&appid=${apiOptions.key}`).then((res)=>{
        
        if(!res.status == 200){
            alert('falha');
        } else {
            showWeather(res.data);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
              Toast.fire({
                icon: 'success',
                title: 'Sucesso ao obter localização!'
            })
        }

    }).catch((err)=>{
        errorPosition(err.response.data.message);
    });
}

/*researching the weather*/
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
        errorPosition(err.response.data.message);
    })
}

/*showing the weather*/
function showWeather(climate){

    let temp = climate.main.temp;
    info.climate.innerText = Math.round(temp);
    
    let city = climate.name;
    info.city.innerText = city;

    let description = climate.weather[0].description;
    info.wtConditions.innerText = description;

    let idImg = climate.weather[0].icon;
    info.wtImg.src = `../img/${idImg}.png`;

    let day = new Date();
    info.day.innerText= formatDate(day);

    let hours = day.getHours();
    console.log(hours);

    setBackground(idImg, hours);
}

/*changing the background, according to the time*/
const linearGradients = {
    bg01: "linear-gradient(to top, #F2F2F2 1%, #F2D4AE 70%, #77ABD9)",
    bg03: "linear-gradient(to top, #F2F2F2, #ACD1F2, #77ABD9)",
    bg04: "linear-gradient(to top, #9FB0BF, #466C8C, #263640)",
}
function setBackground(cod, codb){
    let background = "linear-gradient(to right, #ACD1F2, #F2F2F2)";
    switch (cod){
        case '01d' || '01n':
            background = linearGradients.bg01;
            break;
        case '03d' || '03n' || '02d' || '02n': 
            background = linearGradients.bg03;
            break;
        case '04d' || '04n': 
            background = linearGradients.bg04;
            info.body.style.setProperty('--color-mode','#fff');
            break;
    }

    info.container.style.backgroundImage = background;

    if(codb >= 18 || codb <= 6){
        document.body.style.backgroundColor = "#161616";
    }
}    

/*format date now*/
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
    info.modal.classList.toggle('is-active');
    info.modalClose.classList.toggle('is-active');
}

/*sweet alert*/
function errorPosition(err){
    return (
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Não foi possivel obter sua localização',
            footer: `${err}`
        })
    )
}



