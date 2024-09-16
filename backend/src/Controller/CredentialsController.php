<?php

namespace App\Controller;

use App\Entity\Credentials;
use App\Entity\Group;
use App\Entity\User;
use App\Service\CRUDService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class CredentialsController extends AbstractController
{
    private CRUDService $crudService;

    public function __construct(CRUDService $crudService)
    {
        $this->crudService = $crudService;
    }

    public function index(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $dataJson['email']]);
        if (!$user) {
            return new JsonResponse(['message' => "User with mail {$dataJson['email']} not found.", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        $credentialsForUser = $em->getRepository(Credentials::class)->findBy(['user' => $user]);

        $jsonEntities = [];

        foreach ($credentialsForUser as $credential) {
            $jsonEntities[] = [
                'id' => $credential->getId(),
                'title' => $credential->getTitle(),
                'url' => $credential->getUrl(),
                'username' => $credential->getUsername(),
                'notes' => $credential->getNotes(),
                'category' => $credential->getCategory()?->getTitle(),
                'categoryId' => $credential->getCategory()?->getId(), 
                'password' => $credential->getPassword(),
                'user' => $credential->getUser()->getEmail()
            ];
        }

        return new JsonResponse(['message' => $jsonEntities, 'code' => 200], Response::HTTP_OK);
    }

    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $group = null;
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['title'])) {
            return new JsonResponse(['message' => 'Title is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['username'])) {
            return new JsonResponse(['message' => 'Username is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['password'])) {
            return new JsonResponse(['message' => 'Password is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $dataJson['email']]);
        if (!$user) {
            return new JsonResponse(['message' => "User with mail {$dataJson['email']} not found.", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        $entity = $em->getRepository(Credentials::class)->findOneBy(['title' => $dataJson['title'], 'user' => $user]);
        if ($entity) {
            return new JsonResponse(['message' => "Credential with title '[{$dataJson['title']}' already exists.", 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        if (isset($dataJson['category'])) {
            $group = $em->getRepository(Group::class)->findOneBy(['title' => $dataJson['category'], 'user' => $user]);
            if (!$group) {
                return new JsonResponse(['message' => "Group with title '{$dataJson['category']}' not found.", 'code' => 404], Response::HTTP_NOT_FOUND);
            }
        }

        return $this->crudService->create(Credentials::class, $data, $user, $group);
    }

    public function update(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }
        if (!isset($dataJson['title'])) {
            return new JsonResponse(['message' => 'Title is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $dataJson['email']]);
        if (!$user) {
            return new JsonResponse(['message' => "User with mail {$dataJson['email']} not found.", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        $entity = $em->getRepository(Credentials::class)->findOneBy(['title' => $dataJson['title'],'user' => $user]);
        if (!$entity) {
            return new JsonResponse(['message' => "Credential with title {$dataJson['title']} not found.", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return $this->crudService->update(Credentials::class, $data, $entity);
    }

    public function delete(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataJson = json_decode($data, true);

        if (!isset($dataJson['email'])) {
            return new JsonResponse(['message' => 'Email is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        if (!isset($dataJson['title'])) {
            return new JsonResponse(['message' => 'Title is required', 'code' => 400], Response::HTTP_BAD_REQUEST);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $dataJson['email']]);
        if (!$user) {
            return new JsonResponse(['message' => "User with mail {$dataJson['email']} not found.", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        $entity = $em->getRepository(Credentials::class)->findOneBy(['title' => $dataJson['title'], 'user' => $user]);
        if (!$entity) {
            return new JsonResponse(['message' => "Credential with title {$dataJson['title']} not found.", 'code' => 404], Response::HTTP_NOT_FOUND);
        }

        return $this->crudService->delete(Credentials::class, $entity);
    }
}
