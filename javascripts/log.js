$( document ).ready(function() {
  idStr = (str) => {
    return str.replace(/(\s|:|,)/g,"-");
  }

  style="background-image: ;"
  mediaEl = "<media style=\""+style+"\"></media>"
  $("#header-image-container").css("background-image", "url('../media/bg2.jpeg')");
  $nav = $("nav ul")
  $.map($(".entry"), (el)=>{
    $el = $(el);
    title = $el.data("timestamp") + " - " + $el.data("title")
    id = idStr($el.data("timestamp"))
    console.log(id);
    $el.attr("id", id);
    $($el.find(".date")).text(title);
    $nav.append(
      "<li><a href=\"#"+id+"\">"+title+"</a></la>"
    );
    // debugger
  });
  $.map($(".inline-image"), (el)=>{
    $el = $(el);
    src = $el.data("img").replace("www.dropbox.com", "dl.dropboxusercontent.com");
    $img = $($el.find("img"));
    $img.attr("src", src);
    $img.removeClass("placeholder");
  });
});
