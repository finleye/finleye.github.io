$( document ).ready(function() {
  style="background-image: ;"
  mediaEl = "<media style=\""+style+"\"></media>"
  $("#header-image-container").css("background-image", "url('../media/bg2.jpeg')");
  $.map($(".inline-image"), (el)=>{
    $el = $(el);
    console.log($el.data("img"));
    $el.append(
      "<img src=\"../"+$el.data("img")+"\"/ width=\"100%\">"
    );
  });
});
