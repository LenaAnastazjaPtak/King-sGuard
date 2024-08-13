<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\CRUDService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class UserController extends AbstractController
{
    private CRUDService $crudService;

    public function __construct(CRUDService $crudService)
    {
        $this->crudService = $crudService;
    }

    public function index(): JsonResponse
    {
        return $this->crudService->index(User::class);
    }

    public function show(int $id): JsonResponse
    {
        return $this->crudService->show(User::class, $id);
    }

    public function create(Request $request): JsonResponse
    {
        $data = $request->getContent();
        return $this->crudService->create(User::class, $data);
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $data = $request->getContent();
        return $this->crudService->update(User::class, $id, $data);
    }

    public function delete(int $id): JsonResponse
    {
        return $this->crudService->delete(User::class, $id);
    }
}
