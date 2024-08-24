<?php

namespace App\Controller;

use App\Entity\Credentials;
use App\Entity\User;
use App\Service\CRUDService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class CredentialsController extends AbstractController
{
    private CRUDService $crudService;

    public function __construct(CRUDService $crudService)
    {
        $this->crudService = $crudService;
    }

    public function index(): JsonResponse
    {
        return $this->crudService->index(Credentials::class);
    }

    public function show(Request $request): JsonResponse
    {
        $data = $request->getContent();
        return $this->crudService->show(Credentials::class, $data);
    }

    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['title'])) {
            return new JsonResponse(['message' => 'Title is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['username'])) {
            return new JsonResponse(['message' => 'Username is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['password'])) {
            return new JsonResponse(['message' => 'Password is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
        }

        $entity = $em->getRepository(Credentials::class)->findOneBy(['title' => $dataJson['title']]);
        if ($entity) {
            return new JsonResponse(['message' => "Credential with title {$dataJson['title']} already exists.", 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $dataJson['email']]);
        if (!$user) {
            return new JsonResponse(['message' => "User with mail {$dataJson['email']} not found.", 'code' => 404], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->crudService->create(Credentials::class, $data, $user);
    }

    public function update(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['title'])) {
            return new JsonResponse(['message' => 'Title is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
        }

        $entity = $em->getRepository(Credentials::class)->findOneBy(['title' => $dataJson['title']]);
        if (!$entity) {
            return new JsonResponse(['message' => "Credential with title {$dataJson['title']} not found.", 'code' => 404], JsonResponse::HTTP_NOT_FOUND);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $dataJson['email']]);
        if (!$user) {
            return new JsonResponse(['message' => "User with mail {$dataJson['email']} not found.", 'code' => 404], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->crudService->update(Credentials::class, $data, $entity);
    }

    public function delete(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['title'])) {
            return new JsonResponse(['message' => 'Title is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
        }

        $entity = $em->getRepository(Credentials::class)->findOneBy(['title' => $dataJson['title']]);

        return $this->crudService->delete(Credentials::class, $entity);
    }
}
