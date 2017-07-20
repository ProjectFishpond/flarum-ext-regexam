<?php

namespace Czbix\Exam;

use Flarum\Core\Command\RegisterUser;
use Czbix\Exam\Listener;

class Validate
{
    /**
     * @var UserValidator
     */
    protected $validator;

    /**
     * @param UserValidator $validator
     */
    public function __construct(ExamValidator $validator)
    {
        $this->validator = $validator;
    }

    public function handle($command, $next)
    {
        if ($command instanceof RegisterUser) {
            $this->validator->assertValid([
                'exam_token' => array_get($command->data, 'attributes.exam_token')
            ]);
        }
        return $next($command);
    }
}
