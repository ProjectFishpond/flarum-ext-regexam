<?php

namespace Czbix\Exam\Listener;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Bus\Dispatcher as BusDispatcher;
use Flarum\Event\ConfigureValidator;
use Flarum\Core\Validator\UserValidator;
use Flarum\Core\Command\RegisterUser;
use Flarum\Settings\SettingsRepositoryInterface;
use Czbix\Exam\ExamValidator;

class AddValidatorRule {
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureValidator::class, [$this, 'addRule']);
    }

    public function addRule(ConfigureValidator $event) {
// Return True here to indicate that the code is valid.
//        $client = new GuzzleHttp\Client();
//        $verifyUrl = $this->settings->get('czbix-registration-exam.verify_url');

	if ($event->type instanceof ExamValidator) {
		$event->validator->addExtension('exam_verify',
                function($attribute, $value, $parameters) { //use ($client, $verifyUrl) {
                  if (strlen($value) != 136 || !ctype_alnum($value))
                      $resp = "400";
                  else
                      $resp = exec(__dir__.'/../../py/demo.py '.$value.' '.$this->settings->get('czbix-regexam.secret_key'));
/*                  $resp = $client->request('GET', $verifyUrl, [
                    'query' => ['code' => $value]
                  ]);

                  return $resp->getStatusCode() === 200;
*/                return $resp === "200";
                }
            );
        }
    }
}
