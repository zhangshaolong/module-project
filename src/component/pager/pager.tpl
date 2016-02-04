{{ -- tpl: pager-template -- }}
    <ul class="pagination">
        <li class="pre-group<% if (_this.currentGroup <= 1) { %> disabled<% } %>">
            <a href="javascript:;" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <%
            var start = (_this.currentGroup - 1) * _this.displayPageCount;
            for (var i = start + 1; i <= start + _this.displayPageCount; i++) {
                if (i > _this.totalPage) {
                    continue;
                }
        %>
                <li class="<%= i == _this.currentPage ? 'active' : 'page-btn' %>" data-page="<%= i %>">
                    <a href="javascript:;"><%= i %><span class="sr-only"><%= i %></span></a>
                </li>
        <%
            }
        %>
        <li class="next-group<% if (_this.currentGroup >= _this.totalGrout) { %> disabled<% } %>">
            <a href="javascript:;" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    </ul>
{{ -- /tpl -- }}