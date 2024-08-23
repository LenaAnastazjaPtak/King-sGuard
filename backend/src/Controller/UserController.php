<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\CRUDService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;

class UserController extends AbstractController
{
    private CRUDService $crudService;

    public function __construct(CRUDService $crudService)
    {
        $this->crudService = $crudService;
    }

    public function login(EntityManagerInterface $entityManager, Request $request, SerializerInterface $serializer): JsonResponse
    {
        $data = $serializer->deserialize($request->getContent(), User::class, 'json');

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data->getEmail()]);

        if (!$user) {
            return new JsonResponse(['message' => "User doesn't exist."], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($user->getPassword() === $data->getPassword()) {
            return new JsonResponse(['message' => "Logged in.", 'publicKey' => $user->getPublicKey()], JsonResponse::HTTP_OK);
        }

        return new JsonResponse(['message' => "Wrong credentials!"], JsonResponse::HTTP_UNAUTHORIZED);
    }

    public function index(): JsonResponse
    {
        return $this->crudService->index(User::class);
    }

    public function show(string $email): JsonResponse
    {
        return $this->crudService->show(User::class, $email);
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

    public function getSaltByUser(string $email): JsonResponse
    {
        return $this->crudService->salt(User::class, $email);
    }
}
