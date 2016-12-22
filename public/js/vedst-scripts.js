///////////////
// All views //
///////////////



// Enable Tooltips
$(function () { $("[data-toggle='tooltip']").tooltip(); });     

// Automatically close notifications after 4 seconds (4000 milliseconds)
window.setTimeout(function() {
    $(".message").fadeTo(1000, 0).slideUp(500, function(){
        $(this).alert('close'); 
    });
}, 4000);



// Own shift highlighting 
$('[name^=btn-submit-change]').click(function() {
    $(this).parents('.row').removeClass('my-shift');
});



// Dropdown hiding fix 
$('input').focusout(function() {
    if ($(this).prop('placeholder') === '=FREI=') {
        // hack to allow for click to register before focusout is called
        setTimeout(function () {
            $('.dropdown-username').hide();
        }, 200);
    }
});



// Language switcher 
$('.languageSwitcher').find('a').click(function() {
    var language = $(this).data('language');
    localStorage.setItem('language', language);
});



////////////////
// Event view //
////////////////



// Show/hide more button for infos
$(function(){
	$('.moreless-more-info').click(function(e) {
		$(this).parent().children('.more-info').toggleClass('moreshow-info');
        $(this).parent().children('.more-info').css('height','auto'); 
        $(this).parent().children('.moreless-less-info').show();
        $(this).parent().children('.moreless-more-info').hide();
	});
});

$(function(){
    $('.moreless-less-info').click(function(e) {
        $(this).parent().children('.more-info').toggleClass('moreshow-info');
        $(this).parent().children('.more-info').css('height','100'); 
        $(this).parent().children('.more-info').height(100);  
        $(this).parent().children('.moreless-less-info').hide();
        $(this).parent().children('.moreless-more-info').show();  
    });
});

$(function(){
    $('.moreless-more-info').hide();
    $('.moreless-less-info').hide();
    if ($('.more-info').height() > 100) {   
        $('.more-info').height(100);        
        $('.moreless-more-info').show();
    };
});

$(function(){
    $('.moreless-more-details').click(function(e) {
        $(this).parent().children('.more-details').toggleClass('moreshow-details');
        $(this).parent().children('.more-details').css('height','auto'); 
        $(this).parent().children('.moreless-less-details').show();
        $(this).parent().children('.moreless-more-details').hide();
    });
});

$(function(){
    $('.moreless-less-details').click(function(e) {
        $(this).parent().children('.more-details').toggleClass('moreshow-details');
        $(this).parent().children('.more-details').css('height','100'); 
        $(this).parent().children('.more-details').height(100);  
        $(this).parent().children('.moreless-less-details').hide();
        $(this).parent().children('.moreless-more-details').show();  
    });
});

$(function(){
    $('.moreless-more-details').hide();
    $('.moreless-less-details').hide();
    if ($('.more-details').height() > 100) {   
        $('.more-details').height(100);        
        $('.moreless-more-details').show();
    };

});



// Show/hide change history
$(function(){
    $('#show-hide-history').click(function(e) {
        e.preventDefault();
        if ($('#change-history').hasClass("hide")) 
        {
            // change state, change button
            $('#change-history').removeClass('hide'); 
            $('#arrow-icon').removeClass('fa-caret-right');
            $('#arrow-icon').addClass('fa-sort-desc');
        }
        else
        {
            // change state, change button
            $('#change-history').addClass('hide');
            $('#arrow-icon').addClass('fa-caret-right');
            $('#arrow-icon').removeClass('fa-sort-desc');
        };        
    });
});



///////////////
// Week view //
///////////////



// Show/hide comments
$(function(){
    $('.showhide').click(function(e) {
        $(this).parent().next('.hide').toggleClass('show');
        $('.isotope').isotope('layout') 
    });
});



// button to remove events from week view - mostly for printing
$(function(){
    $('.hide-event').click(function(e) {
        // change state, change button
        $(this).parent().parent().parent().parent().parent().addClass('hide');
        $('.isotope').isotope('layout')       
    });
});



//////////////////////
// Create/edit view //
//////////////////////



// Shows dynamic form fields for new job types 
$(document).ready(function() {
    // initialise counter
    var iCnt = parseInt($('#counter').val());

    if (iCnt < 2) {
        $(".btnRemove").hide();
    }; 

    // Add one more job with every click on "+"
    $('.btnAdd').click(function() {            
        
        var temp = $(this).closest('.box');
        var tempId = parseInt(temp.attr('id').substring(3,7));

        // clone entry
        temp.clone(true).insertAfter(temp);

        // update fields for following entries
        temp.nextUntil("br").each(function() {
            $(this).attr('id', "box" + ++tempId);
            $(this).find("[name^=jobType]").attr('id', "jobType" + tempId).attr('name', "jobType" + tempId);
            $(this).find("[name^=timeStart]").attr('id', "timeStart" + tempId).attr('name', "timeStart" + tempId);
            $(this).find("[name^=timeEnd]").attr('id', "timeEnd" + tempId).attr('name', "timeEnd" + tempId);
            $(this).find("[name^=jbtyp_statistical_weight]").attr('id', "jbtyp_statistical_weight" + tempId).attr('name', "jbtyp_statistical_weight" + tempId);
        }); 

        // update counter
        iCnt = iCnt + 1;
        $('#counter').val(iCnt);      

        if (iCnt >> 1) {
            $(".btnRemove").show();
        };  
    });

    // Remove selected job
    $('.btnRemove').click(function(e) {            
            var temp = $(this).closest('.box');
            var tempId = parseInt(temp.attr('id').substring(3,7)) - 1;

            // update fields for following entries
            temp.nextUntil("br").each(function() {
                $(this).attr('id', "box" + ++tempId);
                $(this).find("[name^=jobType]").attr('id', "jobType" + tempId).attr('name', "jobType" + tempId);
                $(this).find("[name^=timeStart]").attr('id', "timeStart" + tempId).attr('name', "timeStart" + tempId);
                $(this).find("[name^=timeEnd]").attr('id', "timeEnd" + tempId).attr('name', "timeEnd" + tempId);
                $(this).find("[name^=jbtyp_statistical_weight]").attr('id', "jbtyp_statistical_weight" + tempId).attr('name', "jbtyp_statistical_weight" + tempId);
            }); 

            // delete entry
            $(this).closest(".box").remove();
            e.preventDefault();
            
            // update counter
            iCnt = iCnt - 1; 
            $('#counter').val(iCnt);

            if (iCnt < 2) {
                $(".btnRemove").hide();
            }; 
    });

    // populate from dropdown select
    $.fn.dropdownSelect = function(jobtype, timeStart, timeEnd, weight) {
        
        $(this).closest('.box').find("[name^=jobType]").val(jobtype);
        $(this).closest('.box').find("[name^=timeStart]").val(timeStart);
        $(this).closest('.box').find("[name^=timeEnd]").val(timeEnd);   
        $(this).closest('.box').find("[name^=jbtyp_statistical_weight]").val(weight);
    };
});
 


/////////////
// Filters //
/////////////



$( document ).ready( function() {


    //////////////////////////////////////////////////////
    // Month view without Isotope, section filters only //
    //////////////////////////////////////////////////////
    


    if ($('#month-view-marker').length) 
    {
        // Apply filters from local storage on page load
        
        // First hide all
        $('.section-filter').hide();
        
        // go through local storage
        for (i = 0; i < window.localStorage.length; i++) 
        {
            key = window.localStorage.key(i);

            // look for all entries starting with "filter-" prefix
            if (key.slice(0,7) === "filter-") 
            {
                // find what should be revealed
                if (window.localStorage.getItem(key) == "show") 
                { 
                    // show events
                    $("."+key.slice(7)).show(); 

                    // set filter buttons to the saved state
                    $('#filter-'+key.slice(7)).addClass('btn-primary');
                };             
            }
        }

        // Filter buttons action
        $('#section-filter').on( 'click', 'button', function() 
        {
            // save current filter intent
            var filterValue = $( this ).attr('data-filter');

            if ( $(this).hasClass('btn-primary') ) 
            {   // case 1: this section was shown, intent to hide
                
                // deactivate button
                $(this).removeClass('btn-primary');

                // save choice to local storage
                if(typeof(Storage) !== "undefined") { localStorage.setItem("filter-"+filterValue, 'hide'); }
                
                // First hide all
                $('.section-filter').hide();
                
                // go through local storage
                for (i = 0; i < window.localStorage.length; i++) 
                {
                    key = window.localStorage.key(i);

                    // look for all entries starting with "filter-" prefix
                    if (key.slice(0,7) === "filter-") 
                    {
                        // find what should be revealed
                        if (window.localStorage.getItem(key) == "show") 
                        { 
                            // show events
                            $("."+key.slice(7)).show(); 

                            // set filter buttons to the saved state
                            $('#filter-'+key.slice(7)).addClass('btn-primary');
                        };             
                    }
                }
            } 
            else 
            {   //case 2: this section was hidden, intent to show
                
                // reactivate button
                $(this).addClass('btn-primary');

                // save choice to local storage
                if(typeof(Storage) !== "undefined") { localStorage.setItem("filter-"+filterValue, 'show'); }
                
                // show events from this section in view
                $("."+filterValue).show(); 
            }
        });
    } 
    else    
    {


        /////////////////////////////////////////////////////////
        // Week view with Isotope, section and feature filters //
        /////////////////////////////////////////////////////////



        // init Isotope
        var $container = $('.isotope').isotope(
        {
            itemSelector: '.element-item',
            layoutMode: 'masonry',
            masonry: 
            {
                columnWidth: '.grid-sizer'
            },
            getSortData: 
            {
                name: '.name',
                symbol: '.symbol',
                number: '.number parseInt',
                category: '[data-category]',
                weight: function( itemElem ) 
                {
                    var weight = $( itemElem ).find('.weight').text();
                    return parseFloat( weight.replace( /[\(\)]/g, '') );
                }
            }   
        });




        /////////////////////
        // Section filters //
        /////////////////////



        // Apply filters from local storage on page load
        
        // First hide all
        $('.section-filter').hide();

        // go through local storage
        for (i = 0; i < window.localStorage.length; i++) 
        {
            key = window.localStorage.key(i);

            // look for all entries starting with "filter-" prefix
            if (key.slice(0,7) === "filter-") 
            {
                // find what should be revealed 
                if (window.localStorage.getItem(key) == "show") 
                { 
                    // show events
                    $("."+key.slice(7)).show(); 
                    $('.isotope').isotope('layout');

                    // set filter buttons to the saved state
                    $('#filter-'+key.slice(7)).addClass('btn-primary');
                };             
            }
        }

        // Filter buttons action
        $('#section-filter').on( 'click', 'button', function() 
        {
            // save current filter intent
            var filterValue = $( this ).attr('data-filter');

            if ( $(this).hasClass('btn-primary') ) 
            {   // case 1: this section was shown, intent to hide
                
                // deactivate button
                $(this).removeClass('btn-primary');

                // save choice to local storage
                if(typeof(Storage) !== "undefined") { localStorage.setItem("filter-"+filterValue, 'hide'); }
                
                // First hide all
                $('.section-filter').hide();
                
                // go through local storage
                for (i = 0; i < window.localStorage.length; i++) 
                {
                    key = window.localStorage.key(i);

                    // look for all entries starting with "filter-" prefix
                    if (key.slice(0,7) === "filter-") 
                    {
                        // find what should be revealed
                        if (window.localStorage.getItem(key) == "show") 
                        { 
                            // show events
                            $("."+key.slice(7)).show(); 

                            // set filter buttons to the saved state
                            $('#filter-'+key.slice(7)).addClass('btn-primary');
                        };             
                    }
                }
                $('.isotope').isotope('layout'); 
            } 
            else 
            {   //case 2: this section was hidden, intent to show
                
                // reactivate button
                $(this).addClass('btn-primary');

                // save choice to local storage
                if(typeof(Storage) !== "undefined") { localStorage.setItem("filter-"+filterValue, 'show'); }
                
                // show events from this section in view
                $("."+filterValue).show();
                $('.isotope').isotope('layout');
            }
        });

     

        /////////////////////
        // Feature filters //
        /////////////////////



        //////////////////////////////
        // Show/hide time of shifts //
        //////////////////////////////



        // set translated strings
        if (localStorage.getItem('language') == "en") 
        {
            $('#toggle-shift-time').text("Shift time");
        }
        else // default to German
        {
            $('#toggle-shift-time').text("Dienstzeiten");
        }


        // Apply saved preferences from local storage on pageload
        if(typeof(Storage) !== "undefined") 
        {
            if (localStorage.shiftTime == "show") 
            {   
                $('.entry-time').removeClass("hide"); 
                $('#toggle-shift-time').addClass("btn-primary");
                $('.isotope').isotope('layout');
            } 
            else if (localStorage.shiftTime == "hide") 
            {
                $('.entry-time').addClass("hide");
                $('#toggle-shift-time').removeClass("btn-primary");
                $('.isotope').isotope('layout');                  
            }      
        };

        // Filter buttons action
        $('#toggle-shift-time').click(function(e) 
        { 
            if ($('.entry-time').is(":visible"))    // times are shown, intent to hide
            {
                // save selection in local storage
                if(typeof(Storage) !== "undefined") { localStorage.shiftTime = "hide"; }

                // change state, change button
                $('.entry-time').addClass("hide"); 
                $('#toggle-shift-time').removeClass("btn-primary");
                $('.isotope').isotope('layout');
            }
            else    // times are hidden, intent to show
            {
                // save selection in local storage
                if(typeof(Storage) !== "undefined") { localStorage.shiftTime = "show"; }

                // change state, change button
                $('.entry-time').removeClass("hide");
                $('#toggle-shift-time').addClass("btn-primary");
                $('.isotope').isotope('layout');
            };        
        });



        ////////////////////////////
        // Show/hide taken shifts //
        ////////////////////////////




        // set translated strings
        if (localStorage.getItem('language') == "en") 
        {
            $('#toggle-taken-shifts').text("Only EMPTY shifts");
        }
        else // default to German
        {
            $('#toggle-taken-shifts').text("Nur FREIe Dienste");
        }


        // Apply saved preferences from local storage on pageload
        if(typeof(Storage) !== "undefined") 
        {
            if (localStorage.onlyEmptyShifts == "true") 
            {   
                $('div.green').closest('.row').addClass('hide');
                $('#toggle-taken-shifts').addClass("btn-primary");
                $('.isotope').isotope('layout');
            } 
            else if (localStorage.onlyEmptyShifts == "false") 
            {
                $('div.green').closest('.row').removeClass('hide');
                $('#toggle-taken-shifts').removeClass("btn-primary");
                $('.isotope').isotope('layout');                  
            }      
        };

        // Filter buttons action
        $('#toggle-taken-shifts').click(function(e) 
        { 
            if ($('div.green').closest('.row').is(":visible"))    // all shifts are shown, intent to hide full shifts
            {
                // save selection in local storage
                if(typeof(Storage) !== "undefined") { localStorage.onlyEmptyShifts = "true"; }

                // change state, change button
                $('div.green').closest('.row').addClass('hide'); 
                $('#toggle-taken-shifts').addClass("btn-primary");
                $('.isotope').isotope('layout');
            }
            else    // only empty shifts shown, intent to show all shifts
            {
                // save selection in local storage
                if(typeof(Storage) !== "undefined") { localStorage.onlyEmptyShifts = "false"; }

                // change state, change button
                $('div.green').closest('.row').removeClass('hide');
                $('#toggle-taken-shifts').removeClass("btn-primary");
                $('.isotope').isotope('layout');
            };        
        });



        ///////////////////////////////////////////////
        // Week view changer: start Monday/Wednesday //
        ///////////////////////////////////////////////



        // set translated strings
        if (localStorage.getItem('language') == "en") 
        {
            var weekMonSun = "Monday - Sunday";
            var weekWedTue = "Wednesday - Tuesday";
        }
        else // default to German
        {
            var weekMonSun = "Montag - Sonntag";
            var weekWedTue = "Mittwoch - Dienstag";
        }


        // Apply saved preferences from local storage on pageload
        if(typeof(Storage) !== "undefined") 
        {
            if (localStorage.weekStart == "monday") 
            {   
                $('.week-mo-so').removeClass('hide');
                $('.week-mi-di').addClass('hide');
                $('#toggle-week-start').addClass("btn-primary");
                $('#toggle-week-start').removeClass("btn-success");
                $('#toggle-week-start').text(weekMonSun);
                $('.isotope').isotope('layout');
            } 
            else if (localStorage.weekStart == "wednesday") 
            {
                $('.week-mo-so').addClass('hide');
                $('.week-mi-di').removeClass('hide');
                $('#toggle-week-start').removeClass("btn-primary");
                $('#toggle-week-start').addClass("btn-success");
                $('#toggle-week-start').text(weekWedTue);
                $('.isotope').isotope('layout');                  
            }      
        };

        // Filter buttons action
        $('#toggle-week-start').click(function(e) 
        { 
            if ($('.week-mi-di').is(":hidden"))    // week starts monday, intent to start on wednesday
            {
                // save selection in local storage
                if(typeof(Storage) !== "undefined") { localStorage.weekStart = "wednesday"; }

                // change state, change button
                $('.week-mo-so').addClass('hide');
                $('.week-mi-di').removeClass('hide');
                $('#toggle-week-start').removeClass("btn-primary");
                $('#toggle-week-start').addClass("btn-success");
                $('#toggle-week-start').text(weekWedTue);
                $('.isotope').isotope('layout');
            }
            else    // week starts on wednesday, intent to start on monday
            {
                // save selection in local storage
                if(typeof(Storage) !== "undefined") { localStorage.weekStart = "monday"; }

                // change state, change button
                $('.week-mo-so').removeClass('hide');
                $('.week-mi-di').addClass('hide');
                $('#toggle-week-start').addClass("btn-primary");
                $('#toggle-week-start').removeClass("btn-success");
                $('#toggle-week-start').text(weekMonSun);
                $('.isotope').isotope('layout');
            };        
        });

    };
});



//////////
// AJAX //
//////////



// Update schedule entries
jQuery( document ).ready( function( $ ) {


/////////////////////////////
// AUTOCOMPELETE USERNAMES //
/////////////////////////////

    // open username dropdown on input selection and show only "I'll do it!" button at the beginning
    $( '.scheduleEntry' ).find('input').on( 'focus', function() {
        // remove all other dropdowns
        $(document).find('.dropdown-username').hide();
        // open dropdown for current input
        $(document.activeElement).parent().children('.dropdown-username').show();
    } );

    // hide all dropdowns on ESC keypress
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        $(document).find('.dropdown-username').hide();
      }
    });

    $( '.scheduleEntry' ).find("input[id^='userName']").on('input', function() {
        // show only current button
        $('[name^=btn-submit-change]')
            .addClass('hide')
            .removeClass('btn-primary');
        $(this).parents('.scheduleEntry').find('[name^=btn-submit-change]')
            .removeClass('hide')
            .addClass('btn-primary');

        // hide only current icon
        $('[name^=status-icon]').removeClass('hide');
        $(this).parents('.scheduleEntry').find('[name^=status-icon]').addClass('hide');

        // do all the work here after AJAX response is received
        function ajaxCallBackUsernames(response) { 

            // clear array from previous results, but leave first element with current user's data
            $(document.activeElement).parent().children('.dropdown-username').contents().filter(function () {
                return this.id != "yourself";
            }).remove();

            // format data received
            response.forEach(function(data) {

                // now we convert our data to meaningful text - could have done it on server side, but this is easier for now:
                // convert club_id to text
                if (data.clb_id == 2) { data.clb_id = "bc-Club" }
                if (data.clb_id == 3) { data.clb_id = "bc-Café" }

                // convert person_status to text
                if ( data.prsn_status == 'candidate' ) { data.prsn_status = " (K)" }
                else if ( data.prsn_status == 'veteran' ) { data.prsn_status = " (V)" }
                else if ( data.prsn_status == 'resigned' ) { data.prsn_status = " (ex)" }
                else { data.prsn_status = "" } 

                // add found persons to the array
                $(document.activeElement).parent().children('.dropdown-username').append(
                    '<li><a href="javascript:void(0);">' 
                    + '<span id="currentLdapId" hidden>' + data.prsn_ldap_id + '</span>'
                    + '<span id="currentName">' + data.prsn_name + '</span>'
                    + data.prsn_status
                    + '(<span id="currentClub">' + data.clb_id + '</span>)'
                    + '</a></li>');
            });  

            // process clicks inside the dropdown
            $(document.activeElement).parent().children('.dropdown-username').children('li').click(function(e){
                // ignore "i'll do it myself" button (handeled in view)
                if ( this.id == "yourself") return false;

                // gather the data for debugging
                var currentLdapId = $(this).find('#currentLdapId').html();
                var currentName = $(this).find('#currentName').html();
                var currentClub = $(this).find('#currentClub').html();
                var currentEntryId = $(this).closest(".scheduleEntry").attr("id");

                // update fields
                $("input[id=userName" + currentEntryId + "]").val(currentName);
                $("input[id=ldapId"   + currentEntryId + "]").val(currentLdapId);
                $("input[id=club"     + currentEntryId + "]").val(currentClub);

                // send to server
                // need to go via click instead of submit because otherwise ajax:beforesend, complete and so on won't be triggered
                $("#btn-submit-changes"+currentEntryId).click();

            });

            // reveal newly created dropdown
            $(document.activeElement).parent().children('.dropdown-username').show();

        }

        // short delay to prevents double sending
        $(this).delay('250');

        // Request autocompleted names
        $.ajax({  
            type: $( this ).prop( 'method' ),  

            url: "/person/" + $(this).val(),  

            data: {
                    // We use Laravel tokens to prevent CSRF attacks - need to pass the token with each requst
                    "_token": $(this).find( 'input[name=_token]' ).val(),

                    // Most browsers are restricted to only "get" and "post" methods, so we spoof the method in the data
                    "_method": "get"
            },  

            dataType: 'json',

            success: function(response){
                // external function handles the response
                ajaxCallBackUsernames(response);
            },
        });
    } );



/////////////////////////
// AUTOCOMPELETE CLUBS //
/////////////////////////   



    // open club dropdown on input selection
    $( '.scheduleEntry' ).find('input').on( 'focus', function() {
        // remove all other dropdowns
        $(document).find('.dropdown-club').hide();
        // open dropdown for current input
        $(document.activeElement).parent().parent().children('.dropdown-club').show();
    } );

    // hide all dropdowns on ESC keypress
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        $(document).find('.dropdown-club').hide();
      }
    });

    $( '.scheduleEntry' ).find("input[id^='club']").on( 'input', function() {
        // Show save icon on form change
        $(this).parents('.scheduleEntry').find('[name^=btn-submit-change]').removeClass('hide');
        $(this).parents('.scheduleEntry').find("[name^=status-icon]").addClass('hide');

        // do all the work here after AJAX response is received
        function ajaxCallBackClubs(response) { 

            // clear array from previous results, but leave first element with current user's data
            $(document.activeElement).parent().parent().children('.dropdown-club').contents().remove();

            // format data received
            response.forEach(function(data) {

                // add found clubs to the array$(document.activeElement).parent().children('.dropdown-club')
                $(document.activeElement).parent().parent().children('.dropdown-club').append(
                    '<li><a href="javascript:void(0);">' 
                    + '<span id="clubTitle">' + data.clb_title + '</span>'
                    + '</a></li>');
            });  

            // process clicks inside the dropdown
            $(document.activeElement).parent().parent().children('.dropdown-club').children('li').click(function(e){

                var clubTitle = $(this).find('#clubTitle').html();
                var currentEntryId = $(this).closest(".scheduleEntry").attr("id");

                // update fields
                $("input[id=club"     + currentEntryId + "]").val(clubTitle);

                // send to server
                // need to go via click instead of submit because otherwise ajax:beforesend, complete and so on won't be triggered
                $("#btn-submit-changes"+currentEntryId).click();

            });

            // reveal newly created dropdown
            $(document.activeElement).parent().parent().children('.dropdown-club').show();

        }

        // short delay to prevents double sending
        $(this).delay('250');

        // Request autocompleted names
        $.ajax({  
            type: $( this ).prop( 'method' ),  

            url: "/club/" + $(this).val(),  

            data: {
                    // We use Laravel tokens to prevent CSRF attacks - need to pass the token with each requst
                    "_token": $(this).find( 'input[name=_token]' ).val(),

                    // Most browsers are restricted to only "get" and "post" methods, so we spoof the method in the data
                    "_method": "get"
            },  

            dataType: 'json',

            success: function(response){
                // external function handles the response
                ajaxCallBackClubs(response);
            },
        });
    } );


    // Submit changes
    $( '.scheduleEntry' ).on( 'submit', function() {

        // For passworded schedules: check if a password field exists and is not empty
        // We will check correctness on the server side
        if ( $(this).parentsUntil( $(this), '.panel-warning').find("[name^=password]").length
          && !$(this).parentsUntil( $(this), '.panel-warning').find("[name^=password]").val() ) 
        {
            var password = window.prompt( 'Bitte noch das Passwort für diesen Dienstplan eingeben:' );      
        } else {
            var password = $(this).parentsUntil( $(this), '.panel-warning').find("[name^=password]").val();
        }

        $.ajax({  
            type: $( this ).prop( 'method' ),  

            url: $( this ).prop( 'action' ),  

            data: JSON.stringify({
                    // We use Laravel tokens to prevent CSRF attacks - need to pass the token with each requst
                    "_token":       $(this).find( 'input[name=_token]' ).val(),

                    // Actual data being sent below
                    "entryId":      $(this).closest("form").attr("id"), 
                    "userName":     $(this).find("[name^=userName]").val(),
                    "ldapId":       $(this).find("[name^=ldapId]").val(),
                    "timestamp":    $(this).find("[name^=timestamp]").val(),
                    "userClub":     $(this).find("[name^=club]").val(),
                    "userComment":  $(this).find("[name^=comment]").val(),
                    "password":     password, 

                    // Most browsers are restricted to only "get" and "post" methods, so we spoof the method in the data
                    "_method": "put"
                }),  

            dataType: 'json',

            contentType: 'application/json',
            
            beforeSend: function() {
                // console.log("beforesend");
                
                // hide dropdowns because they aren't no longer needed
                $(document).find('.dropdown-username').hide();
                $(document).find('.dropdown-club').hide();

                // HOTFIX: resolve current schedule entry ID via looking for an active save button
                var currentId = $('button.btn-primary').parents('form').attr('id');

                // Remove save icon and show a spinner in the username status while we are waiting for a server response
                $('#btn-submit-changes' + currentId).addClass('hide').parent().children('i').removeClass().addClass("fa fa-spinner fa-spin").attr("id", "spinner").attr("data-original-title", "In Arbeit...").css("color", "darkgrey");                
            },
            
            complete: function() {
                // console.log('complete');
            },

            success: function(data) {  
                // console.log("success");
                
                // COMMENT:
                // we update to server response instead of just saving user input
                // for the case when an entry has been updated recently by other user, 
                // but current user hasn't received a push-update from the server yet.
                //
                // This should later be substituted for "update highlighting", e.g.:
                // green  = "your data was saved successfully", 
                // red    = "server error, entry not saved (try again)", 
                // yellow = "other user updated before you, here's the new data"

                // Update the fields according to server response
                var $userNameInput = $("input[id=userName" + data["entryId"] + "]");
                $userNameInput.val(data["userName"]).attr("placeholder", "=FREI=");
                $("input[id=ldapId"   + data["entryId"] + "]").val(data["ldapId"]);
                $("input[id=timestamp"+ data["entryId"] + "]").val(data["timestamp"]);
                $("input[id=club"     + data["entryId"] + "]").val(data["userClub"]).attr("placeholder", "-");
                $("input[id=comment"  + data["entryId"] + "]").val(data["userComment"]).attr("placeholder", "Kommentar hier hinzufügen");

                // Switch comment icon in week view
                if ( $("input[id=comment"  + data["entryId"] + "]").val() == "" ) {
                    $("input[id=comment"  + data["entryId"] + "]").parent().children().children("button").children("i").removeClass().addClass("fa fa-comment-o");
                } else {
                    $("input[id=comment"  + data["entryId"] + "]").parent().children().children("button").children("i").removeClass().addClass("fa fa-comment");
                };

                // Switch comment in event view
                if ( $("input[id=comment"  + data["entryId"] + "]").val() == "" ) {
                    $("input[id=comment"  + data["entryId"] + "]").parent().children("span").children("i").removeClass().addClass("fa fa-comment-o");
                } else {
                    $("input[id=comment"  + data["entryId"] + "]").parent().children("span").children("i").removeClass().addClass("fa fa-comment");
                };

                var $colorDiv = $userNameInput.parent().prev().find("div");
                var isShiftEmpty = data["userName"] !== "";
                if(isShiftEmpty) {
                    $colorDiv.removeClass("red").addClass("green");
                }
                else {
                    $colorDiv.removeClass("green").addClass("red");
                }

                // UPDATE STATUS ICON
                // switch to normal user status icon and clear "spinner"-markup
                // we receive this parameters: e.g. ["status"=>"fa fa-adjust", "style"=>"color:yellowgreen;", "title"=>"Kandidat"] 
                $("#spinner").attr("style", data["userStatus"]["style"]);
                $("#spinner").attr("data-original-title", data["userStatus"]["title"]);
                $("#spinner").removeClass().addClass(data["userStatus"]["status"]).removeAttr("id");               
            },

            error: function (xhr, ajaxOptions, thrownError) {
                alert(JSON.stringify(xhr.responseJSON));
                // Hide spinner after response received
                // We make changes on success anyway, so the following state is only achieved 
                // when a response from server was received, but errors occured - so let's inform the user
                $("#spinner").removeClass().addClass("fa fa-exclamation-triangle").css("color", "red").attr("data-original-title", "Fehler: Änderungen nicht gespeichert!");
              }


        });

        // Prevent the form from actually submitting in browser
        return false; 

    });



////////////////////////////////
// MANAGEMENT: UPDATE JOBTYPE //
////////////////////////////////



    $( '.updateJobtype' ).on( 'submit', function() {

        $.ajax({  
            type: $( this ).prop( 'method' ),  

            url: $( this ).prop( 'action' ),  

            data: JSON.stringify({
                    // We use Laravel tokens to prevent CSRF attacks - need to pass the token with each requst
                    "_token":       $(this).find( 'input[name=_token]' ).val(),

                    // Actual data being sent below
                    "entryId":      $(this).closest("form").attr("id"), 
                    "jobtypeId":    $(this).find("[name^=jobtype]").val(),

                    // Most browsers are restricted to only "get" and "post" methods, so we spoof the method in the data
                    "_method": "put"
                }),  

            dataType: 'json',

            contentType: 'application/json',
            
            beforeSend: function() {
                // console.log("beforesend");
            },
            
            complete: function() {
                // console.log('complete');
            },

            success: function(data) {  
                //console.log("success");
                // remove row to indicate successful renaming of the jobtype
                $(".jobtype-event-row" + data["entryId"]).hide();

                // if all rows except table header were hidden (all jobtypes substituted withn other ones),
                // refresh the page to get the delete button or show remaining jobtypes
                if ($("tr:visible").length <= 1) {
                    // we remove arguments after "?" because otherwise user could land on a pagination page that is already empty
                    window.location = window.location.href.split("?")[0];
                }
                
            },

            error: function (xhr, ajaxOptions, thrownError) {
                alert(JSON.stringify(xhr.responseJSON));
            }

        });

        // Prevent the form from actually submitting in browser
        return false; 

    });

    // Detect entry name change and remove LDAP id from the previous entry
    $('.scheduleEntry').find("[name^=userName]").on('input propertychange paste', function() {
        $(this).parent().find("[name^=ldapId]").val("");
    });
 
});



////////////////////////////////////
// Clever RESTful Resource Delete //
////////////////////////////////////



/*
Taken from: https://gist.github.com/soufianeEL/3f8483f0f3dc9e3ec5d9
Modified by Ferri Sutanto
- use promise for verifyConfirm
Examples : 
<a href="posts/2" data-method="delete" data-token="{{csrf_token()}}"> 
- Or, request confirmation in the process -
<a href="posts/2" data-method="delete" data-token="{{csrf_token()}}" data-confirm="Are you sure?">
*/

(function(window, $, undefined) {

    var Laravel = {
        initialize: function() {
            this.methodLinks = $('a[data-method]');
            this.token = $('a[data-token]');
            this.registerEvents();
        },

        registerEvents: function() {
            this.methodLinks.on('click', this.handleMethod);
        },

        handleMethod: function(e) {
            e.preventDefault();

            var link = $(this);
            var httpMethod = link.data('method').toUpperCase();
            var form;

            // If the data-method attribute is not PUT or DELETE,
            // then we don't know what to do. Just ignore.
            if ($.inArray(httpMethod, ['PUT', 'DELETE']) === -1) {
                return false
            }

            Laravel
                .verifyConfirm(link)
                .done(function () {
                    form = Laravel.createForm(link);
                    form.submit()
                })
        },

        verifyConfirm: function(link) {
            var confirm = new $.Deferred();
            bootbox.confirm(link.data('confirm'), function(result){
                if (result) {
                    confirm.resolve(link);
                } else {
                    confirm.reject(link);
                }
            });

            return confirm.promise();
        },

        createForm: function(link) {
            var form =
                $('<form>', {
                    'method': 'POST',
                    'action': link.attr('href')
                });

            var token =
                $('<input>', {
                    'type': 'hidden',
                    'name': '_token',
                    'value': link.data('token')
                });

            var hiddenInput =
                $('<input>', {
                    'name': '_method',
                    'type': 'hidden',
                    'value': link.data('method')
                });

            return form.append(token, hiddenInput)
                .appendTo('body');
        }
    };

    Laravel.initialize();

})(window, jQuery);