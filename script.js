var current_img;
var pagina_pedida = 1;
var busqueda = '';

function getImgURL(farm,server,id,secret,size){
    var url = 'https://farm'+farm+'.staticflickr.com/'+server+'/'+id+'_'+secret+'_'+size+'.jpg';
    return url;
}


function searchFlickr(){

    console.log(pagina_pedida);

    //Texto a buscar
    parametros.text = busqueda;

    //Página a la que vamos a buscar
    parametros.page = pagina_pedida;

    $.ajax({
            url: api_base_url+'flickr.photos.search',
            method: 'POST',
            data: parametros,
            //Si todo ok::
            success: function(result) {
                $('#response').empty();

                var pagina = result.photos.page;
                var total_paginas = result.photos.pages;
                var fotos = result.photos.photo;

                $('#response').append('<ul><h5>Resultados de: "'+busqueda+'" mostrando página '+pagina+' de '+total_paginas+'</h5><hr>');
                $.each(fotos, function(){
                    var url = getImgURL(this.farm,this.server,this.id,this.secret,'q');
                
                    $('#response').append('<li class="mosaico"><img class="img-f" src="'+url+'" onclick="flickr_photos_getInfo('+this.id+')"></li>');
                    //console.log(url);
                });
                $('#response').append('</ul>');
                $('#response').append('<hr><br><button type="button" id="btn-search-more" onclick="searchFlickr()">Mostrar más</button><span> ('+pagina+' de '+total_paginas+') páginas"</span>');

                pagina_pedida++;
            },
            //Si falla algo en el ajax::
            error: function(event) {
               console.error('Api error!!');
            }
    });

}

function flickr_photos_getInfo(id){
       
        $('#img-detail').removeClass('hidden');
        $('#img-detail-pic').empty();
       
        parametros.photo_id = id;
        
        //Ir al top de la pagina para ver los detalles
        $('html,body').animate({ scrollTop: 0 }, 'fast');
        
        $.ajax({
            url: api_base_url+'flickr.photos.getInfo',
            method: 'POST',
            data: parametros,
            //Si todo ok::
            success: function(data) {
                var url = getImgURL(data.photo.farm,data.photo.server,data.photo.id,data.photo.secret,'c');
                var miniatura = getImgURL(data.photo.farm,data.photo.server,data.photo.id,data.photo.secret,'s');
                var original_url = data.photo.urls.url._content;
                $('#img-detail-pic').append('<br><a href="'+original_url+'"><img src="'+url+'"></a>');
                $('#img-prop-title').text(data.photo.title._content);
                $('#img-prop-desc').text(data.photo.description._content);
                $('#img-prop-taken').text(data.photo.dates.taken);

                $('#img-save').attr('onclick','addToList("'+data.photo.id+'","'+miniatura+'")');

                //Mostrar set, pools y groups a los que pertenece la imagen
                flickr_photos_getAllContexts(data.photo.id);
                flickr_photos_getListForPhoto(data.photo.id);
            },
            //Si falla algo en el ajax::
            error: function(event) {
               console.error('Api error!!');
            }
    });
}

function flickr_photos_getAllContexts(id){
    parametros.photo_id = id;
        
    $.ajax({
        url: api_base_url+'flickr.photos.getAllContexts',
        method: 'POST',
        data: parametros,
        //Si todo ok::
        success: function(data) {
            console.log(data);

            //Si existe el set lo muestro y luego con pool igual...
            if (typeof data.set !== 'undefined') {
                $('#img-prop-albuns').empty();
                $('#img-prop-albuns').append('<ul>');
                $.each(data.set, function (k) {
                    //console.log(this);
                    $('#img-prop-albuns').append('<li>'+this.title+'</li>');
                });
                $('#img-prop-albuns').append('</ul>');
            }

            if (typeof data.pool !== 'undefined') {
                $('#img-prop-pools').empty();
                $('#img-prop-pools').append('<ul>');
                $.each(data.pool, function (k) {
                    var pool_url = 'https://www.flickr.com/'+this.url;
                    $('#img-prop-pools').append('<li><a href="'+pool_url+'">'+this.title+'</a> <button type="button" class="btn btn-success btn-xs" onclick="saveForLater("'+this.title+'","'+pool_url+'")">Guardar para luego</button></li>');
                });
                $('#img-prop-albuns').append('</ul>');
            }



        },
        //Si falla algo en el ajax::
        error: function(event) {
            console.error('Api error!!');
        }
    });
}

function flickr_photos_getListForPhoto(id){
 
}

function saveForLater(title,url){
    $('#list-saved-photos').append('<li style="margin-top:10px"><a href="'+url+'">'+title+'</a></li>');
}


function addToList(id,url){
    $('#list-saved-photos').append('<li style="margin-top:10px"><img class="mosaico" src="'+url+'" onclick="flickr_photos_getInfo('+id+')"></li>');
}

$(document).ready(function() {

    //Buscar automáticamente al pulsar enter
    $("#in-search").on('keyup', function(e){
        if(e.keyCode == 13){
            $("#btn-search").click();
        }
    });

    $("#btn-search").on("click", function (e) {   
        var search_text = $('#in-search').val();    
        if (search_text!="") {
            busqueda = search_text;
            searchFlickr(); 
        }
    });

    $("#btn-search-more").on('click', function (e) { 
        e.preventDefault();
        var search_text = $('#in-search').val();    
        if (search_text!="") {
            //Incrementamos en uno para pedir la siguiente página
            pagina_pedida++;
            
            busqueda = search_text;
            searchFlickr(); 
        }
    });


    $("#img-close").on("click", function (e) {   
        $('#img-detail').addClass('hidden');
    });


    
});



