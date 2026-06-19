<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['topup', 'joki'])],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['nullable', 'integer', 'exists:products,id'],
            'items.*.name' => ['nullable', 'string'],
            'items.*.price' => ['nullable', 'numeric', 'min:0'],
            'items.*.quantity' => ['nullable', 'integer', 'min:1'],
            'items.*.options' => ['nullable', 'array'],
            'meta' => ['nullable', 'array'],
            'joki' => ['nullable', 'array'],
        ];
    }
}
