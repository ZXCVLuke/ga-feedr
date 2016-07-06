
// Set up app object
var Feedr = {
  // Mashable Object
  Mashable: {
    // create array to fill with articles
    articles: []
  },
  // Reddit Object
  Reddit: {
    // create array to fill with articles
    articles: []
  },
  // Digg Object
  Digg: {
    // create array to fill with articles
    articles: []
  },

  // Converts date/time to ISO
  convertDate : function (dateTime) {
    var x = new Date(dateTime);
    var d = x.toISOString();
    return d;
  },

  // create a function to handle the json response
  responseMashable : function(response) {
      // cponsole log json response
      console.log(response);
      // something to do with closures... apparently the Feedr object isn't available inside the forEach function without the variable being defined here.
      var self = this;

      response.new.forEach(function(result){

        // push an object with all required article details for each article
        self.Mashable.articles.push({
          featuredImage: result.responsive_images[0].image,
          articleLink: result.link,
          articleTitle: result.title,
          articleCategory: result.channel,
          impressions: result.shares.total,
          description: result.content.plain,
          dateTime: Feedr.convertDate(result.post_date)
        });

        // populate tamplate with article content
        var articleContents = { sourceName: "mashable",
                                dateTime: Feedr.convertDate(result.post_date),
                                featuredImage: result.responsive_images[0].image,
                                articleLink: result.link,
                                articleTitle: result.title,
                                articleCategory: result.channel,
                                impressions: result.shares.total
        };

        // complile and append template
        var compiledTemplate = articleTemplate(articleContents);
        $("#main").append(compiledTemplate)

      })
  },

  // create a function to handle the json response
  responseReddit : function(response) {
      // cponsole log json response
      console.log(response);
      // something to do with closures... apparently the Feedr object isn't available inside the forEach function without the variable being defined here.
      var self = this;

      response.data.children.forEach(function(result){

        // push an object with all required article details for each article
        self.Reddit.articles.push({
          featuredImage: result.data.thumbnail,
          articleLink: "www.reddit.com" + result.data.permalink,
          articleTitle: result.data.title,
          articleCategory: result.data.subreddit,
          impressions: result.data.ups,
          // description: result.
          // multiply by 1000 to adjust to milliseconds
          dateTime: Feedr.convertDate(result.data.created_utc * 1000)
        });

        // populate tamplate with article content
        var articleContents = { sourceName: "reddit",
                                dateTime: Feedr.convertDate(result.data.created_utc * 1000),
                                featuredImage: result.data.thumbnail,
                                articleLink: "www.reddit.com" + result.data.permalink,
                                articleTitle: result.data.title,
                                articleCategory: result.data.subreddit,
                                impressions: result.data.ups
        };

        // complile and append template
        var compiledTemplate = articleTemplate(articleContents);
        $("#main").append(compiledTemplate)

      })
  },

  // create a function to handle the json response
  responseDigg : function(response) {
      // cponsole log json response
      console.log(response);
      // something to do with closures... apparently the Feedr object isn't available inside the forEach function without the variable being defined here.
      var self = this;

      response.data.feed.forEach(function(result){

        // push an object with all required article details for each article
        self.Digg.articles.push({
          featuredImage: result.content.media.images[0].url,
          articleLink: result.content.url,
          articleTitle: result.content.title,
          articleCategory: result.content.tags[0].display,
          impressions: result.digg_score,
          // description: result.
          // multiply by 1000 to adjust to milliseconds
          dateTime: Feedr.convertDate(result.date_published * 1000)
        });

        // populate tamplate with article content
        var articleContents = { sourceName: "digg",
                                dateTime: Feedr.convertDate(result.date_published * 1000),
                                featuredImage: result.content.media.images[0].url,
                                articleLink: result.content.url,
                                articleTitle: result.content.title,
                                articleCategory: result.content.tags[0].display,
                                impressions: result.digg_score
        };

        // complile and append template
        var compiledTemplate = articleTemplate(articleContents);
        $("#main").append(compiledTemplate)

      })
  },

  filterArticles : function(source) {
    $('#' + source).on("click", function(){
      $('.article').not('.' + source).hide();
      $('.' + source).show();
      $('#current-source').html(source);
    })
  },

  showAllArticles : function() {
    $('#feedr').on('click', function(){
      $('.article').show();
      $('#current-source').html('All');
    })
  },

  // Replaces Reddits missing images
  swapDudImages : function() {
    var r = "../images/redditlogo.png";
    $('img[src=""]').attr("src", r);
    $('img[src="default"]').attr("src", r);
    $('img[src="self"]').attr("src", r);
    $('img[src="nsfw"]').attr("src", r);
  }

};


// Set up Handlebars templates
var template1 = $('#article-template').html();
var articleTemplate = Handlebars.compile(template1);

var template2 = $('#link-template').html();
var linkTemplate = Handlebars.compile(template2);

// ready DOM
$(function() {

  // Whenever an ajax call is made, while it is being made this will fire the loader animation.
  $(document).on({

    ajaxStart: function() {
       // Displays popUp while ajax is loading
       $("#popUp").removeClass("hidden");
       $(".closePopUp").hide();
    },

     ajaxStop: function() {
       // Hides popUp once ajax has loaded
       $("#popUp").addClass("hidden");
       $(".closePopUp").show();
       // Sorts articles chronologically
       $(".article").sort(function(a,b){
         // Fixed this by swapping > for -. Not sure why this worked?
         return new Date($(a).attr("data-date")) - new Date($(b).attr("data-date"));
       }).each(function(){
         $("#main").prepend(this);
       })

       Feedr.swapDudImages();

       // Set up article filters
       Feedr.filterArticles("mashable");
       Feedr.filterArticles("reddit");
       Feedr.filterArticles("digg");
       Feedr.showAllArticles();

     }
   });

  // get json feeds from Mashable, Reddit and Digg. heroku proxy required for CORS issue. Jquery proxy required to reset context from window to Feedr.
  $.get('https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json', $.proxy(Feedr.responseMashable, Feedr))
      .done(function(){ console.log( "loaded Mashable"); })
      .fail(function() { alert( "error, failed to load Mashable" ); });
  $.get('https://www.reddit.com/top.json', $.proxy(Feedr.responseReddit, Feedr))
      .done(function(){ console.log( "loaded Reddit"); })
      .fail(function() { alert( "error, failed to load Reddit" ); });
  $.get('https://accesscontrolalloworiginall.herokuapp.com/http://digg.com/api/news/popular.json', $.proxy(Feedr.responseDigg, Feedr))
      .done(function(){ console.log( "loaded Digg"); })
      .fail(function() { alert( "error, failed to load Digg" ); });

});
