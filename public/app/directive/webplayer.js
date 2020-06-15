app.directive('webplayer', ["$location",
    function ($location) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                player: '@',
                url: '@',
                mimetype: '@',
                autoplay: '@',
                extension: '@'
            },
            link: function (scope, element, attrs) {
                var $_current = element;

                var video = ["mp4", "mov", "mpg", "flv", "avi", "mkv", "wmv"];
                var audio = ["m4a", "mp3", "flac", "ogg", "aac", "wma"];

                var action = function(data) {
                    if (data.url) {
                        scope.url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + data.url;

                        var $_clone = element.clone(),
                            content = '';

                        if (scope.player == "html5") {
                            if (scope.autoplay == "yes") {
                                if (video.indexOf(scope.extension) !== -1)
                                    content = '<video id="html5" src="' + scope.url + '" type="' + scope.mimetype + '" controls autoplay></video>';
                                if (audio.indexOf(scope.extension) !== -1)
                                    content = '<audio id="html5" src="' + scope.url + '" type="' + scope.mimetype + '" controls autoplay></audio><script type="text/javascript">var elementaudio = document.getElementById(\'html5\');elementaudio.volume = 0.2;</script>';
                            } else {
                                if (video.indexOf(scope.extension) !== -1)
                                    content = '<video id="html5" src="' + scope.url + '" type="' + scope.mimetype + '" controls></video>';
                                if (audio.indexOf(scope.extension) !== -1)
                                    content = '<audio id="html5" src="' + scope.url + '" type="' + scope.mimetype + '" controls></audio><script type="text/javascript">var elementaudio = document.getElementById(\'html5\');elementaudio.volume = 0.2;</script>';
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
