$(function() {
    var Answer = Backbone.Model.extend({
        url: 'api/answers',
        defaults: {
            languageId: 0,
            tagIds: [],
            opinion: ''
        },
        validate: function(attrs, options) {
            if (attrs.tagIds.length === 0) {
                return "empty_tag_list";
            }

            if(attrs.languageId === 0) {
                return 'language_not_selected'
            }
        },
        initialize: function() {
        }
    });

    Tag = Backbone.Model.extend({
        defaults: {
            name: '',
            original: false,
            created_at: new Date()
        },
        url: "api/tags",
        selected: false,
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

    var Job = Backbone.Model.extend({
        defaults: {
            title: ''
        },
        initialize: function() {
        }
    });

    var JobsList = Backbone.Collection.extend({
        model: Job,
        url: "api/jobs"
    });

    window.Jobs = new JobsList;

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
            this.$el.attr('rel', this.model.get('id'));
            this.$el.html(this.template(this.model.toJSON()));

            if(this.model.attributes.selected === true) {
                this.selectTag();
            }

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

    window.JobView = Backbone.View.extend({
        tagName: 'option',
        template: _.template($('#job-template').html()),
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

        events: {
            'click #send-survey-button': 'sendSurvey',
            'click #add-metric-button': 'saveTag'
        },

        initialize: function() {
            _.bindAll(this, 'addOneJob', 'addAllJobs', 'renderJobs', 'addOneTag', 'addAllTags', 'renderTags', 'addOneLanguage', 'addAllLanguages', 'renderLanguages', 'sendSurvey', 'saveTag');

            Jobs.bind('add', this.addOneJob);
            Jobs.bind('reset', this.addAllJobs);
            Jobs.bind('all', this.renderJobs);

            Tags.bind('add', this.addOneTag);
            Tags.bind('reset', this.addAllTags);
            Tags.bind('all', this.renderTags);

            Languages.bind('add', this.addOneLanguage);
            Languages.bind('reset', this.addAllLanguages);
            Languages.bind('all', this.renderLanguages);

            Jobs.fetch();
            Tags.fetch();
            Languages.fetch();
        },

        addOneJob: function(job) {
            var view = new JobView({model:job});
            this.$('#job').append(view.render().el);
        },

        addAllJobs: function() {
            Tags.each(this.addOneJob);
        },

        renderJobs: function() {
        },

        saveTag: function() {
            var metricName = this.$el.find('#metric-name').val();

            var tag = new Tag({'selected': true, 'name': metricName});
            tag.save(null, {
                'success': function() {
                    Tags.add(tag);
                    $('#metric-name').val('');
                }
            });
        },

        addOneTag: function(tag) {
            var view = new TagView({model:tag});
            this.$('#tag-list').append(view.render().el);
        },

        addAllTags: function() {
            Tags.each(this.addOneTag);
        },

        renderTags: function() {
        },

        addOneLanguage: function(language) {
            var view = new LanguageView({model:language});
            this.$('#language').append(view.render().el);
        },

        addAllLanguages: function() {
            Languages.each(this.addOneLanguage());
        },

        renderLanguages: function() {
        },

        sendSurvey: function() {
            var jobId = $('#job').val();
            var languageId = $('#language').val();
            var choosedMetrics = $.map($('#tag-list li.selected'), function(element, index) { return $(element).attr('rel'); });
            var opinion = $('#opinion').val();

            var answer = new Answer({'jobId': jobId, 'languageId': languageId, 'tagIds': choosedMetrics, 'opinion': opinion});
            answer.on('invalid', _.bind(function(model, error) {
                this.$('.error').html('');

                if(error === 'empty_tag_list') {
                    this.$('#metrics-box .error').html('Select at least one metric');
                }

                if(error === 'language_not_selected') {
                    this.$('#metrics-box .error').html('Select language');
                }
            }, this));
            answer.save(null, {
                'success': _.bind(function() {
                    $.cookie('damandaron', true, { expires: 365 });
                    this.$el.replaceWith($('<div id="demandaron"><h1>Software Metrics Survey</h1><h2>Thank you for voting!</h2></div>'));
                }, this)
            });
        }
    });

    if($.cookie('damandaron') !== undefined) {
        $('#demandaron').replaceWith($('<div id="demandaron"><h1>Software Metrics Survey</h1><h2>Thank you for voting!</h2></div>'));
    } else {
        window.App = new AppView;
    }
});