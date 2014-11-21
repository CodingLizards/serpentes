$(function () {
    $('.pure-menu-page').not('.pure-menu-selected').css('display', 'none')
    $('a[data-toggle=tabs]').click(function () {
        var $this = $(this)
        var $old = $('.pure-menu-selected')
        $old.removeClass('pure-menu-selected')
        $($old.find('a').attr('href')).css('display', 'none')
        
        $this.parent().addClass('pure-menu-selected')
        $($this.attr('href')).addClass('pure-menu-selected').css('display', 'block')
    })
    if (window.location.hash) {
        var $old = $('.pure-menu-selected')
        $old.removeClass('pure-menu-selected')
        $($old.find('a').attr('href')).css('display', 'none')

        var $item = $('a[href=' + window.location.hash + ']')
        $item.parent().addClass('pure-menu-selected')
        $($item.attr('href')).addClass('pure-menu-selected').css('display', 'block')
    }
})