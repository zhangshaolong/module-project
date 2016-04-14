{{ -- tpl:product-list-product-list -- }}
    <div class="row">
        <div class="item-title">业务线列表</div>
        <div class="row item-body">
            <a class="btn btn-primary add-product float-right" href="<%= window.rootBase %>/product/add" role="button">添加业务线</a>
            <div class="product-table">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th style="width: 90px;">业务线ID</th>
                            <th>业务线名称</th>
                            <th>接口人</th>
                            <th style="width: 100px;">手机号</th>
                            <th>属性配置</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody class="product-tbody">
                        <% include('product-list-product-list-tbody'); %>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="modal fade" id="delete-product-modal" tabindex="-1" role="dialog" aria-labelledby="delete-product-label">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="delete-product-label">删除业务线提示框</h4>
                </div>
                <div class="modal-body">
                    确认要删除<span class="deleted-product-name"></span>吗？
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary delete-product">确认</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>
{{ -- /tpl -- }}

{{ -- tpl:product-list-product-list-tbody -- }}

    <%
        var len = _this.length;
        if (len) {
            for (var i = 0; i < len; i++) {
                var item = _this[i];

    %>
        <tr>
            <td><%= item.productId %></td>
            <td><%= item.productName %></td>
            <td><%= item.owner %></td>
            <td><%= item.ownerPhone %></td>
            <td><pre><%= filter('formatJson', item.attrs, true) %></pre></td>
            <td><a class="btn btn-primary" href="<%= window.rootBase %>/product/add?id=<%= item.productId %>">编辑</a><span class="separator">|</span><a href="#" class="btn btn-danger to-set-delete" data-id="<%= item.productId %>" data-name="<%= item.productName %>" data-toggle="modal" data-target="#delete-product-modal">删除</a></td>
        </tr>
    <% 
            }
        } else { 
    %>
        <tr><td colspan="6"><center>没有查询到结果</center></td></tr>
    <% } %>

{{ -- /tpl -- }}
