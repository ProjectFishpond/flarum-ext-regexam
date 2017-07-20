<?php

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Bus\Dispatcher as BusDispatcher;
use Czbix\Exam\Listener;


return function (Dispatcher $events, BusDispatcher $bus) {
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\AddValidatorRule::class);
    $events->subscribe(Listener\AddApiAttributes::class);

    $bus->pipeThrough(['Czbix\Exam\Validate']);
};

