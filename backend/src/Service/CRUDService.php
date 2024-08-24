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
        $jsonEntities = $this->serializer->serialize($entities, 'json');

        return new JsonResponse(json_decode($jsonEntities));
    }

    public function show(string $entityClass, string $data): JsonResponse
    {
        $data = json_decode($data, true);

        if ($entityClass == User::class) {
            if (!isset($data['email'])) {
                return new JsonResponse(['message' => 'Email is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
            }

            $email = $data['email'];

            $entity = $this->entityManager->getRepository($entityClass)->findOneBy(['email' => $email]);

            if (!$entity) {
                return new JsonResponse(['message' => "User with email {$email} not found", 'code' => 404], JsonResponse::HTTP_NOT_FOUND);
            }
        } else {
            if (!isset($data['title'])) {
                return new JsonResponse(['message' => 'Title is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
            }

            $entity = $this->entityManager->getRepository($entityClass)->findOneBy(['title' => $data['title']]);

            if (!$entity) {
                return new JsonResponse(['message' => "Entity with title {$data['title']} not found", 'code' => 404], JsonResponse::HTTP_NOT_FOUND);
            }
        }

        $jsonEntity = $this->serializer->serialize($entity, 'json');

        return new JsonResponse(['entity' => json_decode($jsonEntity), 'code' => 200], JsonResponse::HTTP_OK);
    }

    public function create(string $entityClass, string $data, $user = null): JsonResponse
    {
        $entity = $this->serializer->deserialize($data, $entityClass, 'json');

        if ($entityClass == Credentials::class) {
            $entity->setUser($user);

            $this->entityManager->persist($entity);
            $this->entityManager->flush();

            return new JsonResponse(['message' => "Credentials created.", 'publicKey' => $user->getPublicKey(), 'code' => 201], JsonResponse::HTTP_CREATED);
        }

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $jsonEntity = $this->serializer->serialize($entity, 'json');
        return new JsonResponse(['message' => "{$entity} created.", 'entity' => json_decode($jsonEntity), 'code' => 201], JsonResponse::HTTP_CREATED);
    }

    public function update(string $entityClass, string $data, $entity): JsonResponse
    {
        $this->serializer->deserialize($data, $entityClass, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $entity]);
        $this->entityManager->flush();

        return new JsonResponse(['message' => "{$entity} updated.", 'code' => 200], JsonResponse::HTTP_CREATED);
    }

    public function delete(string $entityClass, $entity): JsonResponse
    {
        if (!$entity) {
            return new JsonResponse(['message' => "{$entityClass} not found"], JsonResponse::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();

        return new JsonResponse(['message' => "{$entity} deleted", 'code' => 200], JsonResponse::HTTP_OK);
    }

    public function salt(string $entityClass, string $data): JsonResponse
    {
        $data = json_decode($data, true);

        if (!isset($data['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
        }

        $email = $data['email'];

        $entity = $this->entityManager->getRepository($entityClass)->findOneBy(['email' => $email]);

        if (!$entity) {
            return new JsonResponse(['message' => "User with email {$email} not found", 'code' => 404], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse(['salt' => $entity->getSalt(), 'code' => 200], JsonResponse::HTTP_OK);
    }
}
