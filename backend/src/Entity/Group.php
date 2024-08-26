<?php

namespace App\Entity;

use App\Repository\GroupRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: GroupRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_TITLE', fields: ['title'])]
#[ORM\Table(name: '`group`')]
class Group
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $title = null;

    /**
     * @var Collection<int, Credentials>
     */
    #[ORM\OneToMany(targetEntity: Credentials::class, mappedBy: 'category')]
    private Collection $credentials;

    #[ORM\ManyToOne(inversedBy: 'categories')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(type: Types::GUID)]
    private ?string $uuid = null;

    public function __construct()
    {
        $this->uuid = Uuid::v1();
        $this->credentials = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->title;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return Collection<int, Credentials>
     */
    public function getCredentials(): Collection
    {
        return $this->credentials;
    }

    public function addCredential(Credentials $credential): static
    {
        if (!$this->credentials->contains($credential)) {
            $this->credentials->add($credential);
            $credential->setCategory($this);
        }

        return $this;
    }

    public function removeCredential(Credentials $credential): static
    {
        if ($this->credentials->removeElement($credential)) {
            // set the owning side to null (unless already changed)
            if ($credential->getCategory() === $this) {
                $credential->setCategory(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): static
    {
        $this->uuid = $uuid;

        return $this;
    }
}
