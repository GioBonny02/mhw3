res_limit = 8;
const apiKey = 'AIzaSyARL7lYWaUWUbw0BXfho0X2Bk_9oFCUwvI'; // API key di YouTube
// key di vimeo
const secret_secret_vimeo = '1TPt4Q9y5h22hx1IjvKt/NDJb2R4yZba4XI/Zcr1SGYyfqjfv4MbEo37YzcSQwA6eV2LdFZmd5lgFpKZZY1HY3nwcMlKwZrHCOTZCYYj0OPFHu5JHAsveIyuUzMGvPRs';
const client_id_vimeo = '4619c225c3ee60c323ac8930d20db0aef5f0dd82';
const vimeo_endpoint = 'https://api.vimeo.com/oauth/authorize/client'; 
const vimeo_endpoint_search = `https://api.vimeo.com/videos?page=1&per_page=${res_limit}&query=`;
const st = {grant_type: "client_credentials", scope: "public"}
const bodytype = JSON.stringify(st); //converto st in elemento json
let token_data;


function onVimeoJson(json){
    console.log(json);

    const link = json.data[0].link;

    console.log(link);

    const res_ricerca = document.querySelector('#ris_ricerca');
    res_ricerca.innerHTML= '';   //cancelliamo il contenuto precedente
    
    for(let i=0; i<res_limit; i++){
        const link = json.data[i].link;
        const title = json.data[i].name;
        console.log(link);

        const elem = document.createElement('a'); // creo elemento link
        elem.href = link;
        elem.text = title;
        elem.classList.add('link');

        res_ricerca.appendChild(elem);    

    }
    window.scrollTo(0, document.body.scrollHeight); //scroll automatico a fine pagina per visualizzare i risultati
}

function onYTJson(json){
    
    const res_ricerca = document.querySelector('#ris_ricerca');
    res_ricerca.innerHTML= '';   //cancelliamo il contenuto precedente

    console.log(json);
    for(let i=0; i<res_limit; i++){
        const link = 'https://www.youtube.com/watch?v='+json.items[i].id.videoId;
        const title = json.items[i].snippet.title;
        console.log(link);

        const elem = document.createElement('a'); //creo elemento link
        elem.href = link;
        elem.text = title;
        elem.classList.add('link');

        res_ricerca.appendChild(elem);    

    }
    window.scrollTo(0, document.body.scrollHeight); //scroll automatico a fine pagina per visualizzare i risultati
}

function RicercaVimeo(query){
    const url_req = vimeo_endpoint_search + query; //ricerca dei contenuti su vimeo secondo la documentazione delle API
    fetch(url_req,
			{
			headers: 
			 {
			 'Authorization': 'Bearer ' + token_data
			 }}).then(onResponse).then(onVimeoJson);
}

function RicercaYT(query) {
    //ricerca su youtube dei contenuti seconda la documentazione delle API
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${res_limit}&q=${query}&key=${apiKey}`;
 
  fetch(url).then(onResponse).then(onYTJson);
}


function onTockenJSON(json){
    console.log(json);
    token_data = json.access_token; // estraggo il token ricevuto dal json
    console.log("tocken: ");
    console.log(token_data);
}

function onResponse(response){
    return response.json();
}

function search(event){

    event.preventDefault();

    const text_input = document.querySelector('#content');
    const text_value = encodeURIComponent(text_input.value); //estraggo il testo della ricerca

    console.log(text_value);

    const select_input = document.querySelector('#service');
    const select_value = encodeURIComponent(select_input.value); // estraggo il servizio di ricerca selezionato
    console.log(select_value);

    if(select_value === "yt")RicercaYT(text_value);
    else if(select_value === "vimeo")RicercaVimeo(text_value);


}

//fetch per la richiesta token 20OUTH di vimeo
fetch(vimeo_endpoint, {
	method: 'POST',
	body: bodytype,
	headers:
	{
    'Authorization': 'Basic ' + btoa(client_id_vimeo + ':' + secret_secret_vimeo),
	'Content-Type': 'application/json',
	'Accept': '	application/vnd.vimeo.*+json;version=3.4'
	}
	}).then(onResponse).then(onTockenJSON);

// query selector ed event listener per avviare la ricerca
const form = document.querySelector('form');
form.addEventListener('submit', search);