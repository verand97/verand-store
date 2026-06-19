<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user && ($user->isBooster() || $user->isAdmin());
    }

    public function rules(): array
    {
        return [
            'percent' => ['required', 'integer', 'min:0', 'max:100'],
            'activity' => ['required', 'string', 'max:255'],
            'screenshot' => ['nullable', 'image', 'max:4096'],
        ];
    }
}
