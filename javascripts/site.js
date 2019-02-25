$( document ).ready(function() {
  idStr = (str) => {
    return str.replace(/(\s|:|,)/g,"-");
  }

  style="background-image: ;"
  mediaEl = "<media style=\""+style+"\"></media>"
  headerImg = "https://dl.dropboxusercontent.com/s/smvrj557qz7sy8w/bg2.jpeg?dl=0"
  $("#header-image-container").css("background-image", `url('${headerImg}')`);
  $nav = $("nav ul")
  $.map($(".entry"), (el)=>{
    $el = $(el);
    timestamp = $($el.find(".timestamp")).text()
    place = $($el.find(".place")).text()

    id = idStr(timestamp)

    title = timestamp + " - " + place
    $el.attr("id", id);
    $nav.append(
      "<li><a href=\"#"+id+"\">"+title+"</a></la>"
    );
  });

  $.map($(".inline-image"), (el)=>{
    $el = $(el);

    src = $el.data("img").replace("www.dropbox.com", "dl.dropboxusercontent.com");

    $link = $($el.find("a"))
    if($link.length > 0){
      $link.attr("href", src.replace("-opt",""))
    };

    $img = $($el.find("img"));
    $img.attr("src", src);
  });

  $( () => {
    $('img').one('load',(event) => {
      $(event.target).removeClass("placeholder")
    });
});
});
