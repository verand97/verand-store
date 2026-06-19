<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'game_uid' => ['nullable', 'string', 'max:50'],
            'game_server' => ['nullable', 'string', 'max:50'],
            'account_login' => ['required', 'string', 'max:255'],
            'account_password' => ['required', 'string', 'max:255'],
        ];
    }
}
