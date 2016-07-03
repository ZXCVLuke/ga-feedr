
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
    ajaxStart: function() { $("#popUp").removeClass("hidden"); },
     ajaxStop: function() {
       $("#popUp").addClass("hidden");
       // Sorts articles chronologically
       $(".article").sort(function(a,b){
         return new Date($(a).attr("data-date")) > new Date($(b).attr("data-date"));
       }).each(function(){
         $("#main").prepend(this);
       })
     }
   });

  // get json feed from Mashable. heroku proxy required for CORS issue. Jquery proxy required to reset context from window to Feedr.
  $.get('https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json', $.proxy(Feedr.responseMashable, Feedr));
  $.get('https://www.reddit.com/top.json', $.proxy(Feedr.responseReddit, Feedr));




});
