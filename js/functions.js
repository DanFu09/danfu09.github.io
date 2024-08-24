function showEmail() {
  $("#email-link").html("danfu [at] cs [dot] stanford [dot] edu" );   
}

function toggleVis(news_id, link_id) {
  var e = document.getElementById(news_id)
  var link = document.getElementById(link_id)
  if (e.style.display == "none") {
    e.style.display = "block";
    link.innerHTML = "show less";
  } else {
    e.style.display = "none";
    link.innerHTML = "show more";
  }
}
