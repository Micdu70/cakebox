app.directive('webplayer', ["$location",
    function ($location) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                player: '@',
                url: '@',
                mimetype: '@',
                autoplay: '@'
            },
            template: "<div class='video'></div>",
            link: function (scope, element, attrs) {
                var $_current = element;

                var action = function(data) {
                    if (data.url) {
                        scope.url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + data.url;

                        var $_clone = element.clone(),
                            content = '';

                        if (scope.autoplay == "yes") {
                            if (scope.player == "html5") {
                                content = '<video id="html5" src="' + scope.url + '" type="' + scope.mimetype + '" controls autoplay></video>';
                            }
                        } else {
                            if (scope.player == "html5") {
                                content = '<video id="html5" src="' + scope.url + '" type="' + scope.mimetype + '" controls></video>';
                            }
                        }

                        $_current.replaceWith($_clone.html(content));
                        $_current = $_clone;
                    }
                }

                scope.$watch(function () {
                    return {'player': attrs.player, 'url': attrs.url};
                }, action, true);
            }
        }
    }
]);
