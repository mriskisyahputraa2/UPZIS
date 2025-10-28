<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Daftar Middleware
        $middleware->alias([
            'role' => App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, Illuminate\Http\Request $request) {
            return \Inertia\Inertia::render('not-found', [
                'status' => $e->getStatusCode(),
            ])->toResponse($request)->setStatusCode($e->getStatusCode());
        });

        $exceptions->render(function (Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException $e, Illuminate\Http\Request $request) {
            if ($request->header('X-Inertia')) {
                return back()->with('error', 'Anda terlalu sering mengirim pesan. Silakan coba lagi dalam beberapa saat.');
            }
        });
    })->create();
