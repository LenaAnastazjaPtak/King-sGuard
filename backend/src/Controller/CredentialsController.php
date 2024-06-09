<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CredentialsController extends AbstractController
{
    #[Route('/credentials', name: 'app_credentials')]
    public function index(): Response
    {
        return $this->render('credentials/index.html.twig', [
            'controller_name' => 'CredentialsController',
        ]);
    }
}
