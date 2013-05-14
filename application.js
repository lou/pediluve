// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

google.load('search', '1');

(function($){
  
  jQuery.extend({
    random: function(MinV, MaxV) {
      return MinV + Math.floor((MaxV - MinV + 1) * (Math.random() % 1));
    }
  });
  
  $(function(){
    
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var googleSearch;
    var googlePage = 1;
    var flickrPage = 1;
    var videoSearch;

    function setImgPosition(imgWidth, imgHeight){
      var pos = { x : 0, y : 0 }
      pos.x = $.random(-imgWidth/3, windowWidth-(imgWidth/3));
      pos.y = $.random(-imgHeight/3, windowHeight-(imgHeight/3));
      return(pos);
    }
    
    function setVideoPosition(videoWidth, videoHeight){
      var pos = { x : 0, y : 0 }
      pos.x = Math.floor($.random(-videoWidth/20, windowWidth-(videoWidth/20)));
      pos.y = Math.floor($.random(-videoHeight/20, windowHeight-(videoHeight/20)));
      return pos;
    }
    
    function setImg(url, width, height, provider){
      var pos = setImgPosition(width, height);
      var thumb = $('<img src="'+url+'?+'+Math.random()*Math.random()+'"\
                          class="search '+provider+'"\
                          style=" left:'+pos.x+'px;\
                                  width:'+width+'px;\
                                  height:'+height+'px;\
                                  top:'+pos.y+'px;\
                                  z-index:'+$.random(0, 200)+';\
                                  max-height: '+windowHeight+'px;\
                                  max-width: '+windowWidth+'px;\
                                  opacity: 0.'+$.random(2, 6)+'" />');
      $('#container').append(thumb);
      thumb.load(function(){
        $(this).fadeIn(10000, function(){
          $(this).fadeOut(30000, function(){
            $(this).remove();
          })
        });
      });
    }
      
    
    function searchVideoComplete() {
      if (videoSearch.results && videoSearch.results.length > 0) {
        for(var cpt = 0; cpt < $.random(5, videoSearch.results.length) ; cpt++){
          if (videoSearch.results[cpt]){
            var videoWidth = $.random(300, 800);
            var videoHeight = $.random(300, 800);
            var pos = setVideoPosition(videoWidth, videoHeight);
            var wrapper = $('<div></div>', {
              id: 'video-wrapper-'+cpt,
              style: 'position:absolute;top:'+pos.y+'px;left:'+pos.x+'px;height:'+videoHeight+'px;width:'+videoWidth+'px',
            });
            var container = $('<div></div>', {
              id: 'video-'+cpt,
            })
            wrapper.append(container)
            $('#container').append(wrapper);
            var player = jwplayer('video-'+cpt).setup({
              file: videoSearch.results[cpt].url,
              height: videoHeight,
              width: videoWidth
            });
            $(player.container).css({ top: pos.y });
            player.play(true);
          }
        }
      }
    }
    
    function searchWithGoogleVideo(query){
       videoSearch = new google.search.VideoSearch();
       videoSearch.setSearchCompleteCallback(this, searchVideoComplete, null);
       videoSearch.setResultSetSize(10);
       videoSearch.execute(query);
       videoSearch.clearResults();
    }
    
    function googleSearchComplete(){
      if (googleSearch.results && googleSearch.results.length > 0) {
        for(var cpt = 0; cpt < googleSearch.results.length ; cpt++){
          setImg(googleSearch.results[cpt].url, googleSearch.results[cpt].width, googleSearch.results[cpt].height, 'google');
        }
        googleSearch.gotoPage(googlePage++);
      }
    }
    
    function searchWithGoogle(query){
      googleSearch = new google.search.ImageSearch();
      googleSearch.setSearchCompleteCallback(this, googleSearchComplete, null);
      googleSearch.setRestriction(
        google.search.ImageSearch.RESTRICT_FILETYPE,
        google.search.ImageSearch.FILETYPE_JPG
      );
      googleSearch.setRestriction(
        google.search.Search.RESTRICT_SAFESEARCH,
        google.search.Search.SAFESEARCH_OFF
      );
      googleSearch.setResultSetSize(1);
      googleSearch.execute(query);
      googleSearch.clearResults();
      googlePage = 1;
    }
    
    function searchWithFlickr(query){
      
      $.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.search&\
                                                      api_key=964fa682dfed2991931b089cd8c305a8&\
                                                      text='+query+'&\
                                                      format=json&\
                                                      extras=url_m,m_dims&\
                                                      safe_search=3&\
                                                      content_type=1&\
                                                      per_page=2&\
                                                      page='+flickrPage+'&\
                                                      jsoncallback=?',
        function(data){
          for(var cpt = 0; cpt < data.photos.photo.length; cpt++){
            var photo = data.photos.photo[cpt];
            setImg(photo.url_m, photo.width_m, photo.height_m, 'flickr');
          }
          if (flickrPage < 1000){
            flickrPage++;
            searchWithFlickr(query);
          }
        }
      )
    }
    
    
    function search(query){
      query = query.replace('+', ' ');
      $('#search_query').val(query);
      searchWithFlickr(query);
      searchWithGoogleVideo(query);
      // searchWithGoogle(query);
    }
    
    
    $('form').css('margin-top', windowHeight/2-50+'px')
    $('form').fadeIn('slow');
    $('#search_query').focus();

    $.each(window.location.search.split('&'), function(idx, elem){
      var str = elem.replace('?', '').split('=');
      var key = str[0];
      var value = str[1];
      if( key == 'search' && value != ''){
        search(value);
      }
    });
    
    $('html').click(function(e){
      if($(e.target).attr('id') != 'search_query'){
        alert("Galdric Fleury\nAntoine Fontaine\nLouis Cuny\n\ncontact@fleuryfontaine.fr");
      }   
    });
    
    
  })
})(jQuery)

