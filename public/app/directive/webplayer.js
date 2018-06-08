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
            link: function (scope, element, attrs) {
                var $_current = element;

                var action = function(data) {
                    if (data.url) {
                        scope.url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + data.url;

                        var $_clone = element.clone(),
                            content = '';

                        if (scope.player == "html5") {
                            if (scope.autoplay == "yes") {
                                if (scope.mimetype.indexOf("video") !== -1)
                                    content = '<div class="video"><video id="html5" src="' + scope.url + '" type="' + scope.mimetype + '" controls autoplay></video></div>';
                                else
                                    content = '<div class="audio"><audio id="html5" src="' + scope.url + '" type="' + scope.mimetype + '" controls autoplay></audio></div>';
                            } else {
                                if (scope.mimetype.indexOf("video") !== -1)
                                    content = '<div class="video"><video id="html5" src="' + scope.url + '" type="' + scope.mimetype + '" controls></video></div>';
                                else
                                    content = '<div class="audio"><audio id="html5" src="' + scope.url + '" type="' + scope.mimetype + '" controls></audio></div>';
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
