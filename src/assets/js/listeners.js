$('.show_more').on("click", function() {
    $(this).find(".pop-up").slideToggle()
})

$('header button, .hide-content').on("click", function() {
    $("nav").fadeToggle()
    $(".hide-content").fadeToggle()
})