function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    $greeting.text('So you want to live at ' + address + '?');
    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address;
    var imageTagStr = '<img class="bgimg" src="' + streetViewUrl + '&key=AIzaSyA7cL9sjDSPSsYY_ZT5up60gY2XufCi5D4">';
    $body.append(imageTagStr)

    // get nyt articles
    var nytArticlesUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${cityStr}&sort=newest&api-key=TXvreQcfqL4twxclqQ9Gv70IVTTkz9dS`
    $.getJSON(nytArticlesUrl, function (data) {
        let articles = data['response']['docs'];
        for (let i = 0; i < articles.length; i++) {
            let article = articles[i]
            $nytElem.append(`<li class="article">
                                <a href="${article['web_url']}">${article['headline']['main']}</a>
                                <p>${article['lead_paragraph']}</p>
                             </li>`)
        }
    }).fail(function () {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded')
    });

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('failed to get wikipedia resources')
    }, 8000);

    $.ajax({
        url: 'https://en.wikipediaasdfasdfasdfasdfasdf.org/w/api.php?',
        type: 'GET',
        dataType: 'jsonp',
        data: {
            action: 'opensearch',
            format: 'json',
            search: cityStr,
        },
        success: function (data) {
            articleTitles = data[1]
            aticleLinks = data[3]
            for (let i = 0; i < articleTitles.length; i++){
                $wikiElem.append(`<li><a href=${aticleLinks[i]}>${articleTitles[i]}</a></li>`)
                console.log(articleTitles[i]);
                console.log(aticleLinks[i]);
            };
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);

// google maps api_key='AIzaSyA7cL9sjDSPSsYY_ZT5up60gY2XufCi5D4'
// nyt api_key='TXvreQcfqL4twxclqQ9Gv70IVTTkz9dS'