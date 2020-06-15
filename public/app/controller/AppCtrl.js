app.controller('AppCtrl', function($scope, $http, $location, $translate, Rights, App) {

    $scope.search =
    {
        text: ""
    };
    $scope.sortOptions =
    {
        sortBy: "",
        reverse: false
    };

    $scope.rights = Rights.get();

    $scope.app = App.get(null, function(data) {
        $translate.use(data.language);

        if (data.version.local != data.version.remote)
            alertify.log("Cakebox-light " + data.version.remote + $translate.instant('NOTIFICATIONS.AVAILABLE'), "success", 10000);
    });

    $scope.$on('$locationChangeSuccess',function(event, url) {
        backurl = url.substring(0, url.lastIndexOf("/")).replace("/play/", "/browse/");
        $scope.backtobrowse = backurl;
    });

    $scope.copyText = function(data) {
        if(data.access)
            return $location.protocol() + "://" + $location.host() + ":" + $location.port() + data.access.replace('//', '/');
    };

    $scope.copyfileinfo = function() {
        //alertify.logPosition("bottom right");
        alertify.maxLogItems(1).delay(5000).closeLogOnClick(true).success($translate.instant('NOTIFICATIONS.LINK_COPY'));
    };
});
