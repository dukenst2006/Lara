import * as $ from "jquery"

$(() => {
    $('#createAndPublishBtn').click(
        function () {
            $('input[name=evntIsPublished]').val('1');
            $('#button-create-submit').click();
        }
    );

    $('#createUnpublishedBtn').change(
        function () {
            $('input[name=evntIsPublished]').val('0');
            $('#button-create-submit').click();
        }
    );

    var hideCreateAndPublishBtn = function () {
        var publishBtn = $('#createAndPublishBtn');
        var isPrivateInput = $('[name=isPrivate]');
        if (isPrivateInput.is(':checked')) {
            publishBtn.removeClass('hidden');
        } else {
            publishBtn.addClass("hidden");
            $('[name=evntIsPublished]').prop("checked", false);
        }
    };
    $('[name=isPrivate]').click(hideCreateAndPublishBtn);
    $(window).on('load', hideCreateAndPublishBtn);
});
