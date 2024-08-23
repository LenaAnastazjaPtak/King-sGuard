<?php

namespace App\Service;

use App\Entity\Credentials;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

class CRUDService
{
    private EntityManagerInterface $entityManager;
    private SerializerInterface $serializer;

    public function __construct(EntityManagerInterface $entityManager, SerializerInterface $serializer)
    {
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
    }

    public function index(string $entityClass): JsonResponse
    {
        $entities = $this->entityManager->getRepository($entityClass)->findAll();
        return new JsonResponse($entities);
    }

    public function show(string $entityClass, string $email): JsonResponse
    {
        $entity = $this->entityManager->getRepository($entityClass)->findOneBy(['email' => $email]);

        if (!$entity) {
            return new JsonResponse(['message' => "{$entityClass} not found"], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse($entity);
    }

    public function create(string $entityClass, string $data): JsonResponse
    {
        $entity = $this->serializer->deserialize($data, $entityClass, 'json');

        if ($entityClass == Credentials::class) {
            $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $entity->getUsername()]);

            if (!$user) {
                return new JsonResponse(['message' => "User not found"], JsonResponse::HTTP_NOT_FOUND);
            }

            $this->entityManager->persist($entity);
            $this->entityManager->flush();

            return new JsonResponse(['message' => "{$entity} created.", 'publicKey' => $user->getPublicKey()], JsonResponse::HTTP_CREATED);
        }

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        return new JsonResponse(['message' => "{$entity} created."], JsonResponse::HTTP_CREATED);
    }

    public function update(string $entityClass, int $id, string $data): JsonResponse
    {
        $entity = $this->entityManager->getRepository($entityClass)->find($id);

        if (!$entity) {
            return new JsonResponse(['message' => "{$entityClass} not found"], JsonResponse::HTTP_NOT_FOUND);
        }

        $this->serializer->deserialize($data, $entityClass, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $entity]);

        $this->entityManager->flush();

        return new JsonResponse($entity);
    }

    public function delete(string $entityClass, int $id): JsonResponse
    {
        $entity = $this->entityManager->getRepository($entityClass)->find($id);

        if (!$entity) {
            return new JsonResponse(['message' => "{$entityClass} not found"], JsonResponse::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();

        return new JsonResponse(['message' => "{$entityClass} deleted"], JsonResponse::HTTP_NO_CONTENT);
    }

    public function salt(string $entityClass, string $email): JsonResponse
    {
        if (!$email or $email == '') {
            return new JsonResponse(['message' => "Please provide user's email."], JsonResponse::HTTP_NOT_FOUND);
        }

        $entity = $this->entityManager->getRepository($entityClass)->findOneBy(['email' => $email]);

        if (!$entity) {
            return new JsonResponse(['message' => "User with email {$email} not found"], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse(['salt' => $entity->getSalt()], JsonResponse::HTTP_OK);
    }
}
