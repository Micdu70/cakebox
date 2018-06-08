app.factory('Directory', ['$resource', function ($resource) {
    var Directory, actions;

    actions = {
        archive: {
            method: 'GET',
            url: 'api/directories/archive',
            isArray: true
        },
        delete: {
            method: 'DELETE',
            url: 'api/directories/delete',
            isArray: false
        }
    };

    return Directory = $resource('api/directories', null, actions);
}]);
