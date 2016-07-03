
// Set up app object
var Feedr = {
  // Include objects for each news source
  Mashable: {
    // create array to fill with articles
    articles: []
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
          description: result.content.plain
        });

        // populate tamplate with article content
        var articleContents = { featuredImage: result.responsive_images[0].image,
                                articleLink: result.link,
                                articleTitle: result.title,
                                articleCategory: result.channel,
                                impressions: result.shares.total
        };

        // complile and append template
        var compiledTemplate = articleTemplate(articleContents);
        $("#main").append(compiledTemplate)

      })

      // click function to test availability of data stored on articles array
      $("#feedr").on("click", function() {
        console.log(Feedr.Mashable.articles[0].description);
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

  $(document).on({
    ajaxStart: function() { $("#popUp").removeClass("hidden"); },
     ajaxStop: function() { $("#popUp").addClass("hidden"); }
   });

  // get json feed from Mashable. heroku proxy required for CORS issue. Jquery proxy required to reset context from window to Feedr.
  $.get('https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json', $.proxy(Feedr.responseMashable, Feedr));

});
