{{ -- tpl: slider-template -- }}
    <div class="slider-container" style="width: {{ _this.width }}px; height: {{ _this.height }}px;">
        <div class="resource-holder" style="height: {{ _this.height }}px;"></div>
        <div class="pager-holder"></div>
        <div class="slider-prev"></div>
        <div class="slider-next"></div>
    </div>
{{ -- /tpl -- }}


{{ -- tpl: slider-template-resource -- }}
    <%
        for (var i = 0, len = _this.list.length; i < len; i++) {
            var item = _this.list[i];
    %>
        <img src="{{ item }}" width="{{ _this.width }}px" height="{{ _this.height }}px" class="slider-resource">
    <%
        }
    %>
{{ -- /tpl -- }}


{{ -- tpl: slider-template-page -- }}
    <%
        for (var i = 0, len = _this.list.length; i < len; i++) {
            var item = _this.list[i];
    %>
        <div class="slider-page{{ i === _this.currentPage ? ' selected' : '' }}" data-page="{{ i }}"></div>
    <%
        }
    %>
{{ -- /tpl -- }}