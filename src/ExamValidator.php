<?php

namespace Czbix\Exam;

use Flarum\Core\Validator\AbstractValidator;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Validation\Validator;

class ExamValidator extends AbstractValidator
{    
    /**
     * {@inheritdoc}
     */
    protected $rules = [
        'exam_token' => [
            'required',
            'exam_verify',
        ],
    ];
}
