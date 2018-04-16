/*CREDENCIALES API KEY DE FLICKR*/

    var api_key = 'e91f2432c15ca5dd21a401b5d3b4247c';
    //var api_secret = '770aa68ef1c54ca2';

/* API CONFIG*/
    var api_base_url = 'https://api.flickr.com/services/rest/?method=';
    var response_format = 'json';

    /* CONFIGURO LOS PARAMETROS COMUNES PARA TODAS LAS LLAMADAS A LA API*/
    var parametros = {
            api_key : api_key,
            format: response_format,
            nojsoncallback : 1  //NECESARIO PARA QUE NO TE DEVUELVA UNA FUNCION EN EL CALLBACK DE JSON
    }






    