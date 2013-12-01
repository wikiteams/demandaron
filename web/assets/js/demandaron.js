window.TodoList = Backbone.Collection.extend({
    model: Todo,

    url: "api/tags"
});