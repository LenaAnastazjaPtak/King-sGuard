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
            if (!isset($data['id'])) {
                return new JsonResponse(['message' => 'Id is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
            }

            $entity = $this->entityManager->getRepository($entityClass)->find($data['id']);

            if (!$entity) {
                return new JsonResponse(['message' => "Entity with id {$data['id']} not found", 'code' => 404], JsonResponse::HTTP_NOT_FOUND);
            }
        }

        $jsonEntity = $this->serializer->serialize($entity, 'json');

        return new JsonResponse(['entity' => json_decode($jsonEntity), 'code' => 200], JsonResponse::HTTP_OK);
    }

    public function create(string $entityClass, string $data): JsonResponse
    {
        if ($entityClass == User::class) {
            $dataJson = json_decode($data, true);

            if (!isset($dataJson['email'])) {
                return new JsonResponse(['message' => 'Email is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
            }
            if (!isset($dataJson['roles'])) {
                return new JsonResponse(['message' => 'Roles is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
            }
            if (!isset($dataJson['password'])) {
                return new JsonResponse(['message' => 'Password is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
            }
            if (!isset($dataJson['public_key'])) {
                return new JsonResponse(['message' => 'Public key is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
            }
            if (!isset($dataJson['salt'])) {
                return new JsonResponse(['message' => 'Salt is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
            }

            $entity = $this->entityManager->getRepository($entityClass)->findOneBy(['email' => $dataJson['email']]);

            if ($entity) {
                return new JsonResponse(['message' => "User with mail {$dataJson['email']} already exists.", 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
            }
        }

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

        $jsonEntity = $this->serializer->serialize($entity, 'json');
        return new JsonResponse(['message' => "{$entity} created.", 'entity' => json_decode($jsonEntity), 'code' => 200], JsonResponse::HTTP_CREATED);
    }

    public function update(string $entityClass, string $data): JsonResponse
    {
        $dataJson = json_decode($data, true);

        if ($entityClass == User::class) {
            if (!isset($dataJson['email'])) {
                return new JsonResponse(['message' => 'Email is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
            }
            if (!isset($dataJson['password'])) {
                return new JsonResponse(['message' => 'Password is required', 'code' => 400], JsonResponse::HTTP_BAD_REQUEST);
            }
            $email = $dataJson['email'];

            $entity = $this->entityManager->getRepository($entityClass)->findOneBy(['email' => $email]);

            if (!$entity) {
                return new JsonResponse(['message' => "User with email {$email} not found", 'code' => 404], JsonResponse::HTTP_NOT_FOUND);
            }
        } else {
            $entity = $this->entityManager->getRepository($entityClass)->find($dataJson['id']);

            if (!$entity) {
                return new JsonResponse(['message' => "{$entityClass} not found"], JsonResponse::HTTP_NOT_FOUND);
            }
        }

        $this->serializer->deserialize($data, $entityClass, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $entity]);
        $this->entityManager->flush();

        $jsonEntity = $this->serializer->serialize($entity, 'json');
        return new JsonResponse(['message' => "{$entity} updated.", 'entity' => json_decode($jsonEntity), 'code' => 200], JsonResponse::HTTP_CREATED);
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
