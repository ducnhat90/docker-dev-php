var settings_left_nav = [
    ["quick_setup", "quicksetup"],
    ["wifi_setup", "wlanbasicsettings"],
    ["net_setup", "mobilenetworksettings"],
    ["net_op", "net"],
    ["admin_setup", "modifypassword"],
    ["sd_setup", "storagesettings"],

    ["advance", "dhcp"],
    ["advance", "pincodemanagement"],
    ["advance", "wlanmacfilter"],
    ["advance", "wanipfilter"],
    ["advance", "urlfilter"],
    ["advance", "portfilter"],
    ["advance", "portforward"],
    ["advance", "ddns"],
    ["advance", "wps"],
    ["advance", "wds"],

    ["dialup", "mobileconnection"],
    ["dialup", "profilesmgr"],
    // ["dialup","mobilenetworksettings"],
    ["dialup", "staticdns"],
    ["internet", "wifinetworks"],
    ["internet", "wifipriority"],
    ["wlan", "wlanbasicsettings"],
    ["wlan", "wlanadvanced"],
    // ["wlan","wlanmacfilter"],

    ["wlan", "dhcp"],
    ["security", "pincodemanagement"],
    ["security", "firewallswitch"],
    // ["security","lanipfilter"],
    ["security", "wanipfilter"],

    ["security", "virtualserver"],
    //["security","specialapplication"],
    ["security", "dmzsettings"],
    // ["security","sipalgsettings"],
    ["security", "upnp"],
    ["security", "nat"],
    ["system", "deviceinformation"],
    ["system", "acs"],
    ["system", "modifypassword"],
    ["system", "storagesettings"],
    ["system", "restore"],
    ["system", "configbackup"],
    ["system", "reboot"],
    ["system", "updatesettings"]
]
var settings_idx = 0;


document.oncontextmenu = new Function('return false');

function loadXMLDoc(url) {
    var xmlHttp = null;
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlHttp != null) {
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4) {
                // window.location.reload(true);
            }
        }
        xmlHttp.open("GET", url, true);
        xmlHttp.setRequestHeader("If-Modified-Since", "0");
        xmlHttp.send(null);
    } else {
        // window.location.reload(true);
    }
}

function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function() {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function disableCacheRefresh() {
    loadXMLDoc("/mark_cache.w.xml");
}


if (typeof jQuery == 'undefined') {
    disableCacheRefresh();
}

// if (($.browser.msie && parseInt($.browser.version) <= 8) || ($.browser.mozilla && parseInt($.browser.version) <= 3)) {
//     $("#ieshow").show();
// }


var target = "home.html";
var login = "1";
var sd_st = "0";
var dev_time = 'Sun 2020-04-05 17:41:22';
var fota = parseInt('1');
var net_st = parseInt("9");

var is_conn_clicked = 0,
    is_poweroff_clicked = 0,
    flag_sim_signal = 0,
    flag_wifi = 0,
    flag_wan = 0,
    flag_battery = 0,
    flag_update = 0,
    flag_data_warn = 0,
    flag_valid_sim = 0,
    ussd_clicked_action = 0,
    bundles_info = new Array(),
    fota_tips = 0;
var g_ussd_generalLimitText = '[0-9*#]*';
var update_confirm_poped = 0;
var poping = false;
var g_confirm_input_val = "",
    g_ussd_input = '';
var pre_recv, ussd_recv_cnt = 0,
    waiting_ussd_ret = 0,
    ussd_need_input = false;
var debug_sms;
if (dev_time.split(' ')[1].split('-')[0] == '1970') {
    var date = new Date();
    var post_data = 'time=' + date.getUTCFullYear() + '-' + parseInt(date.getUTCMonth() + 1) + '-' + date.getUTCDate() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
    $.ajax({
        url: "/wxml/set_time.xml",
        type: "Post",
        timeout: 8000,
        cache: false,
        datatype: "xml",
        data: post_data,
        success: function(data, status) {

        },
        error: function(x, t, m) {
            if (t === "timeout") {

            }
        }
    })
}
login = parseInt(login);
var lang, op_mode = "4G,LTE",
    mod_sig = parseInt("5"),
    current_href, is_home, need_refresh = 0,
    invalid_sim_poped = 0,
    is_roam = parseInt("0");
var sms_type = 0,
    sms_ind, wait_mdn_res = 0;
var clickHandler = (navigator.userAgent.match(/iPhone|iPad|iPod/) && ('ontouchstart' in document.documentElement) ? "touchstart" : "click");

var pin_st = "0";
var card_st = "5";
if ((card_st == 7 || pin_st == 4) && (target == "home.html")) {
    target = "nocard.html";
    open_page("nocard.html");
}



var timer_set_len = "10",
    interval_timer, title_timer, locking = 0,
    batt, batt_p;

var menu_disk_clicked = 0;

function update_settings_idx(url) {

    var str_id = url.substr(0, url.length - 5);

    var i = 0;
    for (i = 0; i < settings_left_nav.length; i++) {
        if (settings_left_nav[i][1] == str_id) return i;
    }
    return 0;
}


function open_page(url) {
    $.each($('.qtip-defaults'), function() {
        $(this).remove();
    });
    //fota_tips==0 &&
    if (fota == 2 && net_st == 9 && !poping && (url != "update.html")) {
        showConfirmDialog("Please update your device to enjoy new user interface for better experience.", function() {
            // fota_tips = 1;
            if (current_href != "update.html") open_page("update.html");
        }, null);

        $(".dialog_close_btn").remove();
        return;
    }
    if (interval_timer) clearInterval(interval_timer);
    if (url != 'home.html') ussd_clicked_action = 0;
    $('#align_center').load(url, function(response, status, xhr) {
        if (status == "success") {
            settings_idx = update_settings_idx(url);
            var res_to_login = 'top.window.open("http://' + location.hostname + '/login.htm","_self")';
            if (response.indexOf(res_to_login) > -1) {
                //            top.location.href = 'login.htm';
                loginout(0, url == "update.html");
                target = url;
                open_page('home.html');
                return;
            }
            locking = 0;

            current_href = url;
            load_mark(url);
            ieRadiusBorder();
            if (url == 'home.html') is_home = 1;
            // else if(url=='update.html') is_home=2;
            else if (url == 'app.html') is_home = 3;
            else {
                is_home = 0;
            }
            // if($(window).width()>800 && $('body').height()>$(window).height()){
            //     $('#main').css('margin-left','17px');
            // }
            // else {
            //     $('#main').css('margin-left','0');
            // }
            refresh_height();


        } else {
            if (status == "error" && xhr.status == 404) {
                open_page('home.html')
            } else {
                to_404();
            }
        }
    });
}

function refresh_height() {
    //    if($('body').height()<$("#login_wrapper").height()){
    $('body').height($("#login_wrapper").height() + "px");
    //    }
}

function refresh_login() {
    if ((login & 0x0F) >= 2) {
        $('#logout_span').html('Log Out');
        $('#username_span').html("admin").show();
    } else {
        $('#username_span').hide();
        if ($('#logout_span').html() == 'Log Out') {
            $('#logout_span').html('Log In');
            showInfoDialog("You're logged out of your account. Please login again.");
        }

        if (current_href == "nocard.html") {

        } else if (!is_home) open_page('home.html');
        // else if(is_home == 2 && fota < 50 ) open_page('home.html');
    }
}

var TTIP = {
    sim_signal: '',
    station: '',
    wan: '',
    wifi: '',
    battery: '',
    sms: '',
    wifi_indoor: '',
    warn: ''
};

function changeTooltipContent() {
    if ('<b>' + TTIP.sim_signal + '</b>' != $('.qtip-sim').find('.qtip-content').html()) $('.qtip-sim').find('.qtip-content').html('<b>' + TTIP.sim_signal + '</b>');
    if ('<b>' + TTIP.station + '</b>' != $('.qtip-station').find('.qtip-content').html()) $('.qtip-station').find('.qtip-content').html('<b>' + TTIP.station + '</b>');
    if ('<b>' + TTIP.wan + '</b>' != $('.qtip-wan').find('.qtip-content').html()) $('.qtip-wan').find('.qtip-content').html('<b>' + TTIP.wan + '</b>');
    if ('<b>' + TTIP.wifi + '</b>' != $('.qtip-wifi').find('.qtip-content').html()) $('.qtip-wifi').find('.qtip-content').html('<b>' + TTIP.wifi + '</b>');
    if ('<b>' + TTIP.battery + '</b>' != $('.qtip-battery').find('.qtip-content').html()) $('.qtip-battery').find('.qtip-content').html('<b>' + TTIP.battery + '</b>');

    if ('<b>' + TTIP.wifi + '</b>' != $('.qtip-indoor').find('.qtip-content').html()) $('.qtip-indoor').find('.qtip-content').html('<b>' + TTIP.wifi + '</b>');
    if ('<b>' + TTIP.sms + '</b>' != $('.qtip-sms').find('.qtip-content').html()) $('.qtip-sms').find('.qtip-content').html('<b>' + TTIP.sms + '</b>');
    // if('<b>' + TTIP.warn + '</b>' != $('.qtip-warn').find('.qtip-content').html()) $('.qtip-warn').find('.qtip-content').html('<b>' + TTIP.warn + '</b>');
}

function mod_sig_src(sig, op_mode) {
    var opmode = op_mode.split(",")[1];
    if (opmode != "NO SERVICE") $("#li_op_mode").html(opmode);
    else $("#li_op_mode").html("");
    if (sig == -1) sig = 0;
    if (sig < 6) {
        var htm_sig = "<img onload=\"fixPNG(this)\" src=\"./img/signal_" + sig + ".png\">";
        if ($('#sim_signal_gif').html() != htm_sig) {
            $('#sim_signal_gif').html(htm_sig);
        }

        if (flag_sim_signal != 1 || TTIP.sim_signal != opmode) {
            TTIP.sim_signal = opmode;
            flag_sim_signal = 1;
        }

    } else if (sig == 6) {
        if (flag_sim_signal != 2) {
            $('#sim_signal_gif').html("<img onload=\"fixPNG(this)\" src=\"./img/signal_0.png\">");
            TTIP.sim_signal = "No Service";
            flag_sim_signal = 2;
        }
    } else if (sig == 7) {
        if (flag_sim_signal != 1) {
            $('#sim_signal_gif').html("<img onload=\"fixPNG(this)\" src=\"./img/sim_disable.png\">");
            TTIP.sim_signal = "Card invalid or no card found";
            flag_sim_signal = 3;
        }
    }
}

// SMS_IND_NOTHING = 0x0,
// SMS_IND_SEND_SUCCESS = 0x1,
// SMS_IND_SEND_FAILED = 0x2,
// SMS_IND_NEW_ARRIVED = 0x3,
// SMS_IND_UNREAD = 0x4,
// SMS_IND_MEM_FULL =  0x5

function update_sms_ind(sms_ind) {
    if (parseInt(sms_ind[0]) == 0 || isNaN(parseInt(sms_ind[0]))) {
        $('#sms_gif').css({
            'display': 'none'
        });
        return;
    } else {
        $('#sms_gif').css({
            'display': 'block'
        });
    }

    if (sms_ind[0] == "3" || sms_ind[0] == "4") {
        if ($('#tooltip_sms').html() != null) {
            if ($('#tooltip_sms').html().indexOf("unread_message.gif") < 0) {
                $('#tooltip_sms').html("<img src = './img/unread_message.gif' alt='' />");
            }
        }
    } else {
        if ($('#tooltip_sms').html() != null) {
            if ($('#tooltip_sms').html().indexOf("/message.gif") < 0) {
                $('#tooltip_sms').html("<img src = './img/message.gif' alt='' />");
            }
        }
    }

    if (sms_ind[0] == "1") {
        TTIP.sms = "Send Success";
    } else if (sms_ind[0] == "2") {
        TTIP.sms = "Send Fail";
    } else if (sms_ind[0] == "3") {
        TTIP.sms = "New Message!";
    } else if (sms_ind[0] == "4") {
        if (parseInt(sms_ind[1]) > 1) TTIP.sms = "Unread Messages:" + sms_ind[1];
        else TTIP.sms = "Unread Message: " + sms_ind[1];
    } else if (sms_ind[0] == "5") {
        TTIP.sms = "Your message box is full.";
    }
}


function cancel_update_confirm() {

    setTimeout(function() {
        //        console.log("cancel update");
        update_confirm_poped = 0;
    }, 3000);

}

function pop_update_confirm() {
    update_confirm_poped = 1;
    showConfirmDialog("New Version Founded,Would you want to Upgrade?", function() {
        //        console.log("to update");

        showWaitingDialog("Waiting", "Please waiting...")
        $.ajax({
            url: "/wxml/fota_op.xml",
            type: "Post",
            timeout: 8000,
            cache: false,
            datatype: "xml",
            data: {
                'download': 1
            },
            success: function(data, status) {
                closeWaitingDialog();
                open_page("update.html");
            },
            error: function(x, t, m) {
                closeWaitingDialog();
                if (t === "timeout") {

                }
            }
        })


    }, function() {
        $.ajax({
            url: "/wxml/fota_op.xml",
            type: "Post",
            timeout: 8000,
            cache: false,
            datatype: "xml",
            data: {
                'uncheck': 1
            },
            success: function(data, status) {
                closeWaitingDialog();
            },
            error: function(x, t, m) {
                if (t === "timeout") {

                }
            }
        })



    });
}

function to_404() {
    need_refresh = 4;
    $(".tools").hide();
    clearDialog();
    closeWaitingDialog();
    showWaitingDialog("Note", "Device disconneted. <br>Please check your connection.");
}


function refresh_title() {
    if (locking) return true;
    $.ajax({
        url: '/mark_title.w.xml',
        type: "Get",
        timeout: 20000,
        cache: false,
        datatype: "xml",
        data: null,
        success: function(data, status) {
            var dsc_ver = parseInt($(data).find("dsc").text());
            fota = parseInt($(data).find("fota").text());
            if (fota == 89 || fota == 99) need_refresh = 0;
            if (current_href == "deviceinformation.html" && wait_mdn_res) need_refresh = 0;

            if (need_refresh > 3) {
                // location.reload(true);
                return;
            }
            lang = $(data).find("lang").text();
            if (!lang.length) {
                if (need_refresh < 5 && !locking) need_refresh++;
                if (need_refresh == 4) to_404();
                return;
            }
            locking = 0;

            login = parseInt($(data).find("login").text());
            refresh_login();




            // if(((login&0x0F)>=2) && current_href!="update.html" && fota==79 && !update_confirm_poped){

            //     pop_update_confirm();

            //     return;
            // }


            mod_sig = parseInt($(data).find("onex").text());
            op_mode = $(data).find("op_mode").text();
            if (mod_sig < 0) mod_sig = 0;

            mod_sig_src(mod_sig, op_mode);

            //        pref_mode=$(data).find("pref").text();


            var sig_wifi = parseInt($(data).find("wifi").text());
            var cspn = $(data).find("cspn").text();
            var dsc = parseInt($(data).find("dsc").text());
            var pin = parseInt($(data).find("pin").text());
            var puk_cnt = parseInt($(data).find("puk_cnt").text());
            batt = parseInt($(data).find("batt").text());
            batt_p = parseInt($(data).find("batt_p").text());
            var rate = $(data).find("rate").text().split(',');
            net_st = parseInt($(data).find("netstatus").text());
            is_roam = parseInt($(data).find("roam").text());
            sd_st = parseInt($(data).find("sd_st").text());
            //        var warn=parseInt($(data).find("warning").text());


            if (current_href == "home.html") {
                load_interval();
            }


            if (fota < 2) {
                if (flag_update != 1) {
                    $('#update_gif').css({
                        'display': 'none'
                    });
                    $('#tooltip_update').html("<img src = './img/update_disable.gif'>");
                    flag_update = 1;
                }

            } else if (fota == 2) {
                if (flag_update != 2) {
                    $('#update_gif').css({
                        'display': 'block'
                    });
                    $('#tooltip_update').html("<img src = './img/update_enable.gif'>");
                    flag_update = 2;
                }
                if (net_st == 9) {
                    if (current_href == "home.html" && target == "update.html" && ((login & 0x0F) >= 2)) {
                        open_page("update.html");
                    } // && target != "update.html"
                    else if (!poping && current_href && current_href != "update.html") {
                        showConfirmDialog("Please update your device to enjoy new user interface for better experience.", function() {
                            // fota_tips = 1;
                            open_page("update.html");
                        }, null);

                        $(".dialog_close_btn").remove();

                    }
                }

            } else if ((fota == 89 || fota == 99) && current_href != "update.html") {
                open_page("update.html");
            }




            // if(fota==1) {
            //         if(flag_update!=1){
            //         $('#update_gif').css({
            //             'display' : 'none'
            //         });
            //         $('#tooltip_update').html("<img src = './img/update_disable.gif'>");
            //         flag_update=1;
            //     }

            // }
            // else if(fota==2) {
            //     if(flag_update!=2){
            //         $('#update_gif').css({
            //                 'display' : 'block'
            //         });
            //         $('#tooltip_update').html("<img src = './img/update_enable.gif'>");
            //         flag_update=2;
            //     }
            // }

            // else if(fota==3) {
            //     if(flag_update!=3 && !poping){
            //         showWaitingDialog("Note","Firmware updating...");
            //         flag_update=3;
            //     }
            // }
            // else if(fota==4){
            //     if(is_home!=2) {
            //         closeWaitingDialog();
            //         open_page('update.html');
            //     }
            // }
            // else if(fota==5){
            //     if(flag_update!=5 && !poping){
            //         closeWaitingDialog();
            //         flag_update=5;
            //         showConfirmDialog("Device firmware update to latest version!", function () {
            //         $.ajax({
            //             url: '/wxml/fota_clear_new_tips.xml',
            //             type: "Post",
            //             timeout: 8000,
            //             cache: false,
            //             datatype: "xml",
            //             data: { "clear": 1 },
            //             success: function (data, status) {
            //                 flag_update=0;
            //             },
            //             error: function (x, t, m) {
            //                 flag_update=0;
            //                 if (t === "timeout") {

            //                 }
            //             }
            //         })
            //         return false;
            //         });
            //     }

            // }


            // if(warn==1) {
            //     if(flag_data_warn!=1){
            //         $('#data_gif').css({
            //             'display' : 'block'
            //         });
            //         $('#tooltip_data').html("<img src = './img/data_alert.gif'>");
            //         TTIP.warn = "Over the DataPlan Threshold";
            //         flag_data_warn=1;
            //     }
            // }
            // else {
            //         if(flag_data_warn!=0){
            //         $('#data_gif').css({
            //             'display' : 'none'
            //         });
            //         flag_data_warn=0;
            //     }

            // };
            var rate = $(data).find("rate").text().split(",");
            var up_rate = rate[0];
            var dl_rate = rate[1];

            //        var up_rate = $(data).find("up_rate").text();
            //        var dl_rate = $(data).find("dl_rate").text();

            if (up_rate != "0" && dl_rate != "0") {
                $('#wan_gif').html("<img onload = 'fixPNG(this)' src = './img/wan_up_down.png' 0 0 no-repeat>");
            } else if (up_rate != "0") {
                $('#wan_gif').html("<img onload = 'fixPNG(this)' src = './img/upData.png' 0 0 no-repeat>");
            } else if (dl_rate != "0") {
                $('#wan_gif').html("<img onload = 'fixPNG(this)' src = './img/dwData.png' 0 0 no-repeat>");
            } else {
                $('#wan_gif').html("<img onload = 'fixPNG(this)' src = './img/wan_disable.png' 0 0 no-repeat>");
            }

            if (net_st == 9) {
                TTIP.wan = "WAN connected";
                $('#wan_gif').show();
            } else {
                $('#wan_gif').hide();
            }


            if (sig_wifi == 1) {
                if (flag_wifi != 1) {
                    $('#wifi_gif').html("<img onload = 'fixPNG(this)'  src = './img/wifi_1.png' 0 0 no-repeat>");
                    TTIP.wifi = "WiFi On";
                    flag_wifi = 1;
                }

            } else if (sig_wifi == 0) {
                if (flag_wifi != 2) {
                    $('#wifi_gif').html("<img onload = 'fixPNG(this)'  src = './img/wifi_0.png' 0 0 no-repeat>");
                    TTIP.wifi = "WiFi Off";
                    flag_wifi = 2;
                }
            } else $('#wifi_gif').hide();



            sms_ind = $(data).find("sms_ind").text().split(",");

            update_sms_ind(sms_ind);

            var sms_cnt = $(data).find("sms_cnt").text().split(",");

            if (current_href == "smsinbox.html" || current_href == "messagesettings.html") {
                var unread = sms_cnt[0] ? sms_cnt[0] : 0;
                var in_cnt = sms_cnt[1] ? sms_cnt[1] : 0;
                var out_cnt = sms_cnt[2] ? sms_cnt[2] : 0;
                var df_cnt = sms_cnt[3] ? sms_cnt[3] : 0;

                $("#label_inbox_status").text(unread + "/" + in_cnt);
                $("#label_sent_status").text(out_cnt);
                $("#label_drafts_status").text(df_cnt);
            }


            if (dsc_ver & 0x01) {
                /*
                sim tips:
                PIN Required
                PUK blocked. Please contact your service provider.
                PUK Required
                Card invalid or no card found.


                */

                if (mod_sig == 7) {
                    $("#li_pin").html("No card");
                } else if (cspn == -1 || cspn == 'Please Insert Card' || cspn.toLowerCase() == "invalid sim") {
                    //    $('#cspn').html('Need Card').css('color','red');
                    if (mod_sig != 7) $("#li_pin").html("Invalid SIM");
                    if (!flag_valid_sim && cspn.toLowerCase() == "invalid sim") {
                        flag_valid_sim = 1;
                        showInfoDialog("Non Mobilink 4G SIM,please contact Mobilink customer care.");
                    }
                    TTIP.sim_signal = 'Card invalid or no card found.';
                    if (flag_sim_signal != 5) {
                        $('#sim_signal_gif').html("<img onload = 'fixPNG(this)' src = './img/sim_disable.png ' 0 0 no-repeat>");
                        flag_sim_signal = 5;
                    }
                } else if (pin > 1) {

                    if (pin == 2) {
                        TTIP.sim_signal = 'PIN Required';
                        $("#li_pin").html("PIN Required")
                    }
                    if (pin == 3) {
                        if (puk_cnt == 0) {
                            TTIP.sim_signal = 'PUK blocked. Please contact your service provider.';
                            $("#li_pin").html("PUK blocked")
                        } else {
                            TTIP.sim_signal = 'PUK Required';
                            $("#li_pin").html("PUK Required")
                        }
                    }
                    if (pin == 4) {
                        TTIP.sim_signal = 'No card found';
                        $("#li_pin").html("No card")
                    }
                    //$('#cspn').html(temp).css({'color':'red','cursor':'pointer'});
                    if (flag_sim_signal != 4) {
                        $('#sim_signal_gif').html("<img onload = 'fixPNG(this)' src = './img/sim_disable.png ' 0 0 no-repeat>");
                        flag_sim_signal = 4;
                    }

                } else {
                    $("#li_pin").html("");
                }



            }
            if (dsc_ver & 0x02) {
                var hi = batt >>> 8;
                if (hi == 4) {
                    if (flag_battery != 4) {
                        $('#battery_gif').html("<img src = './img/battery_elect.gif' />");
                        flag_battery = 4;
                    }
                    TTIP.battery = "Battery Charging:" + batt_p + "%";
                } else {
                    if (hi == 0) {
                        if (flag_battery != 5) {
                            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = './img/battery_low.gif' 0 0 no-repeat>");
                            flag_battery = 5;
                        }
                    } else if (hi == 1) {
                        if (flag_battery != 1) {
                            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = './img/battery_level_3.png' 0 0 no-repeat>");
                            flag_battery = 1;
                        }
                    } else if (hi == 2) {
                        if (flag_battery != 2) {
                            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = './img/battery_level_6.png' 0 0 no-repeat>");
                            flag_battery = 2;
                        }
                    } else if (hi == 3) {
                        if (flag_battery != 3) {
                            $('#battery_gif').html("<img onload = 'fixPNG(this)' src = './img/battery_level_9.png' 0 0 no-repeat>");
                            flag_battery = 3;
                        }
                    }
                    TTIP.battery = batt_p + "%";
                }

                // if(hi < 4) show_batt_ind(hi);
                // else if(hi == 4) {
                //   var lo=(batt&0x0C)/4;
                //   if(lo==3) lo=0;
                //   else lo=lo+1;
                //   console.log("v=%d,ind=%d",batt,lo);
                //   show_batt_ind(lo,batt_p);

                //  }
            } else {
                $('#battery_gif').hide();
            }


            changeTooltipContent();

            if (is_roam == 1) $("#li_roam").show();
            else $("#li_roam").hide();
            // if(roam==1){
            // 	$('#roam').html('R');
            // }
            // else $('#roam').html('');
            // if(net_st==9) {
            // 	$("#a_conn_time").show();
            // 	$("#conn_sw").html("&#735;").attr("class","conn_on");
            // 	$("#conn_st").html("Connected");
            // 	$("#a_rate").show();
            // }
            // else {
            // 	$("#a_conn_time").hide();
            // 	$("#a_rate").hide();
            // 	$("#conn_sw").html("&#735;<span id=\"conn_off_x\">&#215;</span>").attr("class","conn_off");
            // 	$("#conn_st").html("Disconnected");

            // }
            // show_dsc(dsc,pin,cspn,batt,batt_p);

            // var date = new Date();
            // $('#hr_min').html(date.Format('hh')+':'+date.Format('mm'));
            //   	$('#date').html('<div>'+week_l[date.getDay()]+'</div><div>'+date.Format('dd')+'&nbsp;'+Month[date.getMonth()+1]+'</div>');
        },
        error: function(x, t, m) {
            if (fota != 3 && fota != 4 && (current_href != "deviceinformation.html" || !wait_mdn_res)) {
                if (t === "timeout") {
                    if (need_refresh < 5 && !locking) need_refresh++;
                    if (need_refresh == 4) to_404();
                } else if (t === "error") {
                    if (need_refresh < 5 && !locking) need_refresh++;
                    if (need_refresh == 4) to_404();
                }
            }
        }
    })
}
Date.prototype.Format = function(format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds()
    };
    var k;
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};

function isInt(input) {
    var reg1 = /^\d+$/;
    return reg1.test(input);
}

function regURL(str) {
    var reg = "(((https|http|ftp|rtsp|mms):&#x2F;&#x2F;)|(www\\.)){1}[\41-\176]*";
    var matchURL = new RegExp(reg, "ig");
    str = XSSResolveCannotParseChar(str);
    return str.replace(matchURL, function($1) {
        $1_href = $1.indexOf("&#x2F;&#x2F;") == -1 ? "http://" + $1 : $1;
        if ($1_href.charAt($1_href.length - 1) == "=" && $1_href.charAt($1_href.length - 2) != "=") {
            $1_href = $1_href.substring(0, $1_href.length - 1);
        }
        return "<a href='" + $1_href + "' style='text-decoration:underline;' target='_blank' onclick='javascript:stopBubble(event)'>" + $1 + "</a>";
    });
}

function XSSResolveCannotParseChar(xmlStr) {
    if (!xmlStr || !xmlStr.length) {
        return '';
    }
    return xmlStr.replace(/(\&|\'|\"|\>|\<|\/|\(|\))/g, function($0, $1) {
        return {
            '&': '&amp;',
            "'": '&#39;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
            '/': '&#x2F;',
            '(': '&#40;',
            ')': '&#41;'
        } [$1];
    });
}

function XSSResolveHtmlReturnChar(xmlStr) {
    return xmlStr.replace(/(\'|\"|\/|\(|\))/g, function($0, $1) {
        return {
            "'": '&apos;',
            '"': '&quot;',
            '/': '&#x2F;',
            '(': '&#40;',
            ')': '&#41;'
        } [$1];
    });
}

function esc(str) {
    str = '' + str;
    str = str.replace(/%/g, '%25');
    str = str.replace(/&/g, '%26');
    str = str.replace(/=/g, '%3D');
    str = str.replace(/\+/g, '%2B');
    str = str.replace(/ /g, '+');
    str = str.replace(/\\/g, '%5C');
    return str;
}

function checkcharwidth(str) {
    var cArr = str.match(/[^\x00-\xff]/ig);
    return (cArr == null ? false : true);
}
String.prototype.macFormat = function() {
    var str = this.toUpperCase();
    if (str == "-") return "";
    str = str.replace(/-/g, ':');
    return str;
}

/*$(document).ready(function() {


    // $.ajaxSetup({
    //     cache: false
    // });

    document.onblur = function() {
        flag_focus = false;
    };
    document.onclick = function() {
        flag_focus = true;
    };


    if ((login & 0x0F) >= 2) {
        $('#logout_span').html('Log Out');
        $('#username_span').html("admin").show();
        open_page(target);
    } else {
        $('#username_span').hide();
        $('#logout_span').html('Log In');
        if (pin_st == 4 || card_st == 7) open_page("nocard.html");
        else open_page("home.html");
    }
    refresh_title();
    title_timer = setInterval(refresh_title, timer_set_len * 1000);

    $('.button_wrapper:not(#login_btn,#connect_btn,#disconnect_btn,#cancel_btn)').live('mouseover', function() {
        $(this).addClass('mouse_on');
    });
    $('.button_wrapper').live('mouseout', function() {
        $(this).removeClass('mouse_on');
    });
    //Button effect when mousedown and mouseout
    $('.button_wrapper:not(#login_btn)').mousedown(function() {
        $(this).addClass('mouse_down');
    });
    $('.button_wrapper').mouseup(function() {
        $(this).removeClass('mouse_down');
    });




    $("#menu_index").click(function() {
        open_page("home.html");

    })


    $("#menu_settings").die().live("click", function() {
        open_page("quicksetup.html");
    })


    $("#quick_setup").die().live("click", function() {
        open_page("quicksetup.html");
    })

    $("#mobileconnection").die().live("click", function() {
        open_page("mobileconnection.html");
    })


    $("#net_op").die().live("click", function() {
        open_page("net.html");
    })

    $("#profilesmgr").die().live("click", function() {
        open_page("profilesmgr.html");
    })

    $("#net_setup,#menu_connection_settings").die().live("click", function() {
        open_page("mobilenetworksettings.html");
    })

    $("#staticdns").die().live("click", function() {
        open_page("staticdns.html");
    })

    $("#wlanbasicsettings,#to_set_wifi,#wifi_setup").die().live("click", function() {
        open_page("wlanbasicsettings.html");
        return false;
    })

    $("#wlanadvanced").die().live("click", function() {
        open_page("wlanadvanced.html");
    })

    $("#wlanmacfilter").die().live("click", function() {
        open_page("wlanmacfilter.html");
    })


    $("#wps").die().live("click", function() {
        open_page("wps.html");
    })


    $("#dhcp").die().live("click", function() {
        open_page("dhcp.html");
    })


    $("#pincodemanagement").die().live("click", function() {
        //    settings_idx=12;
        open_page("pincodemanagement.html");
    })

    $("#firewallswitch").die().live("click", function() {
        open_page("firewallswitch.html");
    })

    $("#lanipfilter").die().live("click", function() {
        open_page("lanipfilter.html");
    })

    $("#wanipfilter").die().live("click", function() {
        open_page("wanipfilter.html");
    })

    $("#urlfilter").die().live("click", function() {
        open_page("urlfilter.html");
    })

    $("#portfilter").die().live("click", function() {
        open_page("portfilter.html");
    })

    $("#portforward").die().live("click", function() {
        open_page("portforward.html");
    })

    $("#virtualserver").die().live("click", function() {
        open_page("virtualserver.html");
    })

    $("#specialapplication").die().live("click", function() {
        open_page("specialapplication.html");
    })

    $("#dmzsettings").die().live("click", function() {
        open_page("dmzsettings.html");
    })

    $("#sipalgsettings").die().live("click", function() {
        open_page("sipalgsettings.html");
    })



    $("#upnp").die().live("click", function() {
        open_page("upnp.html");
    })

    $("#nat").die().live("click", function() {
        open_page("nat.html");
    })

    $("#ddns").die().live("click", function() {
        open_page("ddns.html");
    })

    $("#wds").die().live("click", function() {
        open_page("wds.html");
    })

    $("#deviceinformation").die().live("click", function() {
        open_page("deviceinformation.html");
    })

    $("#acs").die().live("click", function() {
        open_page("acs.html");
    })


    $("#modifypassword,#admin_setup").die().live("click", function() {
        open_page("modifypassword.html");
    })

    $("#storagesettings,#sd_setup").die().live("click", function() {
        open_page("storagesettings.html");
    })


    $("#restore").die().live("click", function() {
        open_page("restore.html");
    })

    $("#configbackup").die().live("click", function() {
        open_page("configbackup.html");
    })

    $("#reboot").die().live("click", function() {
        open_page("reboot.html");
    })

    $("#updatesettings").die().live("click", function() {
        open_page("updatesettings.html");
    })

    $("#statistic,#data_gif").die().live("click", function() {
        open_page("statistic.html");
    })


    $("#sms_gif").die().live("click", function() {
        if (parseInt(sms_ind[0]) < 3) {
            sms_type = 1;
        } else sms_type = 0;
        open_page("smsinbox.html");
    })




    $("#menu_sms,#inbox").die().live("click", function() {
        sms_type = 0;
        //    showInfoDialog("Will Done Soon!");
        open_page("smsinbox.html");
    })

    $("#sent").die().live("click", function() {
        sms_type = 1;
        open_page("smsinbox.html");
    })

    $("#drafts").die().live("click", function() {
        sms_type = 2;
        open_page("smsinbox.html");
    })


    $("#sms_center_number").die().live("click", function() {
        open_page("messagesettings.html");
    })


    $("#menu_ussd,#to_ussd").die().live("click", function() {
        open_page("ussd.html");
    })

    $("#menu_phonebook").die().live("click", function() {
        open_page("phonebook.html");
    })

    $("#menu_app").die().live("click", function() {
        open_page("app.html");
    })

    $("#menu_disk").die().live("click", function() {
        if (!sd_st) {
            showInfoDialog('SD card not exist!');
            return false;
        } else if (sd_st == 2) {
            showInfoDialog('You need to switch "<b>Storage Mode</b>" to <b>WiFi Storage</b>"<br> at page "<b>Storage Setting </b>"!');
            return false;
        }

        if (login & 0x10) {
            var ismobile = navigator.userAgent.toLowerCase().match(/(ipad)|(iphone)|(ipod)|(android)|(webos)|(blackberry)|(iemobile)/i);
            if (ismobile) {
                top.window.open("/msd.html", "_self");
            } else {
                window.open('/sdcard.html', '_self');

                return false;
            }
        } else {
            menu_disk_clicked = 1;

            loginout(0);
        }


    })


    $("#menu_update,#update_gif").die().live("click", function() {
        //    showInfoDialog("TBD");
        open_page("update.html");
    })
})*/

//MD5
var hexcase = 0;
var b64pad = "";
var chrsz = 8;

function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}

function b64_md5(s) {
    return binl2b64(core_md5(str2binl(s), s.length * chrsz));
}

function str_md5(s) {
    return binl2str(core_md5(str2binl(s), s.length * chrsz));
}

function hex_hmac_md5(key, data) {
    return binl2hex(core_hmac_md5(key, data));
}

function b64_hmac_md5(key, data) {
    return binl2b64(core_hmac_md5(key, data));
}

function str_hmac_md5(key, data) {
    return binl2str(core_hmac_md5(key, data));
}

function md5_vm_test() {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

function core_md5(x, len) {
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;

        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
}

function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}

function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function core_hmac_md5(key, data) {
    var bkey = str2binl(key);
    if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}

function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

function str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
    return bin;
}

function binl2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz)
        str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
    return str;
}

function binl2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
            hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
    }
    return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) |
            (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) |
            ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}
////MD5 end

//});


function draw(canvas) {
    var paint = canvas.getContext("2d");
    paint.beginPath();
    paint.clearRect(0, 0, 24, 24);
    paint.fillStyle = "#b11016";
    paint.strokeStyle = "#b11016";
    paint.beginPath();
    paint.arc(12, 12, 11, 0, Math.PI * 2, true);
    paint.closePath();
    paint.lineWidth = 2;
    paint.fill();
    paint.stroke();

    var x = 12;
    y = 12;
    paint.strokeStyle = "#ffdd00";
    paint.beginPath();
    paint.moveTo(6.4, 6.4);
    paint.lineTo(17.6, 17.6);
    paint.stroke();
    paint.closePath();

    paint.strokeStyle = "#ffdd00";
    paint.beginPath();
    paint.moveTo(6.4, 17.6);
    paint.lineTo(17.6, 6.4);
    paint.stroke();
    paint.closePath();

}
//var current_href = window.location.href;
var tabKeyflag = false;
var g_is_login_opened = false;
// Aim to take all the prompt displaying on a page as a stack.
var g_main_displayingPromptStack = [];


$(document).keydown(onKeyup);
g_main_displayingPromptStack.length = 0;
var flag_focus = true;

function onKeyup(evt) {
    if (evt.ctrlKey || evt.altKey) // Exclude key press "CRTL+key" & "ALT+key"
    {
        return;
    }

    if (13 == evt.keyCode && ($("#username").is(":focus") || $("#password").is(":focus"))) // Enter key
    {
        var targetID = '';
        var stackLen = g_main_displayingPromptStack.length;

        if (stackLen > 0) {
            targetID = g_main_displayingPromptStack[stackLen - 1];
        } else {

        }
        if ('' != targetID) {
            $('#' + targetID).trigger('click');
        }
    }
}

function clearAllErrorLabel() {
    $('.error_message').remove();
}

function showErrorUnderTextbox(idOfTextbox, errormsg, label_id) {

    var errorLabel = '';
    if (label_id != null && label_id != '' && label_id != ' ') {
        errorLabel = "<div class='error_message'><label id='" + label_id + "'>" + errormsg + '</label><div>';
    } else {
        errorLabel = "<div class='error_message'><label>" + errormsg + '</label><div>';
    }
    if (0 == $('#' + idOfTextbox).parent().children('.error_message').length) {
        $('#' + idOfTextbox).after(errorLabel);
    }
}

function showloginDialog() {
    clearDialog();
    $('#div_wrapper').remove();
    $('.login_dialog').remove();
    poping = true;
    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='login_dialog' id='dialog'>";
    dialogHtml += "    <div class='login_dialog_content'>";
    dialogHtml += "        <div class='login_dialog_header'>";
    if (menu_disk_clicked) {
        dialogHtml += "            <span class='dialog_header_left clr_white'>" + "WiFi Disk Log In" + '</span>';
    } else dialogHtml += "            <span class='dialog_header_left clr_white'>" + "Log In" + '</span>';

    dialogHtml += "            <span class='dialog_header_right'><a class='dialog_close_btn clr_gray' title='' href='javascript:void(0);'><canvas id='canvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table'>";
    dialogHtml += "               <div class='login'>";
    dialogHtml += "               <div id='username_wrapper'>";
    dialogHtml += '                   <p>' + "User name:" + '</p>';
    dialogHtml += "                   <span><input type='text' class='input' id='username' maxlength='32' style='width:160px'/></span>";
    dialogHtml += '               </div>';
    dialogHtml += "               <div id='login_password_wrapper'>";
    dialogHtml += '               <p>' + "Password:" + '</p>';
    dialogHtml += "                   <span><input  type='password'  class='input' id='password' maxlength='32'/></span>";
    dialogHtml += '               </div>';
    dialogHtml += '               </div>';
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table_bottom'>";
    dialogHtml += "              <span class='button_wrapper pop_login'>";
    dialogHtml += "                  <input id='pop_login' class='button_dialog' type='button' value='" + "Log In" + "'/></span>";

    dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper pop_Cancel'>";
    dialogHtml += "                  <input id='pop_Cancel' class='button_dialog' type='button' value='" + "Cancel" + "'/></span>";

    dialogHtml += '       </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';

    $('.body_bg').before(dialogHtml);
    if ($.browser.msie && (parseInt($.browser.version, 10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("canvas");
        draw(canvas);
    } else if ($.browser.msie && (parseInt($.browser.version, 10) < 9)) {
        $(".dialog_header_left").css("margin-top", "5");
        $(".login_dialog_header").css({
            "width": "420px",
            "height": "29px"
        });
        $(".login_dialog_header").corner("top 5px");
        $(".button_wrapper").css('background', '#FFFFFF');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top", "2px");
        $(".login_dialog_table_bottom").corner("keep 3px cc:6a6a6a");
        var ahtml = "<img src='/img/dialog_close_btn.png' onload=\"fixPNG(this)\" title='' alt='' />";
        $(".login_dialog_header a").append(ahtml);
        $(".dialog_close_btn").css("top", "7px");
    } else {
        var canvas = document.getElementById("canvas");
        draw(canvas);
    }
    reputPosition($('#dialog'), $('#div_wrapper'));
    g_main_displayingPromptStack.push('pop_login');

    $('#username').focus();
    g_is_login_opened = true;

    disableTabKey();

    $('#pop_Cancel,.dialog_close_btn').click(function() {
        clearDialog();
        is_conn_clicked = 0;
        is_poweroff_clicked = 0;
        menu_disk_clicked = 0;
        poping = false;
        // if(current_href == 'quicksetup') {
        //     gotoPageWithoutHistory(HOME_PAGE_URL);
        // }
    });


    function parseLoginResult(type, result) {
        if (result == 0 || result == 2 || result == 4) $('#username').focus();
        else $('#pwd').focus();
        if (result == 4) {
            update_language();
            showErrorUnderTextbox('password', "login timeout,please retry.");
            $("#password").focus();
        } else if (result == 5) {
            showErrorUnderTextbox('password', "hacking detected.");
            $("#password").focus();
        } else if (result == 0) {
            showErrorUnderTextbox('password', "Incorrect user name or password.<br>Please try again.");
            $("#username").focus();
        } else if (result == 1) {
            showErrorUnderTextbox('password', "Password incorrect.");
            $("#password").focus();
        } else if (result == 2) {
            showErrorUnderTextbox('username', "User name incorrect.");
            $("#username").focus();
        } else if (result == 3) {
            clearDialog();
            if (type == 1) {
                var ismobile = navigator.userAgent.toLowerCase().match(/(ipad)|(iphone)|(ipod)|(android)|(webos)|(blackberry)|(iemobile)/i);
                if (ismobile) {
                    top.location.href = "/msd.html";
                } else top.location.href = "/sdcard.html";
            } else if (type == 2) {
                if (is_conn_clicked || is_poweroff_clicked || ussd_clicked_action) open_page("home.html");
                else open_page(target);
            }

            return true;
        }
    }


    $('#pop_login').click(function() {
        clearAllErrorLabel();
        var username = $('#username').val();

        if (menu_disk_clicked /*&& username=="sdcard" */ ) {

            var password = hex_md5($("#password").val().toLowerCase());
            var esc_rand = rand;
            $.ajax({
                url: '/wxml/rlogin.xml',
                type: "Post",
                timeout: 8000,
                cache: false,
                datatype: "xml",
                data: {
                    Name: username,
                    password: password,
                    rand: esc_rand
                },
                success: function(data, status) {
                    var result = parseInt($(data).find("check").text());
                    poping = false;
                    parseLoginResult(1, result);
                },
                error: function(x, t, m) {
                    poping = false;
                    if (t === "timeout") {

                    }
                }
            })
        } else {
            var password = hex_md5(rand + $("#password").val().toLowerCase());
            var esc_rand = rand;
            $.ajax({
                url: '/wxml/post_login.xml',
                type: "Post",
                timeout: 8000,
                cache: false,
                datatype: "xml",
                data: {
                    Name: username,
                    password: password,
                    rand: esc_rand
                },
                success: function(data, status) {
                    var result = parseInt($(data).find("login_check").text());
                    refresh_title();
                    poping = false;
                    parseLoginResult(2, result);

                    //          $('#login').attr({disabled:"false",class:'button'});
                },
                error: function(x, t, m) {
                    poping = false;
                    //      $('#login').attr({disabled:"false",class:'button'});
                    if (t === "timeout") {

                    }
                    to_404();
                }
            })
        }




        // if(current_href == 'quicksetup') {
        //     gotoPageWithoutHistory(HOME_PAGE_URL);
        // }
    });

}


function show_sent(sent) {
    var lastTrH = $('#ussd_result_home tr:last').height();
    var tabl_ussd_html = $('#ussd_result_home').html();
    tabl_ussd_html += "<tr class='general_result'><td class='general_status'>";
    tabl_ussd_html += "Sent:</td><td style='text-align:left;padding-left:8px;'><pre class='general_content_home'>";
    tabl_ussd_html += sent + '</pre></td></tr>';
    $('#ussd_result_home').html(tabl_ussd_html);

    var tableH = $('#ussd_result_home').height();
    lastTrH = $('#ussd_result_home tr:last').height();
    $('#home_ussd_dialog').scrollTop(tableH - lastTrH);
}

function show_recv(recv) {
    var lastTrH = $('#ussd_result_home tr:last').height();
    var tabl_ussd_html = $('#ussd_result_home').html();
    tabl_ussd_html += "<tr class='general_result'><td class='general_status clr_cyan'>";
    tabl_ussd_html += "Received:</td><td style='text-align:left;padding-left:8px;'><pre class='general_content_home clr_cyan'>";
    tabl_ussd_html += recv + '</pre></td></tr>';
    $('#ussd_result_home').html(tabl_ussd_html);

    var tableH = $('#ussd_result_home').height();
    lastTrH = $('#ussd_result_home tr:last').height();
    $('#home_ussd_dialog').scrollTop(tableH - lastTrH);
}

function exitUssd() {
    clearDialog();
    is_conn_clicked = 0;
    is_poweroff_clicked = 0;
    menu_disk_clicked = 0;
    ussd_clicked_action = 0;
    poping = false;
    if (interval_timer) clearInterval(interval_timer);
    //if(ussd_need_input) {
    exitUssdProgress();
    //}
}


function exitUssdProgress(cb) {
    if (!cb) showWaitingDialog("Waiting", "Please wait.");

    $.ajax({
        url: "/wxml/ussd_cancel.xml",
        type: "Post",
        timeout: 20000,
        cache: false,
        datatype: "xml",
        data: {
            "cancel": 1
        },
        success: function(data, status) {
            if (cb) cb();
            else {
                setTimeout(function() {
                    closeWaitingDialog();
                }, 2000)
            }
        },
        error: function(x, t, m) {
            if (!cb) closeWaitingDialog();
            if (t === "timeout") {

            } else if (t === "error") {

            }
        }
    });

}




function getUssdRecv(type, timeout) {
    if (!timeout) timeout = 40;
    interval_timer = setInterval(function() {
        //load_setting();
        $.ajax({
            url: "ussd_res.w.xml",
            type: "Get",
            timeout: 8000,
            cache: false,
            datatype: "xml",
            success: function(data, status) {
                var recv = $(data).find("res").text();

                if (recv == '-') {
                    ussd_recv_cnt++;
                    if (waiting_ussd_ret && ussd_recv_cnt > timeout) {
                        locking = 0;
                        waiting_ussd_ret = 0;
                        ussd_recv_cnt = 0;
                        recv = "Timeout";
                        if (pre_recv == recv) return;
                        else pre_recv = recv;
                        if (type == 1) {
                            parseMobiUSSD(recv);
                        } else show_recv(recv);
                    }
                } else {
                    locking = 0;
                    ussd_recv_cnt = 0;
                    // waiting_ussd_ret = 0;

                    if (pre_recv == recv) return;
                    else pre_recv = recv;

                    recv = recv.replace(/[\n|\r]/g, '<br/>');
                    if (recv.length == 0) {
                        recv = "Failed";
                    }

                    var isNeedInput = parseInt(recv.substr(0, 1));
                    recv = recv.substr(2);
                    if (isNeedInput) {
                        // clearDialog();
                        // showConfirmDialog("<div id='ussd_recv_confirm'>" + recv + "</div>" + "<div style='margin-top: 10px;'><input type='text' id='confirm_input' style='width:100%;height:20px;font-size:16px;'></div>", function() {
                        //     if(g_confirm_input_val.length) home_ussd_send(g_confirm_input_val);
                        //     //}

                        //     //load_setting();
                        // }, function() {
                        //     exitUssdProgress();
                        //     //load_setting();
                        // }, true, function() {
                        //     exitUssdProgress();
                        //     // load_setting();
                        // });
                        // // $("#confirm_input").focus();
                        ussd_need_input = true;
                        waiting_ussd_ret = 0;
                        $("#pop_input_ussd").show();
                        $("#pop_send_ussd").show();
                        $('#pop_input_ussd').val('').focus();
                    } else {
                        ussd_need_input = false;
                        $("#pop_input_ussd").hide();
                        $("#pop_send_ussd").hide();
                        // load_setting();
                    }

                    if (type == 1) {
                        parseMobiUSSD(recv);
                    } else show_recv(recv);
                }
            },
            error: function(x, t, m) {
                if (t === "timeout") {
                    locking = 0;
                    // closeWaitingDialog();
                } else if (t === "error") {
                    locking = 0;
                    // closeWaitingDialog();
                }
                // load_setting();
            }
        });
    }, 1000);
}


function checkInputUssdMasterNumber(input) {
    if (!input.length) return false;
    reg1 = new RegExp(g_ussd_generalLimitText);
    if (reg1.exec(input) != input) {
        return false;
    }
    return true;
}

function showUssdDialog() {
    if (interval_timer) clearInterval(interval_timer);
    getUssdRecv();
    $('#div_wrapper').remove();
    $('.login_dialog').remove();
    poping = true;
    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='login_dialog' id='dialog'>";
    dialogHtml += "    <div class='login_dialog_content'>";
    dialogHtml += "        <div class='login_dialog_header'>";

    dialogHtml += "            <span class='dialog_header_left clr_white'>" + "USSD Messages" + '</span>';

    dialogHtml += "            <span class='dialog_header_right'><a class='dialog_close_btn clr_gray' title='' href='javascript:void(0);'><canvas id='canvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table'>";
    // dialogHtml += "               <div class='login'>";
    // dialogHtml += "               <div id='username_wrapper'>";
    // dialogHtml += '                   <p>' + "User name:" + '</p>';
    // dialogHtml += "                   <span><input type='text' class='input' id='username' maxlength='15' style='width:160px'/></span>";
    // dialogHtml += '               </div>';
    // dialogHtml += "               <div id='login_password_wrapper'>";
    // dialogHtml += '               <p>' + "Password:" + '</p>';
    // dialogHtml += "                   <span><input  type='password'  class='input' id='password' maxlength='15'/></span>";
    // dialogHtml += '               </div>';
    // dialogHtml += '               </div>';

    dialogHtml += '<div id="home_ussd_dialog" style="width:412px; height: 160px; border:#444 solid 1px;overflow-y:scroll;overflow-x: hidden;">'

    dialogHtml += '<table id="ussd_result_home" class="ussd_general_result_home"></table>';

    dialogHtml += '        </div>';

    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table_bottom'>";
    dialogHtml += "                   <span><input style='display:none' type='text'  class='pop_input_ussd' id='pop_input_ussd' maxlength='20'/></span>";
    dialogHtml += "              <span class='button_wrapper pop_login'>";
    dialogHtml += "                  <input style='display:none' id='pop_send_ussd' class='button_dialog_green' type='button' value='" + "Send" + "'/></span>";

    dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper pop_Cancel'>";
    dialogHtml += "                  <input id='pop_cancel_ussd' class='button_dialog_green' type='button' value='" + "Cancel" + "'/></span>";

    dialogHtml += '       </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';

    $('.body_bg').before(dialogHtml);
    if ($.browser.msie && (parseInt($.browser.version, 10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("canvas");
        draw(canvas);
    } else if ($.browser.msie && (parseInt($.browser.version, 10) < 9)) {
        $(".dialog_header_left").css("margin-top", "5");
        $(".login_dialog_header").css({
            "width": "420px",
            "height": "29px"
        });
        $(".login_dialog_header").corner("top 5px");
        $(".button_wrapper").css('background', '#FFFFFF');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top", "2px");
        $(".login_dialog_table_bottom").corner("keep 3px cc:6a6a6a");
        var ahtml = "<img src='/img/dialog_close_btn.png' onload=\"fixPNG(this)\" title='' alt='' />";
        $(".login_dialog_header a").append(ahtml);
        $(".dialog_close_btn").css("top", "7px");
    } else {
        var canvas = document.getElementById("canvas");
        draw(canvas);
    }
    reputPosition($('#dialog'), $('#div_wrapper'));
    g_main_displayingPromptStack.push('pop_login');

    // $('#username').focus();
    g_is_login_opened = true;

    disableTabKey();

    $('#pop_cancel_ussd,.dialog_close_btn').click(function() {
        exitUssd();
        // if(current_href == 'quicksetup') {
        //     gotoPageWithoutHistory(HOME_PAGE_URL);
        // }
    });

    $('#pop_send_ussd').click(function() {
        clearAllErrorLabel();
        var cmd = $.trim($('#pop_input_ussd').val());
        if (!checkInputUssdMasterNumber(cmd)) {
            showQtip('pop_input_ussd', "No command entered or the command entered is formatted incorrectly.");
            $('#pop_input_ussd').focus();
            return;
        }
        show_sent(cmd);
        home_ussd_check(cmd, false, ussd_need_input);
    });

}


function showMasterNumberDialog() {
    $('#div_wrapper').remove();
    $('.login_dialog').remove();
    poping = true;
    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='login_dialog' id='dialog'>";
    dialogHtml += "    <div class='login_dialog_content'>";
    dialogHtml += "        <div class='login_dialog_header'>";

    dialogHtml += "            <span class='dialog_header_left clr_white'>" + "Update your Master Number" + '</span>';

    dialogHtml += "            <span class='dialog_header_right'><a class='dialog_close_btn clr_gray' title='' href='javascript:void(0);'><canvas id='canvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table'>";
    dialogHtml += "               <div class='login'>";
    dialogHtml += "               <div id='username_wrapper'>";
    dialogHtml += '                   <p>' + "Enter New Master Number:" + '</p>';
    dialogHtml += "                   <span><input type='text' class='input' id='new_master_number' maxlength='15' style='width:160px'/></span>";
    dialogHtml += '               </div>';
    dialogHtml += "               <div id='login_password_wrapper'>";
    dialogHtml += '               <p>' + "Enter Your MBB Number:" + '</p>';
    dialogHtml += "                   <span><input  type='text'  class='input' id='mbb_number' maxlength='15'/></span>";
    dialogHtml += '               </div>';
    dialogHtml += '               </div>';

    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table_bottom'>";

    dialogHtml += "              <span class='button_wrapper pop_login'>";
    dialogHtml += "                  <input id='pop_send_master' class='button_dialog_green' type='button' value='" + "Send" + "'/></span>";

    dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper pop_Cancel'>";
    dialogHtml += "                  <input id='pop_cancel_master' class='button_dialog_green' type='button' value='" + "Cancel" + "'/></span>";

    dialogHtml += '       </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';

    $('.body_bg').before(dialogHtml);
    if ($.browser.msie && (parseInt($.browser.version, 10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("canvas");
        draw(canvas);
    } else if ($.browser.msie && (parseInt($.browser.version, 10) < 9)) {
        $(".dialog_header_left").css("margin-top", "5");
        $(".login_dialog_header").css({
            "width": "420px",
            "height": "29px"
        });
        $(".login_dialog_header").corner("top 5px");
        $(".button_wrapper").css('background', '#FFFFFF');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top", "2px");
        $(".login_dialog_table_bottom").corner("keep 3px cc:6a6a6a");
        var ahtml = "<img src='/img/dialog_close_btn.png' onload=\"fixPNG(this)\" title='' alt='' />";
        $(".login_dialog_header a").append(ahtml);
        $(".dialog_close_btn").css("top", "7px");
    } else {
        var canvas = document.getElementById("canvas");
        draw(canvas);
    }
    reputPosition($('#dialog'), $('#div_wrapper'));
    g_main_displayingPromptStack.push('pop_login');

    $('#username').focus();
    g_is_login_opened = true;

    disableTabKey();

    $('#pop_cancel_master,.dialog_close_btn').click(function() {
        clearDialog();
        is_conn_clicked = 0;
        is_poweroff_clicked = 0;
        menu_disk_clicked = 0;
        ussd_clicked_action = 0;
        poping = false;
        // if(current_href == 'quicksetup') {
        //     gotoPageWithoutHistory(HOME_PAGE_URL);
        // }
    });




    $('#pop_send_master').click(function() {
        clearAllErrorLabel();
        var new_master_number = $.trim($('#new_master_number').val());
        var mbb_number = $.trim($('#mbb_number').val());

        if (!checkInputUssdMasterNumber(new_master_number)) {
            showQtip('new_master_number', "Please input correct new master number.");
            $("#new_master_number").focus();
            return;
        }

        if (!checkInputUssdMasterNumber(mbb_number)) {
            showQtip('mbb_number', "Please input correct MBB number.");
            $("#mbb_number").focus();
            return;
        }

        clearDialog();
        var content = 'MC ' + new_master_number + ' CN ' + mbb_number;
        home_sms_send(debug_sms ? debug_sms : '6234', content);
    });

}




function closeWaitingDialog(callback_func) {
    poping = false;
    if ($('.info_dialog').size() == 0) {
        $('#div_wrapper').remove();
    }
    $('#wait_table').remove();
    enableTabKey();
    if (typeof(callback_func) == 'function') {
        callback_func();
    }
}

function showWaitingDialog(tipTitle, tipContent, callback_func) {
    //   tipContent = display_SIMtoUIM(tipContent);
    clearDialog();
    closeWaitingDialog();
    poping = true;
    $('#div_wrapper').remove();
    var tab = "<table colspacing='0' cellspacing='0' id='wait_table' class='wait_table'>" + "<tr><td><div class='wait_table_header'><label class='wait_title clr_white'>" + tipTitle + "</label><span class='wait_dialog_btn' id='wait_dialog_btn' ><canvas id='showWaitingCanvas' width='25px' height='25px'></canvas></span></div></td></tr>" + "<tr><td><div class='wait_table_content clr_bold'><div class='wait_wrapper'><div class='wait_image'><img src='./img/waiting.gif' alt=''/></div><div class='wait_str clr_bold'>" + tipContent + '</div></div></div></td></tr>' + "<tr><td><div class='wait_table_bottom'></div></td></tr>" + '</table>';
    var wait_div = "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>" + tab;
    $('body').append(wait_div);
    if ($.browser.msie && (parseInt($.browser.version, 10) < 9)) {
        $(".wait_title").css("margin-top", "5");
        $(".wait_table_header").css({
            "width": "383px",
            "height": "29px"
        });
        $(".wait_table_header").corner("top 5px");
        $(".wait_dialog_btn").css("top", "7");
        var ahtml = "<img src='/img/dialog_close_btn.png' onload=\"fixPNG(this)\" title='' alt='' />";
        $(".wait_table_header span").append(ahtml);
    } else {
        var canvas = document.getElementById("showWaitingCanvas");
        draw(canvas);
    }
    reputPosition($('#wait_table'), $('#div_wrapper'));
    $('#wait_dialog_btn').bind('click', function() {
        closeWaitingDialog(callback_func);
        poping = false;
    });
    if (typeof(callback_func) == 'function') {
        //$('#wait_dialog_btn').show();
    }
    $('#wait_dialog_btn').hide();
    // if (typeof (callback_func) == 'function') {
    //     callback_func();
    //     poping= false;
    // }
    disableTabKey();
}




function enableTabKey() {
    $('a').attr('tabindex', '');
    $('input').attr('tabindex', '');
    $('select').attr('tabindex', '');
}

function disableTabKey() {
    $('a').attr('tabindex', '-1');
    $('input').attr('tabindex', '-1');
    $('select').attr('tabindex', '-1');

    $("#username").attr('tabindex', '1');
    $("#password").attr('tabindex', '2');
    if (!tabKeyflag) {
        $("#username").focusout(function() {
            disableTabKey();
        });
        $("#username").focusin(function() {
            enableTabKey();
        });
        tabKeyflag = true;
    }

}


function hiddenSelect(flag) {
    if ($.browser.msie && ($.browser.version == 6.0)) {
        if (flag) {
            $("select").css("display", "none");
        } else {
            $("select").css("display", "inline");
            $("#select_WifiCountry_for_Idevice").css("display", "none");
        }
    }
}

function clearDialog() {
    poping = false;
    flag_update = 0;
    $('.dialog:not(#upload_dialog), .info_dialog, .login_dialog, #div_wrapper,.sms_dialog,.group_dialog,.contact_dialog').remove();
    hiddenSelect(false);
    enableTabKey();
    // if (g_is_login_opened) {
    //     g_is_login_opened = false;
    //     getDeviceStatus();
    // }
}

var hideInfo;
//show info dialog
function showInfoDialog(tipsContent, closeTime, closeFunc, showX, bigleft) {
    //        tipsContent = display_SIMtoUIM(tipsContent);

    clearDialog();
    closeWaitingDialog();
    clearTimeout(hideInfo);
    poping = true;
    if ($('.info_dialog').size() == 0) {

        clearTimeout(hideInfo);
        var dialogHtml = '';
        if ($('#div_wrapper').size() < 1) {
            dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
        }
        dialogHtml += "<div class='info_dialog'>";
        dialogHtml += "    <div class='info_dialog_content'>";
        dialogHtml += "        <div class='info_dialog_header'>";
        dialogHtml += "            <span class='dialog_header_left clr_white'>" + "Note" + '</span>';
        dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='' class='info_dialog_close_btn clr_gray'><canvas id='showInfoCanvas' width='25px' height='25px'></canvas></a></span>";
        dialogHtml += '        </div>';
        dialogHtml += "        <div class='info_dialog_table'><div class='info_content'>" + tipsContent + '</div></div>';
        dialogHtml += '    </div>';
        dialogHtml += '</div>';

        $('.body_bg').before(dialogHtml);
        if ($.browser.msie && (parseInt($.browser.version, 10) == 9)) {
            $(".button_wrapper").css('border-radius', '3px');
            var canvas = document.getElementById("showInfoCanvas");
            draw(canvas);
        } else if ($.browser.msie && (parseInt($.browser.version, 10) < 9)) {
            $(".dialog_header_left").css("margin-top", "5");
            $(".info_dialog_header").css({
                "width": "380px",
                "height": "29px"
            });
            $(".info_dialog_header").corner("top 5px");
            $(".info_dialog_close_btn").css("top", "7");
            var ahtml = "<img src='/img/dialog_close_btn.png' onload=\"fixPNG(this)\" title='' alt='' />";
            $(".info_dialog_header a").append(ahtml);
        } else {
            var canvas = document.getElementById("showInfoCanvas");
            draw(canvas);
        }
        hiddenSelect(true);

        $('.info_dialog_close_btn').bind('click', function() {
            if (typeof(closeFunc) == 'function') {
                closeFunc();
            }
            poping = false;
            closeFunc = null;
            clearTimeout(hideInfo);
            clearDialog();
        });

        if (bigleft) {
            $('.info_dialog').width(480);
            $('.info_dialog_header').width(474);
            $('.info_dialog_table').css({
                "width": "446px",
                "text-align": "left"
            });
            $('.info_dialog_content').width(480);

        }


        reputPosition($('.info_dialog'), $('#div_wrapper'));
        disableTabKey();

        if (showX == false) {
            $(".info_dialog_close_btn").remove();
        }

        if (closeTime) {
            // if(closeTime == 20000){
            //     hideInfo = setTimeout( function() {
            //         clearDialog();
            //     }, 20000);
            // }else{
            //                $(".info_dialog_close_btn").remove();
            hideInfo = setTimeout(function() {
                clearDialog();
                poping = false;
                if (typeof(closeFunc) == 'function') {
                    closeFunc();
                }
                closeFunc = null;
            }, closeTime);

            //}
        } else {
            if (typeof(closeTime) != 'undefined') {} else {
                hideInfo = setTimeout(function() {
                    if (typeof(closeFunc) == 'function') {
                        closeFunc();
                    }
                    poping = false;
                    closeFunc = null;
                    clearDialog();
                }, 3000);
            }


        }
    }
}


function showConfirmDialog(content, okFunc, cancelFunc, removeable, removeFunc, okvalue) {
    //    content = display_SIMtoUIM(content);
    poping = true;
    if (0 != removeable) {
        $('#div_wrapper').remove();
        $('.dialog').remove();
    }


    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='dialog'>";
    dialogHtml += "    <div class='dialog_content'>";
    dialogHtml += "        <div class='dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + "Confirm" + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='' class='dialog_close_btn clr_gray'><canvas id='confirmCanvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='dialog_table'>" + content + '</div>';
    dialogHtml += "        <div class='dialog_table_bottom'>";
    dialogHtml += "            <div class='dialog_table_r'>";
    dialogHtml += "              <span class='button_wrapper pop_confirm'>";
    dialogHtml += "                  <input id='pop_confirm' class='button_dialog' type='button' value='" + (okvalue || "OK") + "'/></span>";
    if (cancelFunc != '' && cancelFunc != ' ' && cancelFunc != null) {
        dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper pop_Cancel'>";
        dialogHtml += "                  <input id='pop_Cancel' class='button_dialog' type='button' value='" + "Cancel" + "'/></span>";
    }
    dialogHtml += '            </div>';
    dialogHtml += '        </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';

    $('#pop_confirm').die().live('click', function() {
        g_confirm_input_val = $("#confirm_input").val();
        if (g_confirm_input_val != undefined && g_confirm_input_val != "undefined") {
            if (!g_confirm_input_val.length) {
                showErrorUnderTextbox('confirm_input', "Please input command incorrectly.");
                $("#confirm_input").focus();
                return;
            }
            var reg1 = new RegExp('[0-9*#]*');
            if (reg1.exec(g_confirm_input_val) != g_confirm_input_val) {
                showErrorUnderTextbox('confirm_input', "Please input command incorrectly.");
                $("#confirm_input").val("").focus();
                return;
            }

            // if($("#ussd_recv_confirm").html().indexOf(g_confirm_input_val)<0){
            //     showErrorUnderTextbox('confirm_input', "Please input command incorrectly.");
            //     $("#confirm_input").val("").focus();
            //     return;
            // }

        }

        clearDialog();
        if (typeof(okFunc) == 'function') {
            okFunc();
        }
        poping = false;
        okFunc = null;
        cancelFunc = null;
        removeFunc = null;

        g_main_displayingPromptStack.pop();
        hiddenSelect(false);
        return false;
    });
    $('#pop_Cancel').die().live('click', function() {
        if (typeof(cancelFunc) == 'function') {
            cancelFunc();
        }
        poping = false;
        okFunc = null;
        cancelFunc = null;
        removeFunc = null;
        g_main_displayingPromptStack.pop();
        hiddenSelect(false);
        if (update_confirm_poped) {
            cancel_update_confirm();
        }
        clearDialog();
        return false;
    });
    $(".dialog_close_btn").die().live("click", function() {
        if (typeof(removeFunc) == 'function') {
            removeFunc();
        }
        poping = false;
        okFunc = null;
        cancelFunc = null;
        removeFunc = null;
        if (update_confirm_poped) {
            cancel_update_confirm();
        }
        clearDialog();
        g_main_displayingPromptStack.pop();
    });
    $('.body_bg').before(dialogHtml);
    if ($.browser.msie && (parseInt($.browser.version, 10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("confirmCanvas");
        draw(canvas);
    } else if ($.browser.msie && (parseInt($.browser.version, 10) < 9)) {
        $(".dialog_header_left").css("margin-top", "5");
        $(".dialog_header").css({
            "width": "500px",
            "height": "29px"
        });
        $(".dialog_header").corner("top 5px");
        $(".button_wrapper").css('background', '#FFFFFF');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top", "2px");
        $(".dialog_header a").css("top", "7px");
        $(".button_wrapper input").css("padding-top", "2px");
        var ahtml = "<img src='/img/dialog_close_btn.png' onload=\"fixPNG(this)\" title='' alt='' />";
        $(".dialog_header a").append(ahtml);

    } else {
        var canvas = document.getElementById("confirmCanvas");
        draw(canvas);
    }
    hiddenSelect(true);

    reputPosition($('.dialog'), $('#div_wrapper'));

    g_main_displayingPromptStack.push('pop_confirm');

    disableTabKey();
}

function show_btn_test() {
    $("#btn_test").show();
}

function disableTabKey() {
    $('a').attr('tabindex', '-1');
    $('input').attr('tabindex', '-1');
    $('select').attr('tabindex', '-1');

    $("#username").attr('tabindex', '1');
    $("#password").attr('tabindex', '2');
    if (!tabKeyflag) {
        $("#username").focusout(function() {
            disableTabKey();
        });
        $("#username").focusin(function() {
            enableTabKey();
        });
        tabKeyflag = true;
    }

}

function get_screen_height() {
    var win_avh = window.screen.availHeight;
    if (window.screen.availWidth != $(window).width() && window.devicePixelRatio) {
        win_avh = window.screen.availHeight / window.devicePixelRatio;
    }

    return win_avh;
}


function reputPosition($dialogElement, $dialogDiv) {
    var newTop = 0,
        newLeft = 0,
        scTop = 0,
        scLeft = 0;
    g_smallPage = false;
    g_isPad_status = false;
    if ($dialogElement) {
        if (g_smallPage) {
            newLeft = (getWindowWidth() - $dialogElement.width()) / 2;
            if (g_isPad_status) {
                newTop = ((get_screen_height() - $dialogElement.height()) / 2);
            } else {
                newTop = 0;
                $(document).scrollTop(0);
                $(document).scrollLeft((getWindowWidth() - $dialogElement.width()) / 2);
            }
        } else {
            newTop = (get_screen_height() - $dialogElement.height()) / 2;
            newLeft = (getWindowWidth() - $dialogElement.width()) / 2;
            scTop = $(document).scrollTop();
            scLeft = $(document).scrollLeft();

            newTop = scTop + newTop > 0 ? scTop + newTop : 0;
            newLeft = scLeft + newLeft;
        }

        $dialogElement.css({
            left: newLeft,
            top: newTop
        }).show();
    }
    window.onscroll = function() {
        scTop = $(document).scrollTop();
        scLeft = $(document).scrollLeft();
    };

    function mainIsHandheldBrowser() {
        var bRet = false;
        var hardwarePlatform = navigator.platform.toLowerCase();
        var agent = navigator.userAgent.toLowerCase();
        var isIpod = hardwarePlatform.indexOf("ipod") != -1;
        var isIphone = hardwarePlatform.indexOf("iphone") != -1;
        var isIpad = hardwarePlatform.indexOf("ipad") != -1;
        g_isPad_status = isIpad;
        var isAndroid = agent.indexOf("android") != -1;
        var isPsp = (agent.indexOf("playstation") != -1);


        if (isIphone || isIpod) {
            bRet = true;
        } else if (isPsp) {
            bRet = true;
        } else if (isIpad) {
            bRet = true;
        } else if (isAndroid) {
            bRet = true;
        } else {
            if (screen.height <= 320 || screen.width <= 320) {
                bRet = true;
            }
        }
        return bRet;
    }

    g_smallPage = mainIsHandheldBrowser();
    window.onresize = function() {
        if (!$dialogElement.is(':visible')) {
            return;
        } else {
            $dialogElement.css({
                left: newLeft,
                top: newTop
            });
            if ($dialogDiv) {
                $dialogDiv.css({
                    'width': 0,
                    'height': 0
                });
            }
            if (g_smallPage) {
                if (g_isPad_status) {
                    $(document).scrollTop((getWindowHeight() - $dialogElement.height()) / 2);
                } else {
                    $(document).scrollTop(0);
                }
                $(document).scrollLeft((getWindowWidth() - $dialogElement.width()) / 2);
            } else {
                $(document).scrollTop(scTop);
                $(document).scrollLeft(scLeft);
            }
            reputPosition($dialogElement.last(), $dialogDiv);
        }
    };
    if ($dialogDiv) {
        var div_width = Math.max(getWindowWidth(), getDocumentWidth());
        var div_height = Math.max(getWindowHeight(), getDocumentHeight());
        $dialogDiv.css({
            'width': div_width,
            'height': div_height
        });
        $dialogDiv.show();
    }
    //
    function getWindowHeight() {
        if ($.browser.msie && (parseInt($.browser.version, 10) <= 10)) {
            return document.documentElement.clientHeight;
        } else return document.body.clientHeight;

    }

    function getWindowWidth() {
        if ($.browser.msie && (parseInt($.browser.version, 10) <= 10)) {
            return document.documentElement.clientWidth;
        } else return document.body.clientWidth;
    }

    //
    function getDocumentHeight() {
        if (!$dialogElement) {
            return document.body.scrollHeight;
        } else {
            return Math.max($dialogElement.position().top + $dialogElement.height(), document.documentElement.scrollHeight);
        }
    }

    function getDocumentWidth() {
        if (!$dialogElement) {
            return document.documentElement.scrollWidth;
        } else {
            return Math.max($dialogElement.position().left + $dialogElement.width(), document.documentElement.scrollWidth);
        }
    }
}

/*$('#wlan_connect_btn').live('click', function() {
    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments);
    setTimeout(function() {
        closeWaitingDialog();
    }, 5000);
});*/



/*$('#logout_span').live('click', function() {
    if ((login & 0x0F) >= 2) loginout(1);
    else {
        target = "home.html";
        loginout(0);
    }
});*/

// $('#username_span').live('click', function() {
//     open_page("refreshsettings.html");
// });

/*$('#li_pin').live('click', function() {
    if (!flag_valid_sim) open_page("pincodemanagement.html");
});*/


var rand, lang;

function update_language() {
    $.ajax({
        url: 'mark_lang.w.xml',
        type: "Get",
        timeout: 8000,
        cache: false,
        datatype: "xml",
        //    data: { path:curr_path,page:curr_page,filter:'255'  },
        success: function(data, status) {
            lang = $(data).find("lang").text();
            rand = $(data).find("rand").text();
            // if(lang=='id') $('#show_lang').html('IND');
            // else $('#show_lang').html('ENG');
        },
        error: function(x, t, m) {
            if (t === "timeout") {

            }
        }
    })
}

function loginout(op, allow) {
    if (op == 0) {
        if ((fota == 2 && net_st == 9) && !allow) {
            return;
        } else {
            update_language();
            showloginDialog();
        }

    } else {
        showConfirmDialog("Are you sure you want to logout?", function() {
            $('#login_st').html('LOGIN');
            $.ajax({
                url: '/wxml/login_exit.xml',
                type: "Post",
                timeout: 8000,
                cache: false,
                datatype: "xml",
                data: null,
                success: function(data, status) {
                    refresh_title();
                },
                error: function(x, t, m) {
                    if (t === "timeout") {

                    }
                }
            })
            return false;
        }, function() {});
    }
}



function addStatusListener(funName) {
    STATUS_LISTENER_FUN_LIST.push(funName);
    //    log.debug('MAIN : addStatusListener(' + funName + '), currently ' + STATUS_LISTENER_FUN_LIST.length + ' listener.');
    if (DATA_READY.statusReady && DATA_READY.notificationsReady) {
        log.debug('MAIN : DATA is Ready, execute in addStatusListener');
        eval(funName);
    }
}
// initialStatusIcon();

/*function initialStatusIcon() {
    var corner = {
        tooltip: 'topRight',
        target: 'bottomCenter'
    };

    //    addStatusListener('getIconStatus()');
    // First time of Status listner execution, getIconStatus() was missing, if SIM is not inserted.
    // So executing getIconStatus() if already Status listner is executed
    //    if(alreadyStatusListnerExecuted == '1') {
    //        getIconStatus();
    //    }

    if (1) {
        /!*$('#tooltip_sms').qtip({
            content: '<b>' + "" + '</b>',
            position: {
                corner: corner
            },
            style: {
                name: 'sms'
            }
        });*!/
    }
    if (1) {
        $('#tooltip_update').qtip({
            content: '<b>' + "Update available" + '</b>',
            position: {
                corner: corner
            },
            style: {
                name: 'upd'
            }
        });
    }

    $('#sim_signal_gif').qtip({
        content: '<b>' + "3G" + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'sim'
        }
    });

    $('#wan_gif').qtip({
        content: '<b>' + "WAN connected" + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'wan'
        }
    });

    $('#wifi_gif').qtip({
        content: '<b>' + "WALN On" + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'wifi'
        }
    });

    $('#battery_gif').qtip({
        content: '<b>' + "Battery Charging" + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'battery'
        }
    });

    // $('#data_gif').qtip({
    //     content: '<b>' + "Over the DataPlan Threshold" + '</b>',
    //     position: {
    //         corner: corner
    //     },
    //     style: {
    //         name: 'warn'
    //     }
    // });

    //tooltip_sms_full
    // $('#tooltip_sms_full').qtip({
    //     content: '<b>Your message box is full</b>',
    //     position: {
    //         corner: corner
    //     },
    //     style: {
    //         name: 'sms_full'
    //     }
    // });

    $('#station_gif').qtip({
        content: '<b>' + "WiFi" + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'station'
        }
    });

    $('#indoor_gif').qtip({
        content: '<b>' + "WiFi" + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'indoor'
        }
    });

}*/




var STATUS_BAR_ICON_STATUS = {
    sim_signal_tooltip_state: '',
    station_tooltip_state: '',
    wan_tooltip_state: '',
    wifi_tooltip_state: '',
    battery_tooltip_state: '',
    unread_sms_tooltip_state: '',
    wifi_indoor_tooltip_state: ''
};

var STATUS_LISTENER_FUN_LIST = [];
var g_lastBatteryStatus = null;
//
var header_icon_status = {
    ConnectionStatus: ' ',
    SignalStrength: ' ',
    BatteryStatus: ' ',
    BatteryLevel: ' ',
    BatteryPercent: ' ',
    SimStatus: ' ',
    WifiStatus: ' ',
    ServiceStatus: ' ',
    CurrentNetworkType: ' '
};




function showCur(noSubMenu, idx) {
    if (noSubMenu) {
        $('#settings').addClass('active');
    } else {
        $('#' + settings_left_nav[idx][0]).addClass('click');
        var cName = ($('#' + settings_left_nav[idx][0]).get(0)).className;
        if (cName.indexOf('nosub') > -1) {
            cName = cName.replace('nosub ', 'nosub');
        }
        $('#' + settings_left_nav[idx][0])[0].className = cName;
        //$("#" + settings_left_nav[][0] + " ul li:eq(" + TOPMENU.nav[2] +
        // ")").addClass("subClick");
        $('#' + settings_left_nav[idx][1]).addClass('subClick');
    }
}



function clickMenu(menu) {
    var getEls = $('.' + menu + ' li ');

    $.each(getEls, function(i) {
        $(this).click(function() {
            if ($(this).hasClass('sub') && $(this).hasClass('click')) {
                $(this).removeClass('click');
            } else if ($(this).hasClass('nosub')) {
                return true;
            } else {
                $(getEls).removeClass('click');
                $(this).addClass('click');
            }
        });
        if ("menu_pb" != menu) {
            $(this).mouseover(function() {
                $(this).addClass('menu_hover');
            });
            $(this).mouseout(function() {
                $(this).removeClass('menu_hover');
            });
        }
    });
}

function getQueryStringByName(item) {
    var svalue = location.search.match(new RegExp('[\?\&]' + item + '=([^\&]*)(\&?)', 'i'));
    return svalue ? svalue[1] : svalue;
}
// var log = log4javascript.getNullLogger();
// var _logEnable = getQueryStringByName('log');
var g_needFooter = false;


function isButtonEnable(button_id) {
    var disable = true;
    var $button = $('#' + button_id);
    if ($button) {
        disable = $button.hasClass('disable_btn');
    }
    return !disable;
}

function button_enable(button_id, enable) {
    var my = $('#' + button_id);

    if (enable == '1') {
        my.removeClass('disable_btn');
        my.removeClass('button_dialog');
        my.removeClass('clr_gray_disable_btn_center');
        my.addClass('button_dialog');

    } else if (enable == '0') {
        my.removeClass('disable_btn');
        my.removeClass('clr_gray_disable_btn_center');
        my.removeClass('button_dialog');
        my.addClass('disable_btn');
        my.addClass('clr_gray_disable_btn_center');
    }
}

function create_button_html(content, button_id, buttonClassName) {
    if (buttonClassName != '' && buttonClassName != ' ' && buttonClassName != null) {
        var disButtonClassName = "disable_btn clr_gray_disable_btn_center";
        if (buttonClassName == disButtonClassName) {
            button = "<span class='button_wrapper '>";
            button += "<input id='" + button_id + "' class='" + buttonClassName + "' type='button' value='" + content + "'/></span>";
        } else {
            button = "<span class='button_wrapper '>";
            button += "<input id='" + button_id + "' class='button_dialog " + buttonClassName + "' type='button' value='" + content + "'/></span>";
        }

    } else {
        button = "<span class='button_wrapper'>";
        button += "<input id='" + button_id + "' class='button_dialog ' type='button' value='" + content + "'/></span>";
    }
    return button;
    ieRadiusBorder();

}
var clearshow = null;

function showQtip(showTarget, content, delay) {

    var $showTarget = $('#' + showTarget);
    $showTarget.qtip('destroy');
    if ($showTarget) {
        $showTarget.qtip({
            content: content,
            position: {
                corner: {
                    tooltip: 'topMiddle',
                    target: 'bottomMiddle'
                }
            },
            show: {
                when: false,
                ready: true
            }
        });
        if (delay) {
            if (clearshow != null) {
                clearTimeout(clearshow);
            }
            clearshow = setTimeout(function() {
                $showTarget.qtip('destroy');
            }, delay);
        } else {
            if (clearshow != null) {
                clearTimeout(clearshow);
            }
            clearshow = setTimeout(function() {
                $showTarget.qtip('destroy');
            }, 5000);
        }
    }
    $showTarget.focus();
}

function ieRadiusBorder() {
    if ($.browser.msie) {
        $("input[type=button]").css("outline", "none");
        $(".button_wrapper").css('border-radius', '3px');
        if ($.browser.msie && (parseInt($.browser.version, 10) < 9)) {
            $(".button_wrapper").css('background', '#FFFFFF');
            $(".button_wrapper").corner("3px");
            $(".button_wrapper input").css('padding-top', '1px');
            if ($.browser.msie && (parseInt($.browser.version, 10) < 8)) {
                $("input[type=button]").css("padding", "0 8px");
            }

        }
    }
}

function create_button(content, button_id, buttonClassName) {
    if (buttonClassName != '' && buttonClassName != ' ' && buttonClassName != null) {
        var disButtonClassName = "disable_btn clr_gray_disable_btn_center";
        if (buttonClassName == disButtonClassName) {
            button = "<span class='button_wrapper ' id='span_" + button_id + "'>";
            button += "<input id='" + button_id + "' class='" + buttonClassName + "' type='button' value='" + content + "'/></span>";
        } else {
            button = "<span class='button_wrapper ' id='span_" + button_id + "'>";
            button += "<input id='" + button_id + "' class='button_dialog " + buttonClassName + "' type='button' value='" + content + "'/></span>";
        }

    } else {
        button = "<span class='button_wrapper' id='span_" + button_id + "'>";
        button += "<input id='" + button_id + "' class='button_dialog ' type='button' value='" + content + "'/></span>";
    }

    document.write(button);
    ieRadiusBorder();

}




function call_dialog(dialogTitle, content, button1_text, button1_id, button2_text, button2_id) {
    //   content = display_SIMtoUIM(content);
    $('#div_wrapper').remove();
    $('.dialog').remove();

    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='dialog' id='sms_dialog'>";
    dialogHtml += "    <div class='sms_dialog_content'>";
    dialogHtml += "        <div class='sms_dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left clr_white'>" + dialogTitle + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='close' class='dialog_close_btn clr_gray'><canvas id='callCanvas' width='25px' height='25px'></canvas></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='sms_dialog_table'>" + content + '</div>';
    dialogHtml += "        <div class='sms_dialog_table_bottom'>";
    dialogHtml += "            <div class='dialog_table_r'>";

    dialogHtml += "              <span class='button_wrapper " + button1_id + "'>";
    dialogHtml += "                  <input id='" + button1_id + "' class='button_dialog' type='button' value='" + button1_text + "'/></span>";

    if (button2_text != '' && button2_text != ' ' && button2_text != null) {
        dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper " + button2_id + "'>";
        dialogHtml += "                  <input id='" + button2_id + "' class='button_dialog' type='button' value='" + button2_text + "'/></span>";
    }
    dialogHtml += '            </div>';
    dialogHtml += '        </div>';
    dialogHtml += '    </div>';
    dialogHtml += '</div>';

    $('.body_bg').before(dialogHtml);

    if ($.browser.msie && (parseInt($.browser.version, 10) == 9)) {
        $(".button_wrapper").css('border-radius', '3px');
        var canvas = document.getElementById("callCanvas");
        draw(canvas);
    } else if ($.browser.msie && (parseInt($.browser.version, 10) < 9)) {
        $(".dialog_header_left").css("margin-top", "5");
        $(".dialog_close_btn").css("top", "7");
        $(".sms_dialog_header").css({
            "width": "609px",
            "height": "29px"
        });
        $(".sms_dialog_header").corner("top 5px");
        $(".button_wrapper").css('background', '#FFFFFF');
        $(".button_wrapper").corner("3px");
        $(".button_wrapper input").css("padding-top", "2px");
        $(".sms_dialog_table_bottom").corner("keep 3px cc:6a6a6a");
        var ahtml = "<img src='/img/dialog_close_btn.png' onload=\"fixPNG(this)\" title='' alt='' />";
        $(".sms_dialog_header a").append(ahtml);
    } else {
        var canvas = document.getElementById("callCanvas");
        draw(canvas);
    }

    reputPosition($('.dialog'), $('#div_wrapper'));

    g_main_displayingPromptStack.push(button1_id);

    $('a').attr('tabindex', '-1');
    $('select').attr('tabindex', '-1');

    $('#pop_Cancel,.dialog_close_btn').click(function() {
        clearDialog();
    })

}


window.onbeforeunload = function() {
    if (is_home == 2 && (fota == 89 || fota == 99)) {
        return "Firmware is updating. Please stay on this page and keep device on."
    }

}
