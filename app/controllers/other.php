<?php

namespace App\Controllers\Other;

use Silex\Application;
use SimpleXMLElement;
use Symfony\Component\Finder\SplFileInfo;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Finder\Finder;
use App\Models\Utils;

/**
 * Route declaration
 *
 * @var Application $app Silex Application
 */

$app->get("/api/app",  __NAMESPACE__ . "\\get");
$app->get("/api/rss",  __NAMESPACE__ . "\\rss");

/**
 * Get informations about cakebox
 *
 * @param Application $app Silex Application
 *
 * @return JsonResponse Object containing application informations
 */

function get(Application $app) {

    $local  = json_decode(file_get_contents("{__DIR___}/../../version.json"));
    $remote = json_decode(@file_get_contents("https://raw.github.com/Micdu70/cakebox/master/version.json"));
    if(!$remote)
        $remote = $local;

    $app_infos = array(
        'language' => $app["cakebox.language"],
        'version'  => array(
            'local' => $local->version,
            'remote' => $remote->version
        )
    );

    return $app->json($app_infos);
}

/**
 * @param Application $app
 * @param Request $request
 *
 * @return Response
 */

function rss(Application $app, Request $request) {

    function human_filesize($bytes, $decimals = 2) {
        if ($bytes < 1024) {
            return $bytes . ' B';
        }

        $factor = floor(log($bytes, 1024));
        $filesize = $bytes / pow(1024, $factor);
        $filesize = bcdiv($filesize, 1, 2);
        return $filesize .' '. ['B', 'KB', 'MB', 'GB', 'TB', 'PB'][$factor];
    }

    $dirpath = Utils\check_path($app['cakebox.root'], $request->get('path',''));

    if (!isset($dirpath)) {
        $app->abort(403, "Forbidden");
    }

    $xml = new SimpleXMLElement('<rss/>');
    $xml->addAttribute('version', '2.0');
    $channel = $xml->addChild('channel');

    $finder = new Finder();
    $finder->followLinks()
           ->in("{$app['cakebox.root']}/{$dirpath}")
           ->ignoreVCS(true)
           ->ignoreDotFiles($app['directory.ignoreDotFiles'])
           ->notName($app["directory.ignore"])
           ->sortByModifiedTime();

    $proto = $request->isSecure() ? 'https://' : 'http://';

    if ($app['cakebox.host'] == '')
            $app['cakebox.host'] = file_get_contents("http://ipecho.net/plain");

    if ($app['cakebox.custom_port'] != '')
            $app['cakebox.host'] = $app['cakebox.host'].':'.$app['cakebox.custom_port'];

    if ($dirpath != '' && $dirpath != '/') {
            $channel->addChild('title', 'Cakebox RSS | '.htmlentities($dirpath, ENT_XML1).'');
            $channel->addChild('link', $proto . $app['cakebox.host']);
            $channel->addChild('description', 'Cakebox RSS | '.htmlentities($dirpath, ENT_XML1).'');
            $dirpath = $dirpath . '/';
    } else {
            $channel->addChild('title', 'Cakebox RSS');
            $channel->addChild('link', $proto . $app['cakebox.host']);
            $channel->addChild('description', 'Cakebox RSS');
            $dirpath = '';
    }

    /**
     * @var SplFileInfo $file
     */
    foreach ($finder as $file) {
        if (is_file($file)) {
            $item = $channel->addChild('item');

            $date = new \DateTime();
            $date->setTimestamp($file->getMTime());

            $item->addChild('title', htmlentities($file->getFilename(), ENT_XML1));

            $url   = $app['cakebox.host'] . $app['cakebox.access'] . '/';
            $url  .= $dirpath . $file->getRelativePath() . '/' . $file->getFilename();
            $url   = str_replace('//', '/', $url);

            $link  = $proto . $url;
            $link  = htmlentities($link, ENT_XML1);

            $size = human_filesize($file->getSize());

            $item->addChild('link', $link);
            $item->addChild('pubDate', $date->format(DATE_RFC822));
            $item->addChild('description', $size);
        }
    }

    return new Response($xml->asXML(), 200, ['Content-Type' => 'application/xml']);
}
