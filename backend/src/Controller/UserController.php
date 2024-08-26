<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\CRUDService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
class UserController extends AbstractController
{
    private CRUDService $crudService;

    public function __construct(CRUDService $crudService)
    {
        $this->crudService = $crudService;
    }

    public function login(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['password'])) {
            return new JsonResponse(['message' => 'Password is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $dataJson['email']]);

        if (!$user) {
            return new JsonResponse(['message' => "User with email {$dataJson['email']} not found", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        if ($user->getPassword() === $dataJson['password']) {
            return new JsonResponse(['message' => "{$dataJson['email']} logged in.", 'publicKey' => $user->getPublicKey(), 'code' => 200], Response::HTTP_OK);
        }

        return new JsonResponse(['message' => "Wrong credentials!", 'code' => 401], Response::HTTP_UNAUTHORIZED);
    }

    public function index(): JsonResponse
    {
        return $this->crudService->index(User::class);
    }

    public function show(Request $request): JsonResponse
    {
        $data = $request->getContent();
        return $this->crudService->show(User::class, $data);
    }

    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['roles'])) {
            return new JsonResponse(['message' => 'Roles is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['password'])) {
            return new JsonResponse(['message' => 'Password is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['public_key'])) {
            return new JsonResponse(['message' => 'Public key is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['salt'])) {
            return new JsonResponse(['message' => 'Salt is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        $entity = $em->getRepository(User::class)->findOneBy(['email' => $dataJson['email']]);

        if ($entity) {
            return new JsonResponse(['message' => "User with mail {$dataJson['email']} already exists.", 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        return $this->crudService->create(User::class, $data);
    }

    public function update(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['password'])) {
            return new JsonResponse(['message' => 'Password is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        $email = $dataJson['email'];

        $entity = $em->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$entity) {
            return new JsonResponse(['message' => "User with email $email not found", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return $this->crudService->update(User::class, $data, $entity);
    }

    public function delete(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        $entity = $em->getRepository(User::class)->findOneBy(['email' => $dataJson['email']]);

        return $this->crudService->delete(User::class, $entity);
    }

    public function getSaltByUser(Request $request): JsonResponse
    {
        $data = $request->getContent();

        return $this->crudService->salt(User::class, $data);
    }
}
