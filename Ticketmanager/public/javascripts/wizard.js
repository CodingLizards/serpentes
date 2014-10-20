(function ($) {
    $.fn.wizard = function () {
        $pages = $('.pure-wizard-page')
        $wizard = this
        $wizard.find('.pure-button-wizard-prev').click(function () {
            $page = $(this).closest('.pure-wizard-page')
            $page.prev().css('display', 'block')
            $page.css('display', 'none')
        })
        $wizard.find('.pure-button-wizard-next').click(function () {
            $page = $(this).closest('.pure-wizard-page')
            requiredfilled = true
            $page.find('*[required]').each(function () {
                if (!$(this).val()) {
                    requiredfilled &= false
                    $(this).parent().removeClass('pure-validation-success')
                    $(this).parent().addClass('pure-validation-error')
                } else {
                    requiredfilled &= true
                    $(this).parent().removeClass('pure-validation-error')
                    $(this).parent().addClass('pure-validation-success')
                }
            })
            if (requiredfilled) {
                $page.next().css('display', 'block')
                $page.css('display', 'none')
            }
        })
        $pages.not(':first-child').css('display', 'none')
        return this
    }
}(jQuery))