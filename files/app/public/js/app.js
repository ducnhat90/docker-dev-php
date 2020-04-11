const App = {
    init: function () {
        App.getDevices();
        $('body').on('click', '.btn-refresh', App.changeIp);
    },
    getUrl: function (url, action, ip, proxy) {
        return '/' + url + '?action=' + action + '&ip=' + ip + '&proxy=' + proxy
    },
    getDevices: function () {
        $.ajax({
            url: App.getUrl('service.php', 'listDevices', ''),
            type: "Get",
            cache: false,
            success: function (resp, status) {
                resp = JSON.parse(resp);

                if (resp.status == 1) {
                    const {devices} = resp.data;

                    console.log(devices);

                    $('table#device-list').find('tbody').empty();

                    devices.map(function (device, index) {
                        const deviceHtml = '<tr>' +
                            '<td>' + (index + 1) + '</td>' +
                            '<td>' + device.name + '</td>' +
                            '<td class="device-ip">' + device.ip + '</td>' +
                            '<td>' + device.proxy + '</td>' +
                            '<td><button class="btn btn-primary btn-refresh" ' +
                            'data-proxy="' + device.proxy + '"' +
                            'data-ip="' + device.ip + '"' +
                            '>' +
                            '<i class="fas fa-sync-alt"></i></button></td>' +
                            '</tr>';

                        $('table#device-list').find('tbody').append(deviceHtml);
                    })
                }
            },
            error: function (x, t, m) {
                if (t === "timeout") {
                }
            }
        }).done(function () {
        })
    },
    changeIp: function () {
        const $btn = $(this);
        const ip = $btn.data().ip;
        const proxy = $btn.data().proxy;

        $.ajax({
            url: App.getUrl('service.php', 'changeIp', ip, proxy),
            type: "Get",
            cache: false,
            beforeSend: function () {
                $btn.attr('disabled', 'disabled').closest('tr').removeClass('bg-success').addClass('bg-info')
            },
            success: function (resp, status) {
                resp = JSON.parse(resp);

                if (resp.status === 1) {
                    $btn.closest('tr').find('.device-ip').html(resp.data.ip);
                    $btn.removeAttr('disabled').closest('tr').removeClass('bg-info').addClass('bg-success')
                } else {
                    $btn.removeAttr('disabled').closest('tr').removeClass('bg-info').addClass('bg-danger')
                }
            },
            error: function (x, t, m) {
                if (t === "timeout") {
                }
            }
        }).done(function () {
            $btn.removeAttr('disabled');//.closest('tr').removeClass('bg-success').addClass('bg-warning')
        })
    },
};

window.App = App;
