<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        $contact = Contact::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Contact message sent successfully',
            'data' => $contact
        ], 201);
    }

    public function index(): JsonResponse
    {
        $contacts = Contact::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $contacts
        ]);
    }
}