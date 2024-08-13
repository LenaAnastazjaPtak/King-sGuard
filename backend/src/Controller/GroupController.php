<?php

namespace App\Controller;

use App\Entity\Group;
use App\Service\CRUDService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class GroupController extends AbstractController
{
    private CRUDService $crudService;

    public function __construct(CRUDService $crudService)
    {
        $this->crudService = $crudService;
    }

    public function index(): JsonResponse
    {
        return $this->crudService->index(Group::class);
    }

    public function show(int $id): JsonResponse
    {
        return $this->crudService->show(Group::class, $id);
    }

    public function create(Request $request): JsonResponse
    {
        $data = $request->getContent();
        return $this->crudService->create(Group::class, $data);
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $data = $request->getContent();
        return $this->crudService->update(Group::class, $id, $data);
    }

    public function delete(int $id): JsonResponse
    {
        return $this->crudService->delete(Group::class, $id);
    }
}
