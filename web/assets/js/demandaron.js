$(function() {
    var Tag = Backbone.Model.extend({
        defaults: {
            name: '',
            original: false,
            created_at: new Date()
        },
        initialize: function() {
        }
    });

    var Language = Backbone.Model.extend({
        defaults: {
            name: ''
        },
        initialize: function() {
        }
    });

    var TagList = Backbone.Collection.extend({
        model: Tag,
        url: "api/tags"
    });

    window.Tags = new TagList;

    var LanguageList = Backbone.Collection.extend({
        model: Language,
        url: "api/languages"
    });

    window.Languages = new LanguageList;

    window.TagView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#tag-template').html()),
        events: {
            'click' : 'selectTag'
        },
        initialize: function() {
            _.bindAll(this, 'render', 'selectTag');

            this.model.bind('change', this.render);
        },
        selectTag: function() {
            this.$el.toggleClass('selected');

            if(this.$el.hasClass('selected')) {
                this.$el.find('span').html('&#9745;');
            } else {
                this.$el.find('span').html('&#9744;');
            }

        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    window.LanguageView = Backbone.View.extend({
        tagName: 'option',
        template: _.template($('#language-template').html()),
        initialize: function() {
            _.bindAll(this, 'render');

            this.model.bind('change', this.render);
        },
        render: function() {
            this.$el.val(this.model.get('id'));
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    window.AppView = Backbone.View.extend({
        el: $('#demandaron'),

        initialize: function() {
            _.bindAll(this, 'addOneTag', 'addAllTags', 'renderTags', 'addOneLanguage', 'addAllLanguages', 'renderLanguages');

            Tags.bind('add', this.addOneTag);
            Tags.bind('reset', this.addAllTags);
            Tags.bind('all', this.renderTags);

            Languages.bind('add', this.addOneLanguage);
            Languages.bind('reset', this.addAllLanguages);
            Languages.bind('all', this.renderLanguage);

            Tags.fetch();
            Languages.fetch();
        },

        addOneTag: function(tag) {
            var view = new TagView({model:tag});
            this.$('#tag-list').append(view.render().el);
        },

        addAllTags: function() {
            Tags.each(this.addOneTag);
        },

        renderTags: function() {
            console.log('ala ma kota');
        },

        addOneLanguage: function(language) {
            var view = new LanguageView({model:language});
            this.$('#language').append(view.render().el);
        },

        addAllLanguages: function() {
            Languages.each(this.addOneLanguage());
        },

        renderLanguages: function() {
            console.log('ala ma kota');
        }
    });

    window.App = new AppView;
});