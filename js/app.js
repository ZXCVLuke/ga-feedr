

var Feedr = {
  responseMethod : function(response) {
      console.log(response);

      // response.new.forEach(function(result){
      //   $("#main").append("<article class='article'>"+"<section class='articleContent'>"+"<h3>"+result.title+"<h3>"+"</section>"+"</article>")
      // })



      response.new.forEach(function(result){
        var articleContents = { featuredImage: result.responsive_images[0].image,
                                articleLink: result.link,
                                articleTitle: result.title,
                                articleCategory: result.channel,
                                impressions: result.shares.total,
        };
        var compiledTemplate = template(articleContents);

        $("#main").append(compiledTemplate)
      })

  }
};

var source = $('#article-template').html();
var template = Handlebars.compile(source);

// ready DOM
$(function() {

  $.get('https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json', Feedr.responseMethod);

});
