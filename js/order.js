/*
 * 订单查询
 * 订单数据配置在 data/orders.json，分为 zh / en 两张表，
 * 每张表以订单号为 key，包含 destination（目的地）和 statuses（状态列表，按配置顺序展示）。
 */
(function () {
    var ORDERS_URL = 'data/orders.json';
    var ordersData = null;
    var loading = null;
    var renderCurrent = null;

    function currentLang() {
        return window.getCurrentLang ? window.getCurrentLang() : 'zh';
    }

    function t(key) {
        var value = window.getTranslation ? window.getTranslation(key) : '';
        return value || key;
    }

    function escapeHtml(text) {
        return String(text == null ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function orderTable() {
        if (!ordersData) {
            return {};
        }
        return ordersData[currentLang()] || ordersData.zh || {};
    }

    function findOrder(orderNo) {
        var table = orderTable();
        var key = String(orderNo).toUpperCase();
        for (var name in table) {
            if (Object.prototype.hasOwnProperty.call(table, name) && name.toUpperCase() === key) {
                return table[name];
            }
        }
        return null;
    }

    function loadOrders() {
        if (loading) {
            return loading;
        }
        loading = fetch(ORDERS_URL).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            return response.json();
        }).then(function (data) {
            ordersData = data;
            return data;
        }).catch(function (error) {
            loading = null;
            throw error;
        });
        return loading;
    }

    function showMessage(key) {
        renderCurrent = function () {
            $('#orderModalBody').html('<p class="order_message">' + escapeHtml(t(key)) + '</p>');
        };
        renderCurrent();
        $('#orderModal').modal('show');
    }

    function renderOrder(orderNo, order) {
        renderCurrent = function () {
            var data = findOrder(orderNo) || order;
            var statuses = data.statuses || [];
            var html = '<div class="order_meta">' +
                '<span class="order_no">' + escapeHtml(String(orderNo).toUpperCase()) + '</span>' +
                '<span class="order_dest">' + escapeHtml(data.destination || '') + '</span>' +
                '</div>';
            if (statuses.length) {
                html += '<ul class="order_status_list">';
                for (var i = 0; i < statuses.length; i++) {
                    html += '<li>' +
                        '<p class="order_status_text">' + escapeHtml(statuses[i].text) + '</p>' +
                        '<p class="order_status_time">' + escapeHtml(statuses[i].time) + '</p>' +
                        '</li>';
                }
                html += '</ul>';
            }
            $('#orderModalBody').html(html);
        };
        renderCurrent();
        $('#orderModal').modal('show');
    }

    function query(orderNo) {
        var no = String(orderNo || '').trim();
        if (!no) {
            showMessage('请输入订单号');
            return;
        }
        if (!ordersData) {
            $('#orderSubmit').prop('disabled', true);
            loadOrders().then(function () {
                $('#orderSubmit').prop('disabled', false);
                query(no);
            }, function () {
                $('#orderSubmit').prop('disabled', false);
                showMessage('查询失败');
            });
            return;
        }
        var order = findOrder(no);
        if (!order) {
            showMessage('未找到订单');
            return;
        }
        renderOrder(no, order);
    }

    document.getElementById('orderForm').addEventListener('submit', function (event) {
        event.preventDefault();
        query(document.getElementById('orderInput').value);
    });

    // 语言切换后重新渲染弹窗内容
    document.addEventListener('i18n:applied', function () {
        if (renderCurrent) {
            renderCurrent();
        }
    });
})();
