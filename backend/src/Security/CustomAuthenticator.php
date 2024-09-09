<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class CustomAuthenticator extends AbstractAuthenticator
{
    private JWTTokenManagerInterface $jwtManager;
    private UserProviderInterface $userProvider;

    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        UserProviderInterface $userProvider
    ) {
        $this->jwtManager = $jwtManager;
        $this->userProvider = $userProvider;
    }

    public function supports(Request $request): ?bool
    {
        return $request->getPathInfo() === '/api/login_check' && $request->isMethod('POST');
    }

    public function authenticate(Request $request): Passport
    {
        $data = json_decode($request->getContent(), true);

        $username = $data['username'] ?? '';
        $hashedPassword = $data['password'] ?? '';

        $user = $this->userProvider->loadUserByIdentifier($username);

        if (!$user instanceof User) {
            throw new AuthenticationException('Wrong credentials.');
        }

        $salt = $user->getSalt();

        $hashedPasswordFromFrontend = $this->hashPasswordWithSalt($hashedPassword, $salt);

        if ($user->getPassword() !== $hashedPasswordFromFrontend) {
            throw new AuthenticationException('Wrong credentials.');
        }

        return new Passport(
            new UserBadge($username),
            new PasswordCredentials($hashedPasswordFromFrontend)
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $user = $token->getUser();
        $jwt = $this->jwtManager->create($user);

        return new JsonResponse(['token' => $jwt]);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = [
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData())
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    private function hashPasswordWithSalt(string $password, string $salt): string
    {
        return hash_pbkdf2('sha256', $password, $salt, 100000, 32);
    }
}

