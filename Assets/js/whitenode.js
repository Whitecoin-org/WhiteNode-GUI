$(document).ready(function(){

    /*$.notify({
        icon: 'ti-pulse',
        message: "New block detected <b>307076</b> - Updating dashboard."

    },{
        type: 'success',
        timer: 3000
    });*/

    setInterval(function(){

        var $data = {
            action:  'updatesync'
        };

        var $success = function ($json)
        {
            $("progress.Progress-main").val($json.percentage);
            $("#js--sync").html("<strong>" + $json.percentage + "%</strong> (" + $json.blocks + " / " + $json.height + ")");
        };

        action($data, $success, 'json');

    }, 60000);

    $(document).on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);  // Button that triggered the modal
        var titleData = button.data('title'); // Extract value from data-* attributes
        $(this).find('.modal-title').text(titleData);
    });

    $(document).on("click",'#submitpass',function(e)
    {
        var $formData = $("#unlockpassword").val();

        if($("#unlockpassword").val() != undefined)
        {
            var $data = {
                action:  'unlock',
                unlock: $formData
            };

            var $success = function ($json)
            {
                if($json.message != undefined)
                {
                    $("#js--unlock-error").text($json.message);
                } else {
                    $("#stakepassword").modal('hide');
                    $('.js--unlock-staking-button').hide();
                }
            };

            action($data, $success, 'json');
        }
        e.preventDefault();
    });

    $(document).on("click",'#js--language a',function(e)
    {
        var $data = {
            action:  'changelanguage',
            language:  $(this).attr('data-value')
        };

        var $success = function ($json)
        {
            if($json.finished === 1)
            {
                if($json.action !== undefined)
                {
                    switch($json.action) {
                        case "refresh":
                            location.reload(true);
                        break;
                    }
                }
            }
        };

        action($data, $success, 'json');
        e.preventDefault();
    });

    $(document).on("click",'#js--submitencrypt',function(e)
    {
        var $password = $("#js--encryptpassword").val();
        var $passwordverify = $("#js--encryptpassword-verify").val();

        if($("#js--encryptpassword").val() != undefined)
        {

            var $data = {
                action:  'encrypt',
                encrypt: $password,
                encryptVerify: $passwordverify
            };

            var $success = function ($json)
            {
                if($json.message != undefined)
                {
                    $("#js--encrypt-error").text($json.message);
                } else {
                    $("#encrypt").modal('hide');
                    $('.js--encrypt-button').hide();
                }
            };

            $(this).closest(".modal-content").find(".modal-body").html("Processing.....");

            action($data, $success, 'json');
        }
        e.preventDefault();
    });

    $(document).on("click",'.js--doAction',function(e)
    {
        var $questionBlock = $('#question');
        var $buttonAction = $(this).data('action');

        $questionBlock.modal('toggle');
        $questionBlock.find('.modal-title').text($(this).data('title'));
        $questionBlock.find('.modal-body').text($(this).data('content'));

        $questionBlock.find('#modal_question_submit').attr("data-action",$buttonAction);

        e.preventDefault();
    });

    $(document).on("click",'#modal_question_submit',function(e)
    {
        $submitAction = $(this).data('action');

        var $data = {
            action:  $submitAction
        };

        var $success = function ($json)
        {
            if($json.finished === 1)
            {
                if($json.message !== undefined)
                {
                    $(document).find(".modal-body:visible").text($json.message);
                }

                if($json.action !== undefined)
                {
                    switch($json.action) {
                        case "refresh":
                            location.reload(true);
                        break;
                    }
                }

                $('#question').modal('hide');

            }
        };


        $(this).closest(".modal-content").find(".modal-body").html("Processing.....");

        action($data, $success, 'json');

        e.preventDefault();
    });

    // Stake calculator
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    $(document).on("keyup",'#js--calc-xwc-amount',function(e)
    {
        delay(function(){
            var $data = {
                action:  'calculatestake',
                amount: $("#js--calc-xwc-amount").val()
            };

            var $success = function ($json)
            {
                var $calculated = $json.calculated
                $("#js--calc-xwc-interest").val(Math.floor($calculated));
            };

            action($data, $success, 'json');

        }, 400 );
    });


    function action($data, $success, $type)
    {
        $.ajax({
            type:     'POST',
            url:      "/Operators/Action.php",
            data:     $data,
            dataType: $type,
            cache:    false,
            success:  $success
        });
    }

    $('#datatable').DataTable( {
        "pageLength": 50,
        "bLengthChange": false,
        "order": []
    });
});