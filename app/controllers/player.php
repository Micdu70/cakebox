<?php

namespace App\Controllers\Player;

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;


/**
 * Route declaration
 *
 * @var Application $app Silex Application
 */
$app->get("/api/player",  __NAMESPACE__ . "\\get_infos");


/**
 * Get player configuration
 *
 * @param Application $app Silex Application
 *
 * @return JsonResponse Object containing player informations
 */
function get_infos(Application $app) {

    if ($app["rights.canPlayMedia"] == false) {

        $settings                    = [];
        $settings["default_type"]    = "";
        $settings["available_types"] = "";
        $settings["auto_play"]       = "";

        return $app->json($settings);
    }

    $settings                    = [];
    $settings["default_type"]    = strtolower($app["player.default_type"]);
    $settings["available_types"] = [
        'html5'=> ['name'=> "HTML 5 Web Player", "type"=> "html5"],
    ];
    $settings["auto_play"]       = $app["player.auto_play"];

    return $app->json($settings);
}
