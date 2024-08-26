<?php

namespace App\Controller;

use App\Entity\Group;
use App\Entity\User;
use App\Service\CRUDService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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

    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['title'])) {
            return new JsonResponse(['message' => 'Title is required.', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['email'])) {
            return new JsonResponse(['message' => 'Email is required.', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        $entity = $em->getRepository(Group::class)->findOneBy(['title' => $dataJson['title']]);
        if ($entity) {
            return new JsonResponse(['message' => "Group with title {$dataJson['title']} already exists.", 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $dataJson['email']]);
        if (!$user) {
            return new JsonResponse(['message' => "User with mail {$dataJson['email']} not found.", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return $this->crudService->create(Group::class, $data, $user);
    }

    public function update(int $id, Request $request,EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['title'])) {
            return new JsonResponse(['message' => 'Title is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        $entity = $em->getRepository(Group::class)->find($id);
        if (!$entity) {
            return new JsonResponse(['message' => "Group with id $id not found.", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        $other = $em->getRepository(Group::class)->findOneBy(['title' => $dataJson['title']]);
        if ($other) {
            return new JsonResponse(['message' => "Group with title {$dataJson['title']} already exists.", 'code' => 400], Response::HTTP_NOT_FOUND);
        }

        return $this->crudService->update(Group::class, $data, $entity);
    }

    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $entity = $em->getRepository(Group::class)->find($id);
        if (!$entity) {
            return new JsonResponse(['message' => "Group with id $id not found.", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return $this->crudService->delete(Group::class, $entity);
    }
}
