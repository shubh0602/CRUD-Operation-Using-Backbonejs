/// Main File for User Management
/// This file will hold the functions and
/// methods which are required to display
/// list of users
///
(function ($) {

    //Lets begin with routing of the application....
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',//Default route, when no hash tag is available
            'create': 'create',// Create User, when user clicks on Create button
            'edit/:id': 'edit'
        }
    });

    var userModel = Backbone.Model.extend({
        defaults: {
            Id: null,
            FirstName: null,
            LastName: null,
            Age: null,
            Email: null,
            Phone: null
        },
        url: '/api/User',
        initialize: function () {
            // Do stuff's which you want at the time of model creation
        }
    });
    /*Collection- List of Skills*/
    var listOfUsers = Backbone.Collection.extend({
        model: userModel,
        url: '/api/User'
    });

    var listOfUsersView = Backbone.View.extend({
        el: '.user-management',// The element we defined in HTML
        render: function () {
            var self = this;// Saving the scope object
            var _userList = new listOfUsers();
            _userList.fetch({
                success: function (data) {

                    var _userTemplate = _.template($('#user-list-template').html(), { users: data.models });
                    self.$el.html(_userTemplate);
                }
            });
        },
        killView: function () {

            //console.log('Kill: ', this);

            //this.unbind(); // Unbind all local event bindings

            this.remove(); // Remove view from DOM

            //delete this.$el; // Delete the jQuery wrapped object variable
            //delete this.el; // Delete the variable reference to this node
            //Backbone.View.prototype.remove.call(this);
        }
    });
    var route = new Router();

    var specificUserView = Backbone.View.extend({
        el: '.user-management',// The element we defined in HTML
        model: userModel,
        events: {
            'click #saveUserDetails': 'saveUserDetails'
        },
        initialize: function () {

            //this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function (userId) {
            var userDetails = null;
            if (userId) {
                var self = this;
                this.model = new userModel({ id: userId });
                this.model.fetch({
                    data: { id: userId },
                    success: function (data) {
                        toastr.info('User details fecthed sucessfully...');

                        var _userDetailTemplate = _.template($('#user-detail-template').html(),
                            { user: data });
                        self.$el.html(_userDetailTemplate);
                    }
                });
            }
            else {
                var _userDetailTemplate = _.template($('#user-detail-template').html(), { user: null });
                this.$el.html(_userDetailTemplate);
            }

        },
        saveUserDetails: function () {
            var _userId = $('.hdnId').val();

            var model = new userModel({
                id: _userId || null,
                FirstName: $('.first-name').val(),
                LastName: $('.last-name').val(),
                Age: $('.age').val()
            });

            model.save({}, {
                success: function () {
                    toastr.info('User details saved...');
                    route.navigate('', { trigger: true });
                }
            });
        },
        killView: function () {

            //console.log('Kill: ', this);

            // this.unbind(); // Unbind all local event bindings

            this.remove(); // Remove view from DOM

            //// delete this.$el; // Delete the jQuery wrapped object variable
            // //delete this.el; // Delete the variable reference to this node
            // //Backbone.View.prototype.remove.call(this);
        }
    });

    var _objList = new listOfUsersView();

    var _objUser = new specificUserView();

    // When hash tag has localhost# register the below route
    route.on('route:home', function () {

        _objList.render();

        toastr.info('Displaying list of users...');
    });

    // When hash tag has localhost#create register the below route
    route.on('route:create', function () {

        _objUser.render();
    });

    //When hash tag has localhost# register the below route
    route.on('route:edit', function (userId) {

        toastr.info('Loading user with UserId ' + userId);
        _objUser.render(userId);
    });
    Backbone.history.start();

})(jQuery);