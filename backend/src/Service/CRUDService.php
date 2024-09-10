<?php

namespace App\Service;

use App\Entity\Credentials;
use App\Entity\Group;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
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

    public function show($entity): JsonResponse
    {
        $jsonEntity = $this->serializer->serialize($entity, 'json');

        return new JsonResponse(['entity' => json_decode($jsonEntity), 'code' => 200], Response::HTTP_OK);
    }

    public function create(string $entityClass, string $data, ?User $user = null, ?Group $group = null): JsonResponse
    {
        $entity = $this->serializer->deserialize($data, $entityClass, 'json');

        if ($entityClass == Credentials::class || $entityClass == Group::class) {
            $entity->setUser($user);

            if ($group) {
                $entity->setCategory($group);
            } else {
                $entity->setCategory(null);
            }
        }

        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        $response = [
            'message' => sprintf('%s created.', $entityClass),
            'code' => Response::HTTP_CREATED
        ];

        if ($entity instanceof Credentials || $entity instanceof Group) {
            $response['publicKey'] = $user->getPublicKey();
        }

        return new JsonResponse($response, Response::HTTP_CREATED);
    }

    public function update(string $entityClass, string $data, $entity): JsonResponse
    {
        $this->serializer->deserialize($data, $entityClass, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $entity]);
        $this->entityManager->flush();

        return new JsonResponse(['message' => "$entity updated.", 'code' => 200], Response::HTTP_CREATED);
    }

    public function delete(string $entityClass, $entity): JsonResponse
    {
        if (!$entity) {
            return new JsonResponse(['message' => "$entityClass not found"], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($entity);
        $this->entityManager->flush();

        return new JsonResponse(['message' => "$entity deleted", 'code' => 200], Response::HTTP_OK);
    }

    public function salt(string $entityClass, string $data): JsonResponse
    {
        $data = json_decode($data, true);

        if (!isset($data['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        $email = $data['email'];

        $entity = $this->entityManager->getRepository($entityClass)->findOneBy(['email' => $email]);

        if (!$entity) {
            return new JsonResponse(['message' => "User with email $email not found", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse(['salt' => $entity->getSalt(), 'code' => 200], Response::HTTP_OK);
    }
}
